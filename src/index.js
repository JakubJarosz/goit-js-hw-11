import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import 'simplelightbox/dist/simple-lightbox.min.css';

const DEBOUNCE_DELAY = 300;
const form = document.querySelector('form');
const button = document.querySelector('.load-more');
const div = document.querySelector('.gallery');
const input = document.querySelector('input');
form.addEventListener('submit', handleSubmit);

button.style.display = 'none';
let page = 1;

// Search button handling
function handleSubmit(event) {
  div.innerHTML = '';
  event.preventDefault();
  const {
    elements: { searchQuery },
  } = event.currentTarget;
  fetchImg(searchQuery.value)
    .then(data => fetchResualt(data))
    .catch(err => console.log('Error', err));
}

// What the function does
function fetchResualt(name) {
  try {
    for (let i = 0; i < 40; i++) {
      const elements = `<div class="photo-card">
  <div class="photo-gallery"><a class="photo-main" href="${name.hits[i].largeImageURL}"><img class="photo-small" src="${name.hits[i].webformatURL}" alt="${name.hits[i].tags}" loading="lazy"/></a></div>
  <div class="info">
    <ul class="info-list">
    <li class="info-item"><div class="information">Likes</div><div class="value">${name.hits[i].likes}</div></li>
    <li class="info-item"><div class="information">Views</div><div class="value">${name.hits[i].views}</div></li>
    <li class="info-item"><div class="information">Comments</div><div class="value">${name.hits[i].comments}</div></li>
    <li class="info-item"><div class="information">Downloads</div><div class="value">${name.hits[i].downloads}</div></li>
   </ul>
  </div>
  </div>`;
      div.insertAdjacentHTML('afterbegin', elements);
    }

    let gallery = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });
    Notiflix.Notify.success(`Hooray! We found ${name.total} images.`);
    page = page + 1;
    button.style.display = 'block';
  } catch (err) {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

// Fetching url
function fetchImg(smt) {
  return fetch(
    `https://pixabay.com/api/?key=28402505-f95f4c77bbfaeb79f596a5044&q=${smt}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`
  ).then(response => {
    if (!response.ok) {
      console.log(response.status);
      throw new Error(response.status);
    }
    return response.json();
  });
}

// Funcion of button, that displays more pictures

button.addEventListener('click', handleMorePosts);

function handleMorePosts() {
  fetchImgV2(input.value)
    .then(data => {
      fetchResualtv2(data);
    })
    .catch(err => console.log('Error', err));
}

function fetchImgV2(smt) {
  return fetch(
    `https://pixabay.com/api/?key=28402505-f95f4c77bbfaeb79f596a5044&q=${smt}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  ).then(response => {
    if (!response.ok) {
      console.log(response.status);
      throw new Error(response.status);
    }
    return response.json();
  });
}

function fetchResualtv2(name) {
  for (let i = 0; i < 40; i++) {
    const elements = `<div class="photo-card">
  <div class="photo-gallery"><a class="photo-main" href="${name.hits[i].largeImageURL}"><img class="photo-small" src="${name.hits[i].webformatURL}" alt="${name.hits[i].tags}"/></a></div>
  <div class="info">
    <ul class="info-list">
    <li class="info-item"><div class="information">Likes</div><div class="value">${name.hits[i].likes}</div></li>
    <li class="info-item"><div class="information">Views</div><div class="value">${name.hits[i].views}</div></li>
    <li class="info-item"><div class="information">Comments</div><div class="value">${name.hits[i].comments}</div></li>
    <li class="info-item"><div class="information">Downloads</div><div class="value">${name.hits[i].downloads}</div></li>
   </ul>
  </div>
  </div>`;
    div.insertAdjacentHTML('beforeend', elements);
  }

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  let gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  page = page + 1;
}
