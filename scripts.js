// Function to add new ingredient input field
function addIngredient() {
    const newIngredient = $(`
        <div class="ingredient-item">
            <input type="text" name="ingredients[]" required>
            <button type="button" class="remove-btn">Remove</button>
        </div>
    `);
    $('#ingredientsList').append(newIngredient);
}

// Function to remove ingredient input field
$(document).on('click', '.remove-btn', function() {
    $(this).closest('.ingredient-item').remove();
});

// Function to fetch and display recipes
function displayRecipes() {
    const $recipeList = $('#recipeList');
    if (!$recipeList.length) {
        console.error('Recipe list container not found');
        return;
    }
    
    $.ajax({
        url: 'create_recipe.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                $recipeList.empty();
                
                $.each(data.data, function(i, recipe) {
                    let ingredients = recipe.ingredients;
                    if (typeof ingredients === 'string') {
                        try {
                            ingredients = JSON.parse(ingredients);
                        } catch (e) {
                            ingredients = [];
                        }
                    }
                    
                    let ingredientsList = '';
                    if (Array.isArray(ingredients) && ingredients.length > 0) {
                        ingredientsList = $('<ul>').append(
                            $.map(ingredients, function(ing) {
                                return $('<li>').text(ing);
                            })
                        ).prop('outerHTML');
                    }
                    
                    const $card = $('<div>', {
                        class: 'recipe-card'
                    }).append(`
                        <h3>${recipe.name || 'Untitled Recipe'}</h3>
                        ${recipe.picURL ? `<img src="${recipe.picURL}" alt="${recipe.name || 'Recipe Image'}" onerror="this.style.display='none'">` : ''}
                        <h4>Ingredients:</h4>
                        ${ingredientsList || '<p>No ingredients listed</p>'}
                        <h4>Instructions:</h4>
                        <p>${recipe.instructions || 'No instructions provided'}</p>
                        ${recipe.notes ? `
                            <h4>Notes:</h4>
                            <p>${recipe.notes}</p>
                        ` : ''}
                    `);
                    
                    $recipeList.append($card);
                });
            } else {
                $recipeList.html('<p>No recipes found</p>');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching recipes:', error);
            $recipeList.html('<p>Error loading recipes. Please try again later.</p>');
        }
    });
    const $card = $('<div>', {
    class: 'recipe-card'
    }).append(`
        <h3>${recipe.name || 'Untitled Recipe'}</h3>
        ${recipe.picURL ? `<img src="${recipe.picURL}" alt="${recipe.name || 'Recipe Image'}" onerror="this.style.display='none'">` : ''}
        <h4>Ingredients:</h4>
        ${ingredientsList || '<p>No ingredients listed</p>'}
        <h4>Instructions:</h4>
        <p>${recipe.instructions || 'No instructions provided'}</p>
        ${recipe.notes ? `
            <h4>Notes:</h4>
            <p>${recipe.notes}</p>
        ` : ''}
        <button class="remove-recipe-btn" data-id="${recipe.id}">Remove Recipe</button>
    `);
}

// Handle form submission
$(document).ready(function() {
    const $form = $('#recipeForm');
    if (!$form.length) {
        console.error('Recipe form not found');
        return;
    }

    $form.on('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        // Handle ingredients
        formData.delete('ingredients[]');
        $('input[name="ingredients[]"]').each(function() {
            if (this.value) {
                formData.append('ingredients[]', this.value);
            }
        });
        
        $.ajax({
            url: 'create_recipe.php',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(result) {
                if (result.success) {
                    const $successMessage = $('#successMessage');
                    $successMessage.show();
                    setTimeout(function() {
                        $successMessage.hide();
                    }, 3000);
                    
                    $form[0].reset();
                    
                    $('#ingredientsList').html(`
                        <div class="ingredient-item">
                            <input type="text" name="ingredients[]" required>
                            <button type="button" class="remove-btn">Remove</button>
                        </div>
                    `);
                    
                    displayRecipes();
                } else {
                    alert(result.error || 'Error saving recipe');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error saving recipe:', error);
                alert('Error saving recipe. Please try again later.');
            }
        });
    });
    
    displayRecipes();
});

// Remove recipe
$(document).on('click', '.remove-recipe-btn', function() {
    const recipeId = $(this).data('id');

    if (confirm('Are you sure you want to delete this recipe?')) {
        $.ajax({
            url: 'create_recipe.php',
            method: 'DELETE',
            data: { id: recipeId },
            success: function(result) {
                if (result.success) {
                    alert('Recipe removed successfully!');
                    displayRecipes(); // Refresh the recipe list
                } else {
                    alert(result.error || 'Error removing recipe');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error removing recipe:', error);
                alert('Error removing recipe. Please try again later.');
            }
        });
    }
});
