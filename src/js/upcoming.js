import {
  fetchMovies,
  BASE_URL,
  ENDPOINTS,
  IMG_BASE_URL,
} from './fetchMovies.js';

const upcomingBtn = document.querySelector('.upcoming__library-btn');

const UPCOMING_IMG = document.querySelector('#content-poster');
const movieTitle = document.querySelector('#movie-title');
const releaseDateElement = document.querySelector('#date-of-release');
const avarageVote = document.querySelector('#avarage-vote');
const popularity = document.querySelector('#popularity');
const countVote = document.querySelector('#count-vote');
const genres = document.querySelector('#genres');
const summary = document.querySelector('#summary');

let genreMap = {};
let currentMovieId = null; // Currently active movie ID

// Load genre list
fetchMovies(BASE_URL, ENDPOINTS.GENRE_LIST).then(data => {
  data.genres.forEach(genre => {
    genreMap[genre.id] = genre.name;
  });
});

// Check if movie exists in local storage
function isInLibrary(movieId) {
  const library = JSON.parse(localStorage.getItem('myLibrary')) || [];
  return library.some(movie => movie.id === movieId);
}

// Update the button state
function updateLibraryButton(movieId) {
  const isMovieInLibrary = isInLibrary(movieId);
  upcomingBtn.textContent = isMovieInLibrary
    ? 'Remove from my library'
    : 'Add to my library';
  upcomingBtn.dataset.action = isMovieInLibrary ? 'remove' : 'add';
}

// Add or remove movie from local storage
function toggleLibrary(movie) {
  const library = JSON.parse(localStorage.getItem('myLibrary')) || [];
  const index = library.findIndex(item => item.id === movie.id);

  if (index === -1) {
    library.push(movie); // Add movie
  } else {
    library.splice(index, 1); // Remove movie
  }

  localStorage.setItem('myLibrary', JSON.stringify(library));
  updateLibraryButton(movie.id); // Refresh button state
}

// Load upcoming movie details and update button
export const movieInit = async () => {
  try {
    const data = await fetchMovies(BASE_URL, ENDPOINTS.UPCOMING_MOVIES, {
      page: 1,
    });
    const today = new Date();

    // Filter movies releasing after today
    const futureMovies = data.results.filter(movie => {
      const releaseDate = new Date(movie.release_date);
      return releaseDate >= today;
    });

    if (futureMovies.length > 0) {
      const randomMovie =
        futureMovies[Math.floor(Math.random() * futureMovies.length)];

      // Populate DOM with movie data
      currentMovieId = randomMovie.id;
      UPCOMING_IMG.src = `${IMG_BASE_URL}${ENDPOINTS.IMG_W1280}${randomMovie.backdrop_path}`;
      UPCOMING_IMG.alt = randomMovie.title;
      movieTitle.textContent = randomMovie.title;
      releaseDateElement.textContent = new Date(
        randomMovie.release_date
      ).toLocaleDateString('en-GB');
      avarageVote.textContent = randomMovie.vote_average;
      popularity.textContent = randomMovie.popularity;
      countVote.textContent = randomMovie.vote_count;
      genres.textContent = randomMovie.genre_ids
        .map(id => genreMap[id])
        .join(', ');
      summary.textContent = randomMovie.overview;

      // Set initial button state
      updateLibraryButton(currentMovieId);

      // Handle button click
      upcomingBtn.addEventListener('click', () => {
        toggleLibrary(randomMovie);
      });
    }
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
  }
};


// Initialize
movieInit();
