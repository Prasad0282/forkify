const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

async function showRecipes() {
  try {
    const res = await fetch(
      'https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza'
    );
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    if (data.results === 0) {
      console.log('No recipes found for the given search term.');
      return;
    }

    // Destructure recipes array from data.data
    let { recipes } = data.data;

    if (recipes && recipes.length > 0) {
      // Map and format each recipe
      recipes = recipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
      }));

      console.log(recipes);
    } else {
      console.log('No recipes available in the response.');
    }
  } catch (err) {
    console.error('Error fetching recipes:', err);
  }
}

// Function to delay execution by specified milliseconds
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function showRecipesWithDelay() {
  try {
    await showRecipes();
    await delay(2000); // Delay for 2 seconds between requests
    // Add additional calls to showRecipes() here if needed
  } catch (err) {
    console.error('Error fetching recipes:', err);
  }
}

showRecipesWithDelay();
