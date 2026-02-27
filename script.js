let tg = window.Telegram.WebApp;
tg.expand();

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

function updateBadges() {
    const badges = ['badge-chat', 'badge-news', 'badge-knowledge', 'badge-catalog', 'badge-logistics', 'badge-insurance'];
    badges.forEach(id => {
        const badge = document.getElementById(id);
        if (badge) {
            const randomNum = Math.floor(Math.random() * 10) + 1;
            badge.textContent = randomNum;
        }
    });
}

loadCurrencyRates();
updateBadges();

document.querySelectorAll('.menu-btn').forEach(button => {
    button.addEventListener('click', () => {
        const section = button.getAttribute('data-section');
        if (section === 'chat') {
            // Ссылка на чат экспортёров (замените на вашу)
            tg.openTelegramLink('https://t.me/export_chat_nn');
        } else if (section === 'ai') {
            tg.openTelegramLink('https://t.me/Export_assistant_bot');
        } else if (section === 'feedback') {
            tg.openTelegramLink('https://t.me/exportNO_bot');
        } else if (section === 'news') {
            // Ссылка на новостного бота
            tg.openTelegramLink('https://t.me/NewsEXPORT_bot');
        } else {
            tg.showAlert(`Раздел "${button.textContent}" будет доступен в ближайшее время`);
        }
    });
});

document.getElementById('back-btn').addEventListener('click', () => {
    tg.close();
});

tg.ready();