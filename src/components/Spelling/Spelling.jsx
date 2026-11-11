// Как термин пишется по-настоящему: по-английски и в коде.
// В документации, ошибках и чужом коде ты встретишь именно эти написания,
// поэтому рядом с русским словом всегда видно оригинал.
//   entry — термин из словаря (поля en и code из content/glossaryCode.js).
// В английской игре название термина часто и есть его английское написание («Bundler» и «bundler»):
// тогда повторять его незачем — остаётся только написание в коде.
import { sameWord } from '../../utils/richText.js';

export default function Spelling({ entry, className = '' }) {
  const en = entry?.en && !sameWord(entry.en, entry.title) ? entry.en : null;
  if (!en && !entry?.code) return null;
  return (
    <span className={`spelling ${className}`}>
      {en && (
        <span lang="en" className="spelling-en">
          {en}
        </span>
      )}
      {entry.code && <code className="spelling-code">{entry.code}</code>}
    </span>
  );
}
