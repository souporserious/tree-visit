import { IndexPath } from './indexPath'
import { BaseOptions } from './options'

enum LinePrefix {
  Child = `├── `,
  LastChild = `└── `,
  NestedChild = `│   `,
  LastNestedChild = `    `,
}

type Line = {
  label: string
  depth: number
  prefix: string
  multilinePrefix: string
}

function directoryDiagram<T>(
  node: T,
  indexPath: IndexPath,
  options: DiagramOptions<T>
): Line[] {
  const label = options.getLabel(node, indexPath)
  const depth = indexPath.length

  let rootLine = { label, depth, prefix: '', multilinePrefix: '' }

  const children = options.getChildren(node, indexPath)

  if (children.length === 0) return [rootLine]

  // Special-case nodes with a single child, collapsing their labels to a single line
  if (children.length === 1 && !isMultiline(label)) {
    const lines = directoryDiagram(children[0], [...indexPath, 0], options)
    const hideRoot = indexPath.length === 0 && label === ''
    lines[0].label = hideRoot
      ? `/ ${lines[0].label}`
      : `${rootLine.label} / ${lines[0].label}`
    return lines
  }

  const nestedLines: Line[] = children.flatMap((file, index, array) => {
    const childIsLast = index === array.length - 1
    const childLines = directoryDiagram(file, [...indexPath, index], options)
    const childPrefix = childIsLast ? LinePrefix.LastChild : LinePrefix.Child
    const childMultilinePrefix = childIsLast
      ? LinePrefix.LastNestedChild
      : LinePrefix.NestedChild

    childLines.forEach((line) => {
      if (line.depth === depth + 1) {
        line.prefix = childPrefix + line.prefix
        line.multilinePrefix = childMultilinePrefix + line.multilinePrefix
      } else if (childIsLast) {
        line.prefix = LinePrefix.LastNestedChild + line.prefix
        line.multilinePrefix = LinePrefix.LastNestedChild + line.multilinePrefix
      } else {
        line.prefix = LinePrefix.NestedChild + line.prefix
        line.multilinePrefix = LinePrefix.NestedChild + line.multilinePrefix
      }
    })

    return childLines
  })

  return [rootLine, ...nestedLines]
}

export type DiagramOptions<T> = BaseOptions<T> & {
  getLabel: (node: T, indexPath: IndexPath) => string
}

/**
 * Generate a diagram of the tree, as a string.
 */
export function diagram<T>(node: T, options: DiagramOptions<T>): string {
  const lines = directoryDiagram(node, [], options)
  const strings = lines.map((line) =>
    prefixBlock(line.label, line.prefix, line.multilinePrefix)
  )
  return strings.join('\n')
}

function isMultiline(line: string): boolean {
  return line.includes('\n')
}

function prefixBlock(
  block: string,
  prefix: string,
  multilinePrefix: string
): string {
  if (!isMultiline(block)) return prefix + block

  return block
    .split('\n')
    .map((line, index) => (index === 0 ? prefix : multilinePrefix) + line)
    .join('\n')
}