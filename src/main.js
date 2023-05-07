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
