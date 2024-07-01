<?php

$servername = "sql309.infinityfree.com";
$username = "if0_36756872"; // MySQL username
$password = "SOT6cdxaEKvvCRL"; // MySQL password
$dbname = "if0_36756872_weather01_db"; // Database name

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the city parameter from the URL
$city = $conn->real_escape_string($_GET['city']);

// Get the current date
$currentDate = new DateTime();

// Loop through the past 6 days
for ($i = 0; $i < 6; $i++) {
    $date = $currentDate->format('Y-m-d');
    
    // SQL query to fetch data for the specific date
    $sql = "SELECT * FROM weather_bhuwanbaniya WHERE city='$city' AND DATE(date)='$date' LIMIT 1";
    $result = $conn->query($sql);
    
    echo "<div class='past-weather-box'>
            <div class='past-weather-content'>
                <h2>Past Weather Data for: <br/> $city on <br>" . date('Y-m-d', strtotime($date)) . "</h2>";
    
    if ($result->num_rows > 0) {
        // Output the data
        while ($row = $result->fetch_assoc()) {
            echo "<p>Date: " . $row['date'] . "</p>";
            echo "<p>Temperature: " . $row['temperature'] . "°C</p>";
            echo "<p>Humidity: " . $row['humidity'] . "%</p>";
            echo "<p>Pressure: " . $row['pressure'] . " Pa</p>";
            echo "<p>Wind: " . $row['wind'] . " m/s</p>";
            echo "<p>Description: " . $row['description'] . "</p>";
        }
    } else {
        echo "<p>Date: " . $date . "</p>";
        echo "<p>Temperature: N/A</p>";
        echo "<p>Humidity: N/A</p>";
        echo "<p>Pressure: N/A</p>";
        echo "<p>Wind: N/A</p>";
        echo "<p>Description: N/A</p>";
    }
    
    echo "</div></div>";
    
    // Subtract one day for the next iteration
    $currentDate->modify('-1 day');
}

// Close connection
$conn->close();

?>
