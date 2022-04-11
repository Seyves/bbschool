//Кастомный селект
//========================================================================================================================================================
class Select{
	constructor(inputObj){
		//Заменяем селект
		this.createStructure(inputObj);

		//При клике по селекту тело будет появляться и убираться
		document.addEventListener("click", this.toggleSelect);
		//Обработчики для выбора опций
		this.body.addEventListener("pointermove", this.changeCurrentOption);
		this.body.addEventListener("click", this.changeCurrentOption);

		//Получаем заглушку из дата-атрибута
		this.placeholder = inputObj.select.dataset.placeholder;
		//Активируем заглушку
		this.enablePlaceholder();

		//Если при инициализации был указан miniCurrent, то в текущей опцци бутет отсутствовать innerHTML
		if(inputObj.miniCurrent) this.miniCurrent = true;
		//Если при инициализации был указан sort, то сортируем опции
		if(inputObj.sort)	this.sortOptions();
	}

	changeCurrentOption = (event) => {
		this.current.innerHTML = '';
		this.currentOption = event.target.classList.contains('select__option') ? event.target : event.target.querySelector('.select__option');

		this.current.append(this.currentOption.cloneNode(!this.miniCurrent));
	}

	toggleSelect = (event) => {
		if(this.isOpened == true){ 
			this.select.classList.toggle('active');
			this.isOpened = false;
			return;
		}
		if(event.target.closest('.select') != this.select) return;
		this.select.classList.toggle('active');
		this.isOpened = true;
	}

	enablePlaceholder = () => {	
		//Если есть дата атрибут с заглушкой, ставим её
		if(this.placeholder){
			this.current.innerHTML = '';	
			let placeholder = document.createElement('div');
			placeholder.innerHTML = this.placeholder;
			placeholder.classList.add('select__option', this.className + '__option');
	
			this.current.append(placeholder);
		}
		//Если нет, то ставим первую элемент-опцию
		else{
			this.current.innerHTML = '';

			this.current.append(this.options[0].cloneNode(!this.miniCurrent));
		}		
	}

	//Функция для замены старого селекта новым
	createStructure = (inputObj) => {
		//Создаём заменяющий селект
		this.select = document.createElement('div');
		//Добавляем ему все классы оригинала
		console.log(this.select);
		this.select.classList.add(...inputObj.select.classList);
		
		//Находим основное имя класса
		this.className = inputObj.select.classList.toString().match(/\s\S+(-select)/g)[0].trim();

		//Создаём тело селекта
		this.body = document.createElement('div');
		//Задаём классы телу
		this.body.classList.add(this.className + '__body', 'select__body');
		//Помещаем тело в селект
		this.select.append(this.body);

		//Создаём массив элементов-опций
		this.options = [];
		//Для каждого элемента-опции из старого селекта
		for(let rawOption of inputObj.select.querySelectorAll('option')){
			//Создаём новый элемент-опцию
			let option = document.createElement('div');
			let optionClassList = rawOption.classList;
			//Даём ей классы
			for(let optionClass of optionClassList){
				if(!optionClassList.contains('select__option')) option.classList.add('select__option');
				option.classList.add(optionClass)
			}
			//Копируем данные из старого селетка
			option.innerHTML = rawOption.innerHTML;
			option.dataset.value = rawOption.value;

			//Вставляем элемент-опцию в тело
			this.body.append(option)
			//Добавляем её в массив
			this.options.push(option);
		}

		//Создаём заголовок селекта
		this.header = document.createElement('div');
		//Задаём классы заголовку
		this.header.classList.add(this.className + '__header', 'select__header');
		//Помещаем заголовок в селект
		this.select.prepend(this.header);

		//Создаём контейнер текущей опции
		this.current = document.createElement('div');
		//Задаём классы контейнеру текущей опции
		this.current.classList.add(this.className + '__current', 'select__current');
		//Помещаем контейнер текущей опции в заголовок
		this.header.append(this.current);

		//Создаём иконку
		this.icon = document.createElement('div');
		//Задаём классы иконки
		this.icon.classList.add(this.className + '__icon', 'select__icon');
		this.icon.innerHTML = '<img src="../img/selectArrow.svg" alt="">';
		//Помещаем иконку в заголовок
		this.header.append(this.icon);

		//Замещаем старый селект новым
		inputObj.select.replaceWith(this.select);	
	}	

	sortOptions = () =>{
		//Создаём массивы для уже отсортированных элементов-опций и для их содержимого (которое и будем сортировать изначально)
		let sortedOptions = []
		let innerHTMLs = [];

		//Наполняем массив содержимым опций
		for(let option of this.options){
			innerHTMLs.push(option.innerHTML);
		}
		//Сортируем его
		innerHTMLs.sort();

		//Ищем элемент-опцию, которой соответствует это содержимое
		for(let innerHTML of innerHTMLs){

			let simularOption;
			for(let option of this.options){
				if(option.innerHTML == innerHTML){
					simularOption = option;
					break;
				}
			}		
			//Добавляем её в отсортированный массив
			sortedOptions.push(simularOption);
		}
		
		//Переписываем старые опции в отсортированные
		this.options = Object.assign([], sortedOptions);
		//Делаем тело пустым 
		this.body.innerHTML = '';

		//Вставляем все элементы-опции в тело
		for(let option of this.options){
			this.body.append(option)
		}
		this.enablePlaceholder();
	}
}

const countrySelectElement = document.querySelector('.country-select');
const experienceSelectElement = document.querySelector('.experience-select');
const countryCodeSelectElement = document.querySelector('.country-code-select');

var countrySelect = new Select({
	select: countrySelectElement,
	sort: true,
});

var experienceSelect = new Select({
	select: experienceSelectElement,
	sort: true,
});
