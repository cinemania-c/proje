const weeklyList = document.querySelector('#weekly-movie-card');

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
  const firstTwoGenres = mappedGenres.slice(0, 2);
  return firstTwoGenres.join(', ');
}

// Function to extract release year
function getReleaseYear(releaseDate) {
  return releaseDate ? releaseDate.split('-')[0] : '';
}

// Weekly movies yükleme
async function loadWeeklyMovies() {
  try {
    const data = await fetchMovies(BASE_URL, ENDPOINTS.TRENDING_WEEK);
    const movies = data.results.slice(0, 3); // İlk 3 filmi alıyoruz

    const catalogItems = movies.map(movie => {
      const genresString = getGenreNames(movie.genre_ids);
      const releaseYear = getReleaseYear(movie.release_date);
      const infoText = `${genresString}${
        releaseYear ? ` | ${releaseYear}` : ''
      }`;
      return `
                <li class="catalog-item" id="weekly-movie-${movie.id}">
                    <img class="catalog-img" src="${IMG_BASE_URL}/w500${
        movie.poster_path
      }" alt="${movie.title}">
      <div class="catalog-card-info-container weekly-font">
            <h2 class="weekly-card-title">${movie.title}</h2>
            <p class="weekly-card-text">${infoText}</p>
            <p class="weekly-card-rating">⭐ ${movie.vote_average.toFixed(
              1
            )}</p>
        </div>
                </li>
            `;
    });

    weeklyList.innerHTML = catalogItems.join('');

    // Her film kartına tıklama olayı ekle
    movies.forEach(movie => {
      const movieCard = document.getElementById(`weekly-movie-${movie.id}`);
      movieCard.addEventListener('click', () => {
        window.movieModal.show(movie.id); // Tıklanan filmin ID'sini modal'a gönder
      });
    });
  } catch (error) {
    console.error('Error loading weekly movies:', error);
  }
}

// Weekly movies yükleniyor
loadWeeklyMovies();
