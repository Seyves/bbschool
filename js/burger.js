//Меню бургер
//========================================================================================================================================================
const page = document.querySelector('.page');

class Burger{

	constructor(inputObj){
		this.burger = inputObj.burger;		
		this.hasShell = inputObj.hasShell;
		if(this.hasShell) this.shell = this.burger.parentElement;

		this.menu = inputObj.menu;		
		this.header = this.burger.closest('header');
		this.breakPoint = window.matchMedia(`(max-width: ${inputObj.breakPoint}px)`);

		this.onScroll = inputObj.onScroll;
		this.darkerPage = inputObj.darkerPage;
		this.isActive = false;

		this.bindMenuToHeader = inputObj.bindMenuToHeader;
		this.orientation = inputObj.orientation;

		if(this.hasShell){
			this.shell.addEventListener('click', (event) => {
				this.toggleBurger();
			});
		}
		else{
			this.burger.addEventListener('click', (event) => {
				this.toggleBurger();
			});
		}

		this.menu.addEventListener('click', (event) => {
			let target = event.target.closest('[anchor]');
			if(!target) return;
			this.closeBurger();
		});

		if(this.onScroll){
			window.addEventListener('scroll', (event) => {

				if(this.onScroll == 'close'){
					if(this.isActive) this.burgerCloseDelay = setTimeout(this.closeBurger, 150);
				}
			});
		}

		if(this.bindMenuToHeader){
			this.bindMenu();
			window.addEventListener('resize', (event) => {
				this.bindMenu();
			});
		}
		
		this.checkBreakpoint(this.breakPoint);
		this.breakPoint.onchange = this.checkBreakpoint;
	}

	toggleBurger = () => {		
		this.burger.classList.toggle('active');
		this.menu.classList.toggle('active');	
		
		if(this.isActive == false){
			this.isActive = true;
			
			if(this.darkerPage == true) this.makePageDark();
			if(this.onScroll == 'lock') this.lockPage();
			return;
		}
		
		this.unmakePageDark();
		this.unlockPage();
		this.isActive = false;
	}

	closeBurger = () => {	
		this.burger.classList.remove('active');
		this.menu.classList.remove('active');

		this.unmakePageDark();
		this.unlockPage();
		this.isActive = false;
	}

	bindMenu = () => {
		if(this.orientation == 'top'){
			this.menu.style.top = this.header.offsetHeight + 'px';
		}
		else if(this.orientation == 'left'){			
			this.menu.style.left = this.header.offsetWidth + 'px';
		}
		else if(this.orientation == 'right'){			
			this.menu.style.right = this.header.offsetWidth + 'px';
		}
	}

	checkBreakpoint = (event) => {
		if(event.matches){
			if(this.hasShell)	this.shell.hidden = false;
			this.burger.hidden = false;
			this.menu.setAttribute('burgered', '');

			if(this.isActive){
				if(this.onScroll == 'lock') this.lockPage();
				if(this.darkerPage) this.makePageDark();
			}
		}
		else{
			if(this.hasShell)	this.shell.hidden = true;
			this.burger.hidden = true;
			this.menu.removeAttribute('burgered', '');

			this.unlockPage();
			this.unmakePageDark();
		}
	}

	lockPage = () => document.body.classList.add('locked');
	unlockPage = () => document.body.classList.remove('locked');
	makePageDark = () => document.body.classList.add('darker');
	unmakePageDark = () => document.body.classList.remove('darker');
}

//Инициализация
//========================================================================================================================================================
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const header = document.querySelector('.header');
const wrapper = document.querySelector('.wrapper');

//Если мы на главной
if(wrapper.classList.contains('main-wrapper')){

	var mainBurger = new Burger({
		burger: burger,
		menu: menu,
		breakPoint: 767,
		onScroll: 'close',
		darkerPage: true,
		bindMenuToHeader: true,
		orientation: 'top',
	});
}

//Если мы на побочной
if(wrapper.classList.contains('program-wrapper')){

	var programBurger = new Burger({
		burger: burger,
		menu: menu,
		breakPoint: 1560,
		hasShell: true,
		onScroll: 'close',	
		darkerPage: true,	
		bindMenuToHeader: false,
		orientation: 'left',
	});

	const programHeaderSection = document.querySelector('.program-header-section');
	const programHeader = document.querySelector('.program-header');

	let programBurgerBreakpoint = window.matchMedia(`(max-width: 1560px)`);

	setSectionWidth(programBurgerBreakpoint);
	programBurgerBreakpoint.addListener(setSectionWidth);

	function setSectionWidth(event){
		programHeaderSection.style.width = programHeader.clientWidth + 'px';
		if(programBurgerBreakpoint.matches){
			programHeaderSection.style.width = 52 + 'px';
		}
	}
}