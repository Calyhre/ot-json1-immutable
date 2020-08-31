import pick from "./pick";
import drop from "./drop";

import { registerSubtype } from "./helpers";

function apply(snapshot, op, reviver) {
  if (op === null) return snapshot;
  const held = [];

  snapshot = pick(held, snapshot, op);
  snapshot = drop(held, snapshot, op, reviver);

  return snapshot;
}

export { registerSubtype };
export default apply;
