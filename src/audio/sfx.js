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
};
