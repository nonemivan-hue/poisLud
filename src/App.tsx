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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <i className="fas fa-user-secret text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">OSINT Поиск</h1>
            <p className="text-white/50 text-xs">Поиск информации по ФИО</p>
          </div>
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
    </div>
  );
}

export default App;
