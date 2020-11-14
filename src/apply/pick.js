import { Set, is, fromJS } from "immutable";
import { isPath, isAction, hasPick, hasRemove } from "./helpers";

function removeInSet(sub, action, lastPath) {
  const newSub = sub.filterNot(o => is(fromJS(o.toJS()), fromJS(action.r)));
  if (is(newSub, sub)) {
    throw new Error(
      `Could not remove ${JSON.stringify(action.r)} at path: [${lastPath}]`
    );
  }
  return newSub;
}

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
      // Partial support for Set (not supported in pick)
      if (Set.isSet(fragment)) {
        fragment = removeInSet(fragment, action, lastPath);
        // Partial support for nested Set (not supported in pick)
      } else if (Set.isSet(fragment.getIn(actionPath.slice(0, -1)))) {
        const newFragment = fragment.updateIn(actionPath.slice(0, -1), sub => {
          return removeInSet(sub, action, lastPath);
        });
        fragment = newFragment;
      } else {
        fragment = fragment.deleteIn(actionPath);
      }
    }
  }

  return fragment;
}
