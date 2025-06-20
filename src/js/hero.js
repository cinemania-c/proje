/* hero.js */

import {
  fetchMovies,
  BASE_URL,
  ENDPOINTS,
  IMG_BASE_URL,
} from './fetchMovies.js';

import './weekly.js';
import './loader.js';
import './scroll-to-top.js';
import './modal.js'; // Bu mutlaka hero.js'den önce HTML'de veya import sırasıyla tanımlı olmalı
import './trailer-modal.js'


document.addEventListener('DOMContentLoaded', () => {
  // DOM Elemanları
  const heroItemSummary = document.querySelector('.hero-summary');
  const moreDetailsBtn = document.querySelector('.hero-button-moreDetails');
  const heroButtonWatchTrailer = document.querySelector('.hero-button-watchTrailer');
  const heroSection = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-image-container');
  const heroItemElement = document.querySelector('.hero');
  const heroItemTitle = document.querySelector('.hero-h1');
  const starContainer = document.querySelector('.hero-rating-stars');

  let heroMovieId = null;
  let movie = null;
  let imgElement;

  // Uzun metni kısalt
  function shortenText(text) {
    const maxLength = 170;
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  // Arka planı ayarla
  function setHeroBackground(movie) {
    const mobileImage = `${IMG_BASE_URL}/w500${movie.backdrop_path}`;
    const tabletImage = `${IMG_BASE_URL}/w780${movie.backdrop_path}`;
    const desktopImage = `${IMG_BASE_URL}/w1280${movie.backdrop_path}`;

    imgElement = document.createElement('img');
    imgElement.classList.add('hero-image-itself');
    imgElement.alt = movie.title;

    if (window.innerWidth <= 767) {
      imgElement.src = mobileImage;
    } else if (window.innerWidth <= 1279) {
      imgElement.src = tabletImage;
    } else {
      imgElement.src = desktopImage;
    }

    heroImage.innerHTML = '';
    heroImage.appendChild(imgElement);

    heroItemElement.setAttribute('aria-label', movie.title);
    heroItemTitle.textContent = movie.title;
    heroItemSummary.textContent = shortenText(movie.overview);
    heroMovieId = movie.id;
  }

  // Yıldız SVG'leri (SVG içeriğini doldurman yeterli)
  const fullStarSVG = `<svg>...FULL STAR...</svg>`;
  const halfStarSVG = `<svg>...HALF STAR...</svg>`;
  const emptyStarSVG = `<svg>...EMPTY STAR...</svg>`;

  function renderStarRating(rating, containerElement) {
    if (rating <= 0 || rating >= 10) {
      console.error('Rating must be between 0 and 10');
      return;
    }
    const mappedRating = rating / 2;
    containerElement.innerHTML = '';

    const fullStars = Math.floor(mappedRating);
    const halfStar = mappedRating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    for (let i = 0; i < fullStars; i++) {
      const starElement = document.createElement('div');
      starElement.innerHTML = fullStarSVG;
      containerElement.appendChild(starElement.firstElementChild);
    }

    if (halfStar) {
      const starElement = document.createElement('div');
      starElement.innerHTML = halfStarSVG;
      containerElement.appendChild(starElement.firstElementChild);
    }

    for (let i = 0; i < emptyStars; i++) {
      const starElement = document.createElement('div');
      starElement.innerHTML = emptyStarSVG;
      containerElement.appendChild(starElement.firstElementChild);
    }
  }

  // Film getir ve göster
  fetchMovies(BASE_URL, ENDPOINTS.POPULAR_MOVIES, { page: 1 }).then(data => {
    if (data.results && data.results.length > 0) {
      const randomNumber = Math.floor(Math.random() * data.results.length);
      movie = data.results[randomNumber];
      heroSection.dataset.movieid = movie.id;
      renderStarRating(movie.vote_average, starContainer);
      setHeroBackground(movie);
    } else {
      console.error('No movies found for hero section.');
    }
  });

  // Detaylara Git butonu
  moreDetailsBtn.addEventListener('click', () => {
    if (!window.movieModal || typeof window.movieModal.show !== 'function') {
      console.warn('Modal sistemi henüz hazır değil.');
      return;
    }

    if (heroMovieId) {
      window.movieModal.show(heroMovieId);
    }
  });

  // Responsive arka plan güncelle
  window.addEventListener('resize', () => {
    if (imgElement && movie) {
      setHeroBackground(movie);
    }
  });
});
