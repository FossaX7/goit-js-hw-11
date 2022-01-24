import './sass/main.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import {renderPhotoCard} from './utils';
import {fetchPhotos} from '././fetchPhotos';

const refs = {
    search: document.querySelector('.search-form'),
    searchInput: document.querySelector('.form-input'),
    searchBtn: document.querySelector('.search-btn'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}

let page = 1;
let perPage = 0;

refs.search.addEventListener('submit', searchPhoto);
refs.loadMoreBtn.addEventListener('click', loadSearchPhoto);

async function loadSearchPhoto() {
    page +=1;
    const inputValue = refs.searchInput.value;
    const response = await fetchPhotos(inputValue, page);
    onRenderCards(response);
}

async function searchPhoto(evt) {
    evt.preventDefault();
    page = 1;

    const searchPhotoValue = evt.currentTarget.searchQuery.value;

    if(searchPhotoValue.trim() === '') {
        Notiflix.Notify.info('Field must be filled');
        return;
    }

    const response = await fetchPhotos(searchPhotoValue, page)
    
    onRenderCards(response);
    perPage = response.hits.length;
  
    if (response.totalHits <= perPage) {
      onAddHidden();
    } else { 
      onRemoveHidden();
    }

    if (response.totalHits === 0) {
        onClearContent();
        onAddHidden();
         Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again!');
        return;
      }

    try {
        if (response.totalHits >= 0) {
            Notiflix.Notify.info(`Found ${response.totalHits} images`);
            onRenderCards(response);
          }
    } catch (error) {
        console.log(error);
    }
}

async function onRenderCards(elements) {
    if (!elements) {
        onAddHidden();
        return
    }
    const markup = await elements.hits.map(hit => renderPhotoCard(hit));
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}
  
function onAddHidden() { 
    refs.loadMoreBtn.classList.add('is-hidden');
}

function onRemoveHidden() { 
    refs.loadMoreBtn.classList.remove('is-hidden');
}

function onClearContent() { 
    refs.gallery.innerHTML = '';
}