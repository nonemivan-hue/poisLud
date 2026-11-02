import { useState } from 'react';

interface SearchLink {
  name: string;
  icon: string;
  url: string;
  category: string;
  color: string;
}

function App() {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [searchResults, setSearchResults] = useState<SearchLink[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const generateSearchLinks = (): SearchLink[] => {
    const fullName = `${lastName} ${firstName} ${middleName}`.trim();
    const fullNameReverse = `${firstName} ${lastName}`.trim();
    const encoded = encodeURIComponent(fullName);
    const encodedReverse = encodeURIComponent(fullNameReverse);

    return [
      // Поисковые системы
      {
        name: 'Google',
        icon: 'fab fa-google',
        url: `https://www.google.com/search?q=${encoded}`,
        category: 'Поисковые системы',
        color: 'from-blue-500 to-blue-600',
      },
      {
        name: 'Яндекс',
        icon: 'fas fa-search',
        url: `https://yandex.ru/search/?text=${encoded}`,
        category: 'Поисковые системы',
        color: 'from-yellow-500 to-red-500',
      },
      {
        name: 'Mail.ru',
        icon: 'fas fa-at',
        url: `https://go.mail.ru/search?q=${encoded}`,
        category: 'Поисковые системы',
        color: 'from-blue-400 to-blue-600',
      },
      {
        name: 'Bing',
        icon: 'fab fa-microsoft',
        url: `https://www.bing.com/search?q=${encoded}`,
        category: 'Поисковые системы',
        color: 'from-teal-500 to-teal-600',
      },
      {
        name: 'DuckDuckGo',
        icon: 'fab fa-duck',
        url: `https://duckduckgo.com/?q=${encoded}`,
        category: 'Поисковые системы',
        color: 'from-orange-500 to-orange-600',
      },

      // Социальные сети
      {
        name: 'ВКонтакте',
        icon: 'fab fa-vk',
        url: `https://vk.com/search?q=${encoded}`,
        category: 'Социальные сети',
        color: 'from-blue-500 to-blue-700',
      },
      {
        name: 'Одноклассники',
        icon: 'fas fa-users',
        url: `https://ok.ru/search?q=${encoded}`,
        category: 'Социальные сети',
        color: 'from-orange-400 to-orange-600',
      },
      {
        name: 'Facebook',
        icon: 'fab fa-facebook',
        url: `https://www.facebook.com/search/top/?q=${encoded}`,
        category: 'Социальные сети',
        color: 'from-blue-600 to-blue-800',
      },
      {
        name: 'Instagram',
        icon: 'fab fa-instagram',
        url: `https://www.instagram.com/explore/tags/${encodedReverse.replace(/%20/g, '')}`,
        category: 'Социальные сети',
        color: 'from-pink-500 to-purple-600',
      },
      {
        name: 'LinkedIn',
        icon: 'fab fa-linkedin',
        url: `https://www.linkedin.com/search/results/all/?keywords=${encoded}`,
        category: 'Социальные сети',
        color: 'from-blue-700 to-blue-900',
      },
      {
        name: 'Twitter/X',
        icon: 'fab fa-x-twitter',
        url: `https://twitter.com/search?q=${encoded}`,
        category: 'Социальные сети',
        color: 'from-gray-700 to-gray-900',
      },
      {
        name: 'Telegram',
        icon: 'fab fa-telegram',
        url: `https://t.me/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
        category: 'Социальные сети',
        color: 'from-sky-400 to-sky-600',
      },

      // Профессиональные
      {
        name: 'HeadHunter',
        icon: 'fas fa-briefcase',
        url: `https://hh.ru/search/resume?text=${encoded}`,
        category: 'Профессиональные',
        color: 'from-red-500 to-red-700',
      },
      {
        name: 'Habr',
        icon: 'fas fa-code',
        url: `https://habr.com/ru/search/?q=${encoded}&target_type=articles`,
        category: 'Профессиональные',
        color: 'from-blue-500 to-indigo-600',
      },
      {
        name: 'GitHub',
        icon: 'fab fa-github',
        url: `https://github.com/search?q=${encoded}&type=users`,
        category: 'Профессиональные',
        color: 'from-gray-800 to-gray-900',
      },

      // Дополнительно
      {
        name: 'Судебные приставы (ФССП)',
        icon: 'fas fa-gavel',
        url: `https://fssp.gov.ru/isp/`,
        category: 'Государственные сервисы',
        color: 'from-purple-500 to-purple-700',
      },
      {
        name: 'ФНС (ИНН)',
        icon: 'fas fa-file-invoice',
        url: `https://service.nalog.ru/prod.xhtml?mode=inn`,
        category: 'Государственные сервисы',
        color: 'from-green-600 to-green-800',
      },
      {
        name: 'Госуслуги',
        icon: 'fas fa-landmark',
        url: `https://www.gosuslugi.ru/`,
        category: 'Государственные сервисы',
        color: 'from-blue-500 to-red-500',
      },

      // Проверка утечек
      {
        name: 'Have I Been Pwned',
        icon: 'fas fa-shield-alt',
        url: `https://haveibeenpwned.com/`,
        category: 'Безопасность',
        color: 'from-red-600 to-red-800',
      },
      {
        name: 'Yandex DataLens',
        icon: 'fas fa-database',
        url: `https://yandex.ru/search/?text=${encoded}+email+телефон`,
        category: 'Дополнительный поиск',
        color: 'from-indigo-500 to-indigo-700',
      },
      {
        name: 'Поиск по фото',
        icon: 'fas fa-camera',
        url: `https://images.google.com/?q=${encoded}`,
        category: 'Дополнительный поиск',
        color: 'from-amber-500 to-amber-700',
      },
    ];
  };

  const handleSearch = () => {
    if (!lastName && !firstName) {
      alert('Введите хотя бы фамилию или имя');
      return;
    }
    const links = generateSearchLinks();
    setSearchResults(links);
    setHasSearched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const categories = [...new Set(searchResults.map((r) => r.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <i className="fas fa-user-secret text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">OSINT Поиск</h1>
              <p className="text-white/50 text-xs">Поиск информации по ФИО</p>
            </div>
          </div>
          <button
            onClick={() => setShowInstructions(true)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center gap-2"
          >
            <i className="fas fa-rocket"></i>
            Как запустить
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-white text-2xl font-bold mb-2 flex items-center gap-2">
              <i className="fas fa-search text-purple-400"></i>
              Поиск по ФИО
            </h2>
            <p className="text-white/60 mb-6 text-sm">
              Введите данные для поиска информации о человеке в открытых источниках
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-white/70 text-sm mb-1.5">Фамилия *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Иванов"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1.5">Имя *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Иван"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1.5">Отчество</label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Иванович"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <i className="fas fa-magnifying-glass"></i>
              Найти информацию
            </button>
          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="text-white/60 text-sm font-medium">
                Найдено {searchResults.length} источников
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {categories.map((category) => (
              <div key={category} className="mb-8">
                <h3 className="text-white/80 font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {searchResults
                    .filter((r) => r.category === category)
                    .map((result, index) => (
                      <a
                        key={index}
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg flex items-center gap-3"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${result.color} flex items-center justify-center shrink-0 shadow-lg`}
                        >
                          <i className={`${result.icon} text-white text-sm`}></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm truncate">
                            {result.name}
                          </p>
                          <p className="text-white/40 text-xs truncate">
                            Открыть поиск →
                          </p>
                        </div>
                        <i className="fas fa-external-link-alt text-white/20 group-hover:text-white/50 ml-auto transition-colors text-xs"></i>
                      </a>
                    ))}
                </div>
              </div>
            ))}

            {/* Tips */}
            <div className="mt-10 bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
              <h4 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
                <i className="fas fa-lightbulb"></i>
                Советы по поиску
              </h4>
              <ul className="text-amber-200/70 text-sm space-y-1.5">
                <li>• Используйте полное ФИО для более точного поиска</li>
                <li>• Если не нашли результат, попробуйте искать только по имени и фамилии</li>
                <li>• В социальных сетях ищите также по никнеймам и номерам телефонов</li>
                <li>• Проверяйте разные варианты написания (транслит, сокращения)</li>
                <li>• Используйте поиск по фото для идентификации в социальных сетях</li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-5">
              <h4 className="text-white/80 font-semibold mb-2 flex items-center gap-2">
                <i className="fas fa-exclamation-triangle text-yellow-400"></i>
                Важная информация
              </h4>
              <p className="text-white/50 text-sm leading-relaxed">
                Данный инструмент предоставляет ссылки на открытые источники информации. 
                Использование полученных данных должно соответствовать законодательству вашей страны. 
                Не используйте информацию для преследования, harassment или нарушения приватности других людей.
                Все ссылки ведут на сторонние ресурсы, и мы не несём ответственности за их содержимое.
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasSearched && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <i className="fas fa-user-secret text-4xl text-white/20"></i>
            </div>
            <h3 className="text-white/40 text-lg font-medium mb-2">
              Начните поиск
            </h3>
            <p className="text-white/25 text-sm max-w-md mx-auto">
              Введите ФИО человека выше и нажмите «Найти информацию» для поиска в открытых источниках интернета
            </p>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { icon: 'fab fa-google', label: 'Поисковики', count: '5+' },
                { icon: 'fab fa-vk', label: 'Соцсети', count: '7+' },
                { icon: 'fas fa-briefcase', label: 'Проф. сети', count: '3+' },
                { icon: 'fas fa-landmark', label: 'Гос. сервисы', count: '3+' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <i className={`${item.icon} text-2xl text-purple-400 mb-2`}></i>
                  <p className="text-white/60 text-xs">{item.label}</p>
                  <p className="text-white font-bold">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-white/30 text-sm">
            OSINT Поиск • Инструмент для поиска информации в открытых источниках
          </p>
        </div>
      </footer>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-white text-2xl font-bold flex items-center gap-2">
                <i className="fas fa-rocket text-purple-400"></i>
                Инструкция по запуску
              </h2>
              <button
                onClick={() => setShowInstructions(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Quick Start */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-5">
                <h3 className="text-purple-400 font-semibold text-lg mb-3 flex items-center gap-2">
                  <i className="fas fa-bolt"></i>
                  Быстрый старт
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Это веб-приложение на React + Vite + Tailwind CSS. Для запуска вам понадобится Node.js версии 18 или выше.
                </p>
              </div>

              {/* Prerequisites */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">1</span>
                  Требования
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10">
                  <ul className="text-white/70 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check text-green-400 mt-0.5"></i>
                      <span><strong className="text-white">Node.js</strong> версии 18+ (<a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">скачать</a>)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check text-green-400 mt-0.5"></i>
                      <span><strong className="text-white">npm</strong> (устанавливается вместе с Node.js)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check text-green-400 mt-0.5"></i>
                      <span><strong className="text-white">Git</strong> (опционально, для клонирования репозитория)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Installation */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">2</span>
                  Установка зависимостей
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10">
                  <p className="text-white/70 text-sm mb-3">Откройте терминал в папке проекта и выполните:</p>
                  <div className="bg-black/50 rounded-lg p-3 font-mono text-sm">
                    <code className="text-green-400">npm install</code>
                  </div>
                  <p className="text-white/50 text-xs mt-2">
                    Эта команда установит все необходимые зависимости из package.json
                  </p>
                </div>
              </div>

              {/* Development */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400">3</span>
                  Запуск в режиме разработки
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10">
                  <p className="text-white/70 text-sm mb-3">Для запуска локального сервера разработки:</p>
                  <div className="bg-black/50 rounded-lg p-3 font-mono text-sm">
                    <code className="text-yellow-400">npm run dev</code>
                  </div>
                  <p className="text-white/50 text-xs mt-2">
                    Приложение откроется по адресу <code className="text-purple-400">http://localhost:5173</code>
                  </p>
                  <p className="text-white/50 text-xs mt-1">
                    Сервер автоматически перезагружается при изменении файлов
                  </p>
                </div>
              </div>

              {/* Production Build */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">4</span>
                  Сборка для продакшена
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10">
                  <p className="text-white/70 text-sm mb-3">Для создания оптимизированной production-версии:</p>
                  <div className="bg-black/50 rounded-lg p-3 font-mono text-sm space-y-1">
                    <code className="text-red-400">npm run build</code>
                  </div>
                  <p className="text-white/50 text-xs mt-2">
                    Готовые файлы появятся в папке <code className="text-purple-400">dist/</code>
                  </p>
                </div>
              </div>

              {/* Preview Production */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">5</span>
                  Предпросмотр production-сборки
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10">
                  <p className="text-white/70 text-sm mb-3">После сборки можно запустить локальный preview-сервер:</p>
                  <div className="bg-black/50 rounded-lg p-3 font-mono text-sm">
                    <code className="text-indigo-400">npm run preview</code>
                  </div>
                  <p className="text-white/50 text-xs mt-2">
                    Это запустит статический сервер для проверки production-сборки
                  </p>
                </div>
              </div>

              {/* Project Structure */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">6</span>
                  Структура проекта
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10">
                  <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-white/70 space-y-0.5">
                    <div>📁 <span className="text-white">src/</span></div>
                    <div className="ml-4">├── 📄 App.tsx <span className="text-white/40">← Главный компонент</span></div>
                    <div className="ml-4">├── 📄 main.tsx <span className="text-white/40">← Точка входа</span></div>
                    <div className="ml-4">└── 📄 index.css <span className="text-white/40">← Глобальные стили</span></div>
                    <div>📁 <span className="text-white">public/</span> <span className="text-white/40">← Статические файлы</span></div>
                    <div>📄 <span className="text-white">index.html</span> <span className="text-white/40">← HTML шаблон</span></div>
                    <div>📄 <span className="text-white">package.json</span> <span className="text-white/40">← Зависимости</span></div>
                    <div>📄 <span className="text-white">vite.config.ts</span> <span className="text-white/40">← Конфигурация Vite</span></div>
                    <div>📄 <span className="text-white">tailwind.config.js</span> <span className="text-white/40">← Конфигурация Tailwind</span></div>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">7</span>
                  Решение проблем
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10 space-y-3">
                  <div>
                    <p className="text-white/80 text-sm font-medium">Ошибка: "npm not found"</p>
                    <p className="text-white/50 text-xs mt-1">Установите Node.js с официального сайта nodejs.org</p>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-white/80 text-sm font-medium">Ошибка при npm install</p>
                    <p className="text-white/50 text-xs mt-1">Удалите папку node_modules и package-lock.json, затем повторите npm install</p>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-white/80 text-sm font-medium">Порт 5173 занят</p>
                    <p className="text-white/50 text-xs mt-1">Vite автоматически предложит другой порт или используйте: npm run dev -- --port 3000</p>
                  </div>
                </div>
              </div>

              {/* Additional Commands */}
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-5">
                <h3 className="text-blue-400 font-semibold text-lg mb-3 flex items-center gap-2">
                  <i className="fas fa-terminal"></i>
                  Полезные команды
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-3">
                    <code className="text-green-400 font-mono bg-black/30 px-2 py-1 rounded text-xs whitespace-nowrap">npm run lint</code>
                    <span className="text-white/60">Проверка кода на ошибки</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <code className="text-green-400 font-mono bg-black/30 px-2 py-1 rounded text-xs whitespace-nowrap">npm run format</code>
                    <span className="text-white/60">Форматирование кода</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <code className="text-green-400 font-mono bg-black/30 px-2 py-1 rounded text-xs whitespace-nowrap">npm run test</code>
                    <span className="text-white/60">Запуск тестов (если настроены)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-white/10 p-6">
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Понятно, закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
