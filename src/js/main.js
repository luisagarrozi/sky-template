// Loader de componentes
function loadComponent(containerId, componentPath) {
  fetch(componentPath)
    .then(response => response.text())
    .then(html => {
      const el = document.getElementById(containerId);
      if (el) el.innerHTML = html;
    })
    .catch(error => console.error('Error loading component:', error));
}

document.addEventListener('DOMContentLoaded', async function() {
  
  loadComponent('footer-menu-container', 'dist/components/footer.html');
  
  await initializeHighlightSection(); // Destaques
  initializeAllCarousels();     // Demais carrosséis
});

// TMDb API
const TMDB_API_KEY = "7eb2908a91acc0157112455a74f23265"; 
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const API_ENDPOINTS = {
  FEATURED: `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=revenue.desc&primary_release_year=2024&page=1`,
  MOST_FEARED: `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=1&with_genres=27&sort_by=popularity.desc`,
  NATIONAL_COLLECTION: `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`,
  DC_COMICS: `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=1&with_companies=9993&sort_by=popularity.desc`,
  MARVEL: `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=1&with_companies=420&sort_by=popularity.desc`
};

// Teste da API
async function testApiConnection() {
  try {
    const testUrl = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: { 'accept': 'application/json' }
    });
    if (response.ok) {
      return true;
    } else {
      console.error('TMDb API connection failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('TMDb API connection test failed:', error.message);
    return false;
  }
}

// Fetch com timeout
async function fetchFromApi(url) {
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );
    const fetchPromise = fetch(url, {
      method: 'GET',
      headers: { 'accept': 'application/json' }
    });
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (!response.ok) {
      console.error(`TMDb API error: ${response.status} - ${response.statusText}`);
      throw new Error(`TMDb API error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('TMDb API fetch error:', error.message);
    throw error; 
  }
}

// Extrair imagem da API
function getImageUrl(item) {
  if (!item) return null;
  if (item.poster_path) {
    return `${TMDB_IMAGE_BASE_URL}${item.poster_path}`;
  }
  if (item.backdrop_path) {
    return `${TMDB_IMAGE_BASE_URL}${item.backdrop_path}`;
  }
  return null;
}

function getHighlightsImageUrl(item) {
  if (!item) return null;
  if (item.backdrop_path) {
    return `${TMDB_IMAGE_BASE_URL}${item.backdrop_path}`;
  }

  if (item.poster_path) {
    return `${TMDB_IMAGE_BASE_URL}${item.poster_path}`;
  }
  return null;
}

function createImageSlider(container, options = {}) {
  const root = typeof container === 'string' ? document.querySelector(container) : container;
  if (!root) throw new Error('createImageSlider: container not found');

  // Get responsive dimensions
  const getResponsiveDimensions = () => {
    const width = window.innerWidth;
    if (width <= 430) {
      return { width: 260, height: 146 };
    } else if (width <= 480) {
      return { width: 288, height: 162 };
    } else if (width <= 1250) {
      return { width: 512, height: 288 };
    } else {
      return { width: 695, height: 390 };
    }
  };

  const responsiveDims = getResponsiveDimensions();

  const opts = {
    autoPlay: false,
    autoPlayInterval: 5000,
    centerWidth: responsiveDims.width,
    centerHeight: responsiveDims.height,
    sideScale: 0.9,
    peek: 120,
    prevButton: null,
    nextButton: null,
    dotsContainer: null,
    ...options
  };

  let images = [];
  let currentIndex = 0;
  let isAnimating = false;
  let autoPlayId = null;

  // Estrutura básica do slider (track + controles internos)
  root.innerHTML = `
    <div class="slider-container" style="position:relative; width:${opts.centerWidth}px; height:${opts.centerHeight}px; margin:0 auto;">
      <div class="slider-track" style="position:relative; width:${opts.centerWidth}px; height:${opts.centerHeight}px;"></div>
      ${opts.prevButton || opts.nextButton ? '' : `
        <button class="nav-arrow prev" aria-label="Previous image" type="button" style="position:absolute; left:16px; top:175px;"></button>
        <button class="nav-arrow next" aria-label="Next image" type="button" style="position:absolute; right:16px; top:175px;"></button>
      `}
      ${opts.dotsContainer ? '' : `<div class="slider-dots" style="position:absolute; left:50%; transform:translateX(-50%); bottom:12px; display:flex; gap:8px;"></div>`}
    </div>
  `;

  const track = root.querySelector('.slider-track');
  const internalPrev = root.querySelector('.nav-arrow.prev');
  const internalNext = root.querySelector('.nav-arrow.next');
  const internalDots = root.querySelector('.slider-dots');

  const prevBtn = opts.prevButton || internalPrev;
  const nextBtn = opts.nextButton || internalNext;
  const dotsEl = opts.dotsContainer || internalDots;

  // Eventos
  function onClick(e) {
    const target = e.target;
    if (prevBtn && target.closest && target.closest('.nav-arrow.prev') === prevBtn) prev();
    if (nextBtn && target.closest && target.closest('.nav-arrow.next') === nextBtn) next();

    if (!dotsEl) return;
    const dot = target.closest ? target.closest('.dot, .bullet') : null;
    if (dot && dot.dataset && dot.dataset.index != null) {
      goToSlide(parseInt(dot.dataset.index, 10));
    }
  }

  function onKey(e) {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }

  let touchStartX = 0;
  function onTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX - endX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  }

  function bindEvents() {
    document.addEventListener('keydown', onKey);
    root.addEventListener('touchstart', onTouchStart, { passive: true });
    root.addEventListener('touchend', onTouchEnd, { passive: true });

    // Se usar controles internos, o listener de clique fica no root
    root.addEventListener('click', (e) => {
      if (internalPrev && e.target.closest('.nav-arrow.prev') === internalPrev) prev();
      if (internalNext && e.target.closest('.nav-arrow.next') === internalNext) next();
      const dot = e.target.closest('.bullet');
      if (dot && dot.dataset.index) goToSlide(parseInt(dot.dataset.index, 10));
    });

    // Se usar controles externos, bind neles diretamente
    if (prevBtn && prevBtn !== internalPrev) prevBtn.addEventListener('click', prev);
    if (nextBtn && nextBtn !== internalNext) nextBtn.addEventListener('click', next);

    if (dotsEl && dotsEl !== internalDots) {
      dotsEl.addEventListener('click', (e) => {
        const dot = e.target.closest('.dot, .bullet');
        if (dot && dot.dataset.index) goToSlide(parseInt(dot.dataset.index, 10));
      });
    }
  }

  function unbindEvents() {
    document.removeEventListener('keydown', onKey);
    root.removeEventListener('touchstart', onTouchStart);
    root.removeEventListener('touchend', onTouchEnd);

    if (prevBtn && prevBtn !== internalPrev) prevBtn.removeEventListener('click', prev);
    if (nextBtn && nextBtn !== internalNext) nextBtn.removeEventListener('click', next);
  }

  function createSlides() {
    track.innerHTML = '';
    // Duplicar conjunto para facilitar cálculo do centro e peeks
    const total = images.length * 3;
    for (let i = 0; i < total; i++) {
      const imgIdx = i % images.length;
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.dataset.index = String(imgIdx);
      slide.style.position = 'absolute';
      slide.style.top = '50%';
      slide.style.left = '50%';
      slide.style.width = `${opts.centerWidth}px`;
      slide.style.height = `${opts.centerHeight}px`;
      slide.style.transform = 'translate(-50%, -50%)';
      slide.style.transition = 'transform 300ms ease, opacity 200ms ease';
      slide.style.willChange = 'transform, opacity';
      slide.style.borderRadius = '10px';
      slide.style.overflow = 'hidden';

      const img = document.createElement('img');
      img.src = images[imgIdx];
      img.alt = `Slide ${imgIdx + 1}`;
      img.loading = 'lazy';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';

      slide.appendChild(img);
      track.appendChild(slide);
    }
  }

  function createDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    for (let i = 0; i < images.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.dataset.index = String(i);
      dotsEl.appendChild(dot);
    }
  }

  function update() {
    if (isAnimating) return;
    isAnimating = true;

    const slides = Array.from(track.children);
    const centerIdx = images.length + currentIndex;

    slides.forEach((slide, idx) => {
      const position = idx - centerIdx;

      slide.style.opacity = '0';
      slide.style.pointerEvents = 'none';
      slide.style.zIndex = '0';

      if (position === 0) {
        // Centro
        slide.style.opacity = '1';
        slide.style.transform = 'translate(-50%, -50%) scale(1)';
        slide.style.zIndex = '2';
        slide.style.pointerEvents = 'auto';
      } else if (position === -1) {
        // Esquerda (parcial)
        slide.style.opacity = '1';
        slide.style.transform = `translate(-150%, -50%) scale(${opts.sideScale})`;
        slide.style.zIndex = '1';
      } else if (position === 1) {
        // Direita (parcial)
        slide.style.opacity = '1';
        slide.style.transform = `translate(50%, -50%) scale(${opts.sideScale})`;
        slide.style.zIndex = '1';
      }
    });

    // Dots ativos
    if (dotsEl) {
      Array.from(dotsEl.children).forEach((d) => d.classList.remove('active'));
      const activeDot = dotsEl.querySelector(`[data-index="${currentIndex}"]`);
      if (activeDot) activeDot.classList.add('active');
    }

    setTimeout(() => { isAnimating = false; }, 300);
  }

  function goToSlide(index) {
    if (isAnimating || index === currentIndex) return;
    currentIndex = (index + images.length) % images.length;
    update();
  }

  function next() {
    if (isAnimating) return;
    currentIndex = (currentIndex + 1) % images.length;
    update();
  }

  function prev() {
    if (isAnimating) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    update();
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (opts.autoPlay) {
      autoPlayId = setInterval(next, opts.autoPlayInterval);
    }
  }

  function stopAutoPlay() {
    if (autoPlayId) {
      clearInterval(autoPlayId);
      autoPlayId = null;
    }
  }

  function loadImages(imageUrls) {
    if (!Array.isArray(imageUrls) || !imageUrls.length) {
      console.error('createImageSlider: no images provided');
      return;
    }
    images = imageUrls.slice();
    currentIndex = Math.floor(images.length / 2); // Iniciar slider no centro
    createSlides();
    createDots();
    update();
    startAutoPlay();
  }

  function destroy() {
    stopAutoPlay();
    unbindEvents();
    root.innerHTML = '';
  }

  bindEvents();

  return { loadImages, next, prev, goToSlide, startAutoPlay, stopAutoPlay, destroy };
}

/* ============================================================================
   Destaques - Buscar imagens "Featured" e montar o slider com "peek"
   ============================================================================ */
async function fetchFeaturedImageUrls() {
  const data = await fetchFromApi(API_ENDPOINTS.FEATURED);
  
  const results = (data?.results || []).slice(0, 5);

  const urls = results.map((item, i) => getHighlightsImageUrl(item));
  return urls;
}

async function fetchCarouselData(endpoint, limit = 15) {
  const data = await fetchFromApi(endpoint);
  const results = (data?.results || []).slice(0, limit);
  return results;
}

async function initializeHighlightSection() {
  const highlightContainer = document.querySelector('.highlight-container');
  if (!highlightContainer) {
    console.warn('[Highlight] .highlight-container not found. Skipping highlight slider init.');
    return;
  }

  // Get responsive dimensions
  const getResponsiveDimensions = () => {
    const width = window.innerWidth;
    if (width <= 430) {
      return { width: 260, height: 146 };
    } else if (width <= 480) {
      return { width: 288, height: 162 };
    } else if (width <= 1250) {
      return { width: 512, height: 288 };
    } else {
      return { width: 695, height: 390 };
    }
  };

  const responsiveDims = getResponsiveDimensions();

  highlightContainer.innerHTML = `
    <button class="highlight-nav-btn highlight-nav-left" aria-label="Anterior">
      <svg width="21" height="16" viewBox="0 0 21 16" fill="none">
        <path d="M21 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H21V7Z" fill="white" fill-opacity="0.7"/>
      </svg>
    </button>
    <button class="highlight-nav-btn highlight-nav-right" aria-label="Próximo">
      <svg width="21" height="16" viewBox="0 0 21 16" fill="none">
        <path d="M0 9H17.17L11.58 14.59L13 16L21 8L13 0L11.59 1.41L17.17 7H0V9Z" fill="white" fill-opacity="0.7"/>
      </svg>
    </button>

    <div class="slider-mount" id="highlight-slider"></div>

    <div class="highlight-bullets"></div>
  `;

  const sliderMount = document.getElementById('highlight-slider');
  const prevBtn = highlightContainer.querySelector('.highlight-nav-left');
  const nextBtn = highlightContainer.querySelector('.highlight-nav-right');
  const bulletsContainer = highlightContainer.querySelector('.highlight-bullets');

  // Criar slider com controles externos
  const slider = createImageSlider(sliderMount, {
    autoPlay: false,
    centerWidth: responsiveDims.width,
    centerHeight: responsiveDims.height,
    sideScale: 0.9,
    peek: 120,
    prevButton: prevBtn,
    nextButton: nextBtn,
    dotsContainer: bulletsContainer
  });

  // Ensure bullets sit exactly 16px below: keep them after the slider and use CSS
  // The bullets container remains a sibling of the slider to avoid overlap issues

  // Buscar imagens "Featured" e carregar no slider
  try {
    const imageUrls = await fetchFeaturedImageUrls();
    slider.loadImages(imageUrls);
    window.highlightSlider = slider;

      
    } catch (err) {
      console.error('[Highlight] Failed to load FEATURED. Using fallbacks.', err);
    }
}

// Atualizar slider externamente
window.highlightSlider = null;
window.refreshHighlightSlider = function(newImageUrls) {
  if (window.highlightSlider && Array.isArray(newImageUrls) && newImageUrls.length) {
    window.highlightSlider.loadImages(newImageUrls);
  }
};

// Function to update highlight slider dimensions on resize
function updateHighlightSliderDimensions() {
  if (window.highlightSlider) {
    const getResponsiveDimensions = () => {
      const width = window.innerWidth;
      if (width <= 430) {
        return { width: 260, height: 146 };
      } else if (width <= 480) {
        return { width: 288, height: 162 };
      } else if (width <= 1250) {
        return { width: 512, height: 288 };
      } else {
        return { width: 695, height: 390 };
      }
    };

    const responsiveDims = getResponsiveDimensions();
    
    // Update the slider container dimensions
    const sliderMount = document.getElementById('highlight-slider');
    if (sliderMount) {
      const sliderContainer = sliderMount.querySelector('.slider-container');
      if (sliderContainer) {
        sliderContainer.style.width = `${responsiveDims.width}px`;
        sliderContainer.style.height = `${responsiveDims.height}px`;
      }
    }
  }
}

// Add resize listener
window.addEventListener('resize', updateHighlightSliderDimensions);

// Carrosséis
function initializeAllCarousels() {
  const carousels = [
    { id: 'most-feared-track', endpoint: API_ENDPOINTS.MOST_FEARED, name: 'most-feared' },
    { id: 'national-collection-track', endpoint: API_ENDPOINTS.NATIONAL_COLLECTION, name: 'national-collection' },
    { id: 'dc-comics-track', endpoint: API_ENDPOINTS.DC_COMICS, name: 'dc-comics' },
    { id: 'marvel-track', endpoint: API_ENDPOINTS.MARVEL, name: 'marvel' }
  ];

  carousels.forEach(carousel => {
    initializeCarousel(carousel.id, carousel.endpoint, carousel.name);
  });
}

function initializeCarousel(trackId, endpoint, carouselName) {
  loadCarouselContent(trackId, endpoint);
  setupCarouselNavigation(carouselName);
}

function setupCarouselNavigation(carouselName) {
  const leftBtn = document.querySelector(`[data-carousel="${carouselName}"].carousel-nav-left`);
  const rightBtn = document.querySelector(`[data-carousel="${carouselName}"].carousel-nav-right`);
  const track = document.getElementById(`${carouselName}-track`);
  
  if (!track) return;
  
  let currentPosition = 0;
  
  if (leftBtn) {
    leftBtn.addEventListener('click', () => {
      if (currentPosition > 0) {
        currentPosition -= 432;
        track.style.transform = `translateX(-${currentPosition}px)`;
        updateCarouselButtons(currentPosition, track, leftBtn, rightBtn);
      }
    });
  }
  
  if (rightBtn) {
    rightBtn.addEventListener('click', () => {
      const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
      if (currentPosition < maxScroll) {
        currentPosition += 432;
        track.style.transform = `translateX(-${currentPosition}px)`;
        updateCarouselButtons(currentPosition, track, leftBtn, rightBtn);
      }
    });
  }
}

async function loadCarouselContent(trackId, endpoint) {
  try {
    const items = await fetchCarouselData(endpoint, 15);
    
    const track = document.getElementById(trackId);
    if (!track) return;
    
    track.innerHTML = ''; 
    
    items.forEach((item, index) => {
      const movieCard = createMovieCard(item, index);
      track.appendChild(movieCard);
    });
    
    const carouselName = trackId.replace('-track', '');
    const leftBtn = document.querySelector(`[data-carousel="${carouselName}"].carousel-nav-left`);
    const rightBtn = document.querySelector(`[data-carousel="${carouselName}"].carousel-nav-right`);
    updateCarouselButtons(0, track, leftBtn, rightBtn);
    
  } catch (error) {
    console.error(`Error loading carousel content for ${trackId}:`, error);
  }
}

function createMovieCard(item, index) {
  const card = document.createElement('article');
  card.className = `movie-card`;
  card.setAttribute('role', 'listitem');
  
  const imageUrl = getImageUrl(item) || `https://picsum.photos/140/210?random=${index + 10}`;
  const title = item.title || 'Unknown Title';
  const isPPV = Math.random() > 0.7;
  const isUpgrade = Math.random() > 0.8;
  
  card.innerHTML = `
    <img src="${imageUrl}" alt="${title}" class="movie-card-image" loading="lazy">
    <div class="movie-card-overlay"></div>
    ${isPPV ? createCardIcon('shopping-cart') : ''}
    ${isUpgrade && !isPPV ? createCardIcon('lock') : ''}
  `;
  
  card.addEventListener('click', () => {
    console.log('Movie clicked:', title);
    // Ajuste futuro: Acrescentar detalhes do filme
  });
  
  // Adicionar navegação por teclado
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
  
  return card;
}

function createCardIcon(type) {
  const iconSVG = type === 'shopping-cart' 
    ? '<path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="white"/>'
    : '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" fill="white"/>';
  
  return `
    <div class="movie-card-icon">
      <div class="icon-circle-stroke"></div>
      <div class="icon-circle-fill"></div>
      <div class="icon-content">
        <svg width="16" height="16" viewBox="0 0 24 24">
          ${iconSVG}
        </svg>
      </div>
    </div>
  `;
}

function updateCarouselButtons(currentPosition, track, leftBtn, rightBtn) {
  if (leftBtn) {
    leftBtn.classList.toggle('disabled', currentPosition <= 0);
  }
  if (rightBtn && track) {
    const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
    rightBtn.classList.toggle('disabled', currentPosition >= maxScroll);
  }
}