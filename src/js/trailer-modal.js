import { fetchMovies, BASE_URL, ENDPOINTS } from './fetchMovies.js';

document.addEventListener('DOMContentLoaded', () => {
  const heroTrailerId = document.querySelector('.hero');
  const modal = document.querySelector('.modal-trailer');
  const closeBtn = modal.querySelector('.modal-trailer__close');
  const watchTrailerBtn = document.querySelector('.hero-button-watchTrailer');
  const iframe = modal.querySelector('.modal-trailer__video');

  function stopVideo() {
    const videoSrc = iframe.src;
    iframe.src = videoSrc;
  }

  function closeModal() {
    console.log('Closing modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    stopVideo();
  }

  function openModal() {
    console.log('Opening modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    console.log('video api ', heroTrailerId.dataset.movieid);
    //OFFICIAL TRAILER
    fetchMovies(BASE_URL, `/movie/${heroTrailerId.dataset.movieid}/videos`, {
      page: 1,
    }).then(videoData => {
      console.log('VIDEO:', videoData);

      const officialTrailer = videoData.results.find(
        video =>
          video.official === true &&
          video.site === 'YouTube' &&
          video.type === 'Trailer'
      );

      if (officialTrailer) {
        const youtubeUrl = `https://www.youtube.com/embed/${officialTrailer.key}`;
        console.log(iframe.src);
        iframe.src = youtubeUrl;
        console.log(iframe.src);
      } else {
        console.log('No official YouTube trailer found.');
      }
    });

    // console.log("trailer data", deneme);
    // iframe.src = `https://www.youtube.com/embed/${data.key}`;
  }

  // Event Listeners
  if (watchTrailerBtn) {
    watchTrailerBtn.addEventListener('click', e => {
      console.log('Watch trailer button clicked');
      e.preventDefault();
      openModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', e => {
      console.log('Close button clicked');
      e.preventDefault();
      closeModal();
    });
  }

  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        console.log('Clicked outside modal');
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      console.log('Escape key pressed');
      closeModal();
    }
  });

  // Export for use in other modules if needed
  window.trailerModal = {
    open: openModal,
    close: closeModal,
  };
});
