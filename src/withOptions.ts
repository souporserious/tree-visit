import { BaseOptions } from './options'
import { visit, VisitOptions } from './visit'
import { IndexPath } from './indexPath'
import { access, accessPath } from './access'
import {
  find,
  findAll,
  findAllIndexPaths,
  findIndexPath,
  FindOptions,
  FindOptionsTyped,
} from './find'
import { DiagramOptions, diagram } from './diagram'

// Omit any keys from the BaseOptions, since they're always applied
// automatically as part of `withOptions`
type WithoutBase<O> = Omit<O, keyof BaseOptions<unknown>>

export type WithOptions<T> = {
  access(node: T, indexPath: IndexPath): T
  accessPath(node: T, indexPath: IndexPath): T[]
  diagram(node: T, getLabel: DiagramOptions<T>['getLabel']): string
  diagram(node: T, options: WithoutBase<DiagramOptions<T>>): string
  find(node: T, predicate: FindOptions<T>['predicate']): T | undefined
  find(node: T, options: WithoutBase<FindOptions<T>>): T | undefined
  find<S extends T>(
    node: T,
    predicate: FindOptionsTyped<T, S>['predicate']
  ): S | undefined
  find<S extends T>(
    node: T,
    options: WithoutBase<FindOptionsTyped<T, S>>
  ): S | undefined
  findAll(node: T, predicate: FindOptions<T>['predicate']): T[]
  findAll(node: T, options: WithoutBase<FindOptions<T>>): T[]
  findAll<S extends T>(
    node: T,
    predicate: FindOptionsTyped<T, S>['predicate']
  ): S[]
  findAll<S extends T>(
    node: T,
    options: WithoutBase<FindOptionsTyped<T, S>>
  ): S[]
  findIndexPath(
    node: T,
    predicate: FindOptions<T>['predicate']
  ): IndexPath | undefined
  findIndexPath(
    node: T,
    options: WithoutBase<FindOptions<T>>
  ): IndexPath | undefined
  findAllIndexPaths(
    node: T,
    predicate: FindOptions<T>['predicate']
  ): IndexPath[]
  findAllIndexPaths(node: T, options: WithoutBase<FindOptions<T>>): IndexPath[]
  /**
   * Visit each node using preorder DFS traversal.
   */
  visit(node: T, onEnter: NonNullable<VisitOptions<T>>['onEnter']): void
  /**
   * Visit each node using DFS traversal.
   */
  visit(node: T, options: WithoutBase<VisitOptions<T>>): void
}

/**
 * Return every tree utility function with options partially applied.
 *
 * @param baseOptions
 */
export function withOptions<T>(baseOptions: BaseOptions<T>): WithOptions<T> {
  return {
    access: (node, indexPath) => access(node, indexPath, baseOptions),
    accessPath: (node, indexPath) => accessPath(node, indexPath, baseOptions),
    diagram: (
      node: T,
      getLabelOrOptions:
        | DiagramOptions<T>['getLabel']
        | WithoutBase<DiagramOptions<T>>
    ) =>
      typeof getLabelOrOptions === 'function'
        ? diagram(node, { ...baseOptions, getLabel: getLabelOrOptions })
        : diagram(node, { ...baseOptions, ...getLabelOrOptions }),
    find: (
      node: T,
      predicateOrOptions:
        | FindOptions<T>['predicate']
        | WithoutBase<FindOptions<T>>
    ) =>
      typeof predicateOrOptions === 'function'
        ? find(node, { ...baseOptions, predicate: predicateOrOptions })
        : find(node, { ...baseOptions, ...predicateOrOptions }),
    findAll: (
      node: T,
      predicateOrOptions:
        | FindOptions<T>['predicate']
        | WithoutBase<FindOptions<T>>
    ) =>
      typeof predicateOrOptions === 'function'
        ? findAll(node, { ...baseOptions, predicate: predicateOrOptions })
        : findAll(node, { ...baseOptions, ...predicateOrOptions }),
    findIndexPath: (
      node: T,
      predicateOrOptions:
        | FindOptions<T>['predicate']
        | WithoutBase<FindOptions<T>>
    ) =>
      typeof predicateOrOptions === 'function'
        ? findIndexPath(node, { ...baseOptions, predicate: predicateOrOptions })
        : findIndexPath(node, { ...baseOptions, ...predicateOrOptions }),
    findAllIndexPaths: (
      node: T,
      predicateOrOptions:
        | FindOptions<T>['predicate']
        | WithoutBase<FindOptions<T>>
    ) =>
      typeof predicateOrOptions === 'function'
        ? findAllIndexPaths(node, {
            ...baseOptions,
            predicate: predicateOrOptions,
          })
        : findAllIndexPaths(node, { ...baseOptions, ...predicateOrOptions }),
    visit: (
      node: T,
      onEnterOrOptions:
        | NonNullable<VisitOptions<T>>['onEnter']
        | WithoutBase<VisitOptions<T>>
    ) =>
      typeof onEnterOrOptions === 'function'
        ? visit(node, { ...baseOptions, onEnter: onEnterOrOptions })
        : visit(node, { ...baseOptions, ...onEnterOrOptions }),
  }
}
