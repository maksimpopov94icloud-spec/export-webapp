let tg = window.Telegram.WebApp;
tg.expand();

let currentPage = 'menu';
let surveyAnswers = {};
let currentQuestionIndex = 0;

// Вопросы опроса
const surveyQuestions = [
    {
        id: 'q1',
        text: 'Как часто вы сталкиваетесь с проблемами при экспорте?',
        type: 'single',
        options: ['Часто', 'Иногда', 'Редко', 'Никогда']
    },
    {
        id: 'q2',
        text: 'Какие основные трудности вы испытываете? (можно выбрать несколько)',
        type: 'multiple',
        options: ['Логистика', 'Сертификация', 'Поиск партнёров', 'Финансы/кредиты', 'Таможенное оформление', 'Юридические вопросы']
    },
    {
        id: 'q3',
        text: 'Оцените удобство текущих мер поддержки экспорта (от 1 до 5)',
        type: 'rating',
        options: ['1', '2', '3', '4', '5']
    },
    {
        id: 'q4',
        text: 'Чего не хватает в системе поддержки экспортёров? (открытый ответ)',
        type: 'text'
    },
    {
        id: 'q5',
        text: 'Какой формат помощи для вас наиболее полезен?',
        type: 'single',
        options: ['Консультации', 'Финансовая поддержка', 'Обучение', 'Поиск партнёров', 'Помощь с документами']
    }
];

// Главное меню
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

// Навигация
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

// --- Раздел новостей (обновлённый с резервными источниками) ---
function renderNewsPage() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <div class="page">
            <button class="back-btn" onclick="renderMainMenu()">← Назад</button>
            <h2>📰 Лента новостей</h2>
            <button class="source-btn" onclick="loadNews('exportcenter')">🇷🇺 Российский экспортный центр</button>
            <button class="source-btn" onclick="loadNews('myexport')">🌐 Платформа «Мой экспорт»</button>
            <button class="source-btn" onclick="loadNews('nn')">🏛 Правительство Нижегородской области</button>
            <button class="source-btn" onclick="loadNews('telegram')">📢 Новости российского экспорта (Telegram)</button>
            <div id="news-list"></div>
        </div>
    `;
    currentPage = 'news';
}

async function loadNews(source) {
    const newsDiv = document.getElementById('news-list');
    newsDiv.innerHTML = '⏳ Загрузка...';

    let urls = [];
    let displayFunc = null;

    if (source === 'exportcenter') {
        urls = ['https://api.rss2json.com/v1/api.json?rss_url=https://www.exportcenter.ru/press_center/rss/'];
        displayFunc = displayNews;
    } else if (source === 'myexport') {
        urls = ['https://api.rss2json.com/v1/api.json?rss_url=https://myexport.exportcenter.ru/press_center/rss/'];
        displayFunc = displayNews;
    } else if (source === 'nn') {
        // Демо-новости (можно заменить на реальный парсинг)
        const demoNews = [
            { title: "Нижегородские экспортеры заработали на маркетплейсах более 85 млн рублей", link: "https://nn-news.net/society/2025/11/21/810959.html", description: "72 компании получили поддержку Центра поддержки экспорта." },
            { title: "Региональный центр поддержки экспорта помогает бизнесу выходить на зарубежные рынки", link: "https://мойбизнес52.рф/", description: "Услуги по сертификации, поиску партнеров и логистике." }
        ];
        displayNews(demoNews);
        return;
    } else if (source === 'telegram') {
        // Несколько источников для Telegram-канала
        urls = [
            'https://rsshub.app/telegram/channel/rusexportnews.json',
            'https://tg.i-c-a.su/json/rusexportnews',
            // Добавьте другие, если знаете
        ];
        displayFunc = displayTelegramNews;
    }

    let success = false;
    for (const url of urls) {
        try {
            const response = await fetch(url);
            if (!response.ok) continue;
            const data = await response.json();
            if (data && (data.items || data.length > 0)) {
                displayFunc(data);
                success = true;
                break;
            }
        } catch (e) {
            console.warn(`Ошибка загрузки из ${url}:`, e);
            continue;
        }
    }

    if (!success) {
        newsDiv.innerHTML = `
            <p>😔 Не удалось загрузить новости. Попробуйте позже или перейдите в канал напрямую:</p>
            <a href="https://t.me/rusexportnews" target="_blank" class="send-btn">📢 Перейти в канал</a>
        `;
    }
}

function displayTelegramNews(data) {
    const newsDiv = document.getElementById('news-list');
    let items = [];
    
    // Определяем формат данных
    if (data.items) {
        // Формат RSSHub
        items = data.items;
    } else if (Array.isArray(data)) {
        // Формат tg.i-c-a.su
        items = data;
    } else {
        newsDiv.innerHTML = 'Неизвестный формат данных.';
        return;
    }

    let html = '';
    items.slice(0, 15).forEach(item => {
        let title = item.title || 'Новость';
        let description = item.description || item.message || item.text || '';
        let link = item.link || item.original_url || `https://t.me/rusexportnews/${item.id || ''}`;
        let date = item.pubDate || item.date || item.created_at || '';
        
        description = description.replace(/<[^>]+>/g, '').substring(0, 200);
        if (description.length >= 200) description += '...';
        
        html += `
            <div class="news-item">
                <a href="${link}" target="_blank">${title}</a>
                <p>${description}</p>
                <small>${new Date(date).toLocaleDateString('ru-RU')}</small>
            </div>
        `;
    });
    newsDiv.innerHTML = html;
}

// --- База знаний (заглушка) ---
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
    resultsDiv.innerHTML = '🔍 Результаты поиска (заглушка). В разработке.';
}

// --- Каталог (заглушка) ---
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

// --- Логистика (заглушка) ---
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

// --- Страхование (заглушка) ---
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

// --- ОБРАТНАЯ СВЯЗЬ (обновлено) ---
function renderFeedbackPage() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <div class="page">
            <button class="back-btn" onclick="renderMainMenu()">← Назад</button>
            <h2>💬 Обратная связь</h2>
            <button class="menu-btn full-width" onclick="renderSurveyMenu()">📝 Пройти опрос</button>
            <button class="menu-btn full-width" onclick="renderAdminContact()">📞 Связаться с администратором</button>
        </div>
    `;
    currentPage = 'feedback';
}

function renderSurveyMenu() {
    surveyAnswers = {};
    currentQuestionIndex = 0;
    renderQuestion();
}

function renderQuestion() {
    if (currentQuestionIndex >= surveyQuestions.length) {
        submitSurvey();
        return;
    }
    const q = surveyQuestions[currentQuestionIndex];
    let optionsHtml = '';
    if (q.type === 'text') {
        optionsHtml = `
            <textarea class="feedback-textarea" id="survey-text" placeholder="Введите ответ..."></textarea>
            <button class="send-btn" onclick="nextQuestion()">Далее</button>
        `;
    } else if (q.type === 'rating' || q.type === 'single') {
        optionsHtml = q.options.map(opt => 
            `<button class="source-btn" onclick="answerSingle('${q.id}', '${opt}')">${opt}</button>`
        ).join('');
    } else if (q.type === 'multiple') {
        optionsHtml = q.options.map(opt => 
            `<label style="display:block; margin:5px 0;">
                <input type="checkbox" value="${opt}" onchange="toggleMultiple('${q.id}', '${opt}', this.checked)"> ${opt}
            </label>`
        ).join('');
        optionsHtml += `<button class="send-btn" onclick="nextQuestion()">Далее</button>`;
    }

    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <div class="page">
            <button class="back-btn" onclick="renderFeedbackPage()">← Назад</button>
            <h3>Вопрос ${currentQuestionIndex+1} из ${surveyQuestions.length}</h3>
            <p>${q.text}</p>
            <div id="question-options">${optionsHtml}</div>
        </div>
    `;
    currentPage = 'survey';
}

function answerSingle(qId, value) {
    surveyAnswers[qId] = value;
    nextQuestion();
}

function toggleMultiple(qId, value, checked) {
    if (!surveyAnswers[qId]) surveyAnswers[qId] = [];
    if (checked) {
        surveyAnswers[qId].push(value);
    } else {
        surveyAnswers[qId] = surveyAnswers[qId].filter(v => v !== value);
    }
}

function nextQuestion() {
    const q = surveyQuestions[currentQuestionIndex];
    if (q.type === 'text') {
        const text = document.getElementById('survey-text')?.value;
        if (!text) {
            tg.showAlert('Пожалуйста, введите ответ.');
            return;
        }
        surveyAnswers[q.id] = text;
    } else if (q.type === 'multiple') {
        if (!surveyAnswers[q.id] || surveyAnswers[q.id].length === 0) {
            tg.showAlert('Выберите хотя бы один вариант.');
            return;
        }
    }
    currentQuestionIndex++;
    renderQuestion();
}

function submitSurvey() {
    tg.sendData(JSON.stringify({
        action: 'survey',
        answers: surveyAnswers
    }));
    tg.showAlert('✅ Спасибо за участие в опросе!');
    renderFeedbackPage();
}

function renderAdminContact() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <div class="page">
            <button class="back-btn" onclick="renderFeedbackPage()">← Назад</button>
            <h2>📞 Связь с администратором</h2>
            <textarea class="feedback-textarea" id="admin-message" placeholder="Напишите ваше сообщение..."></textarea>
            <button class="send-btn" onclick="sendAdminMessage()">Отправить</button>
        </div>
    `;
    currentPage = 'adminContact';
}

function sendAdminMessage() {
    const message = document.getElementById('admin-message').value;
    if (!message) {
        tg.showAlert('Введите сообщение.');
        return;
    }
    tg.sendData(JSON.stringify({
        action: 'feedback',
        message: message
    }));
    tg.showAlert('✅ Сообщение отправлено администратору.');
    renderFeedbackPage();
}

// --- Кнопка "Назад" ---
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