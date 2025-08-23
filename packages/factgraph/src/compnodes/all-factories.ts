import { RootNodeFactory } from './RootNode';
import { IntNodeFactory } from './IntNode';
import { StringNodeFactory } from './StringNode';
import { BooleanNodeFactory } from './BooleanNode';

export const allFactories = [
  RootNodeFactory,
  IntNodeFactory,
  StringNodeFactory,
  BooleanNodeFactory,
];
