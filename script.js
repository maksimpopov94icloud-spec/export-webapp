let tg = window.Telegram.WebApp;
tg.expand();

// Состояние приложения
let currentPage = 'menu';

// Основная функция рендеринга
function renderMainMenu() {
    document.getElementById('app').innerHTML = `
        <div class="menu-grid">
            <button class="menu-btn" onclick="navigateTo('chat')">👥 Чат экспортёров</button>
            <button class="menu-btn" onclick="navigateTo('news')">📰 Лента новостей</button>
            <button class="menu-btn" onclick="navigateTo('knowledge')">📚 База знаний</button>
            <button class="menu-btn" onclick="navigateTo('catalog')">📦 Каталог продукции</button>
            <button class="menu-btn" onclick="navigateTo('logistics')">🚚 Логистика</button>
            <button class="menu-btn" onclick="navigateTo('insurance')">🛡️ Страхование</button>
            <button class="menu-btn" onclick="navigateTo('feedback')">💬 Обратная связь</button>
            <button class="menu-btn" onclick="navigateTo('ai')">🤖 Экспортный ассистент</button>
        </div>
    `;
    currentPage = 'menu';
}

// Навигация по разделам
function navigateTo(page) {
    switch(page) {
        case 'chat':
            tg.openTelegramLink('https://t.me/export_chat_nn'); // ⚠️ замените на ссылку вашего чата
            break;
        case 'news':
            renderNewsPage();
            break;
        case 'knowledge':
            renderKnowledgePage();
            break;
        case 'catalog':
            renderCatalogPage();
            break;
        case 'logistics':
            renderLogisticsPage();
            break;
        case 'insurance':
            renderInsurancePage();
            break;
        case 'feedback':
            renderFeedbackPage();
            break;
        case 'ai':
            renderAIPage();
            break;
        default:
            renderMainMenu();
    }
}

// --- Раздел новостей ---
function renderNewsPage() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <div class="page">
            <button class="back-btn" onclick="renderMainMenu()">← Назад</button>
            <h2>📰 Лента новостей</h2>
            <button class="source-btn" onclick="loadNews('exportcenter')">🇷🇺 Российский экспортный центр</button>
            <button class="source-btn" onclick="loadNews('myexport')">🌐 Платформа «Мой экспорт»</button>
            <button class="source-btn" onclick="loadNews('nn')">🏛 Правительство Нижегородской области</button>
            <div id="news-list"></div>
        </div>
    `;
    currentPage = 'news';
}

async function loadNews(source) {
    const newsDiv = document.getElementById('news-list');
    newsDiv.innerHTML = '⏳ Загрузка...';

    let url;
    if (source === 'exportcenter') {
        url = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.exportcenter.ru/press_center/rss/';
    } else if (source === 'myexport') {
        url = 'https://api.rss2json.com/v1/api.json?rss_url=https://myexport.exportcenter.ru/press_center/rss/';
    } else if (source === 'nn') {
        // Демо-новости (можно заменить на реальный парсинг)
        const demoNews = [
            { title: "Нижегородские экспортеры заработали на маркетплейсах более 85 млн рублей", link: "https://nn-news.net/society/2025/11/21/810959.html", description: "72 компании получили поддержку Центра поддержки экспорта." },
            { title: "Региональный центр поддержки экспорта помогает бизнесу выходить на зарубежные рынки", link: "https://мойбизнес52.рф/", description: "Услуги по сертификации, поиску партнеров и логистике." }
        ];
        displayNews(demoNews);
        return;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'ok') {
            displayNews(data.items);
        } else {
            newsDiv.innerHTML = 'Не удалось загрузить новости.';
        }
    } catch (e) {
        newsDiv.innerHTML = 'Ошибка загрузки. Проверьте интернет-соединение.';
    }
}

function displayNews(items) {
    const newsDiv = document.getElementById('news-list');
    let html = '';
    items.slice(0, 10).forEach(item => {
        html += `
            <div class="news-item">
                <a href="${item.link}" target="_blank">${item.title}</a>
                <p>${item.description ? item.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : ''}</p>
            </div>
        `;
    });
    newsDiv.innerHTML = html;
}

// --- Раздел базы знаний (заглушка) ---
function renderKnowledgePage() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <div class="page">
            <button class="back-btn" onclick="renderMainMenu()">← Назад</button>
            <h2>📚 База знаний</h2>
            <input class="search-input" type="text" id="search-input" placeholder="Поиск...">
            <button class="send-btn" onclick="searchKnowledge()">Найти</button>
            <div id="knowledge-results"></div>
        </div>
    `;
    currentPage = 'knowledge';
}

function searchKnowledge() {
    const query = document.getElementById('search-input').value;
    const resultsDiv = document.getElementById('knowledge-results');
    if (!query) {
        resultsDiv.innerHTML = 'Введите запрос.';
        return;
    }
    // Заглушка (можно заменить на реальный поиск по JSON)
    resultsDiv.innerHTML = '🔍 Результаты поиска (заглушка). В разработке.';
}

// --- Разделы-заглушки ---
function renderCatalogPage() {
    document.getElementById('app').innerHTML = `
        <div class="page">
            <button class="back-btn" onclick="renderMainMenu()">← Назад</button>
            <h2>📦 Каталог продукции</h2>
            <p>Раздел в разработке. Скоро здесь появится каталог товаров экспортёров.</p>
        </div>
    `;
    currentPage = 'catalog';
}

function renderLogisticsPage() {
    document.getElementById('app').innerHTML = `
        <div class="page">
            <button class="back-btn" onclick="renderMainMenu()">← Назад</button>
            <h2>🚚 Логистика</h2>
            <p>Раздел в разработке. Здесь будут услуги логистических компаний и калькулятор.</p>
        </div>
    `;
    currentPage = 'logistics';
}

function renderInsurancePage() {
    document.getElementById('app').innerHTML = `
        <div class="page">
            <button class="back-btn" onclick="renderMainMenu()">← Назад</button>
            <h2>🛡️ Страхование</h2>
            <p>Раздел в разработке. Здесь будут услуги страховых компаний.</p>
        </div>
    `;
    currentPage = 'insurance';
}

// --- Обратная связь ---
function renderFeedbackPage() {
    document.getElementById('app').innerHTML = `
        <div class="page">
            <button class="back-btn" onclick="renderMainMenu()">← Назад</button>
            <h2>💬 Обратная связь</h2>
            <textarea class="feedback-textarea" id="feedback-message" placeholder="Напишите ваше сообщение..."></textarea>
            <button class="send-btn" onclick="sendFeedback()">Отправить</button>
        </div>
    `;
    currentPage = 'feedback';
}

function sendFeedback() {
    const message = document.getElementById('feedback-message').value;
    if (!message) {
        tg.showAlert('Введите сообщение.');
        return;
    }
    tg.sendData(JSON.stringify({
        action: 'feedback',
        message: message
    }));
    tg.showAlert('✅ Сообщение отправлено администратору.');
    renderMainMenu();
}

// --- AI-ассистент ---
function renderAIPage() {
    document.getElementById('app').innerHTML = `
        <div class="page">
            <button class="back-btn" onclick="renderMainMenu()">← Назад</button>
            <h2>🤖 Экспортный ассистент</h2>
            <p>Задайте вопрос, и я отвечу в чате.</p>
            <textarea class="feedback-textarea" id="ai-message" placeholder="Ваш вопрос..."></textarea>
            <button class="send-btn" onclick="askAI()">Отправить</button>
        </div>
    `;
    currentPage = 'ai';
}

function askAI() {
    const message = document.getElementById('ai-message').value;
    if (!message) {
        tg.showAlert('Введите вопрос.');
        return;
    }
    tg.sendData(JSON.stringify({
        action: 'ai_query',
        message: message
    }));
    tg.showAlert('⏳ Запрос отправлен. Ожидайте ответ в чате.');
    renderMainMenu();
}

// --- Обработка кнопки "Назад" ---
document.getElementById('back-btn').addEventListener('click', () => {
    if (currentPage === 'menu') {
        tg.close();
    } else {
        renderMainMenu();
    }
});

// Инициализация
renderMainMenu();
tg.ready();