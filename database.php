<?php

$servername = "sql309.infinityfree.com";
$username = "if0_36756872";
$password = "SOT6cdxaEKvvCRL";
$dbname = "if0_36756872_weather01_db";

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Read the raw POST data
$rawData = file_get_contents("php://input");

// Decode JSON data
$data = json_decode($rawData);

// Check for JSON errors
if (json_last_error() !== JSON_ERROR_NONE) {
    echo "Error: Invalid JSON data. " . json_last_error_msg() . "<br>";
    exit;
}

// Validate JSON data
if ($data === null) {
    echo "Error: Invalid JSON data";
    exit;
}

// Sanitize user input
$city = isset($data->city) ? $conn->real_escape_string($data->city) : '';
$temperature = isset($data->data->main->temp) ? $data->data->main->temp : 0.0;
$humidity = isset($data->data->main->humidity) ? $data->data->main->humidity : 0;
$pressure = isset($data->data->main->pressure) ? $data->data->main->pressure : 0;
$wind = isset($data->data->wind->speed) ? $data->data->wind->speed : 0.0;
$description = isset($data->data->weather[0]->description) ? $conn->real_escape_string($data->data->weather[0]->description) : '';

// Check for missing required fields
if ($city === '') {
    echo "Error: City data not provided";
    exit;
}

// Check if data for the same city exists on the current date
$sql = "SELECT * FROM weather_bhuwanbaniya WHERE city = '$city' AND DATE(date) = CURDATE()";
$result = $conn->query($sql);

if ($result === false) {
    echo "Error: " . $conn->error . "<br>";
    exit;
}

if ($result->num_rows > 0) {
    echo "Data for the same city already exists today";
} else {
    // Insert the data into the database
    $insertSql = "INSERT INTO weather_bhuwanbaniya (city, date, temperature, humidity, pressure, wind, description)
                VALUES ('$city', NOW(), '$temperature', '$humidity', '$pressure', '$wind', '$description')";

    if ($conn->query($insertSql) === TRUE) {
        echo "Data saved successfully";
    } else {
        echo "Error: Unable to save data: " . $conn->error;
    }
}

// Close the database connection
$conn->close();

?>
