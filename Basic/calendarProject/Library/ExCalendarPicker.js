(async function() {
                    

await afc.import("Framework/mdfc/component/ACalendarPicker.js");

/**
작성자 : 배경수
작성일 : 2019.08.12
내용 : 확장캘린더피커
*/
ExCalendarPicker = class ExCalendarPicker extends ACalendarPicker
{
    constructor()
    {
        super()
		
	

    }
}



ExCalendarPicker.prototype.init = function(context, evtListener)
{
	ACalendarPicker.prototype.init.call(this, context, evtListener);

	/*
	헤드그리드: 월~일 요일부분 테이블
	리스트그리드: 1일~31일, 1월~12월 숫자부분 테이블
	*/
	
	this.mode = this.getMode();	//일별("0") or 월별("1") 구분

	//캘린더뷰 설정
	this.setCalendarViewStyle({
		 "padding-top": "10px"	//패딩 상단
		,"padding-left": "5px"	//패딩 좌측
		,"padding-right": "5px"	//패딩 우측
		,"padding-bottom": "5px"	//패딩 하단
		,"background-color": "rgb(255, 255, 255)" //백그라운드 색상
		,"border": "1px solid rgb(201, 222, 246)" //보더(border) 사이즈 및 색상
		,"border-radius": "2px"
	});

	//헤드뷰 설정
	this.setHeadViewStyle({
		 "width": "110px"	//헤드뷰 가로길이 고정
		,"margin-bottom": "0px"	//헤드뷰와 헤드그리드와의 마진(헤드뷰 기준)
	});

	//년.월 버튼 설정
	this.setYearMonthBtnStyle({
		 "background-color": "rgb(255, 255, 255)"	//년.월 버튼 백그라운드 색상
		,"font-family": "돋움체"
		,"font-size": "12px"	//년.월 버튼 폰트 크기
		,"color": "rgb(0, 0, 0)"	//년.월 버튼 폰트 크기
		,"height": "25px"	//HeadView 높이
	});

	//좌좌버튼 설정
	this.setLLeftArrowBtnStyle({
 		 "background-color": "rgba(0, 0, 0, 0)"	//투명처리
		,"background-size": "14px 14px"	//이미지 사이즈(가로 * 세로)
		,"background-image": "url(Assets/images/scroll_left_arrow2.png)"	//이미지 사이즈
		,"border": "0px solid rgba(0, 0, 0, 0)" //보더(border) 사이즈 및 색상
		,"width": "25px"	//가로길이
		,"height": "25px"	//높이
		,"display": "none" //숨김
	});

	//좌버튼 설정
	this.setLeftArrowBtnStyle({
 		 "background-color": "rgba(0, 0, 0, 0)"	//투명처리
		,"background-size": "14px 14px"	//이미지 사이즈(가로 * 세로)
		,"background-image": "url(Assets/images/scroll_left_arrow.png)"	//이미지 사이즈
		,"border": "0px solid rgba(0, 0, 0, 0)" //보더(border) 사이즈 및 색상
		,"width": "25px"	//가로길이
		,"height": "25px"	//높이
	});

	//우버튼 설정
	this.setRightArrowBtnStyle({
 		 "background-color": "rgba(0, 0, 0, 0)"	//투명처리
		,"background-size": "14px 14px"	//이미지 사이즈(가로 * 세로)
		,"background-image": "url(Assets/images/scroll_right_arrow.png)"	//이미지 사이즈
		,"border": "0px solid rgba(0, 0, 0, 0)" //보더(border) 사이즈 및 색상
		,"width": "25px"	//가로길이
		,"height": "25px"	//높이
	});

	//우우버튼 설정
	this.setRRightArrowBtnStyle({
 		 "background-color": "rgba(0, 0, 0, 0)"	//투명처리
		,"background-size": "14px 14px"	//이미지 사이즈(가로 * 세로)
		,"background-image": "url(Assets/images/scroll_right_arrow2.png)"	//이미지 사이즈
		,"border": "0px solid rgb(0, 0, 0, 0)" //보더(border) 사이즈 및 색상
		,"display": "none" //숨김
		,"width": "25px"	//가로길이
		,"height": "25px"	//높이
	});

	//헤드그리드 설정
	this.setHeadGridStyle({
		 "background-color": "rgb(95, 152, 223)"	//헤드그리드의 백그라운드 색상
		,"font-size": "12px"	//헤드그리드의 폰트 크기
		,"font-family": "돋움체"
		,"color": "rgb(255, 255, 255)"
		,"border-radius": "2px"
	});

	//리스트그리드 설정
	this.setListGridStyle({
		 "background-color": "rgb(255, 255, 255)"	//리스트그리드의 백그라운드 색상
		,"font-family": "돋움체"
		,"font-size": "12px"	//리스트그리드의 폰트 크기
		,"padding-top": "10px"
	});

	//헤드그리드 td 설정
	this.setHeadGridTdStyle({
		 "color": "rgb(255, 255, 255)"	//색상
		,"width": "50px"	//가로크기
		,"height": "50px"	//세로크기
	});
	
	//헤드그리드 td(첫번째-일요일) 설정
	this.setHeadGridTdFirstStyle({
		 "color": "#e41515"	//색상
	});

	//헤드그리드 td(마지막-토요일) 설정
	this.setHeadGridTdLastStyle({
		 "color": "#0e70d7"	//색상
	});

	//리스트그리드 td 설정
	this.setListGridTdStyle({
		"color": "rgb(87, 87, 87)"	//색상
		,"width": "50px"	//가로크기
		,"height": "50px"	//세로크기
	});
	
	//리스트그리드 td(첫번째-일요일) 설정
	this.setListGridTdFirstStyle({
		 "color": "#e41515"	//색상
	});

	//리스트그리드 td(마지막-토요일) 설정
	this.setListGridTdLastStyle({
		 "color": "#0e70d7"	//색상
	});

	//리스트그리드 td 선택 설정
	this.setListGridTdSelectedStyle({
		"background-color": "rgb(66, 106, 188)"	//백그라운드 색상
		,"color": "rgb(255, 255, 255)"	//색상
		,"border-radius": "2px"
	});
};


                    
window.ExCalendarPicker = ExCalendarPicker;
                    
})();