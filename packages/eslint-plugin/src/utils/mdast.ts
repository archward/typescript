interface Point {
  line: number;
  column: number;
  offset: number;
}

interface Position {
  start: Point;
  end: Point;
}

export interface MdastNode {
  type: string;
  position: Position;
  children?: readonly MdastNode[];
}

export interface Heading extends MdastNode {
  type: 'heading';
  depth: number;
}

export interface Root extends MdastNode {
  type: 'root';
  children: readonly MdastNode[];
}
