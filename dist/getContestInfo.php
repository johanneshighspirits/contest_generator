<?php

  $dbPath = __DIR__."/contests/db.php"; 
  require_once($dbPath);

  $tableName = $_POST['tableName'];
  $nrOfContestants = array();
  $response = new StdClass();
  $response->countries = array();
  $response->tableName = $tableName;
  $response->name = $_POST['name'];

  $sqlString = "SELECT * FROM $tableName ORDER BY country";
  if ($result = $conn->query($sqlString)) {
    if ($result->num_rows > 0) {
      // Manipulate result row by row
      while($row = $result->fetch_assoc()) {
        $country = $row["country"];
        if(!in_array($country, $response->countries)){
          array_push($response->countries, $country);
        }
        if($nrOfContestants[$country] > 0){
          $nrOfContestants[$country]++;
        }else{
          $nrOfContestants[$country] = 1;
        }
      }
    }else{
      $response->error = "ERROR_NO_CONTESTANTS";
    }

    $response->nrOfContestants = $nrOfContestants;
    $response->columns = array();
    $fields = $result->fetch_fields();
    foreach ($fields as $column) {
      array_push($response->columns, $column->name);
    }
  }else{
    $response->error = "$sqlString $conn->error";
  }
  $conn->close();
  echo json_encode($response);
?>