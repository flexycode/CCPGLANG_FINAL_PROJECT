/**
 * Chess Engine — Pure Functional Paradigm
 * 
 * CCPGLANG Final Project: Functional Programming Demonstration
 * 
 * This module implements chess logic using ONLY pure functions:
 * - No classes, no `this`, no mutations
 * - Board state is an immutable array — every move returns a NEW board
 * - Functions are composable and side-effect-free
 * - Higher-order functions (map, filter, reduce) used throughout
 * 
 * Paradigm principles demonstrated:
 * 1. Immutability: Board is never mutated, always copied
 * 2. Pure functions: Same input → same output, no side effects
 * 3. Function composition: Complex logic built from simple functions
 * 4. Higher-order functions: Functions that take/return functions
 * 5. Declarative style: Describe WHAT, not HOW
 */

// ── Types ──────────────────────────────────────────────────

export type PieceColor = 'white' | 'black';
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';

export interface Piece {
  readonly type: PieceType;
  readonly color: PieceColor;
  readonly hasMoved: boolean;
}

export interface Position {
  readonly row: number;
  readonly col: number;
}

export interface Move {
  readonly from: Position;
  readonly to: Position;
  readonly piece: Piece;
  readonly captured?: Piece;
  readonly isPromotion?: boolean;
  readonly isCastle?: boolean;
  readonly isEnPassant?: boolean;
}

// Board is a readonly 8x8 grid — immutable by convention
export type Board = ReadonlyArray<ReadonlyArray<Piece | null>>;

export interface GameState {
  readonly board: Board;
  readonly currentTurn: PieceColor;
  readonly moveHistory: ReadonlyArray<Move>;
  readonly isCheck: boolean;
  readonly isCheckmate: boolean;
  readonly isStalemate: boolean;
  readonly selectedPosition: Position | null;
  readonly validMoves: ReadonlyArray<Position>;
}

// ── Board Creation (Pure) ──────────────────────────────────

/**
 * Creates a piece — pure factory function, no class constructor needed.
 */
const createPiece = (type: PieceType, color: PieceColor): Piece => ({
  type,
  color,
  hasMoved: false,
});

/**
 * Creates the initial chess board.
 * Pure function: no arguments, always returns the same board.
 * Uses Array.from + map — functional array construction.
 */
export const createInitialBoard = (): Board => {
  const emptyRow = (): (Piece | null)[] => Array(8).fill(null);

  const backRow = (color: PieceColor): Piece[] => [
    createPiece('rook', color),
    createPiece('knight', color),
    createPiece('bishop', color),
    createPiece('queen', color),
    createPiece('king', color),
    createPiece('bishop', color),
    createPiece('knight', color),
    createPiece('rook', color),
  ];

  const pawnRow = (color: PieceColor): Piece[] =>
    Array(8).fill(null).map(() => createPiece('pawn', color));

  return [
    backRow('black'),   // Row 0
    pawnRow('black'),   // Row 1
    emptyRow(),         // Row 2
    emptyRow(),         // Row 3
    emptyRow(),         // Row 4
    emptyRow(),         // Row 5
    pawnRow('white'),   // Row 6
    backRow('white'),   // Row 7
  ];
};

/**
 * Creates the initial game state.
 */
export const createInitialGameState = (): GameState => ({
  board: createInitialBoard(),
  currentTurn: 'white',
  moveHistory: [],
  isCheck: false,
  isCheckmate: false,
  isStalemate: false,
  selectedPosition: null,
  validMoves: [],
});

// ── Board Accessors (Pure) ─────────────────────────────────

/**
 * Gets a piece at a position — pure accessor.
 */
export const getPiece = (board: Board, pos: Position): Piece | null =>
  isValidPosition(pos) ? board[pos.row][pos.col] : null;

/**
 * Checks if a position is within board bounds.
 * Pure predicate function.
 */
export const isValidPosition = (pos: Position): boolean =>
  pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;

/**
 * Sets a piece on the board — returns a NEW board (immutability).
 * The original board is never modified.
 */
export const setPiece = (board: Board, pos: Position, piece: Piece | null): Board =>
  board.map((row, r) =>
    r === pos.row
      ? row.map((cell, c) => (c === pos.col ? piece : cell))
      : row
  );

/**
 * Finds the king position for a given color.
 * Uses reduce to scan the board — functional iteration.
 */
export const findKing = (board: Board, color: PieceColor): Position | null =>
  board.reduce<Position | null>((found, row, r) =>
    found ?? row.reduce<Position | null>((f, cell, c) =>
      f ?? (cell?.type === 'king' && cell?.color === color ? { row: r, col: c } : null),
    null),
  null);

// ── Move Generation (Pure) ────────────────────────────────

/**
 * Gets the opponent color — pure function.
 */
const opponent = (color: PieceColor): PieceColor =>
  color === 'white' ? 'black' : 'white';

/**
 * Generates raw moves for a piece (before check validation).
 * Pure function — input determines output completely.
 */
const getRawMoves = (board: Board, pos: Position): Position[] => {
  const piece = getPiece(board, pos);
  if (!piece) return [];

  switch (piece.type) {
    case 'pawn':   return getPawnMoves(board, pos, piece);
    case 'rook':   return getSlidingMoves(board, pos, piece, [[0,1],[0,-1],[1,0],[-1,0]]);
    case 'bishop': return getSlidingMoves(board, pos, piece, [[1,1],[1,-1],[-1,1],[-1,-1]]);
    case 'queen':  return getSlidingMoves(board, pos, piece, [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]);
    case 'knight': return getKnightMoves(board, pos, piece);
    case 'king':   return getKingMoves(board, pos, piece);
    default:       return [];
  }
};

/**
 * Pawn movement — direction depends on color.
 * Demonstrates pattern matching via conditional logic.
 */
const getPawnMoves = (board: Board, pos: Position, piece: Piece): Position[] => {
  const direction = piece.color === 'white' ? -1 : 1;
  const startRow = piece.color === 'white' ? 6 : 1;
  const moves: Position[] = [];

  // Forward one
  const oneForward = { row: pos.row + direction, col: pos.col };
  if (isValidPosition(oneForward) && !getPiece(board, oneForward)) {
    moves.push(oneForward);

    // Forward two from starting position
    const twoForward = { row: pos.row + 2 * direction, col: pos.col };
    if (pos.row === startRow && !getPiece(board, twoForward)) {
      moves.push(twoForward);
    }
  }

  // Diagonal captures
  [-1, 1].forEach(dc => {
    const capturePos = { row: pos.row + direction, col: pos.col + dc };
    if (isValidPosition(capturePos)) {
      const target = getPiece(board, capturePos);
      if (target && target.color !== piece.color) {
        moves.push(capturePos);
      }
    }
  });

  return moves;
};

/**
 * Sliding pieces (rook, bishop, queen) — uses direction vectors.
 * Higher-order pattern: flatMap over directions.
 */
const getSlidingMoves = (
  board: Board,
  pos: Position,
  piece: Piece,
  directions: number[][]
): Position[] =>
  directions.flatMap(([dr, dc]) => {
    const moves: Position[] = [];
    let r = pos.row + dr;
    let c = pos.col + dc;
    while (isValidPosition({ row: r, col: c })) {
      const target = getPiece(board, { row: r, col: c });
      if (!target) {
        moves.push({ row: r, col: c });
      } else {
        if (target.color !== piece.color) moves.push({ row: r, col: c });
        break;
      }
      r += dr;
      c += dc;
    }
    return moves;
  });

/**
 * Knight moves — fixed offsets, filter for valid positions.
 * Demonstrates functional filter pattern.
 */
const getKnightMoves = (board: Board, pos: Position, piece: Piece): Position[] =>
  [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
    .map(([dr, dc]) => ({ row: pos.row + dr, col: pos.col + dc }))
    .filter(p => isValidPosition(p))
    .filter(p => {
      const target = getPiece(board, p);
      return !target || target.color !== piece.color;
    });

/**
 * King moves — one square in any direction.
 */
const getKingMoves = (board: Board, pos: Position, piece: Piece): Position[] =>
  [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
    .map(([dr, dc]) => ({ row: pos.row + dr, col: pos.col + dc }))
    .filter(p => isValidPosition(p))
    .filter(p => {
      const target = getPiece(board, p);
      return !target || target.color !== piece.color;
    });

// ── Check Detection (Pure) ────────────────────────────────

/**
 * Determines if a given color's king is in check.
 * Pure function — scans the board for threats to the king.
 */
export const isKingInCheck = (board: Board, color: PieceColor): boolean => {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;

  // Check if any opponent piece can capture the king
  return board.some((row, r) =>
    row.some((cell, c) => {
      if (!cell || cell.color === color) return false;
      const moves = getRawMoves(board, { row: r, col: c });
      return moves.some(m => m.row === kingPos.row && m.col === kingPos.col);
    })
  );
};

/**
 * Gets all LEGAL moves for a piece (filters out moves that leave king in check).
 * Composition: getRawMoves → filter through check validation.
 */
export const getValidMoves = (board: Board, pos: Position): Position[] => {
  const piece = getPiece(board, pos);
  if (!piece) return [];

  return getRawMoves(board, pos).filter(to => {
    // Simulate the move and check if our king is still safe
    const newBoard = applyMove(board, pos, to);
    return !isKingInCheck(newBoard, piece.color);
  });
};

// ── Move Execution (Pure — Returns New State) ─────────────

/**
 * Applies a move to the board — returns a NEW board.
 * The original board is NEVER mutated (immutability principle).
 */
const applyMove = (board: Board, from: Position, to: Position): Board => {
  const piece = getPiece(board, from);
  if (!piece) return board;

  const movedPiece: Piece = { ...piece, hasMoved: true };

  // Handle pawn promotion (auto-promote to queen for simplicity)
  const promotionRow = piece.color === 'white' ? 0 : 7;
  const finalPiece: Piece =
    piece.type === 'pawn' && to.row === promotionRow
      ? { ...movedPiece, type: 'queen' }
      : movedPiece;

  // Immutable board update: clear origin, place piece at destination
  return setPiece(setPiece(board, from, null), to, finalPiece);
};

/**
 * Makes a move and returns the complete new game state.
 * This is the main state transition function — pure and composable.
 * 
 * GameState(n) → Move → GameState(n+1)
 */
export const makeMove = (state: GameState, from: Position, to: Position): GameState => {
  const piece = getPiece(state.board, from);
  if (!piece) return state;

  const captured = getPiece(state.board, to);
  const newBoard = applyMove(state.board, from, to);
  const nextTurn = opponent(state.currentTurn);

  const move: Move = {
    from,
    to,
    piece,
    captured: captured ?? undefined,
    isPromotion: piece.type === 'pawn' && (to.row === 0 || to.row === 7),
  };

  const isCheck = isKingInCheck(newBoard, nextTurn);
  const hasLegalMoves = boardHasLegalMoves(newBoard, nextTurn);

  return {
    board: newBoard,
    currentTurn: nextTurn,
    moveHistory: [...state.moveHistory, move],
    isCheck,
    isCheckmate: isCheck && !hasLegalMoves,
    isStalemate: !isCheck && !hasLegalMoves,
    selectedPosition: null,
    validMoves: [],
  };
};

/**
 * Checks if a color has any legal moves remaining.
 * Uses some() for early termination — functional short-circuit.
 */
const boardHasLegalMoves = (board: Board, color: PieceColor): boolean =>
  board.some((row, r) =>
    row.some((cell, c) =>
      cell?.color === color && getValidMoves(board, { row: r, col: c }).length > 0
    )
  );

// ── Simple AI (Pure Functional) ───────────────────────────

/**
 * Piece value map — used for board evaluation.
 * Declared as a const (immutable lookup).
 */
const PIECE_VALUES: Record<PieceType, number> = {
  pawn: 10,
  knight: 30,
  bishop: 30,
  rook: 50,
  queen: 90,
  king: 900,
};

/**
 * Evaluates the board from a given color's perspective.
 * Pure function: board → number.
 * Uses reduce to sum piece values — functional aggregation.
 */
export const evaluateBoard = (board: Board, color: PieceColor): number =>
  board.reduce((total, row) =>
    row.reduce((rowTotal, cell) => {
      if (!cell) return rowTotal;
      const value = PIECE_VALUES[cell.type];
      return rowTotal + (cell.color === color ? value : -value);
    }, total),
  0);

/**
 * Position bonus tables — encourage pieces to control the center.
 * Pure data, no behavior.
 */
const CENTER_BONUS = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 2, 2, 1, 0, 0],
  [0, 0, 2, 3, 3, 2, 0, 0],
  [0, 0, 2, 3, 3, 2, 0, 0],
  [0, 0, 1, 2, 2, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

/**
 * Enhanced board evaluation with position bonuses.
 */
const evaluateBoardWithPosition = (board: Board, color: PieceColor): number =>
  board.reduce((total, row, r) =>
    row.reduce((rowTotal, cell, c) => {
      if (!cell) return rowTotal;
      const value = PIECE_VALUES[cell.type] + CENTER_BONUS[r][c];
      return rowTotal + (cell.color === color ? value : -value);
    }, total),
  0);

/**
 * AI Move Selection — Minimax with alpha-beta pruning.
 * 
 * This is a pure recursive function:
 * - No mutation of game state
 * - Each recursive call creates new board states
 * - Returns the best move based on evaluation
 */
export const getBestMove = (
  state: GameState,
  depth: number = 2
): { from: Position; to: Position } | null => {
  const color = state.currentTurn;
  let bestScore = -Infinity;
  let bestMove: { from: Position; to: Position } | null = null;

  // Generate all possible moves for current player
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = getPiece(state.board, { row: r, col: c });
      if (!piece || piece.color !== color) continue;

      const moves = getValidMoves(state.board, { row: r, col: c });
      for (const to of moves) {
        const newBoard = applyMove(state.board, { row: r, col: c }, to);
        const score = -minimax(newBoard, depth - 1, -Infinity, Infinity, opponent(color), color);

        if (score > bestScore) {
          bestScore = score;
          bestMove = { from: { row: r, col: c }, to };
        }
      }
    }
  }

  return bestMove;
};

/**
 * Minimax algorithm — pure recursive function.
 * 
 * Demonstrates:
 * - Recursion as the primary iteration mechanism (functional style)
 * - No side effects — only computes and returns a value
 * - Alpha-beta pruning for efficiency
 */
const minimax = (
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  currentColor: PieceColor,
  maximizingColor: PieceColor
): number => {
  if (depth === 0) {
    return evaluateBoardWithPosition(board, currentColor);
  }

  let bestScore = -Infinity;
  let a = alpha;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = getPiece(board, { row: r, col: c });
      if (!piece || piece.color !== currentColor) continue;

      const moves = getValidMoves(board, { row: r, col: c });
      for (const to of moves) {
        const newBoard = applyMove(board, { row: r, col: c }, to);
        const score = -minimax(newBoard, depth - 1, -beta, -a, opponent(currentColor), maximizingColor);

        bestScore = Math.max(bestScore, score);
        a = Math.max(a, score);
        if (a >= beta) return bestScore; // Prune
      }
    }
  }

  return bestScore === -Infinity ? evaluateBoardWithPosition(board, currentColor) : bestScore;
};

// ── Unicode Piece Symbols ─────────────────────────────────

/**
 * Maps piece type + color to Unicode symbol.
 * Pure lookup function.
 */
export const getPieceSymbol = (piece: Piece): string => {
  const symbols: Record<PieceColor, Record<PieceType, string>> = {
    white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
    black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' },
  };
  return symbols[piece.color][piece.type];
};
