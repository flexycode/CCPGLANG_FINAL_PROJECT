import { useState, useCallback, useEffect, useRef } from 'react';
import { X, RotateCcw, Trophy, Cpu, User } from 'lucide-react';
import { useTheme } from '../utils/theme';
import ChessBoard from './ChessBoard';
import type { GameState, Position } from '../utils/chessEngine';
import {
  createInitialGameState,
  getPiece,
  getValidMoves,
  makeMove,
  getBestMove,
} from '../utils/chessEngine';

/**
 * ChessGame — Full game wrapper with AI opponent.
 * 
 * Manages game state using React's useState (functional state management).
 * AI moves are computed asynchronously to avoid blocking the UI.
 */

interface ChessGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChessGame({ isOpen, onClose }: ChessGameProps) {
  const { isDark } = useTheme();
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [playerColor] = useState<'white' | 'black'>('white');
  const [isThinking, setIsThinking] = useState(false);
  const thinkingTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /**
   * Handle square clicks — select piece or make move.
   * Demonstrates functional state transitions.
   */
  const handleSquareClick = useCallback((pos: Position) => {
    if (gameState.isCheckmate || gameState.isStalemate) return;
    if (gameState.currentTurn !== playerColor) return;
    if (isThinking) return;

    setGameState(prev => {
      const piece = getPiece(prev.board, pos);

      // If a piece is selected and clicking a valid move target
      if (prev.selectedPosition) {
        const isValid = prev.validMoves.some(m => m.row === pos.row && m.col === pos.col);
        if (isValid) {
          return makeMove(prev, prev.selectedPosition, pos);
        }
      }

      // Select own piece
      if (piece && piece.color === playerColor) {
        const moves = getValidMoves(prev.board, pos);
        return { ...prev, selectedPosition: pos, validMoves: moves };
      }

      // Deselect
      return { ...prev, selectedPosition: null, validMoves: [] };
    });
  }, [gameState.isCheckmate, gameState.isStalemate, gameState.currentTurn, playerColor, isThinking]);

  /**
   * AI turn — computed after player moves.
   * Uses setTimeout to allow the UI to update before computation.
   */
  useEffect(() => {
    if (gameState.currentTurn !== playerColor && !gameState.isCheckmate && !gameState.isStalemate) {
      setIsThinking(true);
      thinkingTimeout.current = setTimeout(() => {
        const aiMove = getBestMove(gameState, 2);
        if (aiMove) {
          setGameState(prev => makeMove(prev, aiMove.from, aiMove.to));
        }
        setIsThinking(false);
      }, 400); // Small delay for UX feel
    }

    return () => {
      if (thinkingTimeout.current) clearTimeout(thinkingTimeout.current);
    };
  }, [gameState.currentTurn, gameState.isCheckmate, gameState.isStalemate, playerColor]);

  const handleNewGame = () => {
    setGameState(createInitialGameState());
    setIsThinking(false);
  };

  const getStatusText = (): string => {
    if (gameState.isCheckmate) {
      return gameState.currentTurn === playerColor ? '♚ Checkmate — You lose!' : '♔ Checkmate — You win!';
    }
    if (gameState.isStalemate) return '🤝 Stalemate — Draw!';
    if (gameState.isCheck) return '⚠️ Check!';
    if (isThinking) return '🤔 AI is thinking...';
    return gameState.currentTurn === playerColor ? 'Your turn' : "AI's turn";
  };

  const lastMove = gameState.moveHistory.length > 0
    ? gameState.moveHistory[gameState.moveHistory.length - 1]
    : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-[520px] rounded-2xl shadow-2xl overflow-hidden
          ${isDark ? 'bg-[#1a1a2e] border border-white/10' : 'bg-white border border-gray-200'}`}
        onClick={e => e.stopPropagation()}
        style={{
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b
          ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">♔</span>
            <div>
              <h2 className={`text-lg font-bold font-serif ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Chess
              </h2>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Play while you wait
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors cursor-pointer
              ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Board */}
        <div className="flex flex-col items-center px-6 py-5 gap-4">
          {/* Player indicators */}
          <div className="w-full max-w-[400px] flex items-center justify-between text-sm mb-1">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full
              ${gameState.currentTurn !== playerColor
                ? (isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-amber-100 text-amber-700')
                : (isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500')
              }`}>
              <Cpu size={14} />
              <span className="font-medium">AI (Black)</span>
              {isThinking && <span className="animate-pulse">●</span>}
            </div>
            <div className={`text-xs font-mono px-2 py-1 rounded
              ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
              Move {Math.ceil(gameState.moveHistory.length / 2) || 1}
            </div>
          </div>

          <ChessBoard
            board={gameState.board}
            selectedPosition={gameState.selectedPosition}
            validMoves={gameState.validMoves}
            lastMove={lastMove ? { from: lastMove.from, to: lastMove.to } : null}
            onSquareClick={handleSquareClick}
          />

          <div className="w-full max-w-[400px] flex items-center justify-between text-sm mt-1">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full
              ${gameState.currentTurn === playerColor
                ? (isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-amber-100 text-amber-700')
                : (isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500')
              }`}>
              <User size={14} />
              <span className="font-medium">You (White)</span>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className={`px-6 py-3 flex items-center justify-between border-t
          ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            {(gameState.isCheckmate || gameState.isStalemate) && <Trophy size={16} className="text-amber-500" />}
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {getStatusText()}
            </span>
          </div>
          <button
            onClick={handleNewGame}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
              ${isDark
                ? 'bg-white/10 hover:bg-white/15 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
          >
            <RotateCcw size={14} />
            New Game
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
