export const elements = {
    search: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list'),
    resPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesList: document.querySelector('.likes__list'),
    likesMenu: document.querySelector('.likes__field')
}

export const elementStrings = {
    loader: 'loader'
}

export const renderLoader = parent =>{
    const loader= `
    <div class=${elementStrings.loader}>
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>
    `

    parent.insertAdjacentHTML('afterbegin', loader);
    
};


export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`)
    if(loader) loader.parentElement.removeChild(loader);
}