# Props — Пещеры Графа Пропсулы 🦇

<a id="top"></a>

**Язык / Language / שפה / Idioma / Langue:**
[Русский](#ru) · [English](#en) · [עברית](#he) · [Español](#es) · [Français](#fr)

▶ **Играть / Play:** <https://dubnovalexey.github.io/Props/>

---

<a id="ru"></a>

## Русский

Игра-тренажёр по **пропсам в React** и всему, без чего их не понять. Спускаешься по 18 пещерам — от устройства
проекта до паттернов, — в каждой побеждаешь злобного хозяина-чудище, а учит тебя вампир **Граф Пропсула**.

| Что внутри                                                                | Сколько                                |
| ------------------------------------------------------------------------- | -------------------------------------- |
| Пещеры (темы) на трёх ярусах                                              | 18 + логово Графа (итоговое испытание) |
| Карточки урока — все со схемами или иллюстрациями                         | 103                                    |
| Примеры кода с «анатомией» и разбором «почему так / как ещё / как нельзя» | 95                                     |
| Задания восьми типов, сложность ★ → ★★★                                   | 144                                    |
| Термины словаря с английским и кодовым написанием                         | 117                                    |
| Свитки теории: конспекты пещер + полное руководство                       | 18 + 20 разделов                       |

**Как устроена учёба.** Каждая пещера — это шаги: разминка → урок → заклинание → практика (8 заданий) →
«Объясни Лунатику» → перемена → итог. Хозяин пещеры повержен, если в практике верно **5 заданий из 8**. Ошибки
попадают в «склеп повторения» и возвращаются по системе Лейтнера.

**Играть без интернета.** Игру можно установить как приложение на Android, iPhone и компьютер (страница
«Играть без интернета» в игре) — после первого открытия она работает офлайн. Там же можно скачать всю игру одним
файлом `Props.html`: он открывается двойным щелчком на компьютере и не требует ни сервера, ни сети.

**Быстрый старт** (нужен Node.js 20.19+ или 22.12+):

```bash
npm install
npm run dev      # http://localhost:5173
```

| Команда                | Что делает                                                    |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | сервер разработки, изменения видны сразу                      |
| `npm test`             | тесты: целостность контента и логика (347 проверок)           |
| `npm run lint`         | ESLint: ошибки и правила хуков                                |
| `npm run format`       | Prettier: единый стиль кода                                   |
| `npm run build`        | сборка сайта в `dist/` (+ `sw.js` для офлайна и `Props.html`) |
| `npm run build:single` | только «всё в одном файле»: `dist-single/Props.html`          |
| `npm run preview`      | посмотреть сборку как на GitHub Pages                         |
| `npm run check`        | lint + тесты + сборка — перед каждым коммитом                 |
| `npm run library`      | пересобрать «Свитки Графа» из `docs/guide.md`                 |

**Технологии вкратце.** React 19 и Vite 8, обычный JavaScript (без TypeScript), CSS-модули. Маршруты, подсветка
кода, подсказки, Markdown и звуки написаны вручную — без библиотек: код игры сам служит учебным материалом.
Офлайн-режим — свой сервис-воркер (`build/serviceWorkerPlugin.js`), сборка одним файлом —
`build/singleFilePlugin.js`. Публикация — GitHub Actions → GitHub Pages (в настройках репозитория:
**Settings → Pages → Source: GitHub Actions**).

**Языки.** Сейчас игра на русском. Интерфейс и уроки на английском, иврите, испанском и французском — в работе.

Подробнее: [docs/INTELLIJ.md](docs/INTELLIJ.md) (работа в IntelliJ IDEA), [docs/PROMPT.md](docs/PROMPT.md),
[CHANGELOG.md](CHANGELOG.md), правила проекта — [CLAUDE.md](CLAUDE.md).

[↑ наверх](#top)

---

<a id="en"></a>

## English

A learning game about **props in React** and everything you need to understand them. You descend through 18 caves —
from project setup to patterns — defeat a monster guardian in each, and your teacher is the vampire
**Count Propsula**.

| Inside                                                                  | How many                           |
| ----------------------------------------------------------------------- | ---------------------------------- |
| Caves (topics) on three tiers                                           | 18 + the Count's lair (final exam) |
| Lesson cards, each with a scheme or an illustration                     | 103                                |
| Code samples with "anatomy" and "why / what else works / what is wrong" | 95                                 |
| Tasks of eight kinds, difficulty ★ → ★★★                                | 144                                |
| Glossary terms with English and in-code spelling                        | 117                                |
| Theory scrolls: cave summaries + the full guide                         | 18 + 20 sections                   |

**How learning works.** Every cave is a path: warm-up → lesson → spell → practice (8 tasks) → "Explain it to the
bat" → break → summary. The guardian is defeated when **5 of 8** practice tasks are correct. Mistakes go to the
"crypt of repetition" and come back on a Leitner schedule.

**Play offline.** The game installs as an app on Android, iPhone and desktop (see the "Play offline" page in the
game) and works without a connection after the first visit. The same page offers the whole game as one file,
`Props.html`: double-click it on a computer — no server, no network.

**Quick start** (Node.js 20.19+ or 22.12+):

```bash
npm install
npm run dev      # http://localhost:5173
```

| Command                | What it does                                                   |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | dev server with instant updates                                |
| `npm test`             | tests: content integrity and logic (347 checks)                |
| `npm run lint`         | ESLint: errors and the rules of hooks                          |
| `npm run format`       | Prettier: one code style                                       |
| `npm run build`        | site build in `dist/` (+ `sw.js` for offline and `Props.html`) |
| `npm run build:single` | the single-file build only: `dist-single/Props.html`           |
| `npm run preview`      | preview the build the way GitHub Pages serves it               |
| `npm run check`        | lint + tests + build — before every commit                     |
| `npm run library`      | rebuild the theory scrolls from `docs/guide.md`                |

**Tech in brief.** React 19 and Vite 8, plain JavaScript (no TypeScript), CSS modules. Routing, code highlighting,
tooltips, Markdown and sounds are written by hand, without libraries: the game's own code is study material too.
Offline mode is a custom service worker (`build/serviceWorkerPlugin.js`); the single-file build is
`build/singleFilePlugin.js`. Deployment: GitHub Actions → GitHub Pages (repository
**Settings → Pages → Source: GitHub Actions**).

**Languages.** The game is in Russian for now. English, Hebrew, Spanish and French are in progress.

[↑ top](#top)

---

<a id="he"></a>

## עברית

<div dir="rtl">

משחק לימודי על **props ב‑React** ועל כל מה שצריך כדי להבין אותם. יורדים דרך 18 מערות — ממבנה הפרויקט ועד
תבניות עיצוב — בכל מערה מביסים מפלצת‑שומר, והמורה הוא הערפד **הרוזן פרופסולה**.

**מה בפנים:** 18 מערות בשלוש קומות ומאורת הרוזן (מבחן מסכם) · 103 כרטיסי שיעור עם תרשימים · 95 דוגמאות קוד
עם פירוק «למה כך / איך אפשר אחרת / איך אסור» · 144 משימות משמונה סוגים · 117 מונחים במילון · מגילות תיאוריה:
18 סיכומים ועוד 20 פרקי מדריך.

**איך לומדים.** כל מערה היא מסלול: חימום ← שיעור ← לחש ← תרגול (8 משימות) ← «הסבר לעטלף» ← הפסקה ← סיכום.
השומר מובס כאשר **5 מתוך 8** משימות התרגול נכונות. הטעויות עוברות ל«קריפטת החזרה» וחוזרות לפי שיטת לייטנר.

**משחק בלי אינטרנט.** אפשר להתקין את המשחק כאפליקציה ב‑Android, ב‑iPhone ובמחשב (העמוד «לשחק בלי אינטרנט»
במשחק) — אחרי הפתיחה הראשונה הוא עובד גם בלי חיבור. באותו עמוד אפשר להוריד את כל המשחק כקובץ אחד,
`Props.html`: במחשב פותחים אותו בלחיצה כפולה, בלי שרת ובלי רשת.

**התחלה מהירה** (Node.js 20.19+ או 22.12+):

<div dir="ltr">

```bash
npm install
npm run dev      # http://localhost:5173
```

</div>

**פקודות:** `npm run dev` — שרת פיתוח · `npm test` — בדיקות (347) · `npm run lint` — ESLint ·
`npm run format` — Prettier · `npm run build` — בניית האתר ל‑`dist/` (כולל `sw.js` ו‑`Props.html`) ·
`npm run build:single` — קובץ אחד בלבד · `npm run preview` — תצוגת הבנייה · `npm run check` — הכול יחד לפני commit.

**טכנולוגיות בקצרה.** React 19 ו‑Vite 8, JavaScript רגיל (בלי TypeScript), CSS modules. הניתוב, הדגשת הקוד,
חלוניות ההסבר, Markdown והצלילים נכתבו ביד, בלי ספריות: גם הקוד של המשחק הוא חומר לימוד. מצב לא מקוון —
service worker משלנו (`build/serviceWorkerPlugin.js`); בנייה לקובץ אחד — `build/singleFilePlugin.js`.
פרסום: GitHub Actions ← GitHub Pages (בהגדרות המאגר: **Settings → Pages → Source: GitHub Actions**).

**שפות.** כרגע המשחק ברוסית. אנגלית, עברית, ספרדית וצרפתית — בעבודה.

</div>

[↑ למעלה](#top)

---

<a id="es"></a>

## Español

Un juego para aprender las **props de React** y todo lo necesario para entenderlas. Bajas por 18 cuevas —desde la
estructura del proyecto hasta los patrones—, en cada una vences a un monstruo guardián, y tu maestro es el vampiro
**Conde Propsula**.

**Qué hay dentro:** 18 cuevas en tres niveles y la guarida del Conde (examen final) · 103 tarjetas de lección con
esquemas · 95 ejemplos de código con el análisis «por qué así / de qué otra forma / cómo no» · 144 tareas de ocho
tipos · 117 términos en el glosario · pergaminos de teoría: 18 resúmenes y 20 secciones de la guía.

**Cómo se aprende.** Cada cueva es un camino: calentamiento → lección → conjuro → práctica (8 tareas) →
«Explícaselo al murciélago» → recreo → resumen. El guardián cae cuando aciertas **5 de 8** tareas de la práctica.
Los errores van a la «cripta de repaso» y vuelven según el sistema de Leitner.

**Jugar sin conexión.** El juego se instala como aplicación en Android, iPhone y ordenador (página «Jugar sin
internet» dentro del juego) y funciona sin conexión después de la primera visita. En la misma página se puede
descargar todo el juego en un solo archivo, `Props.html`: en un ordenador se abre con doble clic, sin servidor ni
red.

**Inicio rápido** (Node.js 20.19+ o 22.12+):

```bash
npm install
npm run dev      # http://localhost:5173
```

**Comandos:** `npm run dev` — servidor de desarrollo · `npm test` — pruebas (347) · `npm run lint` — ESLint ·
`npm run format` — Prettier · `npm run build` — compila el sitio en `dist/` (con `sw.js` y `Props.html`) ·
`npm run build:single` — solo el archivo único · `npm run preview` — vista previa de la compilación ·
`npm run check` — todo junto antes de cada commit.

**Tecnología en breve.** React 19 y Vite 8, JavaScript sin TypeScript, módulos CSS. El enrutado, el resaltado de
código, las ayudas emergentes, Markdown y los sonidos están escritos a mano, sin bibliotecas: el propio código del
juego también es material de estudio. El modo sin conexión es un service worker propio
(`build/serviceWorkerPlugin.js`); el archivo único lo genera `build/singleFilePlugin.js`. Publicación: GitHub
Actions → GitHub Pages (en el repositorio: **Settings → Pages → Source: GitHub Actions**).

**Idiomas.** Por ahora el juego está en ruso. Inglés, hebreo, español y francés están en preparación.

[↑ arriba](#top)

---

<a id="fr"></a>

## Français

Un jeu pour apprendre les **props de React** et tout ce qu'il faut pour les comprendre. On descend à travers
18 grottes — de la structure du projet jusqu'aux patterns —, on y bat à chaque fois un monstre gardien, et le
professeur est le vampire **Comte Propsula**.

**Ce qu'il contient :** 18 grottes sur trois niveaux et le repaire du Comte (examen final) · 103 cartes de leçon
avec schémas · 95 exemples de code avec l'analyse « pourquoi ainsi / comment faire autrement / ce qu'il ne faut
pas faire » · 144 exercices de huit types · 117 termes dans le glossaire · parchemins de théorie : 18 résumés et
20 sections du guide.

**Comment on apprend.** Chaque grotte est un parcours : échauffement → leçon → sortilège → pratique (8 exercices) →
« Explique-le à la chauve-souris » → pause → bilan. Le gardien est vaincu quand **5 exercices sur 8** sont justes.
Les erreurs partent dans la « crypte de révision » et reviennent selon le système de Leitner.

**Jouer hors ligne.** Le jeu s'installe comme une application sur Android, iPhone et ordinateur (page « Jouer sans
internet » dans le jeu) et fonctionne sans connexion après la première visite. La même page permet de télécharger
tout le jeu en un seul fichier, `Props.html` : sur un ordinateur, un double-clic suffit, sans serveur ni réseau.

**Démarrage rapide** (Node.js 20.19+ ou 22.12+) :

```bash
npm install
npm run dev      # http://localhost:5173
```

**Commandes :** `npm run dev` — serveur de développement · `npm test` — tests (347) · `npm run lint` — ESLint ·
`npm run format` — Prettier · `npm run build` — construit le site dans `dist/` (avec `sw.js` et `Props.html`) ·
`npm run build:single` — le fichier unique seulement · `npm run preview` — aperçu du build ·
`npm run check` — tout à la fois avant chaque commit.

**La technique en bref.** React 19 et Vite 8, JavaScript sans TypeScript, modules CSS. Le routage, la coloration du
code, les infobulles, Markdown et les sons sont écrits à la main, sans bibliothèques : le code du jeu sert lui
aussi de support d'étude. Le mode hors ligne repose sur un service worker maison
(`build/serviceWorkerPlugin.js`) ; le fichier unique est produit par `build/singleFilePlugin.js`. Publication :
GitHub Actions → GitHub Pages (dans le dépôt : **Settings → Pages → Source: GitHub Actions**).

**Langues.** Pour l'instant, le jeu est en russe. L'anglais, l'hébreu, l'espagnol et le français sont en cours.

[↑ haut](#top)
