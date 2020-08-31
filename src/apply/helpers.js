import * as json1 from "ot-json1";

export const isPath = p => Array.isArray(p);
export const isAction = p => typeof p === "object";
export const hasPick = a => a && a.p != null;
export const hasDrop = a => a && a.d != null;
export const hasInsert = a => a && a.i != null;
export const hasEdit = a =>
  a && (a.et != null || a.es != null || a.ena != null);
export const hasRemove = a => a && a.r != undefined;

export function getEditType(a) {
  if (a === null) {
    return null;
  } else if (a.et) {
    if (!SUBTYPES[a.et]) {
      throw Error(`Missing type: ${a.et}`);
    }
    return SUBTYPES[a.et];
  } else if (a.es) {
    return SUBTYPES["text-unicode"];
  } else if (a.ena) {
    return SUBTYPES.number;
  }

  return null;
}

export const getEdit = c => (c.es ? c.es : c.ena != null ? c.ena : c.e);

const SUBTYPES = {};
export function registerSubtype(subtype) {
  if (subtype.type) subtype = subtype.type;
  if (subtype.name) SUBTYPES[subtype.name] = subtype;
  if (subtype.uri) SUBTYPES[subtype.uri] = subtype;
  json1.type.registerSubtype(subtype);
}

registerSubtype(require("ot-text-unicode"));

const add = (a, b) => a + b;
registerSubtype({
  name: "number",
  apply: add,
  compose: add,
  transform: a => a
});
