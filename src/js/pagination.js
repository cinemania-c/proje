import axios from 'axios';

const API_KEY = '016a30ce49a7789188b6fa9bad9963a6';
const BASE_URL = 'https://api.themoviedb.org/3';

const paginationNumbers = document.getElementById('paginationNumbers');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const movieList = document.getElementById('movie-list');
const errorMessage = document.querySelector('.error-message');


let currentPage = 1;
let totalPages = 1;
let currentSearchQuery = '';

// Genre ID -> Genre Name map
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

// Function to get genre names (limit to first two)
function getGenreNames(genreIds) {
  if (!genreIds || !Array.isArray(genreIds)) return '';
  const mappedGenres = genreIds.map(id => genreMap[id] || 'Unknown');
  const firstTwoGenres = mappedGenres.slice(0, 2);
  return firstTwoGenres.join(', ');
}

// Function to extract release year
function getReleaseYear(releaseDate) {
  return releaseDate ? releaseDate.split('-')[0] : '';
}

export function initPagination() {
  loadMovies(1);
  prevButton.addEventListener('click', () => changePage(currentPage - 1));
  nextButton.addEventListener('click', () => changePage(currentPage + 1));
}

export function setSearchQuery(query) {
  currentSearchQuery = query.trim();
  loadMovies(1);
}

async function loadMovies(page) {
  try {
    const data = await fetchMovies(page, currentSearchQuery);
    renderMovies(data.results);

    currentPage = data.page;
    totalPages = data.total_pages;
    updatePaginationUI();
  } catch (error) {
    console.error('Failed to load movies:', error);
    showErrorMessage('Failed to load movies. Please try again.');
  }
}

async function fetchMovies(page, query) {
  try {
    let endpoint = '/trending/movie/week';
    let params = { api_key: API_KEY, page };

    if (query) {
      endpoint = '/search/movie';
      params.query = query;
    }

    const response = await axios.get(`${BASE_URL}${endpoint}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}

function renderMovies(movies) {
  movieList.innerHTML = '';
  errorMessage.style.display = 'none';

  if (!movies || movies.length === 0) {
    showErrorMessage('No movies found.');
    return;
  }

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'catalog-item';
    card.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;

    const genresString = getGenreNames(movie.genre_ids);
    const releaseYear = getReleaseYear(movie.release_date);
    const infoText = `${genresString}${releaseYear ? ` | ${releaseYear}` : ''}`;

    card.innerHTML = `
      <div class="catalog-card-info-container">
        <h3 class="catalog-card-title">${movie.title}</h3>
        <p class="catalog-card-description">${infoText}</p>
        <p class="rating">⭐ ${movie.vote_average.toFixed(1)}</p>
      </div>
    `;

    movieList.appendChild(card);

    // Add click event for modal
    card.addEventListener('click', () => {
      window.movieModal.show(movie.id); // Pass movie ID to modal
    });
  });
}

function updatePaginationUI() {
  paginationNumbers.innerHTML = '';

  if (totalPages < 2) {
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
    return;
  } else {
    prevButton.style.display = 'inline-block';
    nextButton.style.display = 'inline-block';
  }

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 5);

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.add('pagination-button');
    if (i === currentPage) {
      pageButton.classList.add('active');
    }
    pageButton.addEventListener('click', () => changePage(i));
    paginationNumbers.appendChild(pageButton);
  }

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

function showErrorMessage(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

async function changePage(newPage) {
  if (newPage >= 1 && newPage <= totalPages) {
    await loadMovies(newPage);
  }
}


