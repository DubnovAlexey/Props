// Типографика переводов. Чистые функции — их проверяют тесты.
//
// Во французском перед двоеточием, точкой с запятой, восклицательным и вопросительным
// знаками и внутри кавычек «…» ставится пробел — и он должен быть НЕРАЗРЫВНЫМ, иначе знак
// может уехать на новую строку и повиснуть один. В исходнике неразрывный пробел не отличить
// на глаз от обычного, поэтому словарь пишется обычными пробелами, а эта функция при
// загрузке заменяет нужные из них на неразрывные (U+00A0).

const NBSP = '\u00a0';

/** Расставляет неразрывные пробелы в одной французской строке */
export function frenchSpaces(text) {
  return text.replace(/ (?=[:;!?»])/g, NBSP).replace(/(?<=«) /g, NBSP);
}

/** Применяет функцию fix ко всем строкам словаря, сохраняя его устройство (объекты и списки) */
export function mapStrings(value, fix) {
  if (typeof value === 'string') return fix(value);
  if (Array.isArray(value)) return value.map((item) => mapStrings(item, fix));
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mapStrings(item, fix)]));
  }
  return value;
}
