import 'core-js/stable';
import 'regenerator-runtime/runtime';

import config, { MODAL_CLOSE_SEC } from './config';

import * as model from './model';
import View from './views/View';
import recipeView from './views/recipeView';
import addRecipeView from './views/addRecipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';

// https://forkify-api.herokuapp.com/v2
if (module.hot) module.hot.accept();
///////////////////////////////////////

const controlRecipe = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    // renderSpinner
    recipeView.renderSpinner();

    // RESULT-VIEW : SELECT MARKED RECIPE
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // LOADING RECIPE
    await model.loadRecipe(id);

    // RENDERING RECIPE
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();
    console.log('hit');
    // SEARCH QUERY
    const query = searchView.getQuery();

    if (!query) return;

    // LOAD SEARCH RESULT
    await model.loadSearchResults(query);

    // RENDER RESULT
    resultsView.render(model.getSearchResultsPage());

    // PaginationView
    paginationView.render(model.state.search);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlPagination = gotoPage => {
  // RENDER NEW RESULT
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // RENDER NEW Pagination BUTTONS
  paginationView.render(model.state.search);
};

const controlServings = newServings => {
  // UPDATE RECIPE SERVINGS (IN STATE)
  model.updateServings(newServings);

  // UPDATE RECIPE VIEW
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  // ADD/REMOVE BOOKMARK
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // UPDATE RECIPE VIEW
  recipeView.update(model.state.recipe);

  // RENDER BOOKMARKS
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
