const recipeContainer = document.querySelector(".recipe");
const timeout = function(s) {
    return new Promise(function(_, reject) {
        setTimeout(function() {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};
async function showRecipes() {
    try {
        const res = await fetch("https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza");
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        if (data.results === 0) {
            console.log("No recipes found for the given search term.");
            return;
        }
        // Destructure recipes array from data.data
        let { recipes } = data.data;
        if (recipes && recipes.length > 0) {
            // Map and format each recipe
            recipes = await enhanceRecipes(recipes);
            if (recipes.length > 0) console.log(recipes);
            else console.log("No recipes available after enhancing.");
        } else console.log("No recipes available in the response.");
        //rendering recipe
        const markup = `
        <figure class="recipe__fig">
        <img src="${recipes.image}" alt="Tomato" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${recipes.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="src/img/icons.svg#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${recipes.cookingTime}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="src/img/icons.svg#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${recipes.servings}</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="src/img/icons.svg#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="src/img/icons.svg#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated">
          <svg>
            <use href="src/img/icons.svg#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round">
          <svg class="">
            <use href="src/img/icons.svg#icon-bookmark-fill"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
        ${recipes.ingredients.map((ing)=>{
            return `<li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="src/img/icons.svg#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing.quantity}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
              </div>
            </li>`;
        }).join("")}
      
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${recipes.publisher}</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${recipes.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="src/img/icons.svg#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
        `;
        recipeContainer.innerHTML = "";
        recipeContainer.insertAdjacentHTML("afterbegin", markup);
    } catch (err) {
        console.error("Error fetching recipes:", err);
        alert("Error fetching recipes. Please try again later.", err);
    }
}
// Define a function to enhance recipes with additional details
const enhanceRecipes = async (recipes)=>{
    // Array to store promises for fetching details of each recipe
    const fetchPromises = recipes.map(async (recipe)=>{
        try {
            const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${recipe.id}`);
            const data = await res.json();
            if (!res.ok) throw new Error(`${data.message} (${res.status})`);
            // Update the recipe object with additional details
            recipe.servings = data.data.recipe.servings;
            recipe.cookingTime = data.data.recipe.cooking_time;
            recipe.ingredients = data.data.recipe.ingredients;
            return recipe;
        } catch (error) {
            console.error(`Error fetching details for recipe ${recipe.id}:`, error);
            return null;
        }
    });
    // Wait for all promises to resolve
    const enhancedRecipes = await Promise.all(fetchPromises);
    // Filter out any null values (failed fetches)
    return enhancedRecipes.filter((recipe)=>recipe !== null);
};
// Function to delay execution by specified milliseconds
function delay(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
async function showRecipesWithDelay() {
    try {
        await showRecipes();
        await delay(2000); // Delay for 2 seconds between requests
    // Add additional calls to showRecipes() here if needed
    } catch (err) {
        console.error("Error fetching recipes:", err);
    }
}
showRecipesWithDelay();

//# sourceMappingURL=index.d4d8c304.js.map
