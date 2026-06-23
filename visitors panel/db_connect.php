<?php

$conn = mysqli_connect(
    "sql104.infinityfree.com",
    "if0_42249819",
    "Rcalipay1987",
    "if0_42249819_cemetery_locator"
);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

?>