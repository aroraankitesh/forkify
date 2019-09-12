// import str from './models/Search';
// // import {add as a, multiply as m, ID} from './views/searchView';
// import * as searchView from './views/searchView';

// // console.log(`Using Imported functions! ${a(ID, 2)} and ${m(3,5)}. ${str}`);
// console.log(`Using Imported functions! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(3,5)}. ${str}`);

// async function getResult(query){
//     const key = '0bd7d79e36e4061d520354413ea929fb';
//     const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
//     const recipes = res.data.recipes;
//     console.log(recipes);
// }

// getResult('pizza');

import Search from "./models/Search";
import Reciepe from "./models/Recipe";
import Likes from "./models/Likes";
import List from "./models/List";
import { elements, renderLoader, clearLoader } from "./views/base";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likeView from "./views/likeView";


// **Global State of the object
// -search object
// Current reciepe object
// shopping list object
// liked recipes

const state = {};

window.state = state;


const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();

  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);

    // 3) Prepare query for result
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchResList);

    try {
      // 4) Search for recipes
      await state.search.getResult();

      // render result on UI
      clearLoader();
      searchView.renderResults(state.search.result);
      searchView.renderButton(state.search.result);
    } catch (error) {
      console.log(error);
    }
  }
};

elements.search.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.resPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");

  const page = parseInt(btn.dataset.goto, 10);

  // Clear Result
  searchView.clearResult();

  // render result
  searchView.renderResults(state.search.result, page);
  searchView.renderButton(state.search.result, page);
});

// Reciepe Controller

const controlReciepe = async () => {
  // get id from the url
  const id = window.location.hash.replace("#", "");

  if (id) {
    // Prepare UI for reciepe
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //Highlight Recipe
    if (state.search) searchView.highlightSelected(id);

    // Setup Reciepe
    state.reciepe = new Reciepe(id);

    try {
      // get reciepe data
      await state.reciepe.getRecipe();
      // console.log(state.reciepe.ingredients);
      state.reciepe.parseIngredients();

      // Calculate Serving and the Time
      state.reciepe.calcTime();
      state.reciepe.calcServing();

      // Render Reciepe
      clearLoader();
      recipeView.renderRecipe(
        state.reciepe,
        state.likes.isLiked(id)
        );
    } catch (error) {
      console.log(error);
    }
  }
};

["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlReciepe)
);

// window.addEventListener('hashchange', controlReciepe)

const controlList = () => {
  // Create new List if there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.reciepe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};


// Handle likes of items

// Testing
state.likes = new Likes();
likeView.toggleLikeList(state.likes.getNumLikes());

const controlLikes = () => {
  // Initialize like if not been intialized
  if(!state.likes) state.likes = new Likes();

  const currentID = state.reciepe.id;


// Checking if recipe is liked if not adding item
  if(!state.likes.isLiked(currentID)){
    // adding item to the state object
    const likeItem = state.likes.addItem(
      currentID, 
      state.reciepe.title,
      state.reciepe.author, 
      state.reciepe.img);
    
    // changing the state of like button
    likeView.toogleLikeBtn(true);

    // displaying the liked list in UI
    likeView.toggleLikeList(state.likes.getNumLikes());
     likeView.renderLikes(likeItem);

    
  }else{
    // Deleting recipe if liked before
    state.likes.deleteItem(currentID);

    // changing the state of like button    
    likeView.toogleLikeBtn(false);

    // Removing the liked list in UI 
    likeView.toggleLikeList(state.likes.getNumLikes());
    likeView.deleteLikesItem(currentID);

  }

}


// Handle delete and update list item events

elements.shopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // Handle Delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete Item from list
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count--value")) {
    const newValue = parseFloat(e.target.value, 10);

    state.list.updateCount(id, newValue);
  }
});

// Handling Recipe Button Click

elements.recipe.addEventListener("click", e => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    if (state.reciepe.serving > 1) {
      // Button decrease is clicked
      state.reciepe.updateServings("dec");
      //Update DOM
      recipeView.updateServingIngredients(state.reciepe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // Button Increase is clicked
    state.reciepe.updateServings("inc");
    //Update DOM
    recipeView.updateServingIngredients(state.reciepe);
  } else if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  }else if (e.target.matches(".recipe__love, .recipe__love *")){
    controlLikes();
  }
});
