import pick from './pick';
import drop from './drop';

import { registerSubtype } from './helpers';

function apply(snapshot, op) {
  if (op === null) return snapshot;
  const held = [];

  snapshot = pick(held, snapshot, op);
  snapshot = drop(held, snapshot, op);

  return snapshot;
}

export { registerSubtype };
export default apply;
