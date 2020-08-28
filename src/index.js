import * as json1 from "ot-json1";
import applyImmutable, { registerSubtype } from "./apply";

export default {
  ...json1,
  type: { ...json1.type, applyImmutable, registerSubtype }
};
