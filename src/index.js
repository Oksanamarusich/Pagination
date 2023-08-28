// Є Discovery API (https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2)
// API_KEY = 'uHSLi07StIOlriMPxJGxUbSYsHDs6AFx';
// Потрібно відрендерити колекцію  івентів і реалізувати пагінацію
// за допомогою бібліотеки tui - pagination(https://www.npmjs.com/package/tui-pagination)
// запит робимо використовуючи fetch().

import {pagination} from './paginations'


const backdropEl = document.querySelector('.backdrop')
const modalEl = document.querySelector('.modal')

const formEl = document.querySelector('.form')
const list = document.querySelector('.gallery')
const page = pagination.getCurrentPage()
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/'
const API_KEY = 'uHSLi07StIOlriMPxJGxUbSYsHDs6AFx';
let query = '';

formEl.addEventListener('submit', onFormSearch)

function onFormSearch(e) {
    e.preventDefault();
    console.log(e);
    query = e.target.elements.input.value;
    console.log(query);

    renderFirstPage(page, query)

}

list.addEventListener('click', onItemClick)

function onItemClick(e) {
    const id = e.target.id
    console.log(id);
    backdropEl.classList.remove('is-hidden')
    createModalMarkup(id)

}

backdropEl.addEventListener('click', onclickBackdrop)

function onclickBackdrop() {
    backdropEl.classList.add('is-hidden')
}

function fetchDataId(id) {
    return fetch(`${BASE_URL}events.json?apikey=${API_KEY}&id=${id}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error                
            }
            return res.json();
                    })
        .catch((err) => { console.log(err);})

}


function createModalMarkup(id) {
    fetchDataId(id).then((data) => {
        console.log(data);

        
        const markup = `<img src="${data._embedded.events[0].images[0].url}" alt="${data._embedded.events[0].name}"><p>${data._embedded.events[0].name}</p>`
        
        modalEl.innerHTML = markup;

})
    
}




function fetchData(page, query) {
    return fetch(`${BASE_URL}events.json?apikey=${API_KEY}&page=${page}&keyword=${query}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error                
            }
            return res.json();
            
        })
        .catch((err) => { console.log(err);})

}
renderFirstPage(page, query)

function renderFirstPage(page,query) {
    fetchData(page, query).then(data => {
        pagination.reset(data.page.totalElements);
createMarkup(data._embedded.events)    }
    )
        .catch((err) => {
        console.log(err)
    
    }) 
}

function createMarkup(arr) {
    const markup = arr.map(({ name, id }) => `<li id="${id}"><p id="${id}">${name}</p></li>`).join('');
    list.innerHTML = markup;
}
function renderEvt(page, query) {
    fetchData(page, query).then(data => {
        
createMarkup(data._embedded.events)    }
    )
    .catch(() => {
    
    }) 
}
pagination.on('afterMove', (event) => {
    const currentPage = event.page;
    renderEvt(currentPage, query)
  console.log(currentPage);
});