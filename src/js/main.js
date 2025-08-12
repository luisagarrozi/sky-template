
const RAPIDAPI_KEY = "YOUR_RAPIDAPI_KEY_HERE"; // Estudar se é necessária alguma autenticação
const RAPIDAPI_HOST = "moviesdatabase.p.rapidapi.com"; // Alterar endereço da API


// ENDPOINTS - URLs com placeholder pra buscar os endpoints
const FEATURED_ENDPOINT = "https://moviesdatabase.p.rapidapi.com/titles?limit=5"; // used with await
const MOST_FEARED_ENDPOINT = "https://moviesdatabase.p.rapidapi.com/titles?genre=horror&limit=15";
const CINEMA_NACIONAL_ENDPOINT = "https://moviesdatabase.p.rapidapi.com/titles?country=br&limit=15";

function fetchFromApi(url) {
  return fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': RAPIDAPI_HOST
    }
  }).then(resp => {
    if (!resp.ok) throw new Error(`API error ${resp.status}`);
    return resp.json();
  });
}

/* -------- Carrossel Principal -------- */
async function loadFeatured() {
  try {
    const data = await fetchFromApi(FEATURED_ENDPOINT);

    // Ajustar conforme resultado da API
    const items = (data.results || data.titles || data).slice(0, 5);

    const $track = $('#featuredCarousel .carousel-track');
    $track.empty();

    items.forEach((it, idx) => {
      const image = it.image?.url || it.poster || it.primaryImage || it.thumbnail || 'https://via.placeholder.com/800x450?text=No+image';
      const title = it.title || it.name || it.originalTitle || 'Untitled';

      const card = $(`
        <div class="featured-card">
          <img src="${image}" alt="${title}">
          <div class="p-3">
            <h4>${title}</h4>
            <p class="text-muted small">${it.year || it.releaseYear || ''}</p>
          </div>
        </div>
      `);
      $track.append(card);
    });

  } catch (err) {
    console.error("Falha ao carregar cards do carrossel principal:", err);
    $('#featuredCarousel .carousel-track').html('<div class="p-4">Não foi possível carregar os destaques.</div>');
  }
}

/* -------- Carrosseis secundários -------- */
function loadRow(endpoint, $containerTrack, count = 15) {
  fetchFromApi(endpoint)
    .then(data => {
      const items = (data.results || data.titles || data).slice(0, count);
      $containerTrack.empty();
      items.forEach(it => {
        const image = it.image?.url || it.poster || it.primaryImage || it.thumbnail || 'https://via.placeholder.com/300x450?text=No+image';
        const title = it.title || it.name || it.originalTitle || 'Untitled';
        const year = it.year || it.releaseYear || '';

        const $card = $(`
          <div class="movie-card">
            <img src="${image}" alt="${title}" />
            <div class="meta">
              <div class="title">${title}</div>
              <div class="muted small">${year}</div>
            </div>
          </div>
        `);
        $containerTrack.append($card);
      });

    })
    .catch(err => {
      console.error("Falha ao carregar cards do carrossel secundário:", err);
      $containerTrack.html('<div class="p-3">Não foi possível carregar.</div>');
    });
}


/* -------- INIT -------- */
$(function() {
  (async () => {
    await loadFeatured();
  })();

  loadRow(MOST_FEARED_ENDPOINT, $('#row-most-feared .row-track'), 15);
  loadRow(CINEMA_NACIONAL_ENDPOINT, $('#row-cinema-nacional .row-track'), 15);

  $(document).on('click', '.movie-card', function() {
    const title = $(this).find('.meta .title').text();
    alert('Abrir detalhes para: ' + title);
  });
});
