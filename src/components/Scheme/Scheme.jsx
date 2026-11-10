// Схемы из данных: не нужно рисовать SVG вручную — достаточно описать
// схему объектом в контенте урока. Три вида:
//   steps   — цепочка шагов сверху вниз (процесс, порядок действий);
//   tree    — дерево компонентов с подписями пропсов ↓ и колбэков ↑;
//   compare — две колонки «так / не так», «props / state».
import { RichText } from '../RichText/RichText.jsx';
import styles from './Scheme.module.css';

function Steps({ steps }) {
  return (
    <ol className={styles.steps}>
      {steps.map((step, i) => (
        <li key={i} className={`${styles.step} ${step.tone ? styles[step.tone] : ''}`}>
          <span className={styles.stepNum} aria-hidden="true">
            {i + 1}
          </span>
          <div className={styles.stepBody}>
            <b className={styles.stepTitle}>
              <RichText text={step.title} interactive={false} />
            </b>
            {step.sub && (
              <span className={styles.stepSub}>
                <RichText text={step.sub} interactive={false} />
              </span>
            )}
            {step.code && <code className={styles.stepCode}>{step.code}</code>}
          </div>
          {i < steps.length - 1 && (
            <span className={styles.arrow} aria-hidden="true">
              <span>↓</span>
              {step.arrow && <em>{step.arrow}</em>}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function TreeNode({ node }) {
  return (
    <li className={styles.treeItem}>
      {(node.down || node.up) && (
        <div className={styles.edge}>
          {node.down && <span className={styles.down}>↓ {node.down}</span>}
          {node.up && <span className={styles.up}>↑ {node.up}</span>}
        </div>
      )}
      <div className={`${styles.node} ${node.tone ? styles[node.tone] : ''}`}>
        <code className={styles.nodeName}>{node.name}</code>
        {node.note && (
          <span className={styles.nodeNote}>
            <RichText text={node.note} interactive={false} />
          </span>
        )}
      </div>
      {node.children?.length > 0 && (
        <ul className={styles.treeList}>
          {node.children.map((child, i) => (
            <TreeNode key={i} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

function Compare({ left, right }) {
  return (
    <div className={styles.compare}>
      {[left, right].map((side, i) => (
        <div key={i} className={`${styles.side} ${side.tone ? styles[side.tone] : ''}`}>
          <b className={styles.sideTitle}>
            <RichText text={side.title} interactive={false} />
          </b>
          <ul>
            {side.items.map((item, j) => (
              <li key={j}>
                <RichText text={item} interactive={false} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function Scheme({ scheme }) {
  let body = null;
  if (scheme.type === 'steps') body = <Steps steps={scheme.steps} />;
  if (scheme.type === 'tree')
    body = (
      <ul className={styles.treeRoot}>
        <TreeNode node={scheme.root} />
      </ul>
    );
  if (scheme.type === 'compare') body = <Compare left={scheme.left} right={scheme.right} />;
  if (!body) return null;
  return (
    <figure className={styles.figure}>
      {scheme.title && <figcaption className={styles.title}>{scheme.title}</figcaption>}
      {body}
      {scheme.caption && (
        <p className={styles.caption}>
          <RichText text={scheme.caption} interactive={false} />
        </p>
      )}
    </figure>
  );
}

export const SCHEME_TYPES = ['steps', 'tree', 'compare'];
