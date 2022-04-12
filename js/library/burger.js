//Меню бургер
//========================================================================================================================================================
const wrapper = document.querySelector('.wrapper');
const header = document.querySelector('header');

class Burger{
	constructor(inputObj){
		//Передаём бургер
		this.burger = inputObj.burger;
		
		//Если указано, что есть оболочка, то находим её
		//if(inputObj.hasShell) this.shell = this.burger.parentElement;

		//Передаём меню
		this.menu = inputObj.menu;
		//Передаём брейпоинт
		this.breakPoint = window.matchMedia(`(max-width: ${inputObj.breakPoint}px)`);

		//Передаём действие при скоролле
		this.closeOnScroll = inputObj.closeOnScroll;
		//Передаём должен ли блокироваться скролл при окрытом бургере
		this.lockPage = inputObj.lockPage;
		//Передаём, должна ли страница становится темнее
		this.darkenPage = inputObj.darkenPage;
		//Узнаём, должно ли меню клеиться к хедеру
		this.bindMenuToHeader = inputObj.bindMenuToHeader;

		//Переменная, определяющая открыт ли бургер или закрыт
		this.isActive = false;

		//Если есть оболочка, то при клике по ней открываем/закрываем бургер
		//if(this.shell){
		//	this.shell.addEventListener('click', this.toggleBurger);
		//}
		//Если нет, то открываем/закрываем бургер при клике по нему самому
		//else{
		document.addEventListener('click', (event) => {
			if(!event.target.closest('.burger')){
				if(this.isActive) this.closeBurger();
				return;
			} 
			else{
				this.toggleBurger();
			}
		});
		//}		

		//Если передан параметр с закрытием при скролле, то закрываем бургер при нём
		if(this.closeOnScroll){
			window.addEventListener('scroll', (event) => {
				if(this.isActive) this.closeBurger();				
			});
		}

		//Если передан параметр, то клеим меню к хедеру
		if(this.bindMenuToHeader){			
			document.addEventListener('DOMContentLoaded', this.bindMenu);
			window.addEventListener('resize', this.bindMenu);
		}
		
		//Устанавливаем слушатель на появление бургера и активируем его при загрузке страницы
		this.checkBreakpoint(this.breakPoint);
		this.breakPoint.onchange = this.checkBreakpoint;
	}

	//При открытии/закрытии работаем с классами у меню и бургера, а также управляем затемнением/блокированием страницы
	toggleBurger = () => {		
		this.burger.classList.toggle('active');
		this.menu.classList.toggle('active');	
		
		if(this.isActive == false){
			this.isActive = true;
			
			if(this.darkenPage) this.makePageDark();
			if(this.lockPage) this.makePageLock();
			return;
		}
		
		this.unmakePageDark();
		this.unmakePageLock();
		this.isActive = false;
	}

	//При закрытии удаляем классы и возвращаем всё как было
	closeBurger = () => {	
		if(!this.isActive) return;
		setTimeout(() => {
			this.burger.classList.remove('active');
			this.menu.classList.remove('active');
	
			this.unmakePageDark();
			this.unmakePageLock();
			return this.isActive = false;
		}, 150);
	}

	//Функция для приклеивания меню к хедеру
	bindMenu = () => {
		let headerOrientation = header.dataset.orientation;
		if(headerOrientation == 'top'){
			this.menu.style.top = header.offsetHeight + 'px';
		}
		else if(headerOrientation == 'left'){			
			this.menu.style.left = header.offsetWidth + 'px';
		}
		else if(headerOrientation == 'right'){			
			this.menu.style.right = header.offsetWidth + 'px';
		}
	}

	//Геттер и сеттер для удобного показа бургера при пересечкении брейкпоинтов
	set isShown(bool){
		if(bool){
		//	if(this.shell)	this.burger.classList.add('hidden');
			this.burger.classList.add('hidden');				
			return delete this.menu.dataset.burgered;			
		}
		// if(this.shell)	this.burger.classList.remove('hidden');	
		this.burger.classList.remove('hidden');	
		return this.menu.dataset.burgered = '';
	}
	get isShown(){
		if(this.burger.classList.contains(hidden)) return true;
		return false;
	}

	//Функция для проверки брейкпоинтов
	checkBreakpoint = (event) => {
		if(event.matches){
			this.isShown = false;
			if(this.isActive){
				if(this.onScroll == 'lock') this.makePageLock();
				if(this.darkenPage) this.makePageDark();
			}
		}
		else{
			this.isShown = true;
			this.menu.removeAttribute('burgered', '');

			this.unmakePageLock();
			this.unmakePageDark();
		}
	}

	makePageLock = () => document.body.classList.add('locked');
	unmakePageLock = () => document.body.classList.remove('locked');
	makePageDark = () => wrapper.classList.add('darken');
	unmakePageDark = () => wrapper.classList.remove('darken');

	static init(params){
		let burgerElement = document.querySelector('.burger');
		let menuElement = document.querySelector('.menu');

		return new Burger({
			burger: burgerElement,
			menu: menuElement,
			breakPoint: params.breakPoint,
			closeOnScroll: params.closeOnScroll,
			lockPage: params.lockPage,
			darkenPage: params.darkenPage,
			bindMenuToHeader: params.bindMenuToHeader,
		//	hasShell: params.hasShell,
		});
	}
}

export default Burger;
