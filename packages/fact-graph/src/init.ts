import { CompNodeRegistry } from './compnodes/CompNode'
import {
  AddNodeFactory,
  AddressNodeFactory,
  AnyNodeFactory,
  AsDecimalStringNodeFactory,
  AsStringNodeFactory,
  BooleanNodeFactory,
  CollectionNodeFactory,
  CollectionSumNodeFactory,
  CountNodeFactory,
  DayNodeFactory,
  DaysNodeFactory,
  DivideNodeFactory,
  DollarNodeFactory,
  EINNodeFactory,
  EmailAddressNodeFactory,
  EnumNodeFactory,
  EqualNodeFactory,
  FalseNodeFactory,
  FilterNodeFactory,
  FindNodeFactory,
  GreaterOfNodeFactory,
  GreaterThanNodeFactory,
  GreaterThanOrEqualNodeFactory,
  LesserOfNodeFactory,
  LessThanNodeFactory,
  LessThanOrEqualNodeFactory,
  LengthNodeFactory,
  MaximumNodeFactory,
  NotNodeFactory,
  NotEqualNodeFactory,
  RationalNodeFactory,
  RoundNodeFactory,
  RoundToIntNodeFactory,
  StringNodeFactory,
  SubtractNodeFactory,
  SwitchNodeFactory,
  TINNodeFactory,
  TrueNodeFactory
} from './compnodes'

export function init (): CompNodeRegistry {
  const registry = new CompNodeRegistry()

  registry.register(new AddNodeFactory())
  registry.register(new AddressNodeFactory())
  registry.register(new AnyNodeFactory())
  registry.register(new AsDecimalStringNodeFactory())
  registry.register(new AsStringNodeFactory())
  registry.register(new BooleanNodeFactory())
  registry.register(new CollectionNodeFactory())
  registry.register(new CollectionSumNodeFactory())
  registry.register(new CountNodeFactory())
  registry.register(new DayNodeFactory())
  registry.register(new DaysNodeFactory())
  registry.register(new DivideNodeFactory())
  registry.register(new DollarNodeFactory())
  registry.register(new EINNodeFactory())
  registry.register(new EmailAddressNodeFactory())
  registry.register(new EnumNodeFactory())
  registry.register(new EqualNodeFactory())
  registry.register(new FalseNodeFactory())
  registry.register(new FilterNodeFactory())
  registry.register(new FindNodeFactory())
  registry.register(new GreaterOfNodeFactory())
  registry.register(new GreaterThanNodeFactory())
  registry.register(new GreaterThanOrEqualNodeFactory())
  registry.register(new LesserOfNodeFactory())
  registry.register(new LessThanNodeFactory())
  registry.register(new LessThanOrEqualNodeFactory())
  registry.register(new LengthNodeFactory())
  registry.register(new MaximumNodeFactory())
  registry.register(new NotNodeFactory())
  registry.register(new NotEqualNodeFactory())
  registry.register(new RationalNodeFactory())
  registry.register(new RoundNodeFactory())
  registry.register(new RoundToIntNodeFactory())
  registry.register(new StringNodeFactory())
  registry.register(new SubtractNodeFactory())
  registry.register(new SwitchNodeFactory())
  registry.register(new TINNodeFactory())
  registry.register(new TrueNodeFactory())

  return registry
}
