const apiKey = '4e02f87a66ed42628364000b25970784'; // Your API key
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const recipeResults = document.getElementById('recipe-results');

// Initialize Custom Dropdowns
document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    const button = dropdown.querySelector('.dropdown-btn'); // The dropdown button
    const menu = dropdown.querySelector('.dropdown-menu'); // The dropdown menu
    const options = dropdown.querySelectorAll('.dropdown-menu li'); // List items in the menu
  
    // Toggle dropdown menu visibility
    button.addEventListener('click', () => {
      dropdown.classList.toggle('active'); // Toggle visibility
    });
  
    // Handle option selection
    options.forEach(option => {
      option.addEventListener('click', () => {
        if (option.dataset.value === 'clear') {
          button.textContent = dropdown.id === 'custom-diet-dropdown' ? 'Select Diet' : 'Select Intolerance';
          button.removeAttribute('data-value'); // Remove the selected value
        } else {
          button.textContent = option.textContent; // Update button text
          button.setAttribute('data-value', option.getAttribute('data-value')); // Store the selected value
        }
        dropdown.classList.remove('active'); // Close the dropdown
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
  
// Fetch and display recipes
async function searchRecipes(query, diet, intolerance) {
  try {
    // Construct the API URL with query, diet, and intolerance filters
    let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${apiKey}`;
    if (diet) apiUrl += `&diet=${diet}`;
    if (intolerance) apiUrl += `&intolerances=${intolerance}`;

    // Fetch the data
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Clear previous results
    recipeResults.innerHTML = '';

    // Display results
    if (data.results && data.results.length > 0) {
      data.results.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
          <img src="${recipe.image}" alt="${recipe.title}" />
          <h3>${recipe.title}</h3>
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

// Event listener for the search button
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();

  // Get selected values from dropdowns
  const diet = document.querySelector('#custom-diet-dropdown .dropdown-btn').getAttribute('data-value') || '';
  const intolerance = document.querySelector('#custom-intolerance-dropdown .dropdown-btn').getAttribute('data-value') || '';

  if (query) {
    searchRecipes(query, diet, intolerance);
  } else {
    alert('Please enter a search query.');
  }
});
