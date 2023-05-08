const API = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    api_key: API_KEY,
  },
});

// UTILS

function createMovies(movies, container) {
  container.innerHTML = "";

  const arrMovies = [];

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    movieContainer.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });

    const movieIMG = document.createElement("img");
    movieIMG.classList.add("movie-img");
    movieIMG.setAttribute("alt", movie.title);
    movieIMG.setAttribute(
      "src",
      "https://image.tmdb.org/t/p/w300" + movie.poster_path
    );

    movieContainer.append(movieIMG);

    arrMovies.push(movieContainer);
  });
  container.append(...arrMovies);
}

function createCategories(categories, container) {
  container.innerHTML = "";

  const arrCategories = [];

  categories.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", "id" + category.id);
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });

    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.append(categoryTitleText);
    categoryContainer.append(categoryTitle);

    arrCategories.push(categoryContainer);
  });
  container.append(...arrCategories);
}

// APIs

async function getTrendingMoviesPreview() {
  const { data } = await API("trending/movie/day");
  const movies = data.results;

  createMovies(movies, trendingMoviesPreviewList);
}

async function getCategoriesPreview() {
  const { data } = await API("genre/movie/list", {
    params: {
      lenguage: "es",
    },
  });
  const categories = data.genres;

  createCategories(categories, categoriesPreviewList);
}

async function getMoviesbyCategory(id) {
  const { data } = await API("discover/movie", {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;

  createMovies(movies, genericSection);
}

async function getMoviesbySearch(query) {
  const { data } = await API("search/movie", {
    params: {
      query,
    },
  });
  const movies = data.results;

  createMovies(movies, genericSection);
}

async function getTrendingMovies() {
  const { data } = await API("trending/movie/day");
  const movies = data.results;

  createMovies(movies, genericSection);
}

async function getMovieById(id) {
  const { data: movie } = await API("movie/" + id);

  const movieImgUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
  headerSection.style.background = `
  linear-gradient(
    180deg, 
    rgba(0, 0, 0, 0.35) 19.27%, 
    rgba(0, 0, 0, 0) 29.17%
    ),
  url(${movieImgUrl})`;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);

  getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
  const { data } = await API(`movie/${id}/recommendations`);
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer);
  relatedMoviesContainer.scrollTo(0, 0);
}
