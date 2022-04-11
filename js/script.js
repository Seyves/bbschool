//Инициализация слайдера
//========================================================================================================================================================
function bildSliders() {
	let sliders = document.querySelectorAll('.swiper-wrapper');
	if (sliders) {
		sliders.forEach(slider => {
			slider.parentElement.classList.add('swiper-container');
			for (const slide of slider.children) {
				slide.classList.add('swiper-slide');
			}
		});
	}
}

function initSliders() {

	bildSliders();

	// Перечень слайдеров
	if (document.querySelector('.swiper')) {
		new Swiper('.swiper', {
			// Подключаем модули слайдера
			// для конкретного случая
			/*
			effect: 'fade',
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			*/
			observer: true,
			freeMode: true,
			observeParents: true,
			slidesPerView: 3,
			spaceBetween: 30,
			speed: 800,			
			//touchRatio: 0,
			//simulateTouch: false,
			//loop: true,
			//preloadImages: false,
			//lazy: true,
			// Dotts
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
			on: {

			}
		});
	}
}
initSliders();





//============================================================================================================================