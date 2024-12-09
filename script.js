const apiKey = 'c7a0effd83a74617aa0f7c4d79db3f3a'; // Your API key
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const recipeResults = document.getElementById('recipe-results');
const recipeDetails = document.getElementById('recipe-details');

// Initialize Custom Dropdowns
document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
  const button = dropdown.querySelector('.dropdown-btn');
  const menu = dropdown.querySelector('.dropdown-menu');
  const options = dropdown.querySelectorAll('.dropdown-menu li');

  // Toggle dropdown menu visibility
  button.addEventListener('click', () => {
    dropdown.classList.toggle('active');
  });

  // Handle option selection
  options.forEach(option => {
    option.addEventListener('click', () => {
      if (option.dataset.value === 'clear') {
        button.textContent = dropdown.id === 'custom-diet-dropdown' ? 'Select Diet' : 'Select Intolerance';
        button.removeAttribute('data-value');
      } else {
        button.textContent = option.textContent;
        button.setAttribute('data-value', option.getAttribute('data-value'));
      }
      dropdown.classList.remove('active');
    });
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', e => {
  document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
});

// Function to fetch recipe details
async function fetchRecipeDetails(recipeId) {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
    const data = await response.json();

    document.getElementById('header-container').style.display = 'none';

    // Store the recipe details globally like chrome, firefox
    window.currentRecipe = {
      name: data.title,
      picURL: data.image,
      ingredients: data.extendedIngredients.map(ing => ing.original),
      instructions: data.instructions || "No instructions available.",
      notes: "" // where user add notes
    };

    // Display recipe details
    recipeDetails.innerHTML = `
      <button onclick="closeDetails()">Back to Results</button>
      <button onclick="addFavorite()">Favourite this recipe!</button>
      <h2>${data.title}</h2>
      <img src="${data.image}" alt="${data.title}" style="width: 100%; max-width: 400px;" />
      <h3>Ingredients:</h3>
      <ul>
        ${data.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}
      </ul>
      <h3>Instructions:</h3>
      <p>${data.instructions || 'No instructions available.'}</p>
    `;
    recipeDetails.style.display = 'block';
    recipeResults.style.display = 'none';
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    alert('Unable to fetch recipe details. Please try again later.');
  }
}

// Function to close details view
function closeDetails() {
  // Show the header container
  const headerContainer = document.getElementById('header-container');
  headerContainer.style.display = 'flex'; 

  // Reset any necessary layout-related styles
  headerContainer.style.flexDirection = 'column'; 
  headerContainer.style.alignItems = 'center'; 
  headerContainer.style.justifyContent = 'center'; 

  recipeDetails.style.display = 'none'; // Hide the recipe details section
  recipeResults.style.display = 'flex'; // Show the recipe results again
}

// Updated searchRecipes function to include "View Details" buttons
async function searchRecipes(query) {
  try {
    const diet = document.querySelector('#custom-diet-dropdown .dropdown-btn').getAttribute('data-value') || '';
    const intolerance = document.querySelector('#custom-intolerance-dropdown .dropdown-btn').getAttribute('data-value') || '';

    let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${apiKey}`;
    if (diet) apiUrl += `&diet=${diet}`;
    if (intolerance) apiUrl += `&intolerances=${intolerance}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    // Clear previous results
    recipeResults.innerHTML = '';

    // Display results with "View Details" button
    if (data.results && data.results.length > 0) {
      data.results.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
          <img src="${recipe.image}" alt="${recipe.title}" />
          <h3>${recipe.title}</h3>
          <button onclick="fetchRecipeDetails(${recipe.id})">View Details</button>
        `;
        recipeResults.appendChild(recipeCard);
      });
    } else {
      recipeResults.innerHTML = '<p>No recipes found. Try another search!</p>';
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    recipeResults.innerHTML = '<p>Error fetching recipes. Please try again later.</p>';
  }
}

async function addFavorite() {
    try {
        const data = {
            name: window.currentRecipe.name,
            picURL: window.currentRecipe.picURL,
            ingredients: window.currentRecipe.ingredients,
            instructions: window.currentRecipe.instructions // Include instructions
        };

        const response = await fetch('insert_fav.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json(); // Parse JSON response
        if (result.success) {
            alert(result.message);
        } else {
            alert('Failed to save recipe: ' + result.message);
        }
    } catch (error) {
        console.error('Error saving recipe:', error);
        alert('An error occurred while saving the recipe.');
    }
}




// Event listener for the search button
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    searchRecipes(query);
  } else {
    alert('Please enter a search query.');
  }
});
