<?php
$dbPath = __DIR__."/contests/db.php"; 
require_once($dbPath);

$filename = $_GET["filename"];
$tableName = $_GET["tableName"];
$columns = json_decode($_GET["columns"]);

function decode($member) {
  return mb_convert_encoding($member, 'UTF-16LE', 'UTF-8');
}
// Create .csv file
$file = fopen($filename,"w+");
// Write to .csv file
$decodedColumns = array_map("decode", $columns);
fputcsv($file, $columns, ';');
// Get all contestants
$queryAll = "SELECT * FROM $tableName";
$result = $conn->query($queryAll);
if ($result->num_rows > 0) {
  // print data of each row
  $nrOfContestants = $result->num_rows;
  while($row = $result->fetch_assoc()) {
    $cells = array();
    for ($column = 0; $column < count($columns); $column++) { 
      array_push($cells, $row[$columns[$column]]);
    }
    $decodedCells = array_map("decode", $cells);
    fputcsv($file, $decodedCells, ';');
  }
}
// Close file
fclose($file);
// Download file
header('Content-Description: File Transfer');
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="'.basename($filename).'.csv"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: '.filesize($filename));
readfile($filename);
?>