#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OSINT Поиск — Поиск информации по ФИО
Десктопное приложение для поиска информации о человеке в открытых источниках
"""

import tkinter as tk
from tkinter import ttk, messagebox
import webbrowser
import urllib.parse


class OSINTSearchApp:
    def __init__(self, root):
        self.root = root
        self.root.title("OSINT Поиск — Поиск информации по ФИО")
        self.root.geometry("900x700")
        self.root.configure(bg="#1a1a2e")
        
        # Стили
        self.style = ttk.Style()
        self.style.theme_use('clam')
        
        # Настройка цветов
        self.bg_color = "#1a1a2e"
        self.fg_color = "#ffffff"
        self.accent_color = "#6366f1"
        self.card_bg = "#16213e"
        self.button_bg = "#6366f1"
        self.button_hover = "#4f46e5"
        
        self.setup_ui()
    
    def setup_ui(self):
        """Создание интерфейса"""
        # Заголовок
        header_frame = tk.Frame(self.root, bg=self.bg_color, height=80)
        header_frame.pack(fill=tk.X, padx=20, pady=20)
        
        title_label = tk.Label(
            header_frame,
            text="🔍 OSINT Поиск",
            font=("Arial", 24, "bold"),
            fg=self.fg_color,
            bg=self.bg_color
        )
        title_label.pack(side=tk.LEFT)
        
        subtitle_label = tk.Label(
            header_frame,
            text="Поиск информации по ФИО",
            font=("Arial", 12),
            fg="#888888",
            bg=self.bg_color
        )
        subtitle_label.pack(side=tk.LEFT, padx=20)
        
        # Форма ввода
        form_frame = tk.Frame(self.root, bg=self.card_bg, padx=30, pady=30)
        form_frame.pack(fill=tk.X, padx=20, pady=10)
        
        # Поля ввода
        input_frame = tk.Frame(form_frame, bg=self.card_bg)
        input_frame.pack(fill=tk.X, pady=10)
        
        # Фамилия
        tk.Label(
            input_frame,
            text="Фамилия *",
            font=("Arial", 10),
            fg="#cccccc",
            bg=self.card_bg
        ).grid(row=0, column=0, sticky=tk.W, pady=5)
        
        self.last_name_var = tk.StringVar()
        self.last_name_entry = tk.Entry(
            input_frame,
            textvariable=self.last_name_var,
            font=("Arial", 12),
            bg="#0f1419",
            fg=self.fg_color,
            insertbackground=self.fg_color,
            relief=tk.FLAT,
            bd=0,
            width=25
        )
        self.last_name_entry.grid(row=1, column=0, padx=5, pady=5, sticky=tk.EW)
        self.last_name_entry.bind('<Return>', lambda e: self.search())
        
        # Имя
        tk.Label(
            input_frame,
            text="Имя *",
            font=("Arial", 10),
            fg="#cccccc",
            bg=self.card_bg
        ).grid(row=0, column=1, sticky=tk.W, pady=5, padx=10)
        
        self.first_name_var = tk.StringVar()
        self.first_name_entry = tk.Entry(
            input_frame,
            textvariable=self.first_name_var,
            font=("Arial", 12),
            bg="#0f1419",
            fg=self.fg_color,
            insertbackground=self.fg_color,
            relief=tk.FLAT,
            bd=0,
            width=25
        )
        self.first_name_entry.grid(row=1, column=1, padx=5, pady=5, sticky=tk.EW)
        self.first_name_entry.bind('<Return>', lambda e: self.search())
        
        # Отчество
        tk.Label(
            input_frame,
            text="Отчество",
            font=("Arial", 10),
            fg="#cccccc",
            bg=self.card_bg
        ).grid(row=0, column=2, sticky=tk.W, pady=5, padx=10)
        
        self.middle_name_var = tk.StringVar()
        self.middle_name_entry = tk.Entry(
            input_frame,
            textvariable=self.middle_name_var,
            font=("Arial", 12),
            bg="#0f1419",
            fg=self.fg_color,
            insertbackground=self.fg_color,
            relief=tk.FLAT,
            bd=0,
            width=25
        )
        self.middle_name_entry.grid(row=1, column=2, padx=5, pady=5, sticky=tk.EW)
        self.middle_name_entry.bind('<Return>', lambda e: self.search())
        
        # Настройка колонок
        input_frame.columnconfigure(0, weight=1)
        input_frame.columnconfigure(1, weight=1)
        input_frame.columnconfigure(2, weight=1)
        
        # Кнопка поиска
        self.search_button = tk.Button(
            form_frame,
            text="🔎 Найти информацию",
            font=("Arial", 12, "bold"),
            bg=self.button_bg,
            fg=self.fg_color,
            activebackground=self.button_hover,
            activeforeground=self.fg_color,
            relief=tk.FLAT,
            cursor="hand2",
            padx=30,
            pady=12,
            command=self.search
        )
        self.search_button.pack(pady=20)
        
        # Область результатов
        results_frame = tk.Frame(self.root, bg=self.bg_color)
        results_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)
        
        # Заголовок результатов
        self.results_header = tk.Label(
            results_frame,
            text="Результаты поиска",
            font=("Arial", 14, "bold"),
            fg=self.fg_color,
            bg=self.bg_color
        )
        self.results_header.pack(anchor=tk.W, pady=10)
        
        # Canvas с прокруткой
        canvas_frame = tk.Frame(results_frame, bg=self.bg_color)
        canvas_frame.pack(fill=tk.BOTH, expand=True)
        
        self.canvas = tk.Canvas(canvas_frame, bg=self.bg_color, highlightthickness=0)
        scrollbar = ttk.Scrollbar(canvas_frame, orient=tk.VERTICAL, command=self.canvas.yview)
        self.scrollable_frame = tk.Frame(self.canvas, bg=self.bg_color)
        
        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all"))
        )
        
        self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        self.canvas.configure(yscrollcommand=scrollbar.set)
        
        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Привязка прокрутки колесом мыши
        self.canvas.bind_all("<MouseWheel>", self._on_mousewheel)
        
        # Подсказка
        hint_label = tk.Label(
            self.root,
            text="💡 Введите ФИО и нажмите «Найти информацию» для поиска в открытых источниках",
            font=("Arial", 10),
            fg="#666666",
            bg=self.bg_color
        )
        hint_label.pack(pady=10)
    
    def _on_mousewheel(self, event):
        """Прокрутка колесом мыши"""
        self.canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")
    
    def generate_search_links(self):
        """Генерация ссылок для поиска"""
        last_name = self.last_name_var.get().strip()
        first_name = self.first_name_var.get().strip()
        middle_name = self.middle_name_var.get().strip()
        
        full_name = f"{last_name} {first_name} {middle_name}".strip()
        full_name_reverse = f"{first_name} {last_name}".strip()
        encoded = urllib.parse.quote(full_name)
        encoded_reverse = urllib.parse.quote(full_name_reverse)
        
        links = [
            # Поисковые системы
            ("Поисковые системы", "Google", f"https://www.google.com/search?q={encoded}", "#4285f4"),
            ("Поисковые системы", "Яндекс", f"https://yandex.ru/search/?text={encoded}", "#ff0000"),
            ("Поисковые системы", "Mail.ru", f"https://go.mail.ru/search?q={encoded}", "#005ff9"),
            ("Поисковые системы", "Bing", f"https://www.bing.com/search?q={encoded}", "#00809d"),
            ("Поисковые системы", "DuckDuckGo", f"https://duckduckgo.com/?q={encoded}", "#de5833"),
            
            # Социальные сети
            ("Социальные сети", "ВКонтакте", f"https://vk.com/search?q={encoded}", "#0077ff"),
            ("Социальные сети", "Одноклассники", f"https://ok.ru/search?q={encoded}", "#ee8208"),
            ("Социальные сети", "Facebook", f"https://www.facebook.com/search/top/?q={encoded}", "#1877f2"),
            ("Социальные сети", "Instagram", f"https://www.instagram.com/explore/tags/{encoded_reverse.replace('%20', '')}", "#e4405f"),
            ("Социальные сети", "LinkedIn", f"https://www.linkedin.com/search/results/all/?keywords={encoded}", "#0a66c2"),
            ("Социальные сети", "Twitter/X", f"https://twitter.com/search?q={encoded}", "#1da1f2"),
            ("Социальные сети", "Telegram", f"https://t.me/{first_name.lower()}{last_name.lower()}", "#0088cc"),
            
            # Профессиональные
            ("Профессиональные", "HeadHunter", f"https://hh.ru/search/resume?text={encoded}", "#d6001c"),
            ("Профессиональные", "Habr", f"https://habr.com/ru/search/?q={encoded}&target_type=articles", "#65a3cf"),
            ("Профессиональные", "GitHub", f"https://github.com/search?q={encoded}&type=users", "#333333"),
            
            # Государственные сервисы
            ("Государственные сервисы", "ФССП (Судебные приставы)", "https://fssp.gov.ru/isp/", "#6b46c1"),
            ("Государственные сервисы", "ФНС (ИНН)", "https://service.nalog.ru/prod.xhtml?mode=inn", "#059669"),
            ("Государственные сервисы", "Госуслуги", "https://www.gosuslugi.ru/", "#0d47a1"),
            
            # Безопасность
            ("Безопасность", "Have I Been Pwned", "https://haveibeenpwned.com/", "#dc2626"),
            
            # Дополнительный поиск
            ("Дополнительный поиск", "Поиск email/телефон", f"https://yandex.ru/search/?text={encoded}+email+телефон", "#4f46e5"),
            ("Дополнительный поиск", "Поиск по фото", f"https://images.google.com/?q={encoded}", "#f59e0b"),
        ]
        
        return links
    
    def search(self):
        """Выполнить поиск"""
        last_name = self.last_name_var.get().strip()
        first_name = self.first_name_var.get().strip()
        
        if not last_name and not first_name:
            messagebox.showwarning("Ошибка", "Введите хотя бы фамилию или имя")
            return
        
        # Очистка предыдущих результатов
        for widget in self.scrollable_frame.winfo_children():
            widget.destroy()
        
        # Генерация ссылок
        links = self.generate_search_links()
        
        # Группировка по категориям
        categories = {}
        for category, name, url, color in links:
            if category not in categories:
                categories[category] = []
            categories[category].append((name, url, color))
        
        # Отображение результатов
        self.results_header.config(text=f"Найдено {len(links)} источников")
        
        row = 0
        for category, items in categories.items():
            # Заголовок категории
            category_label = tk.Label(
                self.scrollable_frame,
                text=f"● {category}",
                font=("Arial", 12, "bold"),
                fg="#a78bfa",
                bg=self.bg_color
            )
            category_label.grid(row=row, column=0, sticky=tk.W, pady=(15, 5), padx=10)
            row += 1
            
            # Ссылки в категории
            links_frame = tk.Frame(self.scrollable_frame, bg=self.bg_color)
            links_frame.grid(row=row, column=0, sticky=tk.EW, pady=5, padx=10)
            
            col = 0
            for name, url, color in items:
                # Кнопка-ссылка
                btn = tk.Button(
                    links_frame,
                    text=f"{name} →",
                    font=("Arial", 10),
                    bg=self.card_bg,
                    fg=self.fg_color,
                    activebackground=color,
                    activeforeground=self.fg_color,
                    relief=tk.FLAT,
                    cursor="hand2",
                    padx=15,
                    pady=8,
                    width=20,
                    command=lambda u=url: webbrowser.open(u)
                )
                btn.grid(row=col // 4, column=col % 4, padx=5, pady=5, sticky=tk.EW)
                
                # Hover эффект
                btn.bind("<Enter>", lambda e, b=btn, c=color: b.config(bg=c))
                btn.bind("<Leave>", lambda e, b=btn: b.config(bg=self.card_bg))
                
                col += 1
            
            # Настройка колонок
            for i in range(4):
                links_frame.columnconfigure(i, weight=1)
            
            row += 1
        
        # Советы
        tips_frame = tk.Frame(self.scrollable_frame, bg="#78350f", padx=15, pady=15)
        tips_frame.grid(row=row, column=0, sticky=tk.EW, pady=20, padx=10)
        
        tk.Label(
            tips_frame,
            text="💡 Советы по поиску",
            font=("Arial", 11, "bold"),
            fg="#fbbf24",
            bg="#78350f"
        ).pack(anchor=tk.W)
        
        tips = [
            "• Используйте полное ФИО для более точного поиска",
            "• Если не нашли результат, попробуйте искать только по имени и фамилии",
            "• В социальных сетях ищите также по никнеймам и номерам телефонов",
            "• Проверяйте разные варианты написания (транслит, сокращения)",
            "• Используйте поиск по фото для идентификации в социальных сетях"
        ]
        
        for tip in tips:
            tk.Label(
                tips_frame,
                text=tip,
                font=("Arial", 9),
                fg="#fde68a",
                bg="#78350f",
                anchor=tk.W,
                justify=tk.LEFT
            ).pack(anchor=tk.W, pady=2)
        
        # Предупреждение
        warning_frame = tk.Frame(self.scrollable_frame, bg=self.card_bg, padx=15, pady=15)
        warning_frame.grid(row=row + 1, column=0, sticky=tk.EW, pady=10, padx=10)
        
        tk.Label(
            warning_frame,
            text="⚠️ Важная информация",
            font=("Arial", 11, "bold"),
            fg="#fbbf24",
            bg=self.card_bg
        ).pack(anchor=tk.W)
        
        tk.Label(
            warning_frame,
            text="Данный инструмент предоставляет ссылки на открытые источники информации.\n"
                 "Использование полученных данных должно соответствовать законодательству вашей страны.\n"
                 "Не используйте информацию для преследования или нарушения приватности других людей.",
            font=("Arial", 9),
            fg="#999999",
            bg=self.card_bg,
            anchor=tk.W,
            justify=tk.LEFT,
            wraplength=800
        ).pack(anchor=tk.W, pady=5)


def main():
    """Главная функция"""
    root = tk.Tk()
    app = OSINTSearchApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
