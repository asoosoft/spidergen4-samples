#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

//--------------------------------------------------
// Utility functions
//--------------------------------------------------

function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Find the position of the matching closing brace for an opening brace.
 * Handles strings, template literals, line comments, and block comments.
 */
function findMatchingBrace(text, openPos) {
	let depth = 1;
	let inString = null;
	let inLineComment = false;
	let inBlockComment = false;

	for (let i = openPos + 1; i < text.length; i++) {
		const ch = text[i];
		const next = i + 1 < text.length ? text[i + 1] : '';

		if (inLineComment) {
			if (ch === '\n') inLineComment = false;
			continue;
		}
		if (inBlockComment) {
			if (ch === '*' && next === '/') { inBlockComment = false; i++; }
			continue;
		}
		if (inString) {
			if (ch === '\\') { i++; continue; }
			if (ch === inString) inString = null;
			continue;
		}

		if (ch === '/' && next === '/') { inLineComment = true; i++; continue; }
		if (ch === '/' && next === '*') { inBlockComment = true; i++; continue; }
		if (ch === "'" || ch === '"' || ch === '`') { inString = ch; continue; }

		if (ch === '{') depth++;
		else if (ch === '}') {
			depth--;
			if (depth === 0) return i;
		}
	}
	return -1;
}

/**
 * Add one tab indent to each non-empty line.
 */
function addIndent(text, indent = '\t') {
	return text.split('\n').map(line => {
		if (line.trim() === '') return '';
		return indent + line;
	}).join('\n');
}

/**
 * Convert ParentClass.prototype.method.call(this, ...) to super.method(...)
 */
function convertSuperCalls(text, parentClass) {
	const escaped = escapeRegex(parentClass);

	// ParentClass.prototype.method.call(this) → super.method()
	text = text.replace(
		new RegExp(escaped + '\\.prototype\\.(\\w+)\\.call\\(this\\)', 'g'),
		'super.$1()'
	);

	// ParentClass.prototype.method.call(this, args...) → super.method(args...)
	text = text.replace(
		new RegExp(escaped + '\\.prototype\\.(\\w+)\\.call\\(this,\\s*', 'g'),
		'super.$1('
	);

	return text;
}

//--------------------------------------------------
// Main conversion logic
//--------------------------------------------------

function convertContent(content) {
	const originalHasCRLF = content.includes('\r\n');
	content = content.replace(/\r\n/g, '\n');

	// Find class declaration: ClassName = class ClassName extends Parent\n{
	const classRegex = /(\w+)\s*=\s*class\s+\1\s+extends\s+(\w+)\s*\n\{/;
	const classMatch = content.match(classRegex);
	if (!classMatch) return null;

	const className = classMatch[1];
	const parentClass = classMatch[2];

	// Find class body braces
	const openBrace = content.indexOf('{', classMatch.index + classMatch[0].length - 1);
	const closeBrace = findMatchingBrace(content, openBrace);
	if (closeBrace === -1) return null;

	const beforeClass = content.substring(0, classMatch.index);
	const classInner = content.substring(openBrace + 1, closeBrace);
	let afterClass = content.substring(closeBrace + 1);

	// Find all prototype methods in afterClass
	const methods = [];
	const regions = [];
	const protoRegex = new RegExp(
		escapeRegex(className) + '\\.prototype\\.(\\w+)\\s*=\\s*function\\s*\\(([^)]*)\\)',
		'g'
	);

	let m;
	while ((m = protoRegex.exec(afterClass)) !== null) {
		let braceIdx = -1;
		for (let i = m.index + m[0].length; i < afterClass.length; i++) {
			const ch = afterClass[i];
			if (ch === '{') { braceIdx = i; break; }
			if (ch !== '\n' && ch !== ' ' && ch !== '\t') break;
		}
		if (braceIdx === -1) continue;

		const closeIdx = findMatchingBrace(afterClass, braceIdx);
		if (closeIdx === -1) continue;

		const body = afterClass.substring(braceIdx + 1, closeIdx);

		let endIdx = closeIdx + 1;
		while (endIdx < afterClass.length && (afterClass[endIdx] === ' ' || afterClass[endIdx] === '\t')) endIdx++;
		if (endIdx < afterClass.length && afterClass[endIdx] === ';') endIdx++;

		methods.push({ name: m[1], params: m[2], body });
		regions.push({ start: m.index, end: endIdx });

		protoRegex.lastIndex = endIdx;
	}

	if (methods.length === 0) return null;

	// Build remaining afterClass (non-method parts)
	let remaining = '';
	let lastEnd = 0;
	for (const r of regions) {
		remaining += afterClass.substring(lastEnd, r.start);
		lastEnd = r.end;
	}
	remaining += afterClass.substring(lastEnd);
	remaining = remaining.replace(/\n{3,}/g, '\n\n');

	// Build result
	let result = beforeClass;
	result += `class ${className} extends ${parentClass}\n{`;

	// Constructor (from original class inner), with super call conversion
	let convertedInner = convertSuperCalls(classInner, parentClass);
	convertedInner = convertedInner.replace(/\s+$/, '\n');
	result += convertedInner;

	// Methods
	for (const method of methods) {
		let body = convertSuperCalls(method.body, parentClass);
		body = addIndent(body);
		result += `\n\t${method.name}(${method.params})\n\t{`;
		result += body;
		if (!body.endsWith('\n')) result += '\n';
		result += '\t}\n';
	}

	result += '}\n';
	result += remaining;

	if (originalHasCRLF) {
		result = result.replace(/\n/g, '\r\n');
	}

	return result;
}

//--------------------------------------------------
// File system operations
//--------------------------------------------------

function findJsFiles(dir) {
	const results = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (['node_modules', '.git', '.claude'].includes(entry.name)) continue;
			results.push(...findJsFiles(fullPath));
		} else if (entry.name.endsWith('.js')) {
			results.push(fullPath);
		}
	}
	return results;
}

//--------------------------------------------------
// Main
//--------------------------------------------------

const folderPath = process.argv[2];
if (!folderPath) {
	console.log('Usage: node converter.js <folder-path>');
	process.exit(1);
}

const absPath = path.resolve(folderPath);
if (!fs.existsSync(absPath) || !fs.statSync(absPath).isDirectory()) {
	console.error(`Folder not found: ${absPath}`);
	process.exit(1);
}

const files = findJsFiles(absPath);
console.log(`Found ${files.length} .js files\n`);

let converted = 0;
let skipped = 0;
let errors = 0;

for (const file of files) {
	try {
		const content = fs.readFileSync(file, 'utf8');
		const result = convertContent(content);
		if (result) {
			fs.writeFileSync(file, result, 'utf8');
			console.log(`  Converted: ${path.relative(absPath, file)}`);
			converted++;
		} else {
			skipped++;
		}
	} catch (e) {
		console.error(`  Error: ${path.relative(absPath, file)} - ${e.message}`);
		errors++;
	}
}

console.log(`\nDone: ${converted} converted, ${skipped} skipped, ${errors} errors`);
