# JSON1 + Immutable.js

This module add supports for Immutable.js structures to [`ot-json1`](https://github.com/ottypes/json1).

## Install

```bash
yarn add ot-json1-immutable ot-json1 immutable
```

## Usage

Just import json from `ot-json1-immutable` and use it exactly like specified by [`ot-json1` documentation](https://github.com/ottypes/json1/blob/master/README.md#usage). Use `applyImmutable` to actually apply operations to any immutable structure.

```js
import json1 from 'ot-json1-immutable';
import { Map } from 'immutable';

const op = json1.moveOp(['a'], ['b']);

let doc = new Map({ a: 1 });
doc = json1.type.applyImmutable(doc, op);
// doc => new Map({ b: 1 })
```

`applyImmutable` function also take a reviver, used by [Immutable's `fromJS`](https://immutable-js.github.io/immutable-js/docs/#/fromJS):

```js
function reviver(key, value) => {
  if (!isKeyed(value)) {
    return value.toList();
  }
  switch (value.get('object')) {
    case 'block':
      return Block.create(value.toJS());
    default:
      return value.toMap();
  }
}

const op = json1.insertOp(['a'], { object: 'block' });
let doc = new Map({});

doc = json1.type.applyImmutable(doc, op, reviver);

// doc.get('a') => new Block()
```
