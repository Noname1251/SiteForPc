<?php
header('Content-Type: text/html; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "markinsideinfo@mail.ru";
    $subject = "Новая заявка на помощь в сборке ПК с сайта MARKINSIDE";

    // Собираем данные из формы
    $data = [
        'Имя' => $_POST['name'] ?? '',
        'Email' => $_POST['email'] ?? '',
        'Телефон' => $_POST['phone'] ?? '',
        'Назначение ПК' => $_POST['purpose'] ?? '',
        'Бюджет' => $_POST['budget'] ?? '0 ₽',
        'Имеющиеся комплектующие' => $_POST['components'] ?? 'Нет',
        'Предпочтения и требования' => $_POST['preferences'] ?? 'Не указаны'
    ];

    // Формируем тело письма
    $body = "Детали заявки:\n\n";
    foreach ($data as $key => $value) {
        $body .= "$key: $value\n";
    }
    $body .= "\nДата отправки: " . date('d.m.Y H:i:s');

    $headers = "From: " . ($data['Email'] ?: "noreply@markinside.ru") . "\r\n";
    $headers .= "Reply-To: " . $data['Email'] . "\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";

    // Отправка письма
    if (mail($to, $subject, $body, $headers)) {
        echo '<script>alert("Спасибо! Ваша заявка отправлена. Наш специалист свяжется с вами в ближайшее время."); window.location.href = "helpwithcreating.html";</script>';
    } else {
        echo '<script>alert("Ошибка отправки. Пожалуйста, попробуйте позже или свяжитесь с нами другим способом."); window.history.back();</script>';
    }
} else {
    header("Location: helpwithcreating.html");
}
?>