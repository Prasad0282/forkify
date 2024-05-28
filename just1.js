import * as model from './model.js';
import { MODAL_CLOSE_SECONDS } from './config.js';
import icons from 'url:../img/icons.svg'; // parcel 2
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import bookmarksView from './views/bookmarksView.js';
if (module.hot) {
  module.hot.accept();
}
async function showRecipeDetails() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
    //test
    // controlServings();
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
}

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    //render results
    resultsView.render(model.getSearchResultsPage(1));
    //render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  //render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //render new pagination buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  //update recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //1.add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //2.update recipe view
  recipeView.update(model.state.recipe);
  //3.render bookmarks
  bookmarksView.render(model.state.bookmarks);
  //console.log(bookmarksView);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //render recipe
    recipeView.render(model.state.recipe);
    //success message
    addRecipeView.renderMessage();
    //render bookmark
    bookmarksView.render(model.state.bookmarks);
    //changeID
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //window.history.back();
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    console.log(err, '💥');
    addRecipeView.renderError(err.message);
    //closeform window
  }
  // Further actions after recipe is successfully uploaded
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(showRecipeDetails);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
//clearBookmarks();
