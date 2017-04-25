<?php
session_start();
$dbPath = __DIR__."/../contests/db.php"; 
require_once($dbPath);

//Sanitize form function
function test_input($data){
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

$sqlString = "SELECT COUNT(*) FROM ##tableName## WHERE email=?";
$email = $_POST["email"];

$response = new StdClass();

if($stmt = $conn->prepare($sqlString)) {
	$stmt->bind_param("s", $email);
	if($stmt->execute()) {
		$stmt->store_result();

		$email_check = "";
		$stmt->bind_result($email_check);
		$stmt->fetch();

		if ($email_check > 0){
			//Redirect to error page if user has already participated in contest
			$response->error = "EMAIL_EXISTS";
		}else{
			$stmt->close();
			// Add values to database
			$firstName = $conn->real_escape_string(test_input($_POST["firstName"]));
			$lastName = $conn->real_escape_string(test_input($_POST["lastName"]));
			$gender = $conn->real_escape_string(test_input($_POST["gender"]));
			$age = $conn->real_escape_string(test_input($_POST["age"]));
			$postNummer = $conn->real_escape_string(test_input($_POST["postNummer"]));
			$country = $conn->real_escape_string(test_input($_POST["country"]));
			if ($conn->real_escape_string(test_input($_POST["newsletter"])) == "on"){
				$newsletter = $email;	
			}else{
				$newsletter = "";
			}
			if ($conn->real_escape_string(test_input($_POST["newsletterTL"])) == "on"){
				$newsletterTL = $email;	
			}else{
				$newsletterTL = "";
			}

			##postedAnswers##

			//Create SQL-string to insert from the form
			$query = "##insertAnswersQuery##";

			// Prepare and bind:
			if($insert = $conn->prepare($query)){
				$insert->bind_param("##insertAnswersFormat##", ##insertAnswersVars##);
				if($insert->execute()){
					$insert->close();
					$conn->close();
					//Redirect to thank you page
					$response->success = "SUCCESS";
				}else{
					$response->error = $insert->error;
				}
			}else{
					$response->error = $insert->error;
			}
		}
	}else{
		$response->error = $stmt->error;
	}
}else{
	$response->error = $stmt->error;
}
echo json_encode($response);
?>