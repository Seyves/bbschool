import Select from './library/select.js';
import Burger from './library/burger.js';
import Anchors from './library/anchors.js';
import Popup from './library/popup.js';
import Swiper from 'https://unpkg.com/swiper@8/swiper-bundle.esm.browser.min.js'
import da from './library/dynamic-adapt.js';

//Инициализация
//========================================================================================================================================================
//Кастомный селект
Select.init(true);

//Якоря
Anchors.init();

//Попапы
Popup.init();

//Слайдер
new Swiper('.swiper', {
	observer: true,
	freeMode: true,
	observeParents: true,
	slidesPerView: 3,
	spaceBetween: 30,
	speed: 800,
	scrollbar: {
		el: '.news-preview__scrollbar',
		draggable: true,
		dragSize: 200,
	},
	
	breakpoints: {
		0:{
			slidesPerView: 1,
		},
		320: {
			slidesPerView: 1,
			freeMode: false,
		},
		400:{
			slidesPerView: 1.3,
		},
		460: {
			slidesPerView: 1.7,
		},

		680: {
			slidesPerView: 2,
		},
		780:{
			slidesPerView: 2.5,
		},
		992: {
			slidesPerView: 3,
		},
		1268: {
			slidesPerView: 3,
			spaceBetween: 30,
		},
	},
});

//Динамический адаптив
da.init();

//Меню-бургер
const wrapper = document.querySelector('.wrapper');
//Если мы на главной
if(wrapper.classList.contains('main-wrapper')){
	Burger.init({
		breakPoint: 767,
		closeOnScroll: true,
		darkenPage: true,
		bindMenuToHeader: true,
	});
}
//Если мы на программе
if(wrapper.classList.contains('program-wrapper')){
	Burger.init({
		breakPoint: 1560,
		closeOnScroll: true,	
		darkenPage: true,	
		bindMenuToHeader: false,
	});

	const programHeaderSection = document.querySelector('.program-header-section');
	const programHeader = document.querySelector('.program-header');

	let programBurgerBreakpoint = window.matchMedia(`(max-width: 1560px)`);
	let programOrientationBreakpoint = window.matchMedia(`(max-width: 990px)`);

	setSectionWidth();
	programBurgerBreakpoint.addListener(setSectionWidth);

	setHeaderOrientation();
	programOrientationBreakpoint.addListener(setHeaderOrientation);

	function setSectionWidth(event){
		programHeaderSection.style.width = programHeader.clientWidth + 'px';
		if(programBurgerBreakpoint.matches){
			programHeaderSection.style.width = 52 + 'px';
		}
	}
	function setHeaderOrientation(event){
		programHeader.dataset.orientation = 'left'
		if(programOrientationBreakpoint.matches){
			programHeader.dataset.orientation = 'top'
		}
	}
}