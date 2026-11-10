// Как термин пишется по-настоящему: по-английски и в коде.
// В документации, ошибках и чужом коде ты встретишь именно эти написания,
// поэтому рядом с русским словом всегда видно оригинал.
//   entry — термин из словаря (поля en и code из content/glossaryCode.js).
export default function Spelling({ entry, className = '' }) {
  if (!entry?.en && !entry?.code) return null;
  return (
    <span className={`spelling ${className}`}>
      {entry.en && (
        <span lang="en" className="spelling-en">
          {entry.en}
        </span>
      )}
      {entry.code && <code className="spelling-code">{entry.code}</code>}
    </span>
  );
}
