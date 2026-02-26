let tg = window.Telegram.WebApp;
tg.expand();

// Загрузка курсов валют
async function loadCurrencyRates() {
    try {
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        const data = await response.json();
        document.getElementById('usd-rate').textContent = data.Valute.USD.Value.toFixed(2) + ' ₽';
        document.getElementById('eur-rate').textContent = data.Valute.EUR.Value.toFixed(2) + ' ₽';
        document.getElementById('cny-rate').textContent = data.Valute.CNY.Value.toFixed(2) + ' ₽';
        const updateDate = new Date(data.Date);
        document.getElementById('update-time').textContent = 
            `Обновлено: ${updateDate.toLocaleDateString('ru-RU')} ${updateDate.toLocaleTimeString('ru-RU')}`;
    } catch (error) {
        console.error('Ошибка загрузки курсов:', error);
        document.getElementById('usd-rate').textContent = 'ошибка';
        document.getElementById('eur-rate').textContent = 'ошибка';
        document.getElementById('cny-rate').textContent = 'ошибка';
    }
}

// Функция для обновления счётчиков (пока случайные числа)
function updateBadges() {
    // Здесь будет запрос к серверу для получения реальных данных
    // Пока имитация
    const badges = ['badge-chat', 'badge-news', 'badge-knowledge', 'badge-catalog', 'badge-logistics', 'badge-insurance'];
    badges.forEach(id => {
        const badge = document.getElementById(id);
        if (badge) {
            const randomNum = Math.floor(Math.random() * 10) + 1; // от 1 до 10
            badge.textContent = randomNum;
        }
    });
}

// Загружаем курсы и счётчики при открытии
loadCurrencyRates();
updateBadges();

// Обработка нажатий на кнопки меню
document.querySelectorAll('.menu-btn').forEach(button => {
    button.addEventListener('click', () => {
        const section = button.getAttribute('data-section');
        if (section === 'ai') {
            // Открываем бота-ассистента (замените username)
            tg.openTelegramLink('https://t.me/@Export_assistant_bot');
        } else if (section === 'feedback') {
            // Открываем бота для обратной связи (ваш survey_bot)
            tg.openTelegramLink('https://t.me/@exportNO_bot');
        } else {
            tg.showAlert(`Раздел "${button.textContent}" будет доступен в ближайшее время`);
        }
    });
});

// Кнопка "Назад" — закрыть WebApp
document.getElementById('back-btn').addEventListener('click', () => {
    tg.close();
});

tg.ready();