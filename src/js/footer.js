document.addEventListener('DOMContentLoaded', function() {
  const modalContainer = document.createElement('div');
  // document.body.appendChild(modalContainer);

  // Modal HTML dosyasını yükle
  fetch('modal.html')
      .then(response => response.text())
      .then(html => {
          modalContainer.innerHTML = html;

          const modal = document.getElementById('teamModal');
          const teamLink = document.getElementById('teamLink');
          const closeButton = document.getElementById('closeModal');

          // Modal açma işlevi
          teamLink.addEventListener('click', function() {
              modal.classList.add('active');
              document.body.style.overflow = 'hidden';
          });

          // Modal kapatma işlevi
          function closeModal() {
              modal.classList.remove('active');
              document.body.style.overflow = 'auto';
          }

          // X butonuna tıklama işlevi
          closeButton.addEventListener('click', closeModal);

          // Modal dışına tıklama işlevi
          modal.addEventListener('click', function(e) {
              if (e.target === modal) {
                  closeModal();
              }
          });

          // ESC tuşuyla modal kapatma işlevi
          document.addEventListener('keydown', function(e) {
              if (e.key === 'Escape') {
                  closeModal();
              }
          });
      })
      .catch(error => console.error('Modal yüklenirken bir hata oluştu:', error));
});
