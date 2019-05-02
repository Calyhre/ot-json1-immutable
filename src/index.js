import json1 from 'ot-json1';
import apply, { registerSubtype } from './apply';

export default { ...json1, type: { ...json1.type, apply, registerSubtype } };
