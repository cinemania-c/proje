import axios from 'axios';
//IMPORT API KEY FROM ENV (Bunu Calistiramadim SOnra Canliya Alirken Tekrardan Bakilacak) !
// const API_KEY = import.meta.env.VITE_APIKEY;
// console.log('APIKEY:', API_KEY);

//VARIABLES ABOUT THE API
const API_KEY = '016a30ce49a7789188b6fa9bad9963a6';
const BASE_URL = 'https://api.themoviedb.org/3'; //API ANA DIZIN
const IMG_BASE_URL = 'https://image.tmdb.org/t/p'; //API RESIM ANA DIZIN
export { BASE_URL, IMG_BASE_URL };

// ENDPOINT OBJECTS
export const ENDPOINTS = {
  TRENDING_WEEK: '/trending/movie/week', //API TREND FILM HAFTALIK
  TRENDING_DAY: '/trending/movie/day', //API TREND FILM GUNLUK
  POPULAR_MOVIES: '/movie/popular', //API TREND FILM
  UPCOMING_MOVIES: '/movie/upcoming', //API GET UPCOMING
  MOVIE_DETAILS: movieId => `/movie/${movieId}`,
  MOVIE_VIDEOS: movieId => `/movie/${movieId}/videos`,
  SEARCH_MOVIES: '/search/movie',
  GENRE_LIST: '/genre/movie/list',
  IMG_W500: '/w500', //(BURAYA IHTIYACA GORE DIGER EBATLAR EKLENIR)
  IMG_W780: '/w780',
  IMG_W1280: '/w1280',
  IMG_ORIGINAL: '/original', // RESIM ORJINAL
};

export async function fetchMovies(baseurl, endpoint, params = {}) {
  try {
    const response = await axios.get(`${baseurl}${endpoint}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page: 1,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

//FUNCTION APPLICATION EXAMPLE
// fetchMovies(BASE_URL, ENDPOINTS.TRENDING_WEEK);
// fetchMovies(BASE_URL, ENDPOINTS.TRENDING_DAY);
// fetchMovies(BASE_URL, ENDPOINTS.SEARCH_MOVIES, { query: 'avengers' });
// fetchMovies(BASE_URL, ENDPOINTS.GENRE_LIST);
// fetchMovies(BASE_URL, ENDPOINTS.MOVIE_DETAILS, { id: 337401 });
// fetchMovies(BASE_URL, ENDPOINTS.POPULAR_MOVIES);

// fetchMovies(BASE_URL, ENDPOINTS.POPULAR_MOVIES, { page: 1 }).then(data => {
//   console.log(data);
//   const randomNumber = Math.floor(Math.random() * 20);
//   console.log(randomNumber);
//   const movie = data.results[randomNumber];
//   const imageUrl = `${IMG_BASE_URL}${ENDPOINTS.IMG_ORIGINAL}${movie.poster_path}`; // Resim URL'sini oluşturuyoruz

//   const heroItemElement = document.querySelector('#heroItem');
//   const imgElement = document.createElement('img');
//   imgElement.src = imageUrl;
//   imgElement.alt = movie.title;
//   heroItemElement.appendChild(imgElement);
// });

// API Configuration (Bu Kisim Bilgi Icindir Canlida Temizlenebilir...)
/* 
{
  "images": {
    "base_url": "http://image.tmdb.org/t/p/",
    "secure_base_url": "https://image.tmdb.org/t/p/",
    "backdrop_sizes": [
      "w300",
      "w780",
      "w1280",
      "original"
    ],
    "logo_sizes": [
      "w45",
      "w92",
      "w154",
      "w185",
      "w300",
      "w500",
      "original"
    ],
    "poster_sizes": [
      "w92",
      "w154",
      "w185",
      "w342",
      "w500",
      "w780",
      "original"
    ],
    "profile_sizes": [
      "w45",
      "w185",
      "h632",
      "original"
    ],
    "still_sizes": [
      "w92",
      "w185",
      "w300",
      "original"
    ]
  },
  "change_keys": [
    "adult",
    "air_date",
    "also_known_as",
    "alternative_titles",
    "biography",
    "birthday",
    "budget",
    "cast",
    "certifications",
    "character_names",
    "created_by",
    "crew",
    "deathday",
    "episode",
    "episode_number",
    "episode_run_time",
    "freebase_id",
    "freebase_mid",
    "general",
    "genres",
    "guest_stars",
    "homepage",
    "images",
    "imdb_id",
    "languages",
    "name",
    "network",
    "origin_country",
    "original_name",
    "original_title",
    "overview",
    "parts",
    "place_of_birth",
    "plot_keywords",
    "production_code",
    "production_companies",
    "production_countries",
    "releases",
    "revenue",
    "runtime",
    "season",
    "season_number",
    "season_regular",
    "spoken_languages",
    "status",
    "tagline",
    "title",
    "translations",
    "tvdb_id",
    "tvrage_id",
    "type",
    "video",
    "videos"
  ]
}
*/
