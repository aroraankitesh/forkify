import { elements } from './base';
import Likes from '../models/Likes';
import {limitRecipe} from './searchView'


export const toogleLikeBtn = isliked => {
    const iconString = isliked ? 'icon-heart' : 'icon-heart-outlined'
    // img/icons.svg#icon-heart-outlined
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const toggleLikeList = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export const renderLikes = recipe => {
    const markup = 
       `<li>
            <a class="likes__link" href="#${recipe.id}">
                <figure class="likes__fig">
                    <img src="${recipe.img}" alt="Test">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipe(recipe.title)}</h4>
                    <p class="likes__author">${recipe.author}</p>
                </div>
            </a>
        </li>`

    elements.likesList.insertAdjacentHTML('beforeend', markup);    
};

export const deleteLikesItem = id => {
    const item = document.querySelector(`.likes_link[href*="${id}"]`).parentElement;
    if(item) item.parentElement.removeChild(item);
}

