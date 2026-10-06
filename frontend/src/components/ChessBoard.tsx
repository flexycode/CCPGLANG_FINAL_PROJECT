import { useTheme } from '../utils/theme';
import type { Board, Position } from '../utils/chessEngine';
import { getPiece, getPieceSymbol } from '../utils/chessEngine';

/**
 * ChessBoard — SVG-based chess board renderer.
 * 
 * Functional component demonstrating:
 * - Declarative rendering via map over board state
 * - Pure rendering logic — output depends only on props
 * - No internal mutations
 */

interface ChessBoardProps {
  board: Board;
  selectedPosition: Position | null;
  validMoves: ReadonlyArray<Position>;
  lastMove?: { from: Position; to: Position } | null;
  onSquareClick: (pos: Position) => void;
  flipped?: boolean;
}

const BOARD_SIZE = 400;
const SQUARE_SIZE = BOARD_SIZE / 8;

export default function ChessBoard({
  board,
  selectedPosition,
  validMoves,
  lastMove,
  onSquareClick,
  flipped = false,
}: ChessBoardProps) {
  const { isDark } = useTheme();

  // Colors
  const lightSquare = isDark ? '#4a4458' : '#f0d9b5';
  const darkSquare = isDark ? '#2d2640' : '#b58863';
  const selectedColor = isDark ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 100, 0.6)';
  const validMoveColor = isDark ? 'rgba(139, 92, 246, 0.35)' : 'rgba(100, 200, 100, 0.5)';
  const lastMoveColor = isDark ? 'rgba(212, 168, 67, 0.25)' : 'rgba(255, 255, 0, 0.25)';

  /**
   * Maps logical row/col to visual row/col (supports board flipping).
   */
  const toVisual = (row: number, col: number): { vr: number; vc: number } => ({
    vr: flipped ? 7 - row : row,
    vc: flipped ? 7 - col : col,
  });

  const isSelected = (r: number, c: number) =>
    selectedPosition?.row === r && selectedPosition?.col === c;

  const isValidMove = (r: number, c: number) =>
    validMoves.some(m => m.row === r && m.col === c);

  const isLastMove = (r: number, c: number) =>
    lastMove && ((lastMove.from.row === r && lastMove.from.col === c) ||
                  (lastMove.to.row === r && lastMove.to.col === c));

  return (
    <svg
      viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}
      className="w-full max-w-[400px] aspect-square rounded-lg shadow-xl overflow-hidden select-none"
      style={{ filter: isDark ? 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.15))' : 'none' }}
    >
      {/* Board squares */}
      {Array.from({ length: 8 }, (_, r) =>
        Array.from({ length: 8 }, (_, c) => {
          const { vr, vc } = toVisual(r, c);
          const isLight = (r + c) % 2 === 0;
          let fillColor = isLight ? lightSquare : darkSquare;

          if (isLastMove(r, c)) fillColor = lastMoveColor;
          if (isSelected(r, c)) fillColor = selectedColor;

          return (
            <g key={`${r}-${c}`}>
              <rect
                x={vc * SQUARE_SIZE}
                y={vr * SQUARE_SIZE}
                width={SQUARE_SIZE}
                height={SQUARE_SIZE}
                fill={fillColor}
                onClick={() => onSquareClick({ row: r, col: c })}
                className="cursor-pointer"
                style={{ transition: 'fill 0.15s ease' }}
              />

              {/* Valid move indicator */}
              {isValidMove(r, c) && (
                <circle
                  cx={vc * SQUARE_SIZE + SQUARE_SIZE / 2}
                  cy={vr * SQUARE_SIZE + SQUARE_SIZE / 2}
                  r={getPiece(board, { row: r, col: c }) ? SQUARE_SIZE * 0.45 : SQUARE_SIZE * 0.15}
                  fill={getPiece(board, { row: r, col: c }) ? 'transparent' : validMoveColor}
                  stroke={getPiece(board, { row: r, col: c }) ? validMoveColor : 'none'}
                  strokeWidth={getPiece(board, { row: r, col: c }) ? 3 : 0}
                  onClick={() => onSquareClick({ row: r, col: c })}
                  className="cursor-pointer"
                  style={{ pointerEvents: 'all' }}
                />
              )}
            </g>
          );
        })
      )}

      {/* Pieces */}
      {board.map((row, r) =>
        row.map((cell, c) => {
          if (!cell) return null;
          const { vr, vc } = toVisual(r, c);
          return (
            <text
              key={`piece-${r}-${c}`}
              x={vc * SQUARE_SIZE + SQUARE_SIZE / 2}
              y={vr * SQUARE_SIZE + SQUARE_SIZE / 2 + 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={SQUARE_SIZE * 0.7}
              className="cursor-pointer select-none"
              onClick={() => onSquareClick({ row: r, col: c })}
              style={{
                filter: isDark
                  ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                  : 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))',
                transition: 'transform 0.2s ease',
                pointerEvents: 'all',
              }}
            >
              {getPieceSymbol(cell)}
            </text>
          );
        })
      )}

      {/* File labels (a-h) */}
      {Array.from({ length: 8 }, (_, c) => {
        const label = String.fromCharCode(flipped ? 104 - c : 97 + c);
        return (
          <text
            key={`file-${c}`}
            x={c * SQUARE_SIZE + SQUARE_SIZE - 4}
            y={BOARD_SIZE - 3}
            fontSize={9}
            fill={c % 2 === 0
              ? (isDark ? '#4a4458' : '#b58863')
              : (isDark ? '#2d2640' : '#f0d9b5')}
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            {label}
          </text>
        );
      })}

      {/* Rank labels (1-8) */}
      {Array.from({ length: 8 }, (_, r) => {
        const label = flipped ? r + 1 : 8 - r;
        return (
          <text
            key={`rank-${r}`}
            x={3}
            y={r * SQUARE_SIZE + 13}
            fontSize={9}
            fill={r % 2 === 0
              ? (isDark ? '#2d2640' : '#f0d9b5')
              : (isDark ? '#4a4458' : '#b58863')}
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
