
// Loader de componentes
function loadComponent(containerId, componentPath) {
  fetch(componentPath)
    .then(response => response.text())
    .then(html => {
      document.getElementById(containerId).innerHTML = html;
    })
    .catch(error => console.error('Error loading component:', error));
}

// Footer
document.addEventListener('DOMContentLoaded', async function() {
  loadComponent('footer-menu-container', 'dist/components/footer.html');
  
  initializeHighlightSection();
  initializeAllCarousels();
});

// TMDb API
const TMDB_API_KEY = "7eb2908a91acc0157112455a74f23265"; 
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const API_ENDPOINTS = {
  FEATURED: `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
  MOST_FEARED: `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=1&with_genres=27&sort_by=popularity.desc`,
  NATIONAL_COLLECTION: `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
  DC_COMICS: `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=1&with_companies=9993&sort_by=popularity.desc`,
  MARVEL: `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=1&with_companies=420&sort_by=popularity.desc`
};

// Teste do da API
async function testApiConnection() {
  try {
    console.log('Testing TMDb API connection...');
    const testUrl = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('TMDb API connection successful');
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
    console.log('Fetching from TMDb API:', url);
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );
    
    const fetchPromise = fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });
    
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (!response.ok) {
      console.error(`TMDb API error: ${response.status} - ${response.statusText}`);
      throw new Error(`TMDb API error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('TMDb API response received:', data);
    return data;
    
  } catch (error) {
    console.error('TMDb API fetch error:', error.message);
    throw error; 
  }
}

// Destaques
function initializeHighlightSection() {
  const leftBtn = document.querySelector('.highlight-nav-left');
  const rightBtn = document.querySelector('.highlight-nav-right');
  const bullets = document.querySelectorAll('.bullet');
  
  let currentSlide = 0;
  const totalSlides = 3;
  
  loadFeaturedContent();
  
  // Navegação
  if (leftBtn) {
    leftBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateHighlightSlide(currentSlide);
    });
  }
  
  if (rightBtn) {
    rightBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateHighlightSlide(currentSlide);
    });
  }
  
  bullets.forEach((bullet, index) => {
    bullet.addEventListener('click', () => {
      currentSlide = index;
      updateHighlightSlide(currentSlide);
    });
  });
}

async function loadFeaturedContent() {
  try {
    const data = await fetchFromApi(API_ENDPOINTS.FEATURED);
    const items = data.results || [];
    
    if (items.length > 0) {
      // Adiciona imagens nos detaques
      const leftImg = document.querySelector('.highlight-left .highlight-image');
      const centerImg = document.querySelector('.highlight-center .highlight-image');
      const rightImg = document.querySelector('.highlight-right .highlight-image');
      
      if (leftImg && items[0]) {
        leftImg.src = getImageUrl(items[0]) || 'https://picsum.photos/249/258?random=1';
        leftImg.alt = items[0].title || 'Featured content';
      }
      
      if (centerImg && items[1]) {
        centerImg.src = getImageUrl(items[1]) || 'https://picsum.photos/512/288?random=2';
        centerImg.alt = items[1].title || 'Main featured content';
      }
      
      if (rightImg && items[2]) {
        rightImg.src = getImageUrl(items[2]) || 'https://picsum.photos/247/258?random=3';
        rightImg.alt = items[2].title || 'Featured content';
      }
    }
  } catch (error) {
    console.error('Error loading featured content:', error);
  }
}

function updateHighlightSlide(slideIndex) {
  const bullets = document.querySelectorAll('.bullet');
  bullets.forEach((bullet, index) => {
    bullet.classList.toggle('active', index === slideIndex);
  });
  }

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
        currentPosition -= 432; // Width of large card + gap (200 + 16) * 2
        track.style.transform = `translateX(-${currentPosition}px)`;
        updateCarouselButtons(currentPosition, track, leftBtn, rightBtn);
      }
    });
  }
  
  if (rightBtn) {
    rightBtn.addEventListener('click', () => {
      const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
      if (currentPosition < maxScroll) {
        currentPosition += 432; // Width of large card + gap (200 + 16) * 2
        track.style.transform = `translateX(-${currentPosition}px)`;
        updateCarouselButtons(currentPosition, track, leftBtn, rightBtn);
      }
    });
  }
}

async function loadCarouselContent(trackId, endpoint) {
  try {
    const data = await fetchFromApi(endpoint);
    const items = data.results || [];
    
    const track = document.getElementById(trackId);
    if (!track) return;
    
    track.innerHTML = ''; // Limpa o conteúdo existente
    
    items.forEach((item, index) => {
      const movieCard = createMovieCard(item, index);
      track.appendChild(movieCard);
    });
    
    // Botões dos carrosséis
    const carouselName = trackId.replace('-track', '');
    const leftBtn = document.querySelector(`[data-carousel="${carouselName}"].carousel-nav-left`);
    const rightBtn = document.querySelector(`[data-carousel="${carouselName}"].carousel-nav-right`);
    updateCarouselButtons(0, track, leftBtn, rightBtn);
    
  } catch (error) {
    console.error(`Error loading carousel content for ${trackId}:`, error);
  }
}

function createMovieCard(item, index) {
  const card = document.createElement('div');
  card.className = `movie-card ${index > 5 ? 'small' : ''}`;
  
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
