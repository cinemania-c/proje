const weeklyList = document.querySelector('#weekly-movie-card');

const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p';
const API_KEY = '9d898ad8ed36e30a2f478f382f12d8e2';
const ENDPOINTS = {
  TRENDING_WEEK: '/trending/movie/week',
};

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

function getGenreNames(genreIds) {
  if (!genreIds || !Array.isArray(genreIds)) return '';
  const mappedGenres = genreIds.map(id => genreMap[id] || 'Unknown');
  return mappedGenres.slice(0, 2).join(', ');
}

function getReleaseYear(releaseDate) {
  return releaseDate ? releaseDate.split('-')[0] : '';
}

async function fetchMovies(baseUrl, endpoint) {
  const url = `${baseUrl}${endpoint}?api_key=${API_KEY}&language=en-US`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('API fetch failed');
  return await response.json();
}

async function loadWeeklyMovies() {
  try {
    const data = await fetchMovies(BASE_URL, ENDPOINTS.TRENDING_WEEK);
   

    const movies = data.results.slice(0, 3);

    const catalogItems = movies.map(movie => {
      const genresString = getGenreNames(movie.genre_ids);
      const releaseYear = getReleaseYear(movie.release_date);
      const infoText = `${genresString}${releaseYear ? ` | ${releaseYear}` : ''}`;
     const posterUrl = movie.poster_path
  ? `${IMG_BASE_URL}/w500${movie.poster_path}`
  : 'https://via.placeholder.com/500x750?text=No+Image';

     

      return `
        <li class="catalog-item" id="weekly-movie-${movie.id}">
          <img class="catalog-img" src="${posterUrl}" alt="${movie.title}">
          <div class="catalog-card-info-container weekly-font">
            <h2 class="weekly-card-title">${movie.title}</h2>
            <p class="weekly-card-text">${infoText}</p>
            <p class="weekly-card-rating">⭐ ${movie.vote_average.toFixed(1)}</p>
          </div>
        </li>
      `;
    });

    weeklyList.innerHTML = catalogItems.join('');

    movies.forEach(movie => {
      const movieCard = document.getElementById(`weekly-movie-${movie.id}`);
      movieCard.addEventListener('click', () => {
        window.movieModal?.show(movie.id);
      });
    });
  } catch (error) {
    console.error('Hata:', error);
  }
}

loadWeeklyMovies();
