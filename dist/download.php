<?php
$file = $_GET['file'];
$type = $_GET['type'];
$filename = $_GET['filename'];
header('Content-disposition: attachment; filename='.$filename);
header('Content-type: '.$type);
readfile($file);
?>