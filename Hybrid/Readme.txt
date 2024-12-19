동영상 강좌 참조

Android Studio 설치

Nodejs 설치 - https://nodejs.org/ko/ 

Cordova 설치 - https://cordova.apache.org/
-> get Started

* npm install -g cordova
* cordova create TestApp com.test.testapp TestApp   cordova create path package AppName
* cd TestApp
* cordova platform add android
* cordova plugin add cordova-plugin-device 


MainActivity 에 startWebView, makeUrl, checkPermissions 함수 추가
-> Define.java, PermissionChecker.java 추가
-> Dependencies 에 Library Dependency 에 appcompat-v7 추가
