<?php
  $dbPath = __DIR__."/contests/db.php"; 
  require_once($dbPath);

  function test_input($data){
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
  }

  $tableName = test_input($_POST['tableName']);

  // Regular search - Match from first letter
  $searchString = $conn->real_escape_string($tableName)."%";

  $response = new StdClass();
  $response->tables = array();

  // Check if table exists, else create it
  $query = "SHOW TABLES LIKE '$searchString'";
  if($result = $conn->query($query)) {
    if ($result->num_rows > 0) {
      // Table exist
      while ($row = $result->fetch_array()) {
        array_push($response->tables, $row[0]);
      }
      $response->message = "TABLE_EXISTS";
    }else{
      $response->message = "TABLE_DOES_NOT_EXIST";
    }
  }

  echo json_encode($response);


?>