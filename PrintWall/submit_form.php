<?php
header('Content-Type: text/plain; charset=utf-8');

// Załaduj autoloader Composer
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$host     = 'localhost';
$dbname   = 'twoja_baza';
$username = 'twoj_uzytkownik';
$password = 'twoje_haslo';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Błąd połączenia: " . $e->getMessage());
}

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

    // Wstawianie danych do bazy
    try {
        $sql  = "INSERT INTO orders (name, email, phone, message) VALUES (:name, :email, :phone, :message)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name' => htmlspecialchars($name),
            ':email' => htmlspecialchars($email),
            ':phone' => htmlspecialchars($phone),
            ':message' => htmlspecialchars($message)
        ]);
    } catch (PDOException $e) {
        die("Błąd zapisu do bazy: " . $e->getMessage());
    }

    // Wysyłka wiadomości email przy użyciu PHPMailer
    $mail = new PHPMailer(true);
    try {
        // Konfiguracja SMTP – uzupełnij danymi Twojego serwera SMTP
        $mail->isSMTP();
        $mail->Host       = 'smtp.yourdomain.com'; // adres serwera SMTP
        $mail->SMTPAuth   = true;
        $mail->Username   = 'smtp_username';       // nazwa użytkownika SMTP
        $mail->Password   = 'smtp_password';       // hasło SMTP
        $mail->SMTPSecure = 'tls';                 // lub 'ssl'
        $mail->Port       = 587;                   // lub 465, w zależności od konfiguracji

        // Ustawienia nadawcy i odbiorcy
        $mail->setFrom('no-reply@yourdomain.com', 'KLIENT');
        $mail->addAddress('PrinWall@gmail.com'); // Twój adres, na który mają trafiać wiadomości
        $mail->addReplyTo($email, $name);

        // Treść maila
        $mail->isHTML(false);
        $mail->Subject = 'Nowa wiadomość z formularza kontaktowego';
        $mail->Body    = "Imię i nazwisko: $name\nEmail: $email\nTelefon: $phone\nWiadomość: $message\n";

        $mail->send();
        echo "OK"; // Jeśli wszystko się udało – modal się pojawi
    } catch (Exception $e) {
        echo "Błąd: Nie udało się wysłać maila. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>
