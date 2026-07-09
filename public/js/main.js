document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Logic
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll('.fade-in, .slide-up');
  elementsToAnimate.forEach(el => observer.observe(el));

  // Gallery Drag-to-Scroll Logic
  const galleryContainer = document.getElementById('gallery-container');
  let isDown = false;
  let startX;
  let scrollLeft;

  if (galleryContainer) {
    galleryContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      galleryContainer.style.scrollSnapType = 'none'; // Disable snap while dragging
      startX = e.pageX - galleryContainer.offsetLeft;
      scrollLeft = galleryContainer.scrollLeft;
    });
    galleryContainer.addEventListener('mouseleave', () => {
      isDown = false;
      galleryContainer.style.scrollSnapType = 'x mandatory';
    });
    galleryContainer.addEventListener('mouseup', () => {
      isDown = false;
      galleryContainer.style.scrollSnapType = 'x mandatory';
    });
    galleryContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - galleryContainer.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      galleryContainer.scrollLeft = scrollLeft - walk;
    });
  }

  // Lightbox Logic
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  let currentIndex = 0;
  const totalImages = galleryItems.length;

  if (lightbox && lightboxImg && closeBtn && totalImages > 0) {
    const updateLightboxContent = (index) => {
      const item = galleryItems[index];
      const img = item.querySelector('.gallery-img');
      const caption = item.querySelector('figcaption');
      
      lightboxImg.src = img.src;
      if (caption) {
        lightboxCaption.textContent = caption.textContent;
      } else {
        lightboxCaption.textContent = '';
      }
      currentIndex = index;
    };

    const showNext = () => {
      let newIndex = currentIndex + 1;
      if (newIndex >= totalImages) newIndex = 0; // Infinite loop
      updateLightboxContent(newIndex);
    };

    const showPrev = () => {
      let newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = totalImages - 1; // Infinite loop
      updateLightboxContent(newIndex);
    };

    // Open lightbox on image click
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('.gallery-img');
      if (img) {
        img.addEventListener('click', () => {
          updateLightboxContent(index);
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
      }
    });

    // Close lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
      setTimeout(() => {
        lightboxImg.src = '';
        lightboxCaption.textContent = '';
      }, 300); // Wait for transition to finish
    };

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-wrapper')) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });

    // Swipe navigation (Touch Events)
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    lightbox.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});

    const handleSwipe = () => {
      const swipeThreshold = 50; // Minimum distance to be considered a swipe
      if (touchEndX < touchStartX - swipeThreshold) {
        showNext(); // Swipe left
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        showPrev(); // Swipe right
      }
    };
  }
});
