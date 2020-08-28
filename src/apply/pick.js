import { isPath, isAction, hasPick, hasRemove } from "./helpers";

export default function pick(held, fragment, path) {
  const actions = [];
  let lastPath = [];

  let i = 0;
  for (; i < path.length; i++) {
    if (isPath(path[i])) break;
    if (isAction(path[i])) {
      actions.push([path[i], ...lastPath]);
    } else {
      lastPath.push(path[i]);
    }
  }

  for (let j = path.length - 1; j >= i; j--) {
    if (fragment === undefined) continue;

    const sub = pick(held, fragment.getIn(lastPath), path[j]);
    if (sub === undefined) {
      fragment = fragment.deleteIn(lastPath);
    } else {
      fragment = fragment.setIn(lastPath, sub);
    }
  }

  i = actions.length - 1;
  for (; i >= 0; i--) {
    const [action, ...actionPath] = actions[i];

    if (hasPick(action)) {
      held[action.p] = fragment.getIn(actionPath);
      fragment = fragment.deleteIn(actionPath);
    } else if (hasRemove(action)) {
      fragment = fragment.deleteIn(actionPath);
    }
  }

  return fragment;
}
