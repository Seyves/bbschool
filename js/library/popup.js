class Popup{
	constructor(elem){
		this.popup = elem;
		this.href = this.popup.id;

		this.link = document.querySelector(`[href="#${this.href}"]`);

		document.addEventListener('click', (event) => {
			if(this.isOpened && !event.target.closest('.popup__content')){
				event.preventDefault();
				this.isOpened = false;
			} 
			
			if(event.target == this.link){
				event.preventDefault();
				this.isOpened = true;
			} 
		});		
	}		
	
	set isOpened(bool){
		if(bool){
			this.popup.classList.add('opened');
			return document.body.classList.add('locked');
		}	
		this.popup.classList.remove('opened');
		return document.body.classList.remove('locked');
	}
	get isOpened(){
		return this.popup.classList.contains('opened')
	}

	static init = () => {
		const popupElements = document.querySelectorAll('[data-popup]');
		for(let popupElem of popupElements){
			new Popup(popupElem);
		}
	}
}

export default Popup;
