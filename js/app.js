const API_KEY = "b01f52ff-5548-4b5b-a7ee-928ba5c48437";
const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_DETAIL =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

// Первый вызов
getMovies(API_URL_POPULAR);
// Получает фильмы по url
async function getMovies(url) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "b01f52ff-5548-4b5b-a7ee-928ba5c48437",
      "Content-Type": "application/json",
    },
  });
  const responseData = await response.json();
  showMovies(responseData.films);
}
// Получить цвет рейтинга
function getColorByRating(rating) {
  if (rating >= 7) {
    return "green";
  } else if (rating > 5) {
    return "orange";
  } else {
    return "red";
  }
}
// Показать/рендер карточек фильмов
function showMovies(data) {
  const moviesEl = document.querySelector(".movies");
  moviesEl.innerHTML = "";

  // Перебор массива фильмов
  data.forEach((movie) => {
    let movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
    <div class="movie__cover-inner">
            <img
              src="${movie.posterUrlPreview}"
              class="movie__cover"
              alt="${movie.nameRu}"
            />
            <div class="movie__cover--darkened"></div>
          </div>
          <div class="movie__info">
            <div class="movie__title">${movie.nameRu}</div>
            <div class="movie__category">${movie.genres.map(
              (el) => " " + el.genre
            )}</div>
            <div class="movie__average movie__average movie__average--${getColorByRating(
              movie.rating
            )}">
              ${movie.rating}
            </div>
          </div>
          `;
    movieEl.addEventListener("click", () => openModal(movie.filmId));
    moviesEl.append(movieEl);
  });
}

// Search
const form = document.querySelector("form");
const inputSearch = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${inputSearch.value}`;
  inputSearch.value && getMovies(apiSearchUrl);
  // другой вариант
  // if (inputSearch.value) {
  //   getMovies(apiSearchUrl);
  // }
  inputSearch.value = "";
});

// Modal
const modalElem = document.querySelector(".modal");

async function openModal(id) {
  const response = await fetch(`${API_URL_MOVIE_DETAIL}${id}`, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "b01f52ff-5548-4b5b-a7ee-928ba5c48437",
    },
  });
  const responseData = await response.json();
  modalElem.classList.add("modal--show");

  modalElem.innerHTML = `
    <div class="modal__card">
      <img class="modal__movie-backdrop" src="${responseData.posterUrl}" alt="">
      <h2>
        <span class="modal__movie-title">${responseData.nameRu}</span>
        <span class="modal__movie-release-year"> - ${responseData.year}</span>
      </h2>
      <ul class="modal__movie-info">
        <div class="loader"></div>
        <li class="modal__movie-genre">Жанр - ${responseData.genres.map((el) => `<span>${el.genre}</span>`)}</li>
        
        <li class="modal__movie-runtime">Время - ${responseData.filmLength} минут</li> 
        <li >Сайт: <a class="modal__movie-site" target="_blank" href="${responseData.webUrl}">${responseData.webUrl}</a></li>
        <li class="modal__movie-overview">Описание - ${responseData.description}</li>
      </ul>
      <button type="button" class="modal__button-close">Закрыть</button>
    </div>
  `;

  const btnClose = document.querySelector(".modal__button-close");
  btnClose.addEventListener("click", () => closeModal());
}

function closeModal() {
  modalElem.classList.remove("modal--show");
}

window.addEventListener("click", (e) => {
  if (e.target === modalElem) {
    closeModal();
  }
});
window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
})
