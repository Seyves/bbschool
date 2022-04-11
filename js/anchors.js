//Якоря
//========================================================================================================================================================
const anchors = document.querySelectorAll('[anchor]');
const pageBlocks = page.children;
let currentExitedAnchor = anchors[1];
let listenerDelay;

let prevId;
//цикл вешает на блоки страницы без id атрибутs, определяющий, к какому id их относить
for (let pageBlock = 0; pageBlock < pageBlocks.length; pageBlock++){
	//если блок над блоками с id
	if(!prevId && !pageBlocks[pageBlock].id){
		//pageBlocks[pageBlock].dataset.position = 'aboveid';		
		for (let i = pageBlock; i < pageBlocks.length; i++){
			if(pageBlocks[i].id){ 
				pageBlocks[pageBlock].dataset.corId = pageBlocks[i].id;
				break;
			}
		}
		continue;
	}	
	//если блок и есть блок с id
	if(pageBlocks[pageBlock].id){		
		prevId = pageBlocks[pageBlock].id;
		continue;
	}
	//если всё выше неправда, то проверяем, если ли под нами блоки с id				
	let isBetweenId = false;
	for (let i = pageBlock; i < pageBlocks.length; i++){
		if(pageBlocks[i].id) isBetweenId = pageBlocks[i];
	}
	//если есть
	if(isBetweenId){
		//pageBlocks[pageBlock].dataset.position = `betweenid`;
		pageBlocks[pageBlock].dataset.corId = prevId;
		continue;
	}
	//если нет
	//pageBlocks[pageBlock].dataset.position = 'underid';
	pageBlocks[pageBlock].dataset.corId = prevId;
}

document.addEventListener('DOMContentLoaded', checkPageSection)
addPageSectionListener();

for(let anchor of anchors){
	anchor.addEventListener('click', (event) => {
		event.preventDefault();
		scrollToPageSection(anchor);
		changeCurrentAnchor(anchor);
		
		if(anchor.getAttribute('anchor') == 'no-react') return;

		if(listenerDelay) clearTimeout(listenerDelay);
		window.removeEventListener('scroll', checkPageSection);
		listenerDelay = setTimeout(addPageSectionListener, 700);
	});
}


function getScrollDistanceTo(elem){
	let elemPosition = elem.getBoundingClientRect().top;

	if(header.offsetHeight > 500){		
		return elemPosition && elemPosition + window.pageYOffset;
	}
	return elemPosition && elemPosition + window.pageYOffset - header.offsetHeight;
}

function scrollToPageSection(link){
	let pageSectionId = link.getAttribute('href').slice(1);
	let pageSection = document.getElementById(pageSectionId);

	window.scrollTo({
		top: getScrollDistanceTo(pageSection),
		behavior: "smooth"
	});
}

function checkPageSection(event){
	//текущий блок страницы, на котором находятся пользователь
	let currentPageSection;

	//если мы в самом низу
	if ((document.documentElement.clientHeight + window.pageYOffset) >= Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight)) {
		changeCurrentAnchor(anchors[anchors.length-1]);
		return;
	}

	//если хедер сбоку
	if (header.offsetHeight >= document.documentElement.clientHeight) currentPageSection = document.elementFromPoint(310, 0).closest('.page__block');
	//если сверху
	else currentPageSection = document.elementFromPoint(310, header.offsetHeight+5).closest('.page__block');
	//если наш блок не имеет id, даём ему ближайший
	if(!currentPageSection) return;
	if(currentPageSection.dataset.corId){	
		changeCurrentAnchor(getAnchorFromPageSection(document.getElementById(currentPageSection.dataset.corId)));
		return;
	}
	//если имеет id
	changeCurrentAnchor(getAnchorFromPageSection(currentPageSection));
}

function changeCurrentAnchor(anchor){
	if(currentExitedAnchor == anchor && anchor.classList.contains('exited')) return;	
	if(anchor.getAttribute('anchor') == 'no-react') return;
	currentExitedAnchor.classList.remove('exited');
	currentExitedAnchor = anchor;
	currentExitedAnchor.classList.add('exited');
}

function getAnchorFromPageSection(pageSection){
	let pageSectionHref = '#' + pageSection.id;
	
	for(let anchor of anchors){		
		if(anchor.getAttribute('anchor') == 'no-react') continue;
		anchorHref = anchor.getAttribute('href');		
		if (anchorHref == pageSectionHref) return anchor;
	}
}

function addPageSectionListener(){
	window.addEventListener('scroll', checkPageSection);
}