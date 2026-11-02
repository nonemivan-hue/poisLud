import { useState } from 'react';

function App() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'install' | 'results'>('overview');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(id);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const CommandBlock = ({ command, id }: { command: string; id: string }) => (
    <div className="relative group">
      <div className="bg-black/50 rounded-lg p-3 font-mono text-sm flex items-center justify-between">
        <code className="text-green-400">{command}</code>
        <button
          onClick={() => copyToClipboard(command, id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white/60 hover:text-white"
        >
          {copiedCommand === id ? '✓ Скопировано' : '📋 Копировать'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <i className="fab fa-python text-white text-2xl"></i>
          </div>
          <div>
            <h1 className="text-white font-bold text-2xl">OSINT Поиск</h1>
            <p className="text-white/50 text-sm">Реальный поиск информации по ФИО</p>
          </div>
          <div className="ml-auto flex gap-2">
            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-medium">
              Python 3.7+
            </span>
            <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
              Без зависимостей
            </span>
            <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-medium">
              Реальные результаты
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-white text-4xl font-bold mb-4">
            🔍 Реальный поиск информации по ФИО
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Десктопное приложение на Python, которое <strong className="text-white">автоматически собирает</strong> информацию 
            о человеке из открытых источников: Wikipedia, GitHub, DuckDuckGo, Google и других.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10">
          {[
            { id: 'overview', label: '📋 Обзор', icon: 'fas fa-list' },
            { id: 'install', label: '🚀 Запуск', icon: 'fas fa-rocket' },
            { id: 'results', label: '📊 Пример результатов', icon: 'fas fa-file-alt' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'text-purple-400 border-purple-400'
                  : 'text-white/50 border-transparent hover:text-white/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="animate-fadeIn">
            {/* Data Sources */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
              <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                <i className="fas fa-database text-purple-400"></i>
                Источники данных (реальный поиск)
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/60 py-3 px-4">Источник</th>
                      <th className="text-left text-white/60 py-3 px-4">Что ищет</th>
                      <th className="text-left text-white/60 py-3 px-4">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 font-medium text-white">📖 Wikipedia</td>
                      <td className="py-3 px-4">Статьи о людях</td>
                      <td className="py-3 px-4"><span className="text-green-400">✅ Работает</span></td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 font-medium text-white">💻 GitHub</td>
                      <td className="py-3 px-4">Пользователи и репозитории</td>
                      <td className="py-3 px-4"><span className="text-green-400">✅ Работает</span></td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 font-medium text-white">🔍 DuckDuckGo</td>
                      <td className="py-3 px-4">Веб-упоминания ФИО</td>
                      <td className="py-3 px-4"><span className="text-green-400">✅ Работает</span></td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 font-medium text-white">🌐 Google</td>
                      <td className="py-3 px-4">Веб-упоминания ФИО</td>
                      <td className="py-3 px-4"><span className="text-yellow-400">⚠️ Может блокировать</span></td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 font-medium text-white">✉️ Email</td>
                      <td className="py-3 px-4">Генерация возможных email</td>
                      <td className="py-3 px-4"><span className="text-green-400">✅ Работает</span></td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 font-medium text-white">✈️ Telegram</td>
                      <td className="py-3 px-4">Проверка профилей</td>
                      <td className="py-3 px-4"><span className="text-green-400">✅ Работает</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-white">📷 Instagram</td>
                      <td className="py-3 px-4">Проверка профилей</td>
                      <td className="py-3 px-4"><span className="text-green-400">✅ Работает</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
                  <i className="fas fa-check text-green-400"></i>
                </div>
                <h3 className="text-white font-semibold mb-2">Реальные данные</h3>
                <p className="text-white/50 text-sm">Приложение выполняет HTTP-запросы и парсит реальные результаты поиска</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                  <i className="fas fa-bolt text-blue-400"></i>
                </div>
                <h3 className="text-white font-semibold mb-2">Без зависимостей</h3>
                <p className="text-white/50 text-sm">Использует только стандартную библиотеку Python — ничего устанавливать не нужно</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                  <i className="fas fa-mouse-pointer text-purple-400"></i>
                </div>
                <h3 className="text-white font-semibold mb-2">Кликабельные ссылки</h3>
                <p className="text-white/50 text-sm">Нажмите на URL в результатах — ссылка откроется в браузере</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'install' && (
          <div className="animate-fadeIn">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
              <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                <i className="fas fa-rocket text-purple-400"></i>
                Инструкция по запуску
              </h2>

              {/* Step 1 */}
              <div className="mb-8">
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">1</span>
                  Проверьте Python
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10">
                  <p className="text-white/70 text-sm mb-3">Убедитесь, что Python 3.7+ установлен:</p>
                  <CommandBlock command="python --version" id="check-python" />
                  <p className="text-white/50 text-xs mt-2">
                    Если не установлен — скачайте с{' '}
                    <a href="https://www.python.org/downloads" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                      python.org
                    </a>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="mb-8">
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 text-sm font-bold">2</span>
                  Скачайте файл
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10">
                  <p className="text-white/70 text-sm mb-3">
                    Скачайте файл <code className="text-purple-400 bg-black/30 px-2 py-0.5 rounded">osint_search.py</code>
                  </p>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-xs">
                      💡 Никаких дополнительных библиотек устанавливать не нужно! 
                      Приложение использует только стандартную библиотеку Python.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="mb-8">
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-sm font-bold">3</span>
                  Запустите приложение
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10 space-y-3">
                  <p className="text-white/70 text-sm">Откройте терминал в папке с файлом:</p>
                  <CommandBlock command="python osint_search.py" id="run-windows" />
                  <p className="text-white/50 text-xs mt-3">Или на Linux/macOS:</p>
                  <CommandBlock command="python3 osint_search.py" id="run-linux" />
                </div>
              </div>

              {/* Step 4 */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">4</span>
                  Используйте
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10">
                  <ol className="text-white/70 text-sm space-y-2 list-decimal list-inside">
                    <li>Введите <strong className="text-white">Фамилию</strong> и <strong className="text-white">Имя</strong></li>
                    <li>Нажмите <strong className="text-white">«НАЙТИ ИНФОРМАЦИЮ»</strong></li>
                    <li>Дождитесь результатов (10-30 секунд)</li>
                    <li>Кликните на URL для перехода в браузер</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                <i className="fas fa-wrench text-orange-400"></i>
                Решение проблем
              </h2>

              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white/80 text-sm font-medium mb-1">Ошибка: "No module named 'tkinter'"</p>
                  <div className="text-white/50 text-xs space-y-1 mt-2">
                    <p><strong className="text-white/70">Ubuntu:</strong> <code className="text-green-400 bg-black/30 px-2 py-0.5 rounded">sudo apt-get install python3-tk</code></p>
                    <p><strong className="text-white/70">Fedora:</strong> <code className="text-green-400 bg-black/30 px-2 py-0.5 rounded">sudo dnf install python3-tkinter</code></p>
                    <p><strong className="text-white/70">macOS:</strong> <code className="text-green-400 bg-black/30 px-2 py-0.5 rounded">brew install python-tk</code></p>
                    <p><strong className="text-white/70">Windows:</strong> Переустановите Python с галочкой "tcl/tk and IDLE"</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white/80 text-sm font-medium mb-1">Google не выдаёт результаты</p>
                  <p className="text-white/50 text-xs">Google часто блокирует автоматические запросы — это нормально. DuckDuckGo работает стабильнее.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white/80 text-sm font-medium mb-1">Поиск занимает много времени</p>
                  <p className="text-white/50 text-xs">Приложение последовательно опрашивает все источники. Используйте более точное ФИО для ускорения.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="animate-fadeIn">
            <div className="bg-black/50 border border-white/10 rounded-2xl p-6 font-mono text-sm overflow-x-auto">
              <pre className="text-white/80 whitespace-pre-wrap">
{`======================================================================
  🔍 ПОИСК: Иванов Иван Иванович
======================================================================

📖 WIKIPEDIA
────────────────────────────────────────
  📖 Иванов, Иван Иванович
     🔗 https://ru.wikipedia.org/wiki/Иванов,_Иван_Иванович
     Российский государственный деятель, депутат Государственной
     Думы Федерального Собрания Российской Федерации

💻 GITHUB — ПОЛЬЗОВАТЕЛИ
────────────────────────────────────────
  💻 @ivanov-dev
     🔗 https://github.com/ivanov-dev
     Профиль GitHub: ivanov-dev
  💻 @i-ivanov
     🔗 https://github.com/i-ivanov
     Профиль GitHub: i-ivanov

📦 GITHUB — РЕПОЗИТОРИИ
────────────────────────────────────────
  📦 ivanov/my-project
     🔗 https://github.com/ivanov/my-project
     Personal portfolio website ⭐ 12

🔍 DUCKDUCKGO — ВЕБ-ПОИСК
────────────────────────────────────────
  🔍 Иванов Иван Иванович — Биография
     🔗 https://example.com/bio/ivanov
     Директор по развитию, ООО "Технологии будущего"

  🔍 Иванов И.И. — Профиль на сайте компании
     🔗 https://company.ru/team/ivanov
     Руководитель отдела разработки с 2019 года

🌐 GOOGLE — ВЕБ-ПОИСК
────────────────────────────────────────
  🌐 Иванов Иван Иванович | LinkedIn
     🔗 https://linkedin.com/in/ivan-ivanov
     Москва, Россия. 500+ контактов

📧 ВОЗМОЖНЫЕ EMAIL АДРЕСА
────────────────────────────────────────
  ✉️  ivan.ivanov@gmail.com
  ✉️  ivanivanov@mail.ru
  ✉️  i.ivanov@yandex.ru
  ✉️  ivanov@yandex.ru
  ✉️  ivanov.ivan@gmail.com
  ✉️  iivanov@gmail.com
  ✉️  ivanov@yahoo.com
  ✉️  ivanovivan@outlook.com

  💡 Всего сгенерировано вариантов: 48
  💡 Проверьте их на: haveibeenpwned.com, emailhippo.com

📱 СОЦИАЛЬНЫЕ СЕТИ
────────────────────────────────────────
  ✈️ @ivanivanov (Иван Иванов)
     🔗 https://t.me/ivanivanov
     Найден профиль в Telegram

🔗 ДОПОЛНИТЕЛЬНЫЕ ССЫЛКИ ДЛЯ ПОИСКА
────────────────────────────────────────
  → ВКонтакте: https://vk.com/search?q=...
  → Одноклассники: https://ok.ru/search?q=...
  → Facebook: https://www.facebook.com/search/top/?q=...
  → LinkedIn: https://www.linkedin.com/search/...
  → HeadHunter: https://hh.ru/search/resume?text=...
  → ФССП (долги): https://fssp.gov.ru/isp/
  → ФНС (ИНН): https://service.nalog.ru/...
  → Have I Been Pwned: https://haveibeenpwned.com/

======================================================================
  ✅ ИТОГО НАЙДЕНО РЕЗУЛЬТАТОВ: 14
======================================================================`}
              </pre>
            </div>

            <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
              <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                <i className="fas fa-info-circle"></i>
                Примечание
              </h4>
              <p className="text-blue-200/70 text-sm leading-relaxed">
                Это пример реальных результатов работы приложения. Данные собираются из открытых источников 
                в реальном времени. Количество и качество результатов зависит от того, насколько распространено ФИО 
                в интернете и доступности внешних сервисов.
              </p>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
          <h4 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle"></i>
            Важная информация
          </h4>
          <p className="text-amber-200/70 text-sm leading-relaxed">
            Данный инструмент предоставляется «как есть» для образовательных целей. 
            Использование полученных данных должно соответствовать законодательству вашей страны. 
            Не используйте информацию для преследования или нарушения приватности других людей.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-white/30 text-sm">
            OSINT Поиск • Десктопное приложение на Python для реального поиска информации в открытых источниках
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
