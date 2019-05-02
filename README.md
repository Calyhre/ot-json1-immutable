# JSON1 + Immutable.js

This module add supports for Immutable.js structures to [`ot-json1`](https://github.com/ottypes/json1).

## Install

```bash
yarn add ot-json1-immutable ot-json1 immutable
```

## Usage

Just import json from `ot-json1-immutable` and use it exactly like specified by [`ot-json1` documentation](https://github.com/ottypes/json1/blob/master/README.md#usage).

```js
import json1 from 'ot-json1-immutable';
import { Map } from 'immutable';

const op = json1.moveOp(['a'], ['b']);

let doc = new Map({ a: 1 });
doc = json1.type.apply(doc, op);
```
