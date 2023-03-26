import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more')

let page = 1;

const trimInputData = () => input.value.trim();

loadMoreBtn.style.display = 'none';
form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onBtnLoadMore);

function onSearch(event) {
  event.preventDefault();

  page = 1;
  gallery.innerHTML = '';

  const name = trimInputData();

  if (name !== '') {
    pixabay(name);
  } else {
    loadMoreBtn.style.display = 'none';

    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function onBtnLoadMore() {
  const name = trimInputData();
  page += 1;
  pixabay(name, page);
}

async function pixabay(name, page) {
  const API_URL = 'https://pixabay.com/api/';

  const options = {
    params: {
      key: '34473275-92c4bd108423fa9b9bf2a0798',
      q: name,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  };

  try {
    const response = await axios.get(API_URL, options);

    notification(response.data.hits.length, response.data.total);

    createMarkup(response.data);
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(array) {
  const markup = array.hits
.map(
      item =>
        `<a class="photo-link" href="${item.largeImageURL}"><div class="photo-card"><div class="photo"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/></div><div class="info"><p class="info-item"><b>Likes</b>${item.likes}</p><p class="info-item"><b>Views</b>${item.views}</p><p class="info-item"><b>Comments</b>${item.comments}</p><p class="info-item"><b>Downloads</b>${item.downloads}</p></div></div></a>`
    ).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  simpleLightBox.refresh();
}

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  overlayOpacity: 0.6,
});

function notification(length, totalHits) {
  if (totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'   
    );
    input.value = '';
    loadMoreBtn.style.display = 'none';
    return;
  }
  if (page === 1) {
    loadMoreBtn.style.display = 'flex';

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  if (length < 40) {
    loadMoreBtn.style.display = 'none';

    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}