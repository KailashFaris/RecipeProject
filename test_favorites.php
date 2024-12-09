<?php
// Cache-Control headers to disable caching
header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
header("Pragma: no-cache"); // HTTP 1.0.
header("Expires: 0"); // Proxies.

// Start your PHP logic here (database connection, etc.)
$server = "localhost";
$userid = "umwnlhuoe3tjc";
$pw = ")zIm(p(^%g^6";
$db = "dbvxq70pzuguhx";

$conn = new mysqli($server, $userid, $pw);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->select_db($db);

// Process POST requests for new notes or recipe removal
if ($_POST["newNote"]) {
    $insert = "UPDATE Faves SET notes='" . $_POST["newNote"] . "' WHERE id=" . $_POST["changeRecipe"];
    $conn->query($insert);
}

if ($_POST["removeRecipe"]) {
    $delCommand = "DELETE FROM Faves WHERE id=" . $_POST["removeRecipe"];
    $conn->query($delCommand);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recipe Finder</title>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <nav>
        <a href="search.html">Search Recipe</a>
        <a href="favorites.php">Favorite Recipes</a>
        <a href="create_recipe.html">My Recipes</a>
    </nav>
    <!-- Header Container -->
    <div id="header-container">
        <h1>Favorites</h1>
        <!-- Recipe Results -->
        <div id="faves">
            <?php
            // Fetch and display favorite recipes
            $sql = "SELECT * FROM Faves";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo "<div class='fav-recipe-card'>";
                    echo "<h2>" . $row["name"] . "</h2>";
                    $ingredients = json_decode($row["ingredients"], true); // Decode JSON into an array
                    if (is_array($ingredients)) {
                        echo "<p><strong>Ingredients:</strong></p>";
                        echo "<ul>";
                        foreach ($ingredients as $ingredient) {
                            echo "<li>" . htmlspecialchars($ingredient) . "</li>";
                        }
                        echo "</ul>";
                    } else {
                        echo "<p><strong>Ingredients:</strong> " . htmlspecialchars($row["ingredients"]) . "</p>";
                    }
                    
                    // Handle Instructions
                    $instructions = $row["instructions"];

                    // Decode HTML entities and render
                    echo "<p class='fav-instructions'><strong>Instructions:</strong> " . html_entity_decode($instructions) . "</p>";

                    echo "<img src='" . $row["picURL"] . "' alt='" . $row["name"] . "' class='fav-recipe-img'>";
                    echo "<p class='fav-note'><strong>Notes:</strong> " . $row["notes"] . "</p>";
                    echo "<form action='notes.php' method='POST'>";
                    echo "<button name='id' type='submit' class='edit-btn' value='" . $row["id"] . "'>Edit Note</button>";
                    echo "</form>";
                    echo "<form action='test_favorites.php' method='POST'>";
                    echo "<button name='removeRecipe' type='submit' class='remove-btn' value='" . $row["id"] . "'>Remove From Favorites</button>";
                    echo "</form>";
                    echo "</div>";
                }
            } else {
                echo "No favorite recipes yet! Go look at a recipe and add it to your favorites!";
            }
            ?>
        </div>
    </div>
</body>
</html>
