<?php
// submit_form.php

// Ustawienia połączenia z bazą danych – dostosuj poniższe dane do swojej konfiguracji
$host = 'localhost';
$db   = 'your_database';
$user = 'your_username';
$pass = 'your_password';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die("Błąd połączenia z bazą danych: " . $e->getMessage());
}

// Sprawdzamy, czy formularz został przesłany metodą POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Pobieramy i filtrujemy dane
    $name    = trim($_POST['name'] ?? '');
    $phone   = trim($_POST['phone'] ?? '');
    $email   = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');
    $captcha = trim($_POST['captcha'] ?? '');

    // Prosta walidacja captcha
    if ($captcha !== '54723') {
        die('Błędny kod captcha.');
    }

    // Wstawiamy dane do bazy (upewnij się, że tabela "contacts" istnieje)
    $stmt = $pdo->prepare('INSERT INTO contacts (name, phone, email, message) VALUES (?, ?, ?, ?)');
    try {
        $stmt->execute([$name, $phone, $email, $message]);
        echo "Dziękujemy za kontakt. Twoja wiadomość została wysłana.";
    } catch (PDOException $e) {
        die("Wystąpił błąd podczas zapisywania danych: " . $e->getMessage());
    }
}
?>
