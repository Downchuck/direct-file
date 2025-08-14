# CompNode Implementation Patterns

This document outlines the patterns and lessons learned while implementing the `compnodes`.

## Creating a new `compnode`

To create a new `compnode`, you need to create a new file in the `packages/factgraph/src/compnodes` directory.
The file should contain a class that extends `CompNode` and a factory class that implements `CompNodeFactory`.

The `CompNode` class should have a `readonly expr: Expression<T>` property, where `T` is the type of the `compnode`.
It should also have a `fromExpression` method that returns a new instance of the `compnode`.

The `CompNodeFactory` class should have a `readonly typeName: string` property, which is the name of the `compnode`.
It should also have a `fromDerivedConfig` method that creates a new instance of the `compnode` from a config object.

## Registering a `compnode`

To register a `compnode`, you need to call `compNodeRegistry.register(new MyCompNodeFactory())` in the `compnode`'s file.
You also need to export the `compnode` from the `packages/factgraph/src/compnodes/index.ts` file.

## Using the `compnode` in a test

To use a `compnode` in a test, you need to import it from the `compnodes` directory.
You can then create a new instance of the `compnode` using the `compNodeRegistry.fromDerivedConfig` method.

## Using the `Expression` and `Operator` classes

The `Expression` class is an abstract class that represents a value in the fact graph.
It has a `get` method that returns the value of the expression.
It also has a `map` method that can be used to transform the value of the expression.

The `Operator` classes are used to perform operations on expressions.
There are three types of operators:
- `UnaryOperator`: performs an operation on a single expression.
- `BinaryOperator`: performs an operation on two expressions.
- `ReduceOperator`: performs an operation on a list of expressions.

## Handling circular dependencies

Circular dependencies can occur when two files import each other.
To handle circular dependencies, you can move the classes that are causing the dependency into the same file.
For example, the `SwitchExpression` class was moved to the `Expression.ts` file to break a circular dependency.
