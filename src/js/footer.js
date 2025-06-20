/* document.addEventListener('DOMContentLoaded', function () {
    const modalContainer = document.createElement('div');
    document.body.appendChild(modalContainer); // Modalın DOM’a eklenmesi şart
  
    fetch('modal.html')
      .then(response => response.text())
      .then(html => {
        modalContainer.innerHTML = html;
  
        const modal = modalContainer.querySelector('#teamModal');
  
        if (!modal) {
          console.warn('Modal bulunamadı.');
          return;
        }
  
        // Modal açıkken dışına tıklanırsa kapat
        modal.addEventListener('click', function (e) {
          if (e.target === modal) {
            closeModal();
          }
        });
  
        // ESC tuşuna basınca modalı kapat
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') {
            closeModal();
          }
        });
  
        // Kapatma fonksiyonu
        function closeModal() {
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
  
        // Eğer modal otomatik açılacaksa:
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      })
      .catch(error => console.error('Modal yüklenirken bir hata oluştu:', error));
  });
   */