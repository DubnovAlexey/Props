// Реестр типов заданий: тип из данных → компонент, который его рисует.
// Чтобы добавить новый тип: создай компонент, добавь сюда и в utils/checkAnswer.js.
import ChoiceTask from './ChoiceTask.jsx';
import TrueFalseTask from './TrueFalseTask.jsx';
import InputTask from './InputTask.jsx';
import FillTask from './FillTask.jsx';
import BugTask from './BugTask.jsx';
import OrderTask from './OrderTask.jsx';
import MatchTask from './MatchTask.jsx';
import SortTask from './SortTask.jsx';

export const TASK_VIEWS = {
  choice: ChoiceTask,
  truefalse: TrueFalseTask,
  input: InputTask,
  fill: FillTask,
  bug: BugTask,
  order: OrderTask,
  match: MatchTask,
  sort: SortTask,
};

// Названия типов заданий — в словарях интерфейса: t(`tasks.types.${type}`)
export const TASK_TYPES = {
  choice: { icon: '🎯' },
  truefalse: { icon: '⚖️' },
  input: { icon: '✍️' },
  fill: { icon: '🧩' },
  bug: { icon: '🐞' },
  order: { icon: '🔢' },
  match: { icon: '🔗' },
  sort: { icon: '🗂️' },
};
