<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database connection
$conn = new mysqli("localhost", "umwnlhuoe3tjc", ")zIm(p(^%g^6", "dbvxq70pzuguhx");
header('Content-Type: application/json'); // Ensure JSON response

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "message" => "JSON Decode Error: " . json_last_error_msg()]);
    exit;
}

// Validate fields
if (empty($data['name']) || empty($data['picURL']) || !is_array($data['ingredients']) || empty($data['instructions'])) {
    echo json_encode(["success" => false, "message" => "Invalid input data."]);
    exit;
}

// Prepare SQL
$sql = "INSERT INTO Favor (name, picURL, ingredients, instructions, notes) VALUES (?, ?, ?, ?, NULL)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Error preparing statement: " . $conn->error]);
    exit;
}

// Bind and sanitize parameters
$name = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
$picURL = htmlspecialchars($data['picURL'], ENT_QUOTES, 'UTF-8');
$ingredients = json_encode($data['ingredients'], JSON_UNESCAPED_UNICODE);
$instructions = htmlspecialchars($data['instructions'], ENT_QUOTES, 'UTF-8'); // Now treated as TEXT

$stmt->bind_param("ssss", $name, $picURL, $ingredients, $instructions);

// Execute and return JSON response
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Recipe name, picture link, ingredients, and instructions saved successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to save recipe: " . $stmt->error]);
}

// Close connections
$stmt->close();
$conn->close();

?>
