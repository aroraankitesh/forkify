import {elements} from './base';


export const getInput = () => elements.searchInput.value;


export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
    elements.resPages.innerHTML = '';
}

export const highlightSelected = id => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el =>{
        el.classList.remove('results__link--active');
        })
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}

export const limitRecipe = (title, limit=17) =>{
    const newTitle = [];

    if(title.length >= limit){
        title.split(' ').reduce((acc, cur) =>{
            if(acc + cur.length <= limit ){
                newTitle.push(cur);
            }
            return acc + cur.length;

        },0);
        return `${newTitle.join(' ')}...`;

    }

    return title;

 
}

const renderRecipe = recipe =>{

    const markup = `
    <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipe(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li> `;

elements.searchResList.insertAdjacentHTML('beforeend', markup);
    
}

// type prev, next

const buttonMarkup = (page, type) =>{

    const markup = `
    <button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
    </button>`    

    elements.resPages.insertAdjacentHTML('afterbegin', markup);

}



export const renderButton = (recipes, gotoPage = 1) =>{
    
    const totalPage = Math.ceil(recipes.length / 10);
    
    
    if(gotoPage === 1 && totalPage > 1){
        // if page is first page

        buttonMarkup(gotoPage, 'next');
    }else if (gotoPage === totalPage && totalPage > 1){
        // last page
        buttonMarkup(gotoPage, 'prev');
    }else if (gotoPage < totalPage){
        // in between page

        buttonMarkup(gotoPage, 'prev');
        buttonMarkup(gotoPage, 'next');
    }

}



export const renderResults = (recipes, page=1, recipePerPage=10) => {
    const start = (page - 1) * recipePerPage;
    const end = recipePerPage * page;
   
   
    recipes.slice(start, end).forEach(renderRecipe);
}




