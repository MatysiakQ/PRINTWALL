<?php
header('Content-Type: text/plain; charset=utf-8');

// Załaduj autoloader Composer
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Dane do połączenia z bazą danych – UZUPEŁNIJ SWOJE DANE!
$host     = 'localhost';           // Zazwyczaj 'localhost'
$dbname   = 'twoja_baza';          // Nazwa Twojej bazy danych
$username = 'twoj_uzytkownik';    // Twój użytkownik bazy danych
$password = 'twoje_haslo';        // Twoje hasło do bazy danych

// Połączenie z bazą danych
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Błąd połączenia z bazą danych: " . $e->getMessage());
}

// Sprawdzenie, czy formularz został wysłany
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Pobranie i oczyszczenie danych z formularza
    $name    = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email   = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone   = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Walidacja pól
    if (empty($name) || empty($email) || empty($phone) || empty($message)) {
        die("Wszystkie pola są wymagane.");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Podano nieprawidłowy adres email.");
    }

    // Zapis do bazy danych
    try {
        $sql  = "INSERT INTO orders (name, email, phone, message) VALUES (:name, :email, :phone, :message)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name'    => $name,
            ':email'   => $email,
            ':phone'   => $phone,
            ':message' => $message
        ]);
    } catch (PDOException $e) {
        die("Błąd zapisu do bazy danych: " . $e->getMessage());
    }

    // Wysyłka emaila za pomocą PHPMailera
    $mail = new PHPMailer(true);
    try {
        // Konfiguracja SMTP – UZUPEŁNIJ SWOJE DANE!
        $mail->isSMTP();
        $mail->Host       = 'smtp.example.com';        // Adres serwera SMTP (np. smtp.gmail.com dla Gmaila)
        $mail->SMTPAuth   = true;
        $mail->Username   = 'twoj_email@example.com';  // Twój email SMTP
        $mail->Password   = 'twoje_haslo';            // Twoje hasło SMTP (lub hasło aplikacji dla Gmaila)
        $mail->SMTPSecure = 'tls';                    // 'tls' lub 'ssl'
        $mail->Port       = 587;                      // Port SMTP (587 dla TLS, 465 dla SSL)

        // Ustawienia nadawcy i odbiorcy
        $mail->setFrom('no-reply@twojadomena.com', 'Formularz Kontaktowy');
        $mail->addAddress('PrinWall@gmail.com');      // Twój email, na który mają przychodzić wiadomości
        $mail->addReplyTo($email, $name);             // Odpowiedź będzie kierowana na email użytkownika

        // Treść emaila
        $mail->isHTML(false);                         // Format tekstowy
        $mail->Subject = 'Nowa wiadomość z formularza kontaktowego';
        $mail->Body    = "Imię i nazwisko: $name\nEmail: $email\nTelefon: $phone\nWiadomość: $message\n";

        $mail->send();
        echo "OK"; // Sukces – wyświetli się modal w JS
    } catch (Exception $e) {
        echo "Błąd: Nie udało się wysłać emaila. Szczegóły: {$mail->ErrorInfo}";
    }
}
?>
