import { useState } from 'react';

function App() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

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
            <p className="text-white/50 text-sm">Десктопное приложение на Python</p>
          </div>
          <div className="ml-auto flex gap-2">
            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-medium">
              Python 3.7+
            </span>
            <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
              Без зависимостей
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-white text-4xl font-bold mb-4">
            🔍 Поиск информации по ФИО
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Десктопное приложение на Python для поиска информации о человеке в открытых источниках интернета. 
            Генерирует ссылки на 21+ ресурс.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
              <i className="fas fa-search text-blue-400"></i>
            </div>
            <h3 className="text-white font-semibold mb-2">Поисковые системы</h3>
            <p className="text-white/50 text-sm">Google, Яндекс, Mail.ru, Bing, DuckDuckGo</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center mb-3">
              <i className="fas fa-users text-pink-400"></i>
            </div>
            <h3 className="text-white font-semibold mb-2">Социальные сети</h3>
            <p className="text-white/50 text-sm">ВКонтакте, Facebook, Instagram, LinkedIn, Telegram</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
              <i className="fas fa-briefcase text-green-400"></i>
            </div>
            <h3 className="text-white font-semibold mb-2">Профессиональные</h3>
            <p className="text-white/50 text-sm">HeadHunter, Habr, GitHub</p>
          </div>
        </div>

        {/* Installation Guide */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-rocket text-purple-400"></i>
            Инструкция по запуску
          </h2>

          {/* Step 1 */}
          <div className="mb-8">
            <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">1</span>
              Требования
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10">
              <p className="text-white/70 text-sm mb-3">Убедитесь, что у вас установлен Python 3.7 или выше:</p>
              <CommandBlock command="python --version" id="check-python" />
              <p className="text-white/50 text-xs mt-2">
                Если Python не установлен, скачайте его с{' '}
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
              Скачайте файл приложения
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10">
              <p className="text-white/70 text-sm mb-3">
                Скачайте файл <code className="text-purple-400 bg-black/30 px-2 py-0.5 rounded">osint_search.py</code> из репозитория проекта
              </p>
              <p className="text-white/50 text-xs">
                💡 Приложение использует только стандартную библиотеку Python — дополнительные пакеты не требуются!
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-8">
            <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-sm font-bold">3</span>
              Запустите приложение
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10 space-y-3">
              <p className="text-white/70 text-sm">Откройте терминал в папке с файлом и выполните:</p>
              <CommandBlock command="python osint_search.py" id="run-windows" />
              
              <p className="text-white/50 text-xs mt-3">Или на Linux/macOS:</p>
              <CommandBlock command="python3 osint_search.py" id="run-linux" />
              
              <p className="text-white/50 text-xs mt-3">
                💡 Также можно просто дважды кликнуть на файл <code className="text-purple-400">osint_search.py</code>
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">4</span>
              Используйте приложение
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 ml-10">
              <ol className="text-white/70 text-sm space-y-2 list-decimal list-inside">
                <li>Введите <strong className="text-white">Фамилию</strong> и <strong className="text-white">Имя</strong> (обязательно)</li>
                <li>При необходимости введите <strong className="text-white">Отчество</strong></li>
                <li>Нажмите кнопку <strong className="text-white">«Найти информацию»</strong> или клавишу <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">Enter</kbd></li>
                <li>В появившемся списке нажмите на нужный источник — ссылка откроется в браузере</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-wrench text-orange-400"></i>
            Решение проблем
          </h2>

          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white/80 text-sm font-medium mb-1">Ошибка: "python: command not found"</p>
              <p className="text-white/50 text-xs">Установите Python с официального сайта python.org и перезапустите терминал</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white/80 text-sm font-medium mb-1">Ошибка: "No module named 'tkinter'"</p>
              <div className="text-white/50 text-xs space-y-1 mt-2">
                <p><strong className="text-white/70">Ubuntu/Debian:</strong> <code className="text-green-400 bg-black/30 px-2 py-0.5 rounded">sudo apt-get install python3-tk</code></p>
                <p><strong className="text-white/70">Fedora:</strong> <code className="text-green-400 bg-black/30 px-2 py-0.5 rounded">sudo dnf install python3-tkinter</code></p>
                <p><strong className="text-white/70">macOS:</strong> <code className="text-green-400 bg-black/30 px-2 py-0.5 rounded">brew install python-tk</code></p>
                <p><strong className="text-white/70">Windows:</strong> Переустановите Python с отмеченной галочкой "tcl/tk and IDLE"</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white/80 text-sm font-medium mb-1">Окно не появляется</p>
              <p className="text-white/50 text-xs">Убедитесь, что у вас установлена графическая среда (X11/Wayland на Linux)</p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 mb-8">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-code text-blue-400"></i>
            Технические детали
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/50 text-xs mb-1">Язык</p>
              <p className="text-white font-semibold">Python 3.7+</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/50 text-xs mb-1">GUI фреймворк</p>
              <p className="text-white font-semibold">tkinter (встроен)</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/50 text-xs mb-1">Зависимости</p>
              <p className="text-white font-semibold">Нет (стандартная библиотека)</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/50 text-xs mb-1">Платформы</p>
              <p className="text-white font-semibold">Windows, macOS, Linux</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
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
            OSINT Поиск • Десктопное приложение на Python для поиска информации в открытых источниках
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
