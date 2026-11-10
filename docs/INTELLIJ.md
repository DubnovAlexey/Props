# Доработка в IntelliJ IDEA и Claude Code

Пошаговая инструкция: как открыть игру на компьютере, запускать, отлаживать и дорабатывать вместе с Claude Code.

## 1. Что поставить

| Что                                | Зачем                                | Где взять                                   |
| ---------------------------------- | ------------------------------------ | ------------------------------------------- |
| **Node.js 22 LTS** (или 20.19+)    | запускает Vite, тесты и сборку       | [nodejs.org](https://nodejs.org/)           |
| **IntelliJ IDEA** или **WebStorm** | редактор                             | [jetbrains.com](https://www.jetbrains.com/) |
| **Git**                            | история изменений, пуш на GitHub     | [git-scm.com](https://git-scm.com/)         |
| **Claude Code**                    | помощник-программист в терминале IDE | см. раздел 6                                |

> Полная поддержка JavaScript, JSX и React в IntelliJ IDEA входит в подписку **Ultimate** (есть пробный период,
> для студентов и преподавателей — бесплатно). Бесплатная альтернатива от той же JetBrains — **WebStorm**
> (бесплатен для некоммерческого использования): проект открывается в нём точно так же. Условия меняются —
> проверь актуальные на сайте JetBrains.

## 2. Открыть проект

1. Распакуй архив в папку `проект/фулстак/` — получится `проект/фулстак/Props`.
2. IntelliJ: **File → Open…** → выбери папку `Props` → **Trust Project**.
3. IDE предложит выполнить `npm install` — соглашайся (или в терминале IDE: `npm install`).
4. **Settings → Languages & Frameworks → Node.js**: выбери установленный Node.js 22.

## 3. Запуск — готовые конфигурации

В папке `.run/` лежат конфигурации, IDE подхватит их сама (выпадающий список **Run** вверху справа):

| Конфигурация                | Что делает                                                             |
| --------------------------- | ---------------------------------------------------------------------- |
| 1. Игра: сервер разработки  | `npm run dev` → http://localhost:5173, изменения видны сразу           |
| 2. Тесты                    | `npm test` — проверка контента и логики (345+ проверок)                |
| 3. Проверка кода            | `npm run lint` — ESLint                                                |
| 4. Сборка                   | `npm run build` → папка `dist/`                                        |
| 5. Просмотр сборки          | `npm run preview` — как будет на GitHub Pages, с офлайн-режимом        |
| 6. Всё сразу перед коммитом | `npm run check` — lint + тесты + сборка                                |
| 7. Пересобрать свитки       | `npm run library` — после правки `docs/guide.md`                       |
| 8. Отладка в браузере       | после «1» открывает Chrome с отладчиком: точки останова прямо в `.jsx` |

## 4. Проверки при сохранении

- **ESLint:** Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint →
  **Automatic ESLint configuration**. Ошибки правил хуков подчёркиваются прямо в редакторе.
- **Prettier:** Settings → Languages & Frameworks → JavaScript → Prettier → **Automatic Prettier configuration**
  и галочка **Run on save**. Настройки — в `.prettierrc.json`.
- **EditorConfig** (`.editorconfig`) IDE понимает сама: отступ 2 пробела, UTF-8, перевод строки LF.

## 5. Отладка

1. Запусти «1. Игра: сервер разработки».
2. Поставь точку останова (клик слева от номера строки), например в `handleAnswer` в
   `src/features/practice/PracticeRunner.jsx`.
3. Запусти «8. Отладка в браузере» и ответь на задание — выполнение остановится на точке.
4. Дополнительно поставь в браузер **React Developer Tools**: вкладка Components показывает пропсы каждого
   компонента — это лучший способ увидеть пропсы вживую.

## 6. Claude Code в IntelliJ

**Установка CLI** (один раз, в обычном терминале):

```text
macOS / Linux / WSL:   curl -fsSL https://claude.ai/install.sh | bash
Windows PowerShell:    irm https://claude.ai/install.ps1 | iex
Проверка:              claude --version
```

Нужна подписка Claude (Pro, Max, Team или Enterprise) или аккаунт Claude Console — при первом запуске `claude`
попросит войти.

**Плагин:** Settings → Plugins → Marketplace → найди **Claude Code [Beta]** → Install → перезапусти IDE.
Плагин не содержит самого Claude Code — он запускает установленный `claude` во встроенном терминале и
связывается с ним.

**Работа:**

1. Открой терминал IDE (он стартует в корне проекта) и набери `claude`. Или нажми **Ctrl+Esc** (macOS — **Cmd+Esc**).
2. Claude Code сам прочитает `CLAUDE.md` — правила проекта.
3. Вставь промпт из `docs/PROMPT.md` и допиши свою задачу.
4. Изменения откроются в штатном окне сравнения IDE (diff) — смотри и принимай.
5. Ссылку на файл в запрос вставляет **Alt+Ctrl+K** (macOS — **Cmd+Option+K**); выделенный в редакторе код
   Claude видит автоматически.
6. Если `claude` запущен во внешнем терминале — команда `/ide` подключит его к IntelliJ.

**Полезные настройки:**

- Settings → Tools → **Claude Code [Beta]** → Claude command: путь к `claude`, если IDE его не находит.
- Если **Esc** не прерывает Claude: Settings → Tools → Terminal → сними галочку
  «Move focus to the editor with Escape».
- Для безопасности в JetBrains лучше подтверждать правки вручную, а не включать режим автопринятия: так Claude
  не изменит конфигурацию IDE без спроса.

## 7. Git и публикация

1. **VCS → Enable Version Control Integration → Git** (или `git init` в терминале).
2. Коммиты и пуши делаешь сам: окно **Commit** (Ctrl+K / Cmd+K), затем **Push** (Ctrl+Shift+K / Cmd+Shift+K).
3. На GitHub: **Settings → Pages → Source: GitHub Actions**. Файл `.github/workflows/deploy.yml` уже настроен:
   каждый пуш в `main` проверяет тесты, собирает и публикует игру.
4. С адреса GitHub Pages игру можно установить на телефон и играть без интернета (страница «📲 Играть без интернета»).
