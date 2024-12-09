<?php
header('Content-Type: application/json');

$server = "localhost";
$userid = "uhxe5swjhgbno";
$pw = "21+$)3#m<I33";
$db = "dbg8yt8cawmfwr";

$conn = new mysqli($server, $userid, $pw, $db);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => "Connection failed: " . $conn->connect_error]));
}

// Handle POST request (create recipe)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['recipeName'];
    $picURL = $_POST['picURL'];
    $instructions = $_POST['instructions'];
    $notes = $_POST['notes'];
    
    // Handle ingredients array
    $ingredients = isset($_POST['ingredients']) ? json_encode($_POST['ingredients']) : '[]';
    
    $sql = "INSERT INTO UserRecipes (name, picURL, ingredients, instructions, notes) VALUES (?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $name, $picURL, $ingredients, $instructions, $notes);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }
    $stmt->close();
}

// Handle GET request (fetch recipes)
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $sql = "SELECT * FROM UserRecipes ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    if ($result) {
        $recipes = [];
        while ($row = $result->fetch_assoc()) {
            $row['ingredients'] = json_decode($row['ingredients']);
            $recipes[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $recipes]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
}

// Handle DELETE request
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);

    if (isset($_DELETE['id'])) {
        $recipeId = intval($_DELETE['id']);
        $userId = getCurrentUserId(); // Ensure the user is authenticated

        $sql = "DELETE FROM UserRecipes WHERE id = ? AND user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $recipeId, $userId);

        if ($stmt->execute() && $stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Recipe deleted successfully']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Failed to delete recipe or recipe not found']);
        }

        $stmt->close();
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Recipe ID is required']);
    }
}


$conn->close();
?>