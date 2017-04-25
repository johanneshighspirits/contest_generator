<?php
$root = $_SERVER['DOCUMENT_ROOT'];
$mysqliPath = $root."/htmlprinter/ReactContestGenerator/mysqli.php";
require_once($mysqliPath);

function test_input($data){
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

function camelCase($str, $noStrip = array()) {
  $str = preg_replace('/[^a-z0-9' . implode("", $noStrip) . ']+/i', ' ', $str);
  $str = trim($str);
  $str = ucwords($str);
  $str = str_replace(" ", "", $str);
  $str = lcfirst($str);
  return $str;
}

class JBoFile
{
  public $name;
  public $content;
  
  public function JBoFile($name)
  {
    $this->name = $name;
    $templateDir = "contestTemplates";
    $this->content = file_get_contents($templateDir."/".$name);
  }
}

function replacePlaceholders($input) {
  global $tableName, $insertAnswersFormat, $insertAnswersQuery, $insertAnswersVars, $postedAnswers;
  $patterns = array (
    "/##tableName##/",
    "/##insertAnswersQuery##/",
    "/##insertAnswersFormat##/",
    "/##insertAnswersVars##/",
    "/##postedAnswers##/"
    );
  $replacements = array(
    $tableName,
    $insertAnswersQuery,
    $insertAnswersFormat,
    $insertAnswersVars,
    $postedAnswers,
    );
  return preg_replace($patterns, $replacements, $input);
}

$contestName = camelCase(test_input($_POST['contestName']));
$tableName = test_input($_POST['tableName']);
$columns = json_decode($_POST['columns'], true);
$endDate = date( "Y-m-d", strtotime($_POST['endDate']));

$response = new StdClass();
$response->contestName = $contestName;

  // Check if table exists, else create it
$query = "SHOW TABLES LIKE '$tableName'";
if($result = $conn->query($query)) {
  if ($result->num_rows > 0) {
      // Table exist
    $response->error = "ERROR_TABLE_EXISTS";
    $response->tableCreated = true;
  }else{
    $response->tableCreation = "TABLE_DOES_NOT_EXIST";

    $createTableQuery = "CREATE TABLE $tableName (
    country varchar(2),
    firstName varchar(255),
    lastName varchar(255),
    gender varchar(32),
    age varchar(4),
    postNummer varchar(255),
    email varchar(255),";
    foreach ($columns["columns"] as $column) {
      $createTableQuery .= $column.",";
    }
    $createTableQuery .= "
    newsletter varchar(255),
    newsletterTL varchar(255),
    PRIMARY KEY (email)
    )";
    $response->query = $createTableQuery;
    if($tableCreation = $conn->query($createTableQuery)) {
      $response->tableCreated = true;

      // Add contest to contests table
      $addContestQuery = "INSERT INTO contests (name, table, endDate) VALUES ($contestName, $tableName, $endDate)";
      if($conn->query($addContestQuery) === TRUE) {
        $response->addedToContests = "Successfully added to contests table";
      }else{
        $response->addedToContests = "ERROR when trying to save to contests table. ".$conn->error;
      }

    }else{
      $response->tableCreated = false;
      $response->error = "ERROR: $conn->error";
    }
  }
}else{
  $response->error = "ERROR: $conn->error";
}


$tempDir = "temp";
if (!file_exists($tempDir)) {
  mkdir($tempDir);
}

// Create master folder. Add all files and folders to be downloaded
// temp/tableName-123456
$folderToBeDownloaded = $tempDir."/".$contestName."-".mktime();
if (!file_exists($folderToBeDownloaded)) {
  mkdir($folderToBeDownloaded);
}

$zipname = $tempDir."/".$contestName.'.zip';
$zip = new ZipArchive;
$zip->open($zipname, ZipArchive::CREATE);

$languages = json_decode($_POST["languages"]);
foreach ($languages as $language) {
  // Create one contest folder per country.
  // This is the folder that should be uploaded to travellink-campaign
  // temp/tableName-123456/language/tableName
  $folderToBeUploaded = $folderToBeDownloaded."/".$language."/".$contestName;
  if (!file_exists($folderToBeUploaded)) {
    mkdir($folderToBeUploaded, 0777, true);
  }

  // Add index.php to contest folder
  $index = fopen($folderToBeUploaded."/index.php", "w+");
  fwrite($index, $_POST["fileContent"]);
  fclose($index);
  $zip->addFile($folderToBeUploaded."/index.php", $language."/".$contestName."/index.php");

  $editorial = fopen($folderToBeDownloaded."/editorial-".$language.".html", "w+");
  $editorialText = $_POST["editorialHtml"];
  $editorialText = preg_replace("/#LOWERCASE_LANG#/", strtolower($language), $editorialText);
  $editorialText = preg_replace("/#UPPERCASE_LANG#/", $language, $editorialText);
  fwrite($editorial, $editorialText);
  fclose($editorial);
  $zip->addFile($folderToBeDownloaded."/editorial-".$language.".html", $language."/editorial-".$language.".html");

  // Add handle user answers file (post.php)
  // Create insert query and format
  $insertAnswersFormat = "s";
  $insertAnswersVars = '$country,
  $firstName,
  $lastName,
  $gender,
  $age,
  $postNummer,
  $email,';
  $insertAnswersQuery = "INSERT INTO $tableName (
  country,
  firstName,
  lastName,
  gender,
  age,
  postNummer,
  email,";
  foreach ($columns["columns"] as $column) {
    $answer = preg_replace("/( varchar\([0-9]*\)| text)/", "", $column);
    $insertAnswersQuery .= $answer.",";
    $insertAnswersVars .= '$'.$answer.",";
    $postedAnswers .= '$'.$answer.' = $conn->real_escape_string(test_input($_POST["'.$answer.'"]));';
  }
  $insertAnswersQuery .= "
  newsletter,
  newsletterTL
  )
  VALUES (";
  $insertAnswersVars .= '$newsletter, $newsletterTL';
  for ($i = 0; $i < (count($columns["columns"]) + 8); $i++) {
    $insertAnswersQuery .= "?,";
    $insertAnswersFormat .= "s";
  }
  $insertAnswersQuery .= "?)";

  // Add post.php to contest folder
  $post = new JBoFile("post.php");
  $postFile = fopen($folderToBeUploaded."/".$post->name, "w+");
  // Replace placeholders with correct variables
  $postContent = replacePlaceholders($post->content);
  fwrite($postFile, $postContent);
  fclose($postFile);
  $zip->addFile($folderToBeUploaded."/".$post->name, $language."/".$contestName."/".$post->name);
}



$zip->close();

$response->zipFile = "$zipname";
  // header('Content-Type: application/zip');
  // header("Content-Disposition: attachment; filename='$zipname'");
  // header('Content-Length: ' . filesize($zipname));
  // header("Location: $zipname");

echo json_encode($response);

?>