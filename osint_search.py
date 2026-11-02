#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OSINT Поиск — Поиск информации по ФИО
Десктопное приложение для РЕАЛЬНОГО поиска информации о человеке в открытых источниках.

Источники:
- DuckDuckGo (веб-поиск)
- Wikipedia (статьи)
- GitHub (пользователи и репозитории)
- Google (веб-поиск)
- Проверка email на популярных сервисах
"""

import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import urllib.request
import urllib.parse
import json
import re
import ssl
import threading
from html.parser import HTMLParser


# ============================================================
# УТИЛИТЫ ДЛЯ HTTP-ЗАПРОСОВ
# ============================================================

def make_request(url, headers=None, timeout=10):
    """Выполнить HTTP GET запрос и вернуть содержимое"""
    if headers is None:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
        }
    
    # Игнорируем SSL ошибки для некоторых сайтов
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as response:
            charset = response.headers.get_content_charset() or 'utf-8'
            return response.read().decode(charset, errors='replace')
    except Exception as e:
        return None


def make_json_request(url, headers=None, timeout=10):
    """Выполнить HTTP GET запрос и вернуть JSON"""
    if headers is None:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
        }
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return None


# ============================================================
# ПАРСЕРЫ
# ============================================================

class DuckDuckGoParser(HTMLParser):
    """Парсер результатов DuckDuckGo"""
    def __init__(self):
        super().__init__()
        self.results = []
        self.current_result = {}
        self.in_result = False
        self.in_title = False
        self.in_snippet = False
        self.depth = 0
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        cls = attrs_dict.get('class', '')
        
        if tag == 'article' and 'result' in cls:
            self.in_result = True
            self.current_result = {'title': '', 'url': '', 'snippet': ''}
            
        if self.in_result:
            if tag == 'a' and 'result__a' in cls:
                self.in_title = True
                href = attrs_dict.get('href', '')
                if href:
                    self.current_result['url'] = href
                    
            if tag == 'a' and 'result__snippet' in cls:
                self.in_snippet = True
                
            if tag == 'span' and 'result__snippet' in cls:
                self.in_snippet = True
    
    def handle_endtag(self, tag):
        if tag == 'article' and self.in_result:
            if self.current_result.get('title') or self.current_result.get('snippet'):
                self.results.append(self.current_result)
            self.in_result = False
            self.current_result = {}
            
        if tag == 'a':
            self.in_title = False
            self.in_snippet = False
            
        if tag == 'span':
            self.in_snippet = False
    
    def handle_data(self, data):
        if self.in_title:
            self.current_result['title'] += data.strip()
        if self.in_snippet:
            self.current_result['snippet'] += data.strip()


class GoogleParser(HTMLParser):
    """Парсер результатов Google"""
    def __init__(self):
        super().__init__()
        self.results = []
        self.current_result = {}
        self.in_h3 = False
        self.in_a = False
        self.capture_text = False
        self.text_buffer = ''
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        if tag == 'div' and 'g' in attrs_dict.get('class', '').split():
            self.current_result = {'title': '', 'url': '', 'snippet': ''}
            
        if tag == 'a' and 'href' in attrs_dict:
            href = attrs_dict['href']
            if href.startswith('/url?q='):
                url = urllib.parse.unquote(href.split('/url?q=')[1].split('&')[0])
                if not url.startswith('http'):
                    return
                self.current_result['url'] = url
                self.in_a = True
                
        if tag == 'h3' and self.in_a:
            self.in_h3 = True
            
        if tag == 'span' and 'st' in attrs_dict.get('class', '').split():
            self.capture_text = True
            self.text_buffer = ''
    
    def handle_endtag(self, tag):
        if tag == 'h3':
            self.in_h3 = False
            
        if tag == 'a':
            self.in_a = False
            
        if tag == 'span':
            if self.capture_text and self.text_buffer:
                self.current_result['snippet'] = self.text_buffer
            self.capture_text = False
            
        if tag == 'div' and self.current_result.get('title'):
            if self.current_result.get('url'):
                self.results.append(self.current_result.copy())
            self.current_result = {'title': '', 'url': '', 'snippet': ''}
    
    def handle_data(self, data):
        if self.in_h3:
            self.current_result['title'] += data.strip()
        if self.capture_text:
            self.text_buffer += data.strip()


# ============================================================
# МОДУЛИ ПОИСКА
# ============================================================

def search_duckduckgo(query, max_results=10):
    """Поиск через DuckDuckGo HTML"""
    encoded = urllib.parse.quote(query)
    url = f"https://html.duckduckgo.com/html/?q={encoded}"
    
    html = make_request(url)
    if not html:
        return []
    
    parser = DuckDuckGoParser()
    try:
        parser.feed(html)
    except:
        pass
    
    results = []
    for r in parser.results[:max_results]:
        if r.get('title') and r.get('url'):
            results.append({
                'source': 'DuckDuckGo',
                'title': r['title'],
                'url': r['url'],
                'snippet': r.get('snippet', ''),
                'icon': '🔍'
            })
    
    return results


def search_wikipedia(query, lang='ru'):
    """Поиск через Wikipedia API"""
    encoded = urllib.parse.quote(query)
    url = f"https://{lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch={encoded}&format=json&srlimit=5"
    
    data = make_json_request(url)
    if not data or 'query' not in data:
        return []
    
    results = []
    for item in data['query'].get('search', []):
        title = item.get('title', '')
        snippet = item.get('snippet', '')
        # Убираем HTML теги из сниппета
        snippet = re.sub(r'<[^>]+>', '', snippet)
        
        results.append({
            'source': 'Wikipedia',
            'title': title,
            'url': f"https://{lang}.wikipedia.org/wiki/{urllib.parse.quote(title)}",
            'snippet': snippet,
            'icon': '📖'
        })
    
    return results


def search_github(query):
    """Поиск пользователей на GitHub"""
    encoded = urllib.parse.quote(query)
    url = f"https://api.github.com/search/users?q={encoded}&per_page=5"
    
    data = make_json_request(url)
    if not data or 'items' not in data:
        return []
    
    results = []
    for item in data['items']:
        login = item.get('login', '')
        avatar = item.get('avatar_url', '')
        profile_url = item.get('html_url', '')
        
        results.append({
            'source': 'GitHub',
            'title': f"@{login}",
            'url': profile_url,
            'snippet': f"Профиль GitHub: {login}",
            'icon': '💻',
            'avatar': avatar
        })
    
    return results


def search_github_repos(query):
    """Поиск репозиториев на GitHub"""
    encoded = urllib.parse.quote(query)
    url = f"https://api.github.com/search/repositories?q={encoded}&per_page=5"
    
    data = make_json_request(url)
    if not data or 'items' not in data:
        return []
    
    results = []
    for item in data['items']:
        name = item.get('full_name', '')
        description = item.get('description', '') or 'Нет описания'
        repo_url = item.get('html_url', '')
        stars = item.get('stargazers_count', 0)
        
        results.append({
            'source': 'GitHub (репозиторий)',
            'title': name,
            'url': repo_url,
            'snippet': f"{description} ⭐ {stars}",
            'icon': '📦'
        })
    
    return results


def search_google(query, max_results=10):
    """Поиск через Google (может блокироваться)"""
    encoded = urllib.parse.quote(query)
    url = f"https://www.google.com/search?q={encoded}&hl=ru&num={max_results}"
    
    html = make_request(url)
    if not html:
        return []
    
    parser = GoogleParser()
    try:
        parser.feed(html)
    except:
        pass
    
    results = []
    for r in parser.results[:max_results]:
        if r.get('title') and r.get('url'):
            results.append({
                'source': 'Google',
                'title': r['title'],
                'url': r['url'],
                'snippet': r.get('snippet', ''),
                'icon': '🌐'
            })
    
    return results


def check_email_variants(first_name, last_name):
    """Генерация возможных email адресов"""
    variants = []
    
    # Транслитерация
    translit_map = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    }
    
    def to_translit(text):
        return ''.join(translit_map.get(c.lower(), c) for c in text)
    
    fn_translit = to_translit(first_name).lower() if first_name else ''
    ln_translit = to_translit(last_name).lower() if last_name else ''
    
    if fn_translit and ln_translit:
        domains = ['gmail.com', 'mail.ru', 'yandex.ru', 'yahoo.com', 'outlook.com']
        
        patterns = [
            f"{fn_translit}.{ln_translit}",
            f"{fn_translit}{ln_translit}",
            f"{fn_translit[0]}.{ln_translit}",
            f"{fn_translit[0]}{ln_translit}",
            f"{ln_translit}.{fn_translit}",
            f"{ln_translit}{fn_translit}",
        ]
        
        for pattern in patterns:
            for domain in domains:
                variants.append(f"{pattern}@{domain}")
    
    return variants


def search_social_profiles(first_name, last_name):
    """Поиск профилей в социальных сетях"""
    results = []
    
    fn_lower = first_name.lower() if first_name else ''
    ln_lower = last_name.lower() if last_name else ''
    
    if not fn_lower and not ln_lower:
        return results
    
    # Возможные username варианты
    usernames = []
    if fn_lower and ln_lower:
        usernames.extend([
            f"{fn_lower}{ln_lower}",
            f"{fn_lower}.{ln_lower}",
            f"{ln_lower}{fn_lower}",
            f"{fn_lower[0]}{ln_lower}",
            f"{fn_lower}_{ln_lower}",
        ])
    
    # Транслит
    translit_map = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    }
    
    def to_translit(text):
        return ''.join(translit_map.get(c.lower(), c) for c in text)
    
    fn_t = to_translit(first_name) if first_name else ''
    ln_t = to_translit(last_name) if last_name else ''
    
    if fn_t and ln_t:
        usernames.extend([
            f"{fn_t}{ln_t}",
            f"{fn_t}.{ln_t}",
            f"{ln_t}{fn_t}",
            f"{fn_t[0]}{ln_t}",
        ])
    
    # Проверяем Telegram
    for username in usernames[:3]:
        url = f"https://t.me/{username}"
        html = make_request(url, timeout=5)
        if html and 'tgme_page_title' in html:
            # Извлекаем имя
            title_match = re.search(r'tgme_page_title[^>]*>.*?<span[^>]*>([^<]+)', html, re.DOTALL)
            name = title_match.group(1).strip() if title_match else username
            
            results.append({
                'source': 'Telegram',
                'title': f"@{username} ({name})",
                'url': url,
                'snippet': f"Найден профиль в Telegram",
                'icon': '✈️'
            })
            break
    
    # Проверяем Instagram
    for username in usernames[:3]:
        url = f"https://www.instagram.com/{username}/"
        html = make_request(url, timeout=5)
        if html and ('profilePage' in html or 'og:title' in html):
            results.append({
                'source': 'Instagram',
                'title': f"@{username}",
                'url': url,
                'snippet': f"Возможный профиль в Instagram",
                'icon': '📷'
            })
            break
    
    return results


# ============================================================
# ГЛАВНОЕ ПРИЛОЖЕНИЕ
# ============================================================

class OSINTSearchApp:
    def __init__(self, root):
        self.root = root
        self.root.title("OSINT Поиск — Поиск информации по ФИО")
        self.root.geometry("1000x750")
        self.root.configure(bg="#1a1a2e")
        self.root.minsize(800, 600)
        
        # Стили
        self.style = ttk.Style()
        self.style.theme_use('clam')
        
        # Цвета
        self.bg_color = "#1a1a2e"
        self.fg_color = "#ffffff"
        self.card_bg = "#16213e"
        self.button_bg = "#6366f1"
        self.button_hover = "#4f46e5"
        self.success_color = "#10b981"
        self.error_color = "#ef4444"
        
        self.is_searching = False
        self.all_results = []
        
        self.setup_ui()
    
    def setup_ui(self):
        """Создание интерфейса"""
        # Заголовок
        header_frame = tk.Frame(self.root, bg=self.bg_color)
        header_frame.pack(fill=tk.X, padx=20, pady=15)
        
        tk.Label(
            header_frame,
            text="🔍 OSINT Поиск",
            font=("Arial", 22, "bold"),
            fg=self.fg_color,
            bg=self.bg_color
        ).pack(side=tk.LEFT)
        
        tk.Label(
            header_frame,
            text="Реальный поиск информации по ФИО",
            font=("Arial", 11),
            fg="#888888",
            bg=self.bg_color
        ).pack(side=tk.LEFT, padx=15)
        
        # Форма ввода
        form_frame = tk.Frame(self.root, bg=self.card_bg, padx=25, pady=20)
        form_frame.pack(fill=tk.X, padx=20, pady=5)
        
        input_frame = tk.Frame(form_frame, bg=self.card_bg)
        input_frame.pack(fill=tk.X)
        
        # Фамилия
        tk.Label(input_frame, text="Фамилия *", font=("Arial", 10), fg="#cccccc", bg=self.card_bg).grid(row=0, column=0, sticky=tk.W, pady=3)
        self.last_name_var = tk.StringVar()
        self.last_name_entry = tk.Entry(
            input_frame, textvariable=self.last_name_var, font=("Arial", 12),
            bg="#0f1419", fg=self.fg_color, insertbackground=self.fg_color,
            relief=tk.FLAT, width=22
        )
        self.last_name_entry.grid(row=1, column=0, padx=5, pady=5, sticky=tk.EW)
        self.last_name_entry.bind('<Return>', lambda e: self.start_search())
        
        # Имя
        tk.Label(input_frame, text="Имя *", font=("Arial", 10), fg="#cccccc", bg=self.card_bg).grid(row=0, column=1, sticky=tk.W, pady=3, padx=10)
        self.first_name_var = tk.StringVar()
        self.first_name_entry = tk.Entry(
            input_frame, textvariable=self.first_name_var, font=("Arial", 12),
            bg="#0f1419", fg=self.fg_color, insertbackground=self.fg_color,
            relief=tk.FLAT, width=22
        )
        self.first_name_entry.grid(row=1, column=1, padx=5, pady=5, sticky=tk.EW)
        self.first_name_entry.bind('<Return>', lambda e: self.start_search())
        
        # Отчество
        tk.Label(input_frame, text="Отчество", font=("Arial", 10), fg="#cccccc", bg=self.card_bg).grid(row=0, column=2, sticky=tk.W, pady=3, padx=10)
        self.middle_name_var = tk.StringVar()
        self.middle_name_entry = tk.Entry(
            input_frame, textvariable=self.middle_name_var, font=("Arial", 12),
            bg="#0f1419", fg=self.fg_color, insertbackground=self.fg_color,
            relief=tk.FLAT, width=22
        )
        self.middle_name_entry.grid(row=1, column=2, padx=5, pady=5, sticky=tk.EW)
        self.middle_name_entry.bind('<Return>', lambda e: self.start_search())
        
        input_frame.columnconfigure(0, weight=1)
        input_frame.columnconfigure(1, weight=1)
        input_frame.columnconfigure(2, weight=1)
        
        # Кнопки
        buttons_frame = tk.Frame(form_frame, bg=self.card_bg)
        buttons_frame.pack(fill=tk.X, pady=10)
        
        self.search_button = tk.Button(
            buttons_frame, text="🔎 НАЙТИ ИНФОРМАЦИЮ",
            font=("Arial", 12, "bold"), bg=self.button_bg, fg=self.fg_color,
            activebackground=self.button_hover, activeforeground=self.fg_color,
            relief=tk.FLAT, cursor="hand2", padx=25, pady=10,
            command=self.start_search
        )
        self.search_button.pack(side=tk.LEFT)
        
        self.status_label = tk.Label(
            buttons_frame, text="", font=("Arial", 10),
            fg="#888888", bg=self.card_bg
        )
        self.status_label.pack(side=tk.RIGHT, padx=10)
        
        # Область результатов
        results_outer = tk.Frame(self.root, bg=self.bg_color)
        results_outer.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)
        
        # Заголовок результатов
        self.results_header = tk.Label(
            results_outer, text="Результаты поиска",
            font=("Arial", 14, "bold"), fg=self.fg_color, bg=self.bg_color
        )
        self.results_header.pack(anchor=tk.W, pady=(0, 5))
        
        # Текстовое поле для результатов
        self.results_text = scrolledtext.ScrolledText(
            results_outer,
            font=("Consolas", 10),
            bg="#0f1419",
            fg="#e2e8f0",
            insertbackground=self.fg_color,
            relief=tk.FLAT,
            wrap=tk.WORD,
            padx=15,
            pady=15,
            state=tk.DISABLED
        )
        self.results_text.pack(fill=tk.BOTH, expand=True)
        
        # Настройка тегов для форматирования
        self.results_text.tag_configure("header", foreground="#a78bfa", font=("Consolas", 12, "bold"))
        self.results_text.tag_configure("source", foreground="#60a5fa", font=("Consolas", 10, "bold"))
        self.results_text.tag_configure("title", foreground="#f1f5f9", font=("Consolas", 10, "bold"))
        self.results_text.tag_configure("url", foreground="#34d399", font=("Consolas", 9))
        self.results_text.tag_configure("snippet", foreground="#94a3b8", font=("Consolas", 9))
        self.results_text.tag_configure("separator", foreground="#334155")
        self.results_text.tag_configure("success", foreground="#10b981")
        self.results_text.tag_configure("error", foreground="#ef4444")
        self.results_text.tag_configure("info", foreground="#fbbf24")
        self.results_text.tag_configure("email", foreground="#f472b6")
        
        # Привязка клика для открытия URL
        self.results_text.tag_bind("url", "<Button-1>", self.on_url_click)
        self.results_text.tag_bind("url", "<Enter>", lambda e: self.results_text.config(cursor="hand2"))
        self.results_text.tag_bind("url", "<Leave>", lambda e: self.results_text.config(cursor=""))
        
        # Статус бар
        status_bar = tk.Frame(self.root, bg=self.bg_color)
        status_bar.pack(fill=tk.X, padx=20, pady=5)
        
        self.stats_label = tk.Label(
            status_bar, text="Готов к поиску",
            font=("Arial", 9), fg="#666666", bg=self.bg_color
        )
        self.stats_label.pack(side=tk.LEFT)
        
        # Хранилище URL для кликов
        self.url_map = {}
    
    def on_url_click(self, event):
        """Обработка клика по URL"""
        index = self.results_text.index(f"@{event.x},{event.y}")
        
        # Получаем текст строки
        line_start = self.results_text.index(f"{index} linestart")
        line_end = self.results_text.index(f"{index} lineend")
        line_text = self.results_text.get(line_start, line_end)
        
        # Ищем URL в строке
        url_match = re.search(r'https?://[^\s]+', line_text)
        if url_match:
            import webbrowser
            webbrowser.open(url_match.group(0))
    
    def update_status(self, text):
        """Обновить статус"""
        self.status_label.config(text=text)
        self.root.update_idletasks()
    
    def append_result(self, text, tag=None):
        """Добавить текст в область результатов"""
        self.results_text.config(state=tk.NORMAL)
        if tag:
            self.results_text.insert(tk.END, text, tag)
        else:
            self.results_text.insert(tk.END, text)
        self.results_text.config(state=tk.DISABLED)
        self.results_text.see(tk.END)
        self.root.update_idletasks()
    
    def clear_results(self):
        """Очистить результаты"""
        self.results_text.config(state=tk.NORMAL)
        self.results_text.delete(1.0, tk.END)
        self.results_text.config(state=tk.DISABLED)
        self.url_map.clear()
        self.all_results.clear()
    
    def start_search(self):
        """Начать поиск"""
        last_name = self.last_name_var.get().strip()
        first_name = self.first_name_var.get().strip()
        middle_name = self.middle_name_var.get().strip()
        
        if not last_name and not first_name:
            messagebox.showwarning("Ошибка", "Введите хотя бы фамилию или имя")
            return
        
        if self.is_searching:
            return
        
        self.is_searching = True
        self.search_button.config(state=tk.DISABLED, text="⏳ Поиск...")
        self.clear_results()
        
        # Запуск поиска в отдельном потоке
        thread = threading.Thread(
            target=self.perform_search,
            args=(first_name, last_name, middle_name),
            daemon=True
        )
        thread.start()
    
    def perform_search(self, first_name, last_name, middle_name):
        """Выполнить поиск по всем источникам"""
        full_name = f"{last_name} {first_name} {middle_name}".strip()
        short_name = f"{first_name} {last_name}".strip()
        
        self.append_result(f"{'='*70}\n", "separator")
        self.append_result(f"  🔍 ПОИСК: {full_name}\n", "header")
        self.append_result(f"{'='*70}\n\n", "separator")
        
        total_results = 0
        
        # 1. Wikipedia
        self.update_status("📖 Поиск в Wikipedia...")
        self.append_result("📖 WIKIPEDIA\n", "source")
        self.append_result("─" * 40 + "\n", "separator")
        
        wiki_results = search_wikipedia(full_name)
        if not wiki_results:
            wiki_results = search_wikipedia(short_name)
        
        if wiki_results:
            for r in wiki_results:
                self.append_result(f"  {r['icon']} {r['title']}\n", "title")
                self.append_result(f"     🔗 {r['url']}\n", "url")
                if r['snippet']:
                    self.append_result(f"     {r['snippet'][:150]}\n", "snippet")
                self.append_result("\n")
                total_results += 1
        else:
            self.append_result("  ❌ Ничего не найдено\n\n", "error")
        
        # 2. GitHub Users
        self.update_status("💻 Поиск на GitHub...")
        self.append_result("\n💻 GITHUB — ПОЛЬЗОВАТЕЛИ\n", "source")
        self.append_result("─" * 40 + "\n", "separator")
        
        github_results = search_github(short_name)
        if not github_results:
            github_results = search_github(last_name)
        
        if github_results:
            for r in github_results:
                self.append_result(f"  {r['icon']} {r['title']}\n", "title")
                self.append_result(f"     🔗 {r['url']}\n", "url")
                self.append_result(f"     {r['snippet']}\n", "snippet")
                self.append_result("\n")
                total_results += 1
        else:
            self.append_result("  ❌ Ничего не найдено\n\n", "error")
        
        # 3. GitHub Repos
        self.update_status("📦 Поиск репозиториев на GitHub...")
        self.append_result("\n📦 GITHUB — РЕПОЗИТОРИИ\n", "source")
        self.append_result("─" * 40 + "\n", "separator")
        
        repo_results = search_github_repos(full_name)
        if repo_results:
            for r in repo_results:
                self.append_result(f"  {r['icon']} {r['title']}\n", "title")
                self.append_result(f"     🔗 {r['url']}\n", "url")
                self.append_result(f"     {r['snippet']}\n", "snippet")
                self.append_result("\n")
                total_results += 1
        else:
            self.append_result("  ❌ Ничего не найдено\n\n", "error")
        
        # 4. DuckDuckGo
        self.update_status("🔍 Поиск в DuckDuckGo...")
        self.append_result("\n🔍 DUCKDUCKGO — ВЕБ-ПОИСК\n", "source")
        self.append_result("─" * 40 + "\n", "separator")
        
        ddg_results = search_duckduckgo(f'"{full_name}"')
        if not ddg_results:
            ddg_results = search_duckduckgo(short_name)
        
        if ddg_results:
            for r in ddg_results:
                self.append_result(f"  {r['icon']} {r['title']}\n", "title")
                self.append_result(f"     🔗 {r['url']}\n", "url")
                if r['snippet']:
                    self.append_result(f"     {r['snippet'][:200]}\n", "snippet")
                self.append_result("\n")
                total_results += 1
        else:
            self.append_result("  ❌ Ничего не найдено\n\n", "error")
        
        # 5. Google
        self.update_status("🌐 Поиск в Google...")
        self.append_result("\n🌐 GOOGLE — ВЕБ-ПОИСК\n", "source")
        self.append_result("─" * 40 + "\n", "separator")
        
        google_results = search_google(f'"{full_name}"')
        if not google_results:
            google_results = search_google(short_name)
        
        if google_results:
            for r in google_results:
                self.append_result(f"  {r['icon']} {r['title']}\n", "title")
                self.append_result(f"     🔗 {r['url']}\n", "url")
                if r['snippet']:
                    self.append_result(f"     {r['snippet'][:200]}\n", "snippet")
                self.append_result("\n")
                total_results += 1
        else:
            self.append_result("  ⚠️ Google заблокировал запрос или ничего не найдено\n\n", "info")
        
        # 6. Email варианты
        self.update_status("📧 Генерация email...")
        self.append_result("\n📧 ВОЗМОЖНЫЕ EMAIL АДРЕСА\n", "source")
        self.append_result("─" * 40 + "\n", "separator")
        
        emails = check_email_variants(first_name, last_name)
        if emails:
            for email in emails[:12]:
                self.append_result(f"  ✉️  {email}\n", "email")
            self.append_result(f"\n  💡 Всего сгенерировано вариантов: {len(emails)}\n", "info")
            self.append_result("  💡 Проверьте их на сайтах: haveibeenpwned.com, emailhippo.com\n\n", "info")
        else:
            self.append_result("  ❌ Не удалось сгенерировать варианты\n\n", "error")
        
        # 7. Социальные сети
        self.update_status("📱 Поиск в соцсетях...")
        self.append_result("\n📱 СОЦИАЛЬНЫЕ СЕТИ\n", "source")
        self.append_result("─" * 40 + "\n", "separator")
        
        social_results = search_social_profiles(first_name, last_name)
        if social_results:
            for r in social_results:
                self.append_result(f"  {r['icon']} {r['title']}\n", "title")
                self.append_result(f"     🔗 {r['url']}\n", "url")
                self.append_result(f"     {r['snippet']}\n", "snippet")
                self.append_result("\n")
                total_results += 1
        else:
            self.append_result("  ❌ Профили не найдены\n\n", "error")
        
        # 8. Ссылки для дополнительного поиска
        self.update_status("🔗 Генерация ссылок...")
        self.append_result("\n🔗 ДОПОЛНИТЕЛЬНЫЕ ССЫЛКИ ДЛЯ ПОИСКА\n", "source")
        self.append_result("─" * 40 + "\n", "separator")
        
        encoded_full = urllib.parse.quote(full_name)
        encoded_short = urllib.parse.quote(short_name)
        
        extra_links = [
            ("ВКонтакте", f"https://vk.com/search?q={encoded_full}"),
            ("Одноклассники", f"https://ok.ru/search?q={encoded_full}"),
            ("Facebook", f"https://www.facebook.com/search/top/?q={encoded_full}"),
            ("LinkedIn", f"https://www.linkedin.com/search/results/all/?keywords={encoded_full}"),
            ("HeadHunter", f"https://hh.ru/search/resume?text={encoded_full}"),
            ("ФССП (долги)", "https://fssp.gov.ru/isp/"),
            ("ФНС (ИНН)", "https://service.nalog.ru/prod.xhtml?mode=inn"),
            ("Have I Been Pwned", "https://haveibeenpwned.com/"),
        ]
        
        for name, url in extra_links:
            self.append_result(f"  → {name}: {url}\n", "url")
        
        # Итоги
        self.append_result(f"\n{'='*70}\n", "separator")
        self.append_result(f"  ✅ ИТОГО НАЙДЕНО РЕЗУЛЬТАТОВ: {total_results}\n", "success")
        self.append_result(f"{'='*70}\n", "separator")
        
        # Завершение
        self.root.after(0, lambda: self.search_finished(total_results))
    
    def search_finished(self, total):
        """Завершение поиска"""
        self.is_searching = False
        self.search_button.config(state=tk.NORMAL, text="🔎 НАЙТИ ИНФОРМАЦИЮ")
        self.update_status(f"✅ Поиск завершён")
        self.stats_label.config(text=f"Найдено результатов: {total} | Кликните на URL для перехода")


def main():
    """Главная функция"""
    root = tk.Tk()
    
    # Установка иконки (если доступна)
    try:
        root.iconbitmap(default='')
    except:
        pass
    
    app = OSINTSearchApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
