//Кастомный селект
//========================================================================================================================================================
class Select{
	constructor(inputObj){
		//Заменяем селект
		this.createStructure(inputObj);

		//При клике по селекту тело будет появляться и убираться
		document.addEventListener("click", this.toggleSelect);
		//Обработчики для выбора опций
		//this.body.addEventListener("pointermove", this.changeCurrentOption);
		this.body.addEventListener("click", this.changeCurrentOption);
		document.addEventListener("keydown", this.search);
		//Получаем заглушку из дата-атрибута
		this.placeholder = inputObj.select.dataset.placeholder;
		//Активируем заглушку
		this.enablePlaceholder();

		//Если при инициализации был указан miniCurrent, то в текущей опцци бутет отсутствовать innerHTML
		if(inputObj.miniCurrent) this.miniCurrent = true;
		//Если при инициализации был указан sort, то сортируем опции
		if(inputObj.sort)	this.sortOptions();
	}

	//Функция для замены старого селекта новым
	createStructure = (inputObj) => {
		//Создаём заменяющий селект
		this.select = document.createElement('div');
		//Добавляем ему все классы оригинала
		this.select.classList.add(...inputObj.select.classList);
		
		//Находим основное имя класса
		this.className = inputObj.select.classList[0];

		//Строим заголовок селекта
		this.header = this.buildChild([this.className + '__header', 'select__header'], this.select);

		//Строим контейнер текущей опции
		this.current = this.buildChild([this.className + '__current', 'select__current'], this.header);

		//Строим тело селекта
		this.body = this.buildChild([this.className + '__body', 'select__body'], this.select);

		//Строим иконку
		this.icon = this.buildChild([this.className + '__icon', 'select__icon'], this.header);

		//Создаём массив элементов-опций
		this.options = [];
		//Создаём массив содержимого опций
		this.optionsInners = []
		//Для каждого элемента-опции из старого селекта
		for(let rawOption of inputObj.select.querySelectorAll('option')){
			//Строим новый элемент-опцию
			let option = this.buildChild([this.className + '__option', 'select__option'], this.body);
			//Добавляем уникальные классы
			rawOption.classList.forEach(rawClass => {
				option.classList.add(rawClass);
			});

			//Копируем данные из сырой опции
			option.innerHTML = rawOption.innerHTML;
			option.dataset.value = rawOption.value;

			//Добавляем элемент-опцию в массив
			this.options.push(option);
			this.optionsInners.push(rawOption.innerHTML);
		}
		//Замещаем старый селект новым
		inputObj.select.replaceWith(this.select);	
	}	

	//Функция для постройки элементов новой структуры
	buildChild = (classList, target) => {
		let element = document.createElement('div');
		element.classList.add(...classList);
		target.append(element);
		return element;
	}

	//Функция для изменения текущей опции
	//Также используется в обработчике событий
	//Для использования вне обработчика первым аргументом должен стоять null
	changeCurrentOption = (event, option) => {
		if(!event && !option) return;
		if(event){ 
			if(!event.target.classList.contains('select__option') || this.currentOption == event.target) return;
		}
		this.current.innerHTML = '';
		if(this.currentOption) this.currentOption.classList.remove('selected');
		this.currentOption = option || event.target;
		this.current.append(this.currentOption.cloneNode(!this.miniCurrent));
		this.currentOption.classList.add('selected');		
	}

	search = (event) => {
		//Проверяем, открыт ли селект
		if(!this.isOpened) return;
		//Проверяем, является ли нажатая клавиша буквой
		if(event.key.length !== 1) return;

		//Обнуляем всё при полном бездействии
		this.clearSearchTimeout();
		this.setSearchTimeout();

		//Создаём строку введённую пользователем, если её ещё нет
		if(!this.searchString) this.searchString = '';
		//Добавляем в строку нажатую клавишу
		this.searchString += event.key.toLowerCase();
		//Получаем массив содержимого элементов-опций
		let innersLower = this.optionsInners;
		//Не учитываем их регистр
		innersLower.forEach((inner, index, inners) => inners[index] = inner.toLowerCase());

		//Пользуемся функцией для умного поиска
		let foundedInner = smartFind(innersLower, this.searchString);
		//Если она ничего не нашла, делаем строку пустой
		if (!foundedInner) return this.searchString = '';
		//Если она что-то нашла, но такого значения нет в массиве, то делаем строку последним её символом
		if(!innersLower.indexOfStartsWith(this.searchString)) this.searchString = this.searchString[this.searchString.length-1];

		//Находим элемент-опцию по её содержимому
		let foundedOption = this.body.getElementByInner(foundedInner, false);		
		
		//Меняем текущую опцию и скорллим до неё
		this.changeCurrentOption(null, foundedOption);		
		return this.scrollToOption(foundedOption);
	}
	setSearchTimeout = () => {
		this.searchTimeout = setTimeout(() => this.searchString = '', 600);
	}
	clearSearchTimeout = () => {
		clearTimeout(this.searchTimeout);
	}

	scrollToOption = (inputOption) => {
		let heightSum = 0;
		for(let option of this.options){
			if(inputOption == option) break;
			heightSum += option.offsetHeight;
		}
		this.body.scrollTop = heightSum;
	}

	//Функция для управления открытием/закрытием селекта
	toggleSelect = (event) => {
		//Если селект открыт, то закрываем его при ЛЮБОМ клике
		if(this.isOpened == true){ 
			this.select.classList.toggle('active');
			return this.isOpened = false;
		}
		//Если селект закрыт, то открываем его ТОЛЬКО если клик по нему
		if(event.target.closest('.select') != this.select) return;
		this.select.classList.toggle('active');
		return this.isOpened = true;
	}

	//Функция для активации заглушки
	enablePlaceholder = () => {			
		this.current.innerHTML = '';
		//Если есть дата атрибут с заглушкой, ставим её
		if(this.placeholder){
			let placeholder = this.buildChild([this.className + '__option', 'select__option'], this.current);
			placeholder.innerHTML = this.placeholder;
		}
		//Если нет, то ставим первую элемент-опцию
		else{
			this.current.append(this.options[0].cloneNode(!this.miniCurrent));
		}		
	}

	//Функция для сортировки опций в альфавитном порядке
	sortOptions = () => {
		//Создаём массивы для уже отсортированных элементов-опций
		let sortedOptions = []
		//Сортируем содержимое всех элементов опций
		this.optionsInners.sort();

		//Для каждого содержимого находим элемент-опцию и записываем её в отсортированный массив
		this.optionsInners.forEach(inner => {
			sortedOptions.push(this.body.getElementByInner(inner));
		});
		
		//Переписываем старые опции в отсортированные
		this.options = Object.assign([], sortedOptions);
		//Делаем тело пустым 
		this.body.innerHTML = '';
		//Вставляем все элементы-опции в тело
		for(let option of this.options) this.body.append(option);
		//Меняем заглушку
		this.enablePlaceholder();
	}

	static init = (sort) => {
		let selectElements = document.querySelectorAll('.select');
		let selects = [];
		for(let select of selectElements){
			selects.push(new Select({
				select,
				sort,
			}));
		}
		return selects;
	}
}

//Функции
//========================================================================================================================================================
function smartFind(arr, str){	
	let founded = arr[arr.indexOfStartsWith(str)];
	if(founded) return founded;		
	if(str.length == 1) return
	return smartFind(arr, str[str.length-1]);
}

Element.prototype.getElementByInner = function(inner, reg = true){
	if(reg){
		for(let child of this.children){
			if (child.innerHTML == inner) return child;
		}
	}
	
	for(let child of this.children){
		if (child.innerHTML.toLowerCase() == inner.toLowerCase()) return child;
	}
}

Array.prototype.indexOfStartsWith = function(str){
	for(let index in this){
		if (this[index].startsWith(str)) return index;
	}
}

Object.defineProperty(Array.prototype, "indexOfStartsWith", { enumerable: false });
Object.defineProperty(Element.prototype, "getElementByInner", { enumerable: false });

export default Select;
