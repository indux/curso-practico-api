const API = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    api_key: API_KEY,
  },
});

async function getTrendingMoviesPreview() {
  const { data } = await API("trending/movie/day");

  const trendingMoviesPreviewList = document.querySelector(
    "#trendingPreview .trendingPreview-movieList"
  );

  const arrMovies = [];
  const movies = data.results;

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
  trendingMoviesPreviewList.append(...arrMovies);
}

async function getCategoriesPreview() {
  const { data } = await API("genre/movie/list");

  const categoriesPreviewList = document.querySelector(
    "#categoriesPreview .categoriesPreview-list"
  );

  const arrCategories = [];
  const categories = data.genres;

  categories.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", "id" + category.id);

    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.append(categoryTitleText);
    categoryContainer.append(categoryTitle);

    arrCategories.push(categoryContainer);
  });
  categoriesPreviewList.append(...arrCategories);
}
