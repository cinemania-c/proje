document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('[data-modal]');
  const closeBtn = modal.querySelector('[data-modal-close]');
  const libraryBtn = modal.querySelector('.modal-details__library-btn');
  let currentMovieId = null;

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

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  function isInLibrary(movieId) {
    const library = JSON.parse(localStorage.getItem('myLibrary')) || [];
    return library.some(movie => movie.id === movieId);
  }

  function updateLibraryButton(movieId) {
    const isMovieInLibrary = isInLibrary(movieId);
    libraryBtn.textContent = isMovieInLibrary
      ? 'Remove from my library'
      : 'Add to my library';
    libraryBtn.dataset.action = isMovieInLibrary ? 'remove' : 'add';
  }

  function toggleLibrary(movie) {
    const library = JSON.parse(localStorage.getItem('myLibrary')) || [];
    const index = library.findIndex(item => item.id === movie.id);

    if (movie.genres && !movie.genre_ids) {
      movie.genre_ids = movie.genres.map(genre => genre.id);
    }

    if (movie.genre_ids && !movie.genres) {
      movie.genres = movie.genre_ids.map(id => ({
        id,
        name: genreMap[id] || 'Unknown',
      }));
    }

    if (index === -1) {
      library.push(movie);
    } else {
      library.splice(index, 1);
    }

    localStorage.setItem('myLibrary', JSON.stringify(library));
    updateLibraryButton(movie.id);
  }

  libraryBtn.addEventListener('click', async () => {
    if (currentMovieId) {
      const movieData = await fetchMovieDetails(currentMovieId);
      toggleLibrary(movieData);
    }
  });

  async function fetchMovieDetails(movieId) {
    const API_KEY = '016a30ce49a7789188b6fa9bad9963a6';
    const BASE_URL = 'https://api.themoviedb.org/3';
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
      );
      if (!response.ok) throw new Error('Failed to fetch movie details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  }

  async function populateModal(movieId) {
    const movieData = await fetchMovieDetails(movieId);
    if (!movieData) return;

    currentMovieId = movieData.id;

    modal.querySelector('.modal-details__image').src =
      `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
    modal.querySelector('.modal-details__image').alt = movieData.title;
    modal.querySelector('.modal-details__title').textContent = movieData.title;
    modal.querySelector('.modal-details__vote').textContent =
      movieData.vote_average.toFixed(1);
    modal.querySelector('.modal-details__votes').textContent =
      movieData.vote_count;
    modal.querySelector('.modal-details__popularity').textContent =
      movieData.popularity.toFixed(1);
    modal.querySelector('.modal-details__genre').textContent = movieData.genres
      .map(genre => genre.name)
      .join(', ');
    modal.querySelector('.modal-details__about-text').textContent =
      movieData.overview;

    updateLibraryButton(movieData.id);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.movieModal = {
    show: populateModal,
    close: closeModal,
  };
});
