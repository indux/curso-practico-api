const API = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    api_key: "f373fa5741655d1d02bd733b915ff533",
    language: "en",
  },
});

// HELPERS

function likedMovieList() {
  const item = JSON.parse(localStorage.getItem("liked_movies"));
  let movies;

  if (item) {
    movies = item;
  } else {
    movies = {};
  }

  return movies;
}

function likeMovie(movie) {
  const likedMovies = likedMovieList();
  favoriteTitle.innerText = "Favorite Movies";

  if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined;
  } else {
    likedMovies[movie.id] = movie;
  }
  localStorage.setItem("liked_movies", JSON.stringify(likedMovies));
}

// UTILS

const LazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url);
    }
  });
});

function createMovies(
  movies,
  container,
  { LazyLoad = false, clean = true, title = true, isTitleExtend = false } = {}
) {
  if (clean) {
    container.innerHTML = "";
  }

  const arrMovies = [];

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");

    const movieIMG = document.createElement("img");
    movieIMG.classList.add("movie-img");
    movieIMG.setAttribute("alt", movie.title);
    movieIMG.addEventListener("error", () => {
      movieContainer.style.display = "none";
    });
    movieIMG.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });

    const movieBtn = document.createElement("button");
    movieBtn.classList.add("movie-btn");

    if (likedMovieList()[movie.id]) {
      movieBtn.classList.add("movie-btn--liked");
    }

    movieBtn.addEventListener("click", () => {
      movieBtn.classList.toggle("movie-btn--liked");
      likeMovie(movie);

      if (location.hash = "#home") {
        getLikedMovies();
      }
    });

    const ContainerMovieData = document.createElement("div");
    ContainerMovieData.classList.add("container-data-movie");

    if (LazyLoad) {
      movieIMG.setAttribute(
        "data-img",
        "https://image.tmdb.org/t/p/w300" + movie.poster_path
      );
      LazyLoader.observe(movieIMG);
    } else {
      movieIMG.setAttribute(
        "src",
        "https://image.tmdb.org/t/p/w300" + movie.poster_path
      );
    }

    movieContainer.append(movieIMG);
    movieContainer.append(movieBtn);

    if (title) {
      const ContainerMovieData = document.createElement("div");
      ContainerMovieData.classList.add("container-data-movie");

      if (isTitleExtend) {
        ContainerMovieData.classList.remove("container-data-movie");
      }

      const movieDate = document.createElement("h4");
      movieDate.innerText = decodeURIComponent(movie.title);

      ContainerMovieData.append(movieDate);
      movieContainer.append(ContainerMovieData);
    }

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

  createMovies(movies, trendingMoviesPreviewList, {
    LazyLoad: true,
    clean: true,
    title: true,
  });
}

async function getCategoriesPreview() {
  const { data } = await API("genre/movie/list", {
    params: {
      language: "en",
    },
  });
  const categories = data.genres;

  createCategories(categories, categoriesPreviewList, {
    LazyLoad: true,
    clean: true,
    title: true,
  });
}

async function getMoviesbyCategory(id) {
  const { data } = await API("discover/movie", {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection, {
    LazyLoad: true,
    clean: true,
    isTitleExtend: true
  });
}

function getPaginatedMoviesbyCategory(id) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const IsScrollBottom = scrollTop + clientHeight >= scrollHeight - 15;

    const IsNotPageMax = page < maxPage;

    if (IsScrollBottom && IsNotPageMax) {
      page++;
      const { data } = await API("discover/movie", {
        params: {
          with_genres: id,
          page,
        },
      });
      const movies = data.results;

      createMovies(movies, genericSection, {
        LazyLoad: true,
        clean: false,
        isTitleExtend: true,
      });
    }
  };
}

async function getMoviesbySearch(query) {
  const { data } = await API("search/movie", {
    params: {
      query,
    },
  });
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection, {
    isTitleExtend: true,
  });
}

function getPaginatedMoviesbySearch(query) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const IsScrollBottom = scrollTop + clientHeight >= scrollHeight - 15;

    const IsNotPageMax = page < maxPage;

    if (IsScrollBottom && IsNotPageMax) {
      page++;
      const { data } = await API("search/movie", {
        params: {
          query,
          page,
        },
      });
      const movies = data.results;

      createMovies(movies, genericSection, {
        LazyLoad: true,
        clean: false,
        isTitleExtend: true,
      });
    }
  };
}

async function getTrendingMovies() {
  const { data } = await API("trending/movie/day");
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection, {
    LazyLoad: true,
    clean: true,
    isTitleExtend: true,
  });
}

async function getPaginatedTrendingMovies() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  const IsScrollBottom = scrollTop + clientHeight >= scrollHeight - 15;

  const IsNotPageMax = page < maxPage;

  if (IsScrollBottom && IsNotPageMax) {
    page++;
    const { data } = await API("trending/movie/day", {
      params: {
        page,
      },
    });
    const movies = data.results;

    createMovies(movies, genericSection, {
      LazyLoad: true,
      clean: false,
      isTitleExtend: true
    });
  }
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

  createMovies(relatedMovies, relatedMoviesContainer, {
    LazyLoad: true,
    clean: true,
  });
  relatedMoviesContainer.scrollTo(0, 0);
}

function getLikedMovies() {
  const likedMovies = likedMovieList();
  const moviesArr = Object.values(likedMovies);

  createMovies(moviesArr, likedMoviesListArticle, {
    LazyLoad: true,
    clean: true,
    title: true,
  });
}
