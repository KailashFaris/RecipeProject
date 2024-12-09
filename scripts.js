// Function to add new ingredient input field
function addIngredient() {
    const ingredientsList = document.getElementById('ingredientsList');
    const newIngredient = document.createElement('div');
    newIngredient.className = 'ingredient-item';
    newIngredient.innerHTML = `
        <input type="text" name="ingredients[]" required>
        <button type="button" class="remove-btn" onclick="removeIngredient(this)">Remove</button>
    `;
    ingredientsList.appendChild(newIngredient);
}

// Function to remove ingredient input field
function removeIngredient(button) {
    button.parentElement.remove();
}

// Function to fetch and display recipes
async function displayRecipes() {
    const recipeList = document.getElementById('recipeList');
    
    try {
        const response = await fetch('create_recipe.php');
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            recipeList.innerHTML = '';
            
            data.data.forEach(recipe => {
                const card = document.createElement('div');
                card.className = 'recipe-card';
                
                let ingredientsList = '';
                if (recipe.ingredients && recipe.ingredients.length > 0) {
                    ingredientsList = `
                        <ul>
                            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>
                    `;
                }
                
                card.innerHTML = `
                    <h3>${recipe.name}</h3>
                    ${recipe.picURL ? `<img src="${recipe.picURL}" alt="${recipe.name}">` : ''}
                    <h4>Ingredients:</h4>
                    ${ingredientsList}
                    <h4>Instructions:</h4>
                    <p>${recipe.instructions}</p>
                    ${recipe.notes ? `
                        <h4>Notes:</h4>
                        <p>${recipe.notes}</p>
                    ` : ''}
                `;
                
                recipeList.appendChild(card);
            });
        } else {
            recipeList.innerHTML = '<p>No recipes found</p>';
        }
    } catch (error) {
        recipeList.innerHTML = '<p>Error loading recipes</p>';
    }
}

// Handle form submission
document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Get all ingredients and append them individually
    const ingredientInputs = e.target.querySelectorAll('input[name="ingredients[]"]');
    formData.delete('ingredients[]'); // Remove the original ingredients array
    ingredientInputs.forEach(input => {
        if (input.value) {
            formData.append('ingredients[]', input.value);
        }
    });
    
    try {
        const response = await fetch('create_recipe.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success message
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
            
            // Clear form
            e.target.reset();
            
            // Reset ingredients to one empty input
            document.getElementById('ingredientsList').innerHTML = `
                <div class="ingredient-item">
                    <input type="text" name="ingredients[]" required>
                    <button type="button" class="remove-btn" onclick="removeIngredient(this)">Remove</button>
                </div>
            `;
            
            // Refresh recipe list
            await displayRecipes();
        } else {
            alert('Error saving recipe');
        }
    } catch (error) {
        alert('Error saving recipe');
    }
});

// Load recipes when page loads
document.addEventListener('DOMContentLoaded', displayRecipes);