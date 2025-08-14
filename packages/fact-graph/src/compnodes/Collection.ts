import { CompNode, CompNodeFactory } from './CompNode'
import { writable, Writable } from 'svelte/store'
import type { CompNodeJson } from '../types/CompNodeJson'
import type { Result } from '../types/Result'
import { Path } from '../Path'
import { Graph } from '../Graph'
import { FactDictionary } from '../FactDictionary'
import { Collection } from '../types/Collection'

export class CollectionNode extends CompNode {
  public static readonly typeName = 'Collection'
  private readonly store: Writable<Collection>

  constructor (
    path: Path,
    graph: Graph,
    factDictionary: FactDictionary,
    children: CompNode[] = []
  ) {
    super(path, graph, factDictionary, children)
    this.store = writable(new Collection())
  }

  public get value (): Collection {
    let value: Collection | undefined
    const unsubscribe = this.store.subscribe(v => { value = v })()
    return value!
  }

  public get values (): Result[] {
    return [
      {
        value: this.value,
        isComplete: true,
        isPlaceholder: false
      }
    ]
  }

  public static fromJson (
    json: CompNodeJson,
    path: Path,
    graph: Graph,
    factDictionary: FactDictionary
  ): CollectionNode {
    return new CollectionNode(path, graph, factDictionary)
  }

  public toJson (): CompNodeJson {
    return {
      type: CollectionNode.typeName
    }
  }
}

export class CollectionNodeFactory extends CompNodeFactory {
  public static readonly typeName = 'Collection'

  public fromJson (
    json: CompNodeJson,
    path: Path,
    graph: Graph,
    factDictionary: FactDictionary
  ): CollectionNode {
    return CollectionNode.fromJson(json, path, graph, factDictionary)
  }
}
