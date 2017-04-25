<?php

  $dbPath = __DIR__."/contests/db.php"; 
  require_once($dbPath);

  $tableName = $_POST['tableName'];
  $country = $_POST['country'];
  $columns = json_decode($_POST['columns']);

  $response = new StdClass();
  $response->country = $country;

  //Get all contestants
  $query = "SELECT * FROM $tableName WHERE country='$country'";
  $result = $conn->query($query);
  if ($result->num_rows > 0) {
    $randomWinner = rand(0,($result->num_rows - 1));
    $possibleWinners = array();
    while($row = $result->fetch_assoc()) {
      $possibleWinner = new StdClass();
      $possibleWinner->firstName = $row["firstName"];
      $possibleWinner->lastName = $row["lastName"];
      $possibleWinner->gender = $row["gender"];
      $possibleWinner->age = $row["age"];
      $possibleWinner->postNummer = $row["postNummer"];
      $possibleWinner->email = $row["email"];
      $possibleWinner->answers = array();
      foreach ($columns as $column) {
        if(substr($column, 0, 1) == "q"){
          array_push($possibleWinner->answers, preg_replace('#(\\\r\\\n|\\\r|\\\n)#', 'BREAK', $row[$column]));
        }
      }
      if(count($possibleWinner->answers) == 0){
        array_push($possibleWinner->answers, preg_replace('#(\\\r\\\n|\\\r|\\\n)#', 'BREAK', $row['motivering']));
      }
      array_push($possibleWinners, $possibleWinner);
    }
  }
  $response->firstName = $possibleWinners[$randomWinner]->firstName;
  $response->lastName = $possibleWinners[$randomWinner]->lastName;
  $response->gender = $possibleWinners[$randomWinner]->gender;
  $response->age = $possibleWinners[$randomWinner]->age;
  $response->postNummer = $possibleWinners[$randomWinner]->postNummer;
  $response->email = $possibleWinners[$randomWinner]->email;
  $response->answers = $possibleWinners[$randomWinner]->answers;
  $conn->close();

  echo json_encode($response);

?>