const recipeContainer = document.querySelector(".recipe");
const timeout = function(s) {
    return new Promise(function(_, reject) {
        setTimeout(function() {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};
async function showRecipeDetails(recipeId) {
    try {
        const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${recipeId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        const recipe = data.data.recipe;
        // Render recipe details
        const markup = `
      <figure class="recipe__fig">
        <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${recipe.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="src/img/icons.svg#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${recipe.cooking_time}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="src/img/icons.svg#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
          <span class="recipe__info-text">servings</span>
        </div>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${recipe.ingredients.map((ing)=>`
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="src/img/icons.svg#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing.quantity ? ing.quantity : ""}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit ? ing.unit : ""}</span>
                ${ing.description}
              </div>
            </li>
          `).join("")}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${recipe.source_url}"
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
        console.error("Error fetching recipe details:", err);
        alert("Error fetching recipe details. Please try again later.");
    }
}
// Function to delay execution by specified milliseconds
function delay(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
async function showRecipeWithDelay() {
    try {
        //await showRecipeDetails('664c8f193e7aa067e94e8355');
        await showRecipeDetails("664c8f193e7aa067e94e8476"); // Provide the recipe ID here
        await delay(2000); // Delay for 2 seconds
    } catch (err) {
        console.error("Error showing recipe:", err);
    }
}
showRecipeWithDelay();

//# sourceMappingURL=index.7c8e513b.js.map
