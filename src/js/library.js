document.addEventListener('DOMContentLoaded', () => {
  const genreDropdownContainer = document.getElementById(
    'genre-dropdown-container'
  );
  const loadMoreContainer = document.getElementById('load-more-container');
  const libraryList = document.getElementById('library-list');
  const defaultContent = document.getElementById('default-content');
  const genreDropdown = document.getElementById('genre-dropdown');

  const pageSize = 10;
  let currentPage = 1;

  const myLibrary = JSON.parse(localStorage.getItem('myLibrary')) || [];

  if (myLibrary.length === 0) {
    // Film yoksa, sadece varsayılan ekranı göster
    defaultContent.style.display = 'block';
    genreDropdownContainer.style.display = 'none';
    loadMoreContainer.style.display = 'none';
    return;
  }

  // Film varsa, varsayılan ekranı gizle ve dropdown/load more'u göster
  defaultContent.style.display = 'none';
  genreDropdownContainer.style.display = 'block';
  renderLibrary(myLibrary.slice(0, pageSize));

  if (myLibrary.length > pageSize) {
    loadMoreContainer.style.display = 'block';
  } else {
    loadMoreContainer.style.display = 'none';
  }

  // Genre Dropdown İşlevselliği
  genreDropdown.addEventListener('change', e => {
    const genreId = e.target.value;

    // Tür filtreleme
    const filteredMovies =
      genreId === 'all'
        ? myLibrary.slice(0, currentPage * pageSize)
        : myLibrary.filter(movie =>
            movie.genre_ids.includes(parseInt(genreId))
          );

    if (filteredMovies.length === 0) {
      // Eğer seçilen türe ait film yoksa varsayılan ekranı göster
      defaultContent.style.display = 'block';
      libraryList.innerHTML = '';
      genreDropdownContainer.style.display = 'block';
      loadMoreContainer.style.display = 'none';
    } else {
      // Film varsa listeyi render et
      defaultContent.style.display = 'none';
      renderLibrary(filteredMovies.slice(0, currentPage * pageSize));
      loadMoreContainer.style.display =
        filteredMovies.length > currentPage * pageSize ? 'block' : 'none';
    }
  });

  // Load More İşlevselliği
  document.getElementById('load-more').addEventListener('click', () => {
    currentPage++;
    const newMovies = myLibrary.slice(0, currentPage * pageSize);
    renderLibrary(newMovies);

    if (newMovies.length >= myLibrary.length) {
      loadMoreContainer.style.display = 'none';
    }
  });
});

function renderLibrary(library) {
  const libraryList = document.getElementById('library-list');
  libraryList.innerHTML = '';

  library.forEach(movie => {
    const movieItem = document.createElement('div');
    movieItem.className = 'movie-item';
    movieItem.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    }" class="movie-poster">
        <div class="catalog-card-info-container">
          <h3 class="catalog-card-title">${movie.title}</h3>
          <p class="catalog-card-description">${getGenreNames(
            movie.genre_ids
          )} | ${
      movie.release_date ? movie.release_date.split('-')[0] : 'Unknown'
    }</p>
          <p class="rating">⭐ ${movie.vote_average.toFixed(1)}</p>
        </div>
      `;

    movieItem.addEventListener('click', () => {
      window.movieModal.show(movie.id);
    });

    libraryList.appendChild(movieItem);
  });
}

function getGenreNames(genreIds) {
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

  if (!genreIds || !Array.isArray(genreIds)) return '';
  const mappedGenres = genreIds.map(id => genreMap[id] || 'Unknown');
  return mappedGenres.slice(0, 2).join(', '); // Maksimum 2 genre döndür
}
