<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recipe Finder</title>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<style type="text/css">
    #noteBox {
      height:100px;
      width:300px;
      font-size:1.2rem;
    }

    label {
      font-size: 2.5rem; /* Adjust the size as needed */
      font-weight: bold; /* Optional: Make it bold */
    }

    button {
    background-color: #4caf50; /* Green background */
    color: white;
    padding: 15px 15px; 
    margin-top:10px;
    font-size: 15px; 
    font-weight: bold; 
    border: none; 
    border-radius: 8px; 
    cursor: pointer; 
    transition: all 0.3s ease; 
    }
  </style>
<body>
  <nav>
      <a href="search.html">Search Recipe</a>
      <a href="test_favorites.php">Favorite Recipes</a>
      <a href="create_recipe.html">My Recipes</a>
    </nav>
  <!-- Header Container -->
  <div id="header-container">
    <h1>Edit Note</h1>

  <!-- Recipe Results -->
  <div id="faves">
    <?php

    $foodID = $_POST["id"];
    $server = "localhost";
    $userid = "umwnlhuoe3tjc";
    $pw = ")zIm(p(^%g^6";
    $db = "dbvxq70pzuguhx";

  $conn = new mysqli($server, $userid, $pw);
    if ($conn->connect_error) {
      dies("Connection failed: ".$conn->connect_error);
  }
  $conn->select_db($db);
  
  //SQL connection for products
  $sql = "SELECT * From Faves WHERE id = ".$foodID;
  $result = $conn->query($sql);

  // while($row = $result->fetch_assoc()){
  //   echo($row['name']);
  // }
  $row = $result->fetch_assoc();
  echo($row['name']);
  $note = $row["notes"];
  if (empty($note)){
    // echo("Empty<br>");
    $write = "";
  }
  else{
    // echo("Already stuff<br>");
    $write = $note;
  }

?>
  <script>
  // document.write("Script stuff here");
    var idNum = "<?php echo($foodID)?>";
    // document.write(idNum);
    var oldNote = "<?php echo($write)?>";
    // document.write(oldNote);
    document.write("<br>");

    //Making form
    // var idLine = "<form action='favorites.php?id="+idNum+"' method='POST'>";
    var idLine = "<form action='test_favorites.php' method='POST'>";
    document.write(idLine);
    var noteLine = "<input type='textarea' name='newNote' id='noteBox' value='"+oldNote+"'><br>";
    document.write(noteLine);
    document.write("<button name='changeRecipe' type='submit' value='"+idNum+"'>Submit</button></form>");
    // document.write("<input type='submit'></form>");

    
  </script>
    
  </div>
</body>
</html>
