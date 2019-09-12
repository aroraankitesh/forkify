import axios from 'axios';
import {key} from '../config';

export default class Recipe{

    constructor(id){
        this.id = id;
    }


    async getRecipe(){
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            console.log(res);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
        }
    }

    calcTime(){
        // Assuming each ingredients take 15 mins for 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;

    }

    calcServing(){
        this.serving = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'jars'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'jar'];

        const newIngredients = this.ingredients.map(el => {
        // 1. Uniform Units
            let ingredient = el.toLowerCase();

            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            })



        // 2. Remove Paranthesis

        ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");



        // 3. Parse units into count, unit and ingredients
        const arrIng = ingredient.split(' ');
        const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

        let objIng;

        if(unitIndex > -1){
            // There is a Unit

            const arrCount = arrIng.slice(0, unitIndex);

            let count;
            if(arrCount.length === 1){
                count = eval(arrIng[0].replace('-', '+'));
            }else{
                count = eval(arrIng.slice(0, unitIndex).join('+'));
            }

            objIng = {
                count,
                unit: arrIng[unitIndex],
                ingredient: arrIng.slice(unitIndex+1).join(' ')
            }



        }else if (parseInt(arrIng[0], 10)){
            // There is no unit but first element is number
            objIng = {
                count: parseInt(arrIng[0], 10),
                unit: '',
                ingredient: arrIng.slice(1).join(' ')

            }
        }else if(unitIndex === -1){
            // There is no number and unit in first position

            objIng = {
                count: 1,
                unit: '',
                ingredient  //ingredient: ingredient
            }
        }

        return objIng;
        // return newIngredients;

    })

    this.ingredients = newIngredients;
    }

    updateServings(type){
        // Serving
        const newServing = type === 'dec' ? this.serving - 1 : this.serving + 1;

        // Ingredients
        this.ingredients.forEach(el => {
            el.count *= (newServing/this.serving);
        })

        this.serving = newServing;

    }

}