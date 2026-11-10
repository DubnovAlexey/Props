<!--suppress MarkdownUnresolvedFileReference -->

# Props — Пещеры Графа Пропсулы 🦇

<a id="top"></a>

**Язык / Language / שפה / Idioma / Langue:**
[Русский](#ru) · [English](#en) · [עברית](#he) · [Español](#es) · [Français](#fr)

▶ **Играть / Play:** <https://dubnovalexey.github.io/Props/>

📲 **Как установить на iPhone, Android или компьютер / How to install:** [Русский](#install-ru) · [English](#install-en) · [עברית](#install-he) · [Español](#install-es) · [Français](#install-fr)

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

**Неожиданности.** Иногда по экрану кто-то пролетает или пробегает: летучая мышь с горящими глазами, гоблин
с факелом, тролль, банши. Секунда испуга встряхивает внимание — мозг отдыхает и возвращается к задаче свежим.
Мешает — выключается внизу карты пещер. Тем, кто попросил устройство уменьшить движение, они не показываются.

<a id="install-ru"></a>

### 📲 Как установить игру — по шагам

Игра открывается по ссылке **<https://dubnovalexey.github.io/Props/>** в любом браузере — ничего устанавливать не обязательно. Но если её
установить, она появится значком на экране, как обычное приложение, и будет работать **без интернета**.
Выберите своё устройство.

#### 1. 📱 iPhone или iPad

1. Откройте ссылку в браузере **Safari** (синий значок с компасом).
2. Нажмите кнопку **«Поделиться»** — квадрат со стрелкой вверх, обычно внизу экрана.
3. Прокрутите список и выберите **«На экран „Домой“»**.
4. Нажмите **«Добавить»** справа вверху.
5. На экране телефона появится значок **Props**. Откройте игру с него один раз при включённом интернете
   и подождите полминуты — игра сохранится в телефон.

#### 2. 🤖 Android

1. Откройте ссылку в браузере **Chrome**.
2. Нажмите **три точки ⋮** справа вверху.
3. Выберите **«Добавить на гл. экран»** (или **«Установить приложение»**) и подтвердите — **«Установить»**.
4. Значок **Props** появится на главном экране. Откройте игру с него один раз при включённом интернете.

#### 3. 💻 Компьютер (Windows или Mac)

**Способ А — скачать одним файлом (проще всего):**

1. Откройте игру по ссылке и внизу карты пещер нажмите **«📲 Играть без интернета»**.
2. Нажмите **«⬇️ Скачать Props.html»**. Файл окажется в папке «Загрузки».
3. Дважды щёлкните по файлу — игра откроется в браузере. Интернет больше не нужен; файл можно переслать другу
   или положить на флешку.

**Способ Б — установить как приложение:** откройте ссылку в **Chrome** или **Edge**, нажмите значок установки
в правой части адресной строки (монитор со стрелкой) и подтвердите — **«Установить»**.

**Как проверить, что всё получилось.** Включите авиарежим (или отключите Wi‑Fi) и откройте игру — она должна
работать.

**Важно знать.** Ваши успехи хранятся на том устройстве, где вы играете: на телефоне — свои, на компьютере — свои.

**Быстрый старт** (нужен Node.js 20.19+ или 22.12+):

```bash
npm install
npm run dev      # http://localhost:5173
```

| Команда                | Что делает                                                    |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | сервер разработки, изменения видны сразу                      |
| `npm test`             | тесты: целостность контента и логика (364 проверок)           |
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

**Surprises.** Now and then something flies or runs across the screen: a bat with burning eyes, a goblin with
a torch, a troll, a banshee. A second of fright resets your attention, and you return to the task refreshed.
You can switch them off at the bottom of the cave map. They never appear if your device asks for reduced motion.

<a id="install-en"></a>

### 📲 How to install the game — step by step

The game opens from the link **<https://dubnovalexey.github.io/Props/>** in any browser — you don't have to install anything. If you do install
it, it gets an icon on your screen like a normal app and works **without the internet**. Pick your device.

#### 1. 📱 iPhone or iPad

1. Open the link in **Safari** (the blue compass icon).
2. Tap the **Share** button — a square with an arrow pointing up, usually at the bottom of the screen.
3. Scroll the list and choose **Add to Home Screen**.
4. Tap **Add** in the top right corner.
5. A **Props** icon appears on your Home Screen. Open the game from it once while you are online and wait half
   a minute — the game saves itself to the phone.

#### 2. 🤖 Android

1. Open the link in **Chrome**.
2. Tap the **three dots ⋮** in the top right corner.
3. Choose **Add to Home screen** (or **Install app**) and confirm with **Install**.
4. The **Props** icon appears on your home screen. Open the game from it once while you are online.

#### 3. 💻 Computer (Windows or Mac)

**Option A — download one file (the easiest):**

1. Open the game from the link and, at the bottom of the cave map, click **«📲 Играть без интернета»**
   (the game is in Russian for now).
2. Click **«⬇️ Скачать Props.html»**. The file lands in your Downloads folder.
3. Double-click the file — the game opens in your browser. No internet needed any more; you can send the file
   to a friend or put it on a USB stick.

**Option B — install it as an app:** open the link in **Chrome** or **Edge**, click the install icon at the right
end of the address bar (a monitor with an arrow) and confirm with **Install**.

**How to check it worked.** Turn on airplane mode (or switch Wi‑Fi off) and open the game — it should still work.

**Good to know.** Your progress is stored on the device you play on: the phone keeps its own, the computer keeps
its own.

**Quick start** (Node.js 20.19+ or 22.12+):

```bash
npm install
npm run dev      # http://localhost:5173
```

| Command                | What it does                                                   |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | dev server with instant updates                                |
| `npm test`             | tests: content integrity and logic (364 checks)                |
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

**הפתעות.** מדי פעם משהו עף או רץ על פני המסך: עטלף עם עיניים בוערות, גובלין עם לפיד, טרול, בנשי. שנייה של
בהלה מרעננת את הקשב, וחוזרים למשימה רעננים. אפשר לכבות אותן בתחתית מפת המערות. אם במכשיר מופעלת «הפחתת
תנועה», הן לא מופיעות כלל.

<a id="install-he"></a>

### 📲 איך מתקינים את המשחק — שלב אחר שלב

המשחק נפתח מהקישור **<https://dubnovalexey.github.io/Props/>** בכל דפדפן — לא חייבים להתקין כלום. אבל אם מתקינים, הוא מופיע כסמל על המסך כמו
אפליקציה רגילה ועובד **בלי אינטרנט**. בחרו את המכשיר שלכם.

#### 1. 📱 iPhone או iPad

1. פתחו את הקישור בדפדפן **Safari** (הסמל הכחול עם המצפן).
2. הקישו על כפתור **«שיתוף»** — ריבוע עם חץ למעלה, בדרך כלל בתחתית המסך.
3. גללו ברשימה ובחרו **«הוסף למסך הבית»**.
4. הקישו על **«הוסף»** בפינה העליונה.
5. על מסך הבית יופיע הסמל **Props**. פתחו ממנו את המשחק פעם אחת כשיש אינטרנט וחכו חצי דקה — המשחק יישמר
   בטלפון.

#### 2. 🤖 Android

1. פתחו את הקישור בדפדפן **Chrome**.
2. הקישו על **שלוש הנקודות ⋮** בפינה העליונה.
3. בחרו **«הוספה למסך הבית»** (או **«התקנת האפליקציה»**) ואשרו — **«התקנה»**.
4. הסמל **Props** יופיע במסך הבית. פתחו ממנו את המשחק פעם אחת כשיש אינטרנט.

#### 3. 💻 מחשב (Windows או Mac)

**דרך א׳ — להוריד קובץ אחד (הכי פשוט):**

1. פתחו את המשחק מהקישור, ובתחתית מפת המערות לחצו על **«📲 Играть без интернета»** (המשחק כרגע ברוסית).
2. לחצו על **«⬇️ Скачать Props.html»**. הקובץ יישמר בתיקיית «הורדות».
3. לחצו לחיצה כפולה על הקובץ — המשחק ייפתח בדפדפן. אין יותר צורך באינטרנט; אפשר לשלוח את הקובץ לחבר
   או לשים אותו על דיסק און קי.

**דרך ב׳ — להתקין כאפליקציה:** פתחו את הקישור ב‑**Chrome** או ב‑**Edge**, לחצו על סמל ההתקנה בקצה שורת
הכתובת (מסך עם חץ) ואשרו — **«התקנה»**.

**איך בודקים שהצליח.** הפעילו מצב טיסה (או כבו את ה‑Wi‑Fi) ופתחו את המשחק — הוא אמור לעבוד.

**חשוב לדעת.** ההתקדמות נשמרת במכשיר שבו משחקים: לטלפון יש התקדמות משלו, ולמחשב משלו.

**התחלה מהירה** (Node.js 20.19+ או 22.12+):

<div dir="ltr">

```bash
npm install
npm run dev      # http://localhost:5173
```

</div>

**פקודות:** `npm run dev` — שרת פיתוח · `npm test` — בדיקות (364) · `npm run lint` — ESLint ·
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

**Sobresaltos.** De vez en cuando algo cruza la pantalla volando o corriendo: un murciélago de ojos ardientes,
un goblin con antorcha, un trol, una banshee. Un segundo de susto despeja la atención y vuelves a la tarea con
la mente fresca. Se desactivan al final del mapa de cuevas. Si tu dispositivo pide reducir el movimiento, no
aparecen.

<a id="install-es"></a>

### 📲 Cómo instalar el juego — paso a paso

El juego se abre con el enlace **<https://dubnovalexey.github.io/Props/>** en cualquier navegador: no hace falta instalar nada. Pero si lo
instalas, aparece como un icono en la pantalla, igual que una aplicación normal, y funciona **sin internet**.
Elige tu dispositivo.

#### 1. 📱 iPhone o iPad

1. Abre el enlace en **Safari** (el icono azul con una brújula).
2. Toca el botón **Compartir**: un cuadrado con una flecha hacia arriba, normalmente en la parte inferior
   de la pantalla.
3. Desplázate por la lista y elige **Añadir a pantalla de inicio**.
4. Toca **Añadir** arriba a la derecha.
5. En la pantalla aparecerá el icono **Props**. Abre el juego desde él una vez con internet y espera medio
   minuto: el juego se guardará en el teléfono.

#### 2. 🤖 Android

1. Abre el enlace en **Chrome**.
2. Toca los **tres puntos ⋮** arriba a la derecha.
3. Elige **Añadir a pantalla de inicio** (o **Instalar aplicación**) y confirma con **Instalar**.
4. El icono **Props** aparecerá en la pantalla de inicio. Abre el juego desde él una vez con internet.

#### 3. 💻 Ordenador (Windows o Mac)

**Opción A: descargar un solo archivo (lo más fácil).**

1. Abre el juego con el enlace y, al final del mapa de cuevas, haz clic en **«📲 Играть без интернета»**
   (por ahora el juego está en ruso).
2. Haz clic en **«⬇️ Скачать Props.html»**. El archivo quedará en la carpeta Descargas.
3. Haz doble clic en el archivo: el juego se abrirá en el navegador. Ya no necesitas internet; puedes enviar
   el archivo a un amigo o guardarlo en una memoria USB.

**Opción B: instalarlo como aplicación.** Abre el enlace en **Chrome** o **Edge**, haz clic en el icono de
instalación al final de la barra de direcciones (un monitor con una flecha) y confirma con **Instalar**.

**Cómo comprobar que ha funcionado.** Activa el modo avión (o apaga el wifi) y abre el juego: debe seguir
funcionando.

**Conviene saber.** Tu progreso se guarda en el dispositivo en el que juegas: el teléfono tiene el suyo
y el ordenador, el suyo.

**Inicio rápido** (Node.js 20.19+ o 22.12+):

```bash
npm install
npm run dev      # http://localhost:5173
```

**Comandos:** `npm run dev` — servidor de desarrollo · `npm test` — pruebas (364) · `npm run lint` — ESLint ·
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

<a id="install-fr"></a>

### 📲 Comment installer le jeu — pas à pas

Le jeu s'ouvre avec le lien **<https://dubnovalexey.github.io/Props/>** dans n'importe quel navigateur : il n'est pas nécessaire d'installer quoi
que ce soit. Mais une fois installé, il apparaît comme une icône sur l'écran, comme une application ordinaire,
et fonctionne **sans internet**. Choisissez votre appareil.

#### 1. 📱 iPhone ou iPad

1. Ouvrez le lien dans **Safari** (l'icône bleue avec une boussole).
2. Touchez le bouton **Partager** : un carré avec une flèche vers le haut, en général en bas de l'écran.
3. Faites défiler la liste et choisissez **Sur l'écran d'accueil**.
4. Touchez **Ajouter** en haut à droite.
5. L'icône **Props** apparaît sur l'écran d'accueil. Ouvrez le jeu depuis cette icône une première fois avec
   internet et patientez une demi-minute : le jeu s'enregistre dans le téléphone.

#### 2. 🤖 Android

1. Ouvrez le lien dans **Chrome**.
2. Touchez les **trois points ⋮** en haut à droite.
3. Choisissez **Ajouter à l'écran d'accueil** (ou **Installer l'application**) et confirmez avec **Installer**.
4. L'icône **Props** apparaît sur l'écran d'accueil. Ouvrez le jeu depuis cette icône une première fois avec
   internet.

#### 3. 💻 Ordinateur (Windows ou Mac)

**Option A — télécharger un seul fichier (le plus simple) :**

1. Ouvrez le jeu avec le lien et, en bas de la carte des grottes, cliquez sur **«📲 Играть без интернета»**
   (le jeu est en russe pour l'instant).
2. Cliquez sur **«⬇️ Скачать Props.html»**. Le fichier arrive dans le dossier Téléchargements.
3. Double-cliquez sur le fichier : le jeu s'ouvre dans le navigateur. Plus besoin d'internet ; vous pouvez
   envoyer le fichier à un ami ou le mettre sur une clé USB.

**Option B — l'installer comme une application :** ouvrez le lien dans **Chrome** ou **Edge**, cliquez sur
l'icône d'installation au bout de la barre d'adresse (un écran avec une flèche) et confirmez avec **Installer**.

**Comment vérifier que tout a fonctionné.** Activez le mode avion (ou coupez le Wi‑Fi) et ouvrez le jeu : il doit
continuer à fonctionner.

**Bon à savoir.** Votre progression est enregistrée sur l'appareil avec lequel vous jouez : le téléphone a la
sienne, l'ordinateur aussi.

**Démarrage rapide** (Node.js 20.19+ ou 22.12+) :

```bash
npm install
npm run dev      # http://localhost:5173
```

**Commandes :** `npm run dev` — serveur de développement · `npm test` — tests (364) · `npm run lint` — ESLint ·
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
