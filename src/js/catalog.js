import { initPagination } from './pagination.js';
import './modal.js';

// API AYARLARI
const API_KEY = '9d898ad8ed36e30a2f478f382f12d8e2';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p';

export const ENDPOINTS = {
  TRENDING_WEEK: '/trending/movie/week',
  SEARCH_MOVIES: '/search/movie',
  IMG_W500: '/w500',
};

// HTML ELEMENTLER
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearButton = document.getElementById('clear-button');
const yearSelect = document.getElementById('year-select');
const movieListContainer = document.getElementById('movie-list');
const errorMessage = document.querySelector('.error-message');

// TÜRLER HARİTASI
const genreMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

// Yardımcı fonksiyonlar
function getGenreNames(genreIds) {
  if (!Array.isArray(genreIds)) return '';
  const names = genreIds.map(id => genreMap[id] || 'Unknown');
  return names.slice(0, 2).join(', ');
}
function getReleaseYear(date) {
  return date ? date.split('-')[0] : '';
}

// Film kartlarını render et
function renderMovies(movies) {
  movieListContainer.innerHTML = '';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'catalog-item';
    card.id = `movie-${movie.id}`;

    const posterUrl = movie.poster_path
      ? `${IMG_BASE_URL}${ENDPOINTS.IMG_W500}${movie.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image';

    console.log('Poster URL:', posterUrl); // Poster URL'yi konsola yazdır

    card.innerHTML = `
      <img src="${posterUrl}" alt="${movie.title}" class="catalog-img" />
      <div class="catalog-card-info-container">
        <h3 class="catalog-card-title">${movie.title}</h3>
        <p class="catalog-card-description">${getGenreNames(movie.genre_ids)}${
      getReleaseYear(movie.release_date)
        ? ` | ${getReleaseYear(movie.release_date)}`
        : ''
    }</p>
        <p class="rating">⭐ ${movie.vote_average.toFixed(1)}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      window.movieModal?.show(movie.id);
    });

    movieListContainer.appendChild(card);
  });
}

// API'den veri çek
async function fetchMovies(endpoint, params = {}) {
  const url = new URL(BASE_URL + endpoint);
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('language', 'en-US');
  url.searchParams.append('page', 1);

  Object.entries(params).forEach(([key, val]) =>
    url.searchParams.append(key, val)
  );

  const response = await fetch(url);
  if (!response.ok) throw new Error('API request failed');
  return response.json();
}

// Trend filmleri yükle (ilk açılış)
async function loadTrendingMovies() {
  try {
    const data = await fetchMovies(ENDPOINTS.TRENDING_WEEK);
    if (data.results?.length > 0) {
      renderMovies(data.results);
      errorMessage.style.display = 'none';
    } else {
      errorMessage.textContent = 'No trending movies found.';
      errorMessage.style.display = 'block';
    }
  } catch (err) {
    console.error(err);
    errorMessage.textContent = 'Failed to load trending movies.';
    errorMessage.style.display = 'block';
  }
}

//  Yıl dropdown'ını doldur
function populateYearDropdown() {
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1960; y--) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }
}

// Arama input ✕ butonu kontrol
searchInput.addEventListener('input', () => {
  clearButton.style.display = searchInput.value.trim()
    ? 'inline-block'
    : 'none';
});
clearButton.addEventListener('click', () => {
  searchInput.value = '';
  clearButton.style.display = 'none';
});

// Arama form submit
searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  const query = searchInput.value.trim();
  const selectedYear = yearSelect.value;

  if (!query) return;

  try {
    const data = await fetchMovies(ENDPOINTS.SEARCH_MOVIES, {
      query,
      primary_release_year: selectedYear,
    });

    if (data.results?.length > 0) {
      renderMovies(data.results);
      errorMessage.style.display = 'none';
    } else {
      movieListContainer.innerHTML = '';
      errorMessage.textContent = `  OOPS!        We are unable to load trending movies. Please try again later.
`;
      errorMessage.style.display = 'block';
    }
  } catch (err) {
    console.error(err);
    errorMessage.textContent = 'Search failed. Please try again.';
    errorMessage.style.display = 'block';
  }
});

// Sayfa açıldığında
document.addEventListener('DOMContentLoaded', () => {
  initPagination();
  populateYearDropdown();
  loadTrendingMovies();
});
