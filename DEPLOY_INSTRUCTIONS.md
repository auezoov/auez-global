# 🚀 Инструкции по деплою в GitHub

## 1. Установка Git (если не установлен)

### Windows:
1. Скачайте Git с официального сайта: https://git-scm.com/download/win
2. Установите Git Bash (рекомендуется)
3. Перезапустите терминал после установки

### Или через GitHub Desktop:
1. Установите GitHub Desktop: https://desktop.github.com/
2. Откройте репозиторий через GUI
3. Используйте встроенный терминал

## 2. Инициализация репозитория

После установки Git выполните команды:

```bash
git init
git add .
git commit -m "Deploy to cloud 24/7"
git branch -M main
git remote add origin [ВАША_ССЫЛКА_РЕПОЗИТОРИЯ]
git push -u origin main
```

## 3. Подготовка проекта ✅

- ✅ `start.sh` - скрипт запуска
- ✅ `package.json` - с командой "start"
- ✅ `.gitignore` - настроен правильно
- ✅ База данных SQLite - авто-создание
- ✅ Cyberpunk главная страница

## 4. Запуск на хостинге

На большинстве хостингов:
```bash
npm install
npm start
```

## 5. Публичный URL для тестов

**https://imaginably-glycosidic-joetta.ngrok-free.dev**

## 6. Структура проекта

```
auez/
├── server-pro.js          # Основной сервер
├── package.json          # Зависимости и скрипты
├── start.sh            # Скрипт запуска
├── .gitignore          # Исключения Git
├── src/                # Frontend код
├── public/             # Статические файлы
└── auez.db            # База данных SQLite
```

Проект готов к облачному хостингу 24/7! 🌐
