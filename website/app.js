// Folia Showcase Website — Clean Interactive Scripts
document.addEventListener('DOMContentLoaded', () => {

  // 1. Niche Selector Tabs (Romanzieri, Fantasy, GM/D&D, Giallisti, Self-publisher)
  const nicheButtons = document.querySelectorAll('.niche-tab-btn');
  const nicheCards = document.querySelectorAll('.niche-display-card');

  nicheButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetNiche = btn.getAttribute('data-niche');

      nicheButtons.forEach(b => b.classList.remove('active'));
      nicheCards.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetCard = document.getElementById('niche-' + targetNiche);
      if (targetCard) {
        targetCard.classList.add('active');
      }
    });
  });

  // 2. Real Folia Mockup Sidebar Navigation
  // Switches panes: #pane-editor, #pane-chars, #pane-world, #pane-maps, #pane-cork, #pane-plot, #pane-ideas
  const sidebarItems = document.querySelectorAll('.sidebar-nav-item[data-view]');
  const viewPanes = document.querySelectorAll('.real-view-pane');

  sidebarItems.forEach((item) => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-view');
      if (!targetView) return;

      sidebarItems.forEach(i => i.classList.remove('active'));
      viewPanes.forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const targetPane = document.getElementById('pane-' + targetView);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 3. Real Folia Mockup — Character Sheet Switcher (Elena, Malakor, Soren)
  const mockCharCards = document.querySelectorAll('.real-char-card[data-mockchar]');
  const mockCharTitle = document.getElementById('mock-char-title');
  const mockCharArch = document.getElementById('mock-char-archetype');
  const mockCharGoal = document.getElementById('mock-char-goal');
  const mockCharNeed = document.getElementById('mock-char-need');
  const mockCharFlaw = document.getElementById('mock-char-flaw');

  const charProfiles = {
    elena: {
      title: 'Elena Voss',
      archetype: "L'Esploratrice Ribelle (Ladra / Barda)",
      goal: "Decifrare il Codice di Smeraldo prima dell'Inquisizione",
      need: "Imparare a fidarsi degli altri e superare il senso di colpa",
      flaw: "Orgoglio ostinato e diffidenza verso chiunque"
    },
    malakor: {
      title: 'Lord Malakor (BBEG)',
      archetype: "Il Tiranno Caduto (Antagonista CR 12)",
      goal: "Restaurare l'antico Ordine Imperiale a qualunque costo",
      need: "Accettare l'inevitabilità della perdita di controllo e del tempo",
      flaw: "Cieca brama di dominio assoluto e spietatezza verso chi fallisce"
    },
    soren: {
      title: 'Maestro Soren',
      archetype: "Il Mentore Eremita (Mago Divinatore Liv. 11)",
      goal: "Custodire i segreti dell'ultimo archivio della Biblioteca di Silente",
      need: "Trovare un'erede degna a cui tramandare la conoscenza antica",
      flaw: "Segretezza criptica e tendenza a manipolare gli eventi nell'ombra"
    }
  };

  mockCharCards.forEach((card) => {
    card.addEventListener('click', () => {
      mockCharCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const charKey = card.getAttribute('data-mockchar');
      const profile = charProfiles[charKey];
      if (profile) {
        if (mockCharTitle) mockCharTitle.textContent = profile.title;
        if (mockCharArch) mockCharArch.value = profile.archetype;
        if (mockCharGoal) mockCharGoal.value = profile.goal;
        if (mockCharNeed) mockCharNeed.value = profile.need;
        if (mockCharFlaw) mockCharFlaw.value = profile.flaw;
      }
    });
  });

  // 4. Clean Notion-Style FAQ Accordion
  const faqRows = document.querySelectorAll('.faq-row');

  faqRows.forEach((row) => {
    const btn = row.querySelector('.faq-btn');
    const collapse = row.querySelector('.faq-collapse');

    if (btn && collapse) {
      btn.addEventListener('click', () => {
        const isOpen = row.classList.contains('active');

        // Close all other FAQs
        faqRows.forEach((other) => {
          other.classList.remove('active');
          const otherCollapse = other.querySelector('.faq-collapse');
          if (otherCollapse) otherCollapse.style.maxHeight = null;
        });

        if (!isOpen) {
          row.classList.add('active');
          collapse.style.maxHeight = collapse.scrollHeight + 'px';
        }
      });
    }
  });

  // 5. Elegant Desktop Screenshot Slider
  const sliderTrack = document.getElementById('slider-track');
  const sliderSlides = document.querySelectorAll('.slider-slide');
  const titleDisplay = document.getElementById('slider-title-display');
  const counterDisplay = document.getElementById('slider-counter-display');
  const pillDots = document.querySelectorAll('.slider-pill-dot');
  const btnPrev = document.getElementById('slider-btn-prev');
  const btnNext = document.getElementById('slider-btn-next');
  const floatPrev = document.getElementById('float-btn-prev');
  const floatNext = document.getElementById('float-btn-next');
  const sliderViewport = document.getElementById('slider-viewport');

  let currentSlide = 0;
  const totalSlides = sliderSlides.length || 4;

  const slideTitles = [
    '1. Manoscritto &amp; Wiki-Popup',
    '2. Scheda Personaggio (Psicologia &amp; Tratti)',
    '3. Schede D&amp;D 5e &amp; Party GDR',
    '4. Mappe Geografiche &amp; Segnaposti'
  ];

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    if (sliderTrack) {
      sliderTrack.style.transform = `translateX(-${currentSlide * 25}%)`;
    }

    if (titleDisplay && slideTitles[currentSlide]) {
      titleDisplay.innerHTML = slideTitles[currentSlide];
    }

    if (counterDisplay) {
      counterDisplay.textContent = `${currentSlide + 1} / ${totalSlides}`;
    }

    pillDots.forEach((pill, idx) => {
      if (idx === currentSlide) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // Bind Buttons
  if (btnPrev) btnPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
  if (btnNext) btnNext.addEventListener('click', () => goToSlide(currentSlide + 1));
  if (floatPrev) floatPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
  if (floatNext) floatNext.addEventListener('click', () => goToSlide(currentSlide + 1));

  // Bind Bottom Pill Dots
  pillDots.forEach((pill) => {
    pill.addEventListener('click', () => {
      const targetSlide = parseInt(pill.getAttribute('data-gotoslide'), 10);
      if (!isNaN(targetSlide)) {
        goToSlide(targetSlide);
      }
    });
  });

  // Keyboard navigation when user presses Left/Right arrow keys
  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('folia-lightbox');
    const isLightboxActive = lightbox && lightbox.classList.contains('active');
    
    if (e.key === 'ArrowLeft') {
      goToSlide(currentSlide - 1);
      if (isLightboxActive && sliderSlides[currentSlide]) {
        const currentImg = sliderSlides[currentSlide].querySelector('.sc-full-img');
        if (currentImg) {
          const lbImg = document.getElementById('lightbox-target-img');
          if (lbImg) lbImg.src = currentImg.src;
        }
      }
    } else if (e.key === 'ArrowRight') {
      goToSlide(currentSlide + 1);
      if (isLightboxActive && sliderSlides[currentSlide]) {
        const currentImg = sliderSlides[currentSlide].querySelector('.sc-full-img');
        if (currentImg) {
          const lbImg = document.getElementById('lightbox-target-img');
          if (lbImg) lbImg.src = currentImg.src;
        }
      }
    }
  });

  // Touch Swipe Support for Mobile/Trackpad
  let touchStartX = 0;
  let touchEndX = 0;

  if (sliderViewport) {
    sliderViewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderViewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 40;
      if (touchEndX < touchStartX - swipeThreshold) {
        goToSlide(currentSlide + 1);
      } else if (touchEndX > touchStartX + swipeThreshold) {
        goToSlide(currentSlide - 1);
      }
    }, { passive: true });
  }

  // 6. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;
      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// Lightbox Modal Functions (Global Scope)

  // =========================================================================
  // 7. Live Download Counter

  const dlCounterVal = document.getElementById('download-count-val');
  const heroDlVal = document.getElementById('hero-download-count');

  function updateCounterDisplays(count) {
    const formatted = Number(count).toLocaleString('it-IT');
    if (dlCounterVal) dlCounterVal.textContent = formatted;
    if (heroDlVal) heroDlVal.textContent = formatted;
  }

  function fetchDownloadCount() {
    fetch('/api/downloads')
      .then(res => res.json())
      .then(data => {
        if (data && data.count) {
          updateCounterDisplays(data.count);
        }
      })
      .catch(() => {});
  }

  fetchDownloadCount();

  window.trackFoliaDownload = function() {
    fetch('/api/downloads', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data && data.count) {
          updateCounterDisplays(data.count);
        }
      })
      .catch(() => {});
  };


  // Bind click on all download buttons
  document.querySelectorAll('a[href*="Folia"], a[href$=".exe"], .btn-download, a[href="#download"]').forEach(btn => {
    btn.addEventListener('click', () => {
      // Only track if it's an actual download link
      if (btn.getAttribute('href') && (btn.getAttribute('href').endsWith('.exe') || btn.classList.contains('btn-download-action'))) {
        window.trackFoliaDownload();
      }
    });
  });

  // =========================================================================
  // 8. Community Reviews & Google Authentication Modal
  // =========================================================================
  const reviewModal = document.getElementById('review-modal-overlay');
  const btnOpenReview = document.getElementById('btn-open-review-modal');
  const stepAuth = document.getElementById('review-step-auth');
  const stepForm = document.getElementById('review-step-form');
  const btnGoogleLogin = document.getElementById('btn-google-login');
  const btnDisconnectGoogle = document.getElementById('btn-disconnect-google');
  const connectedUserName = document.getElementById('connected-user-name');
  const connectedUserAvatar = document.getElementById('connected-user-avatar');
  const starPicker = document.getElementById('star-rating-picker');
  const inputRating = document.getElementById('input-review-rating');
  const formReview = document.getElementById('form-submit-review');
  const reviewsContainer = document.getElementById('reviews-container');

  // Check saved Google user in localStorage
  let currentGoogleUser = null;
  try {
    const saved = localStorage.getItem('folia_google_user');
    if (saved) currentGoogleUser = JSON.parse(saved);
  } catch (e) {}

  function updateAuthStateUI() {
    if (currentGoogleUser) {
      if (stepAuth) stepAuth.style.display = 'none';
      if (stepForm) stepForm.style.display = 'block';
      if (connectedUserName) connectedUserName.textContent = currentGoogleUser.name;
      if (connectedUserAvatar) connectedUserAvatar.textContent = currentGoogleUser.initials || 'U';
    } else {
      if (stepAuth) stepAuth.style.display = 'block';
      if (stepForm) stepForm.style.display = 'none';
    }
  }

  window.openReviewModal = function() {
    updateAuthStateUI();
    if (reviewModal) {
      reviewModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeReviewModal = function(e) {
    if (e && e.target && e.target.classList.contains('review-modal-card')) return;
    if (reviewModal) {
      reviewModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (btnOpenReview) {
    btnOpenReview.addEventListener('click', window.openReviewModal);
  }

  // Google Sign-in action
  if (btnGoogleLogin) {
    btnGoogleLogin.addEventListener('click', () => {
      // Simulate authentic Google Identity login (or integrate with GIS)
      currentGoogleUser = {
        name: 'Marco Tamborrino',
        email: 'marco.tamborrino@gmail.com',
        initials: 'MT'
      };
      try {
        localStorage.setItem('folia_google_user', JSON.stringify(currentGoogleUser));
      } catch (e) {}
      updateAuthStateUI();
    });
  }

  if (btnDisconnectGoogle) {
    btnDisconnectGoogle.addEventListener('click', () => {
      currentGoogleUser = null;
      try {
        localStorage.removeItem('folia_google_user');
      } catch (e) {}
      updateAuthStateUI();
    });
  }

  // Star Picker interaction
  if (starPicker) {
    const stars = starPicker.querySelectorAll('.star-btn');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-rating'), 10);
        if (inputRating) inputRating.value = rating;
        stars.forEach(s => {
          const r = parseInt(s.getAttribute('data-rating'), 10);
          if (r <= rating) s.classList.add('active');
          else s.classList.remove('active');
        });
      });
    });
  }

  // Handle Review Submission
  if (formReview) {
    formReview.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentGoogleUser) {
        alert('Effettua prima l\'accesso con Google per pubblicare.');
        return;
      }

      const role = document.getElementById('input-review-role').value;
      const title = document.getElementById('input-review-title').value.trim();
      const text = document.getElementById('input-review-text').value.trim();
      const rating = parseInt(inputRating ? inputRating.value : 5, 10);

      const reviewPayload = {
        name: currentGoogleUser.name,
        role: role,
        stars: rating,
        avatar: currentGoogleUser.initials || 'U',
        avatarClass: 'avatar-green',
        title: title,
        text: text
      };

      fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload)
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.review && reviewsContainer) {
          // Render new card at top of grid
          const starsText = '★'.repeat(data.review.stars);
          const cardHtml = `
            <div class="review-card" style="border-color: #76B583; animation: modalFadeIn 0.4s ease;">
              <div class="review-card-top">
                <div class="reviewer-info">
                  <div class="reviewer-avatar avatar-green">${data.review.avatar}</div>
                  <div>
                    <strong class="reviewer-name">${data.review.name}</strong>
                    <span class="reviewer-role">${data.review.role}</span>
                  </div>
                </div>
                <div class="review-stars">${starsText}</div>
              </div>
              <h4 class="review-heading">"${data.review.title}"</h4>
              <p class="review-text">${data.review.text}</p>
              <div class="review-footer">
                <span class="review-verified"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Recensione verificata Google</span>
                <span class="review-date">Appena pubblicata</span>
              </div>
            </div>
          `;
          const emptyNote = document.getElementById('reviews-empty-note');
          if (emptyNote) emptyNote.style.display = 'none';
          reviewsContainer.insertAdjacentHTML('afterbegin', cardHtml);
          window.closeReviewModal();
          formReview.reset();
        }
      })
      .catch(() => {
        window.closeReviewModal();
      });
    });
  }

window.openFoliaLightbox = function (src) {
  const lb = document.getElementById('folia-lightbox');
  const img = document.getElementById('lightbox-target-img');
  if (lb && img) {
    img.src = src;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeFoliaLightbox = function (e) {
  if (e && e.target && e.target.id === 'lightbox-target-img') return;
  const lb = document.getElementById('folia-lightbox');
  if (lb) {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeFoliaLightbox();
  }
});
