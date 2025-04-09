<?php
header('Content-Type: text/plain; charset=utf-8');

// Załaduj autoloader Composera
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Załaduj dane z pliku .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Dane do połączenia z bazą danych z pliku .env
$host     = $_ENV['DB_HOST'];
$dbname   = $_ENV['DB_NAME'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];

// Połączenie z bazą danych
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Błąd połączenia z bazą danych: " . $e->getMessage());
}

// Sprawdzenie formularza
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name    = trim($_POST['name'] ?? '');
    $email   = trim($_POST['email'] ?? '');
    $phone   = trim($_POST['phone'] ?? '');
    $message = trim($_POST['message'] ?? '');

    // Walidacja
    if (empty($name) || empty($email) || empty($phone) || empty($message)) {
        die("Wszystkie pola są wymagane.");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Nieprawidłowy email.");
    }

    // Zapis do bazy
    try {
        $sql  = "INSERT INTO orders (name, email, phone, message) VALUES (:name, :email, :phone, :message)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':name' => $name, ':email' => $email, ':phone' => $phone, ':message' => $message]);
    } catch (PDOException $e) {
        die("Błąd zapisu do bazy: " . $e->getMessage());
    }

    // Wysyłka maila
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $_ENV['SMTP_HOST'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['SMTP_USER'];
        $mail->Password   = $_ENV['SMTP_PASS'];
        $mail->SMTPSecure = 'tls';
        $mail->Port       = $_ENV['SMTP_PORT'];

        $mail->setFrom($_ENV['SMTP_FROM'], 'Formularz Kontaktowy');
        $mail->addAddress($_ENV['SMTP_TO']);
        $mail->addReplyTo($email, $name);

        $mail->isHTML(false);
        $mail->Subject = 'Nowa wiadomość z formularza kontaktowego';
        $mail->Body    = "Imię i nazwisko: $name\nEmail: $email\nTelefon: $phone\nWiadomość: $message\n";

        $mail->send();
        echo "Dziękujemy za kontakt. Twoja wiadomość została wysłana!";
    } catch (Exception $e) {
        echo "Błąd wysyłki maila: {$mail->ErrorInfo}";
    }
}

// Pobranie wszystkich zamówień z bazy
try {
    $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Wyświetlanie zamówień
    if ($orders) {
        echo "Zamówienia:\n";
        foreach ($orders as $order) {
            echo "ID: " . $order['id'] . "\n";
            echo "Imię i nazwisko: " . $order['name'] . "\n";
            echo "Email: " . $order['email'] . "\n";
            echo "Telefon: " . $order['phone'] . "\n";
            echo "Wiadomość: " . $order['message'] . "\n";
            echo "Data: " . $order['created_at'] . "\n";
            echo "--------------------------\n";
        }
    } else {
        echo "Brak zamówień w bazie.";
    }
} catch (PDOException $e) {
    echo "Błąd pobierania zamówień: " . $e->getMessage();
}
  ini_set('display_errors', 1);
  error_reporting(E_ALL);

  // Przykładowa obsługa danych
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // Sprawdź czy wszystkie wymagane pola są przesłane
      if (!empty($_POST['name']) && !empty($_POST['email']) && !empty($_POST['phone']) && !empty($_POST['message'])) {
          // Tutaj możesz próbować połączyć się z bazą danych i wykonać zapytanie
          // Przykładowo:
          $mysqli = new mysqli("localhost", "użytkownik", "hasło", "baza_danych");
          if ($mysqli->connect_error) {
              die("Błąd połączenia: " . $mysqli->connect_error);
          }

          // Przykładowe zapytanie (upewnij się, że dane są zabezpieczone przed SQL Injection)
          $name = $mysqli->real_escape_string($_POST['name']);
          $email = $mysqli->real_escape_string($_POST['email']);
          $phone = $mysqli->real_escape_string($_POST['phone']);
          $message = $mysqli->real_escape_string($_POST['message']);

          $query = "INSERT INTO formularz (name, email, phone, message) VALUES ('$name', '$email', '$phone', '$message')";
          if ($mysqli->query($query)) {
              echo "OK";
          } else {
              echo "Błąd zapytania: " . $mysqli->error;
          }
          $mysqli->close();
      } else {
          echo "Brak wymaganych danych.";
      }
  } else {
      echo "Nieprawidłowa metoda żądania.";
  }


?>
