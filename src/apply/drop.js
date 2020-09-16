import { Record, fromJS, isKeyed, Set } from "immutable";

import {
  isPath,
  isAction,
  hasDrop,
  hasInsert,
  hasEdit,
  getEdit,
  getEditType
} from "./helpers";

function insertNode(fragment, path, node) {
  if (path.length === 0) {
    if (fragment !== undefined) {
      throw Error(`Node already exists at path: [${path}]`);
    }
    return node;
  }

  const insertPath = path.slice(0, -1);
  const insertIndex = path[path.length - 1];

  if (Set.isSet(fragment)) {
    return fragment.add(node);
  }

  return fragment.updateIn(insertPath, sub => {
    if (isKeyed(sub) || Record.isRecord(sub)) {
      return sub.set(insertIndex, node);
    } else if (Set.isSet(sub)) {
      return sub.add(node);
    }
    return sub.insert(insertIndex, node);
  });
}

export default function drop(held, fragment, path, reviver) {
  const lastPath = [];
  for (let i = 0; i < path.length; i++) {
    if (isPath(path[i])) {
      fragment = fragment
        ? fragment.updateIn(lastPath, sub => drop(held, sub, path[i], reviver))
        : undefined;
    } else if (isAction(path[i])) {
      const action = path[i];
      if (hasDrop(action)) {
        fragment = insertNode(fragment, lastPath, held[action.d]);
      }
      if (hasInsert(action)) {
        fragment = insertNode(fragment, lastPath, fromJS(action.i, reviver));
      }
      if (hasEdit(action)) {
        const edit = getEditType(action);

        fragment = fragment.updateIn(lastPath, sub =>
          edit.apply(sub, getEdit(action))
        );
      }
    } else {
      lastPath.push(path[i]);
    }
  }

  return fragment;
}
