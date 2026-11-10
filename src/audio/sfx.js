// Звуки игры, синтезированные Web Audio API: ни одного звукового файла,
// поэтому всё работает офлайн и почти ничего не весит.
// Звук — мгновенная обратная связь: мозг связывает ответ с результатом
// быстрее, чем успевает прочитать текст (приём «немедленная обратная связь»).
// Браузер разрешает звук только после жеста пользователя — поэтому
// AudioContext создаётся лениво, при первом звуке (он всегда после клика).

let ctx = null;
let master = null;
let enabled = true;

/** Включить или выключить звук (настройка хранится в прогрессе) */
export function setSoundEnabled(value) {
  enabled = value;
}

function audio() {
  if (!enabled || typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioCtx) return null;
  try {
    if (!ctx) {
      ctx = new AudioCtx();
      master = ctx.createGain();
      master.gain.value = 0.32;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/**
 * Контекст звука — только если он уже работает. Неожиданности появляются сами, без нажатия,
 * а без нажатия браузер звук не разрешает: поэтому здесь ничего не создаём и не «будим».
 */
function running() {
  return enabled && ctx && ctx.state === 'running' ? ctx : null;
}

// Первый же щелчок или нажатие клавиши «открывает» звук: браузер не даёт странице звучать,
// пока человек сам что-нибудь не нажал. Без этого неожиданности молчали бы до первого ответа.
if (typeof window !== 'undefined') {
  const unlock = () => audio();
  window.addEventListener('click', unlock, { once: true, capture: true });
  window.addEventListener('keydown', unlock, { once: true, capture: true });
}

/** Одна нота: частота, начало (с), длительность (с), тембр, громкость */
function tone(ac, { freq, start = 0, dur = 0.4, type = 'sine', gain = 0.5, glide }) {
  const t = ac.currentTime + start;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (glide) osc.frequency.exponentialRampToValueAtTime(glide, t + dur);
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(amp).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/** Шум: шипение вампира или свист крыльев */
function noise(ac, { start = 0, dur = 0.3, gain = 0.25, from = 3000, to = 800, type = 'bandpass' }) {
  const t = ac.currentTime + start;
  const length = Math.floor(ac.sampleRate * dur);
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + dur);
  const amp = ac.createGain();
  amp.gain.setValueAtTime(gain, t);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(amp).connect(master);
  src.start(t);
  src.stop(t + dur + 0.05);
}

/** Колокольчик: основная нота + обертоны, долгое затухание */
function bell(ac, freq, start = 0, dur = 0.9, gain = 0.35) {
  tone(ac, { freq, start, dur, gain });
  tone(ac, { freq: freq * 2.01, start, dur: dur * 0.6, gain: gain * 0.35 });
  tone(ac, { freq: freq * 3.02, start, dur: dur * 0.35, gain: gain * 0.15 });
}

export const sfx = {
  /** Верный ответ: два чистых удара колокола вверх */
  correct() {
    const ac = audio();
    if (!ac) return;
    bell(ac, 659.25, 0, 0.7);
    bell(ac, 987.77, 0.11, 0.9);
  },
  /** Неверный ответ: низкий диссонанс органа и шипение */
  wrong() {
    const ac = audio();
    if (!ac) return;
    tone(ac, { freq: 130.81, dur: 0.55, type: 'sawtooth', gain: 0.18, glide: 110 });
    tone(ac, { freq: 138.59, dur: 0.55, type: 'sawtooth', gain: 0.14, glide: 116 });
    noise(ac, { start: 0.04, dur: 0.35, gain: 0.12, from: 5200, to: 2200, type: 'highpass' });
  },
  /** Пещера пройдена: мрачное арпеджио минорного аккорда */
  complete() {
    const ac = audio();
    if (!ac) return;
    [440, 523.25, 659.25, 880].forEach((freq, i) => bell(ac, freq, i * 0.13, 1.1, 0.3));
  },
  /** Поймана мышь: короткий писк */
  catch() {
    const ac = audio();
    if (!ac) return;
    tone(ac, { freq: 1800, dur: 0.12, type: 'triangle', gain: 0.22, glide: 2700 });
  },
  /** Переворот карточки: свист крыла */
  flip() {
    const ac = audio();
    if (!ac) return;
    noise(ac, { dur: 0.22, gain: 0.16, from: 900, to: 3200 });
  },
  /**
   * Неожиданность (components/Scares): хлопки крыльев, писк, топот, визг банши.
   * Звуки тихие — они дополняют испуг, а не оглушают. kind — вид неожиданности.
   */
  scare(kind) {
    const ac = running();
    if (!ac) return;
    // хлопки кожистых крыльев: короткие глухие «вух-вух»
    const flaps = (count, gap, start = 0, gain = 0.1) => {
      for (let i = 0; i < count; i += 1) noise(ac, { start: start + i * gap, dur: 0.09, gain, from: 520, to: 180 });
    };
    const squeak = (start, freq = 5200) => tone(ac, { freq, start, dur: 0.07, type: 'triangle', gain: 0.05, glide: freq * 1.4 });

    switch (kind) {
      case 'bat':
        flaps(9, 0.17, 0.3);
        squeak(0.9);
        squeak(1.6, 6100);
        break;
      case 'perch':
        flaps(5, 0.17, 0.2);
        squeak(1.4);
        flaps(5, 0.17, 3.9);
        flaps(4, 0.17, 7.9);
        break;
      case 'swarm':
        flaps(14, 0.09, 0.1, 0.08);
        squeak(0.4);
        squeak(0.7, 6400);
        squeak(1.1, 5600);
        break;
      case 'eyes': // низкий гул: две близкие ноты «бьются» друг о друга
        tone(ac, { freq: 82, dur: 2.6, gain: 0.07 });
        tone(ac, { freq: 87.5, dur: 2.6, gain: 0.06 });
        break;
      case 'goblin': // частый топоток и хихиканье
        for (let i = 0; i < 12; i += 1)
          noise(ac, { start: 0.1 + i * 0.16, dur: 0.035, gain: 0.07, from: 2600, to: 1400, type: 'highpass' });
        [760, 690, 620, 560].forEach((freq, i) => tone(ac, { freq, start: 0.5 + i * 0.09, dur: 0.07, type: 'sawtooth', gain: 0.035 }));
        break;
      case 'troll': // тяжёлые шаги
        for (let i = 0; i < 8; i += 1) {
          tone(ac, { freq: 72, start: 0.2 + i * 0.42, dur: 0.24, gain: 0.3, glide: 38 });
          noise(ac, { start: 0.2 + i * 0.42, dur: 0.12, gain: 0.1, from: 300, to: 90, type: 'lowpass' });
        }
        break;
      case 'rats':
        [0.15, 0.4, 0.62, 0.95].forEach((start, i) => squeak(start, 3300 + i * 260));
        break;
      case 'spider': // нить со свистом разматывается
        tone(ac, { freq: 1700, dur: 0.6, gain: 0.03, glide: 520 });
        break;
      case 'banshee': // вой нарастает и срывается в визг
        tone(ac, { freq: 480, start: 0.5, dur: 1.5, type: 'sawtooth', gain: 0.07, glide: 1500 });
        tone(ac, { freq: 492, start: 0.5, dur: 1.5, type: 'sawtooth', gain: 0.06, glide: 1560 });
        noise(ac, { start: 1.2, dur: 0.9, gain: 0.09, from: 2400, to: 5200, type: 'highpass' });
        break;
      case 'apparition': // утробный рык
        tone(ac, { freq: 58, dur: 2.2, type: 'sawtooth', gain: 0.07, glide: 46 });
        tone(ac, { freq: 61, dur: 2.2, type: 'sawtooth', gain: 0.05, glide: 47 });
        break;
      default:
    }
  },
};
