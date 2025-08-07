import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, User, Clock, Trophy } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle.jsx';
import {fetchGameData} from '../services/Games.js';

const ChessAnalysis = () => {
  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {game_id} = useParams()
  console.log(game_id)

  useEffect(() => {
    ;(async () => {
      setLoading(true);

      try {

        const response = await fetchGameData(game_id)
        console.log(response.data)
        setGameData(response)
        initializeGame(response.data);

      } catch (err) {

        setError(err.message);

      } finally {

        setLoading(false)
        
      }
    })()
  }, []);

  const initializeGame = (data) => {
    const newGame = new Chess();
    setGame(newGame);
    setGamePosition(newGame.fen());
    setCurrentMoveIndex(-1);
  };

  const goToMove = (moveIndex) => {
    if (!gameData) return;
    
    const newGame = new Chess();
    const moves = gameData.data.moveComments.slice(0, moveIndex + 1);
    
    moves.forEach((moveData) => {
      try {
        newGame.move(moveData.move);
      } catch (error) {
        console.error('Invalid move:', moveData.move);
      }
    });

    setGame(newGame);
    setGamePosition(newGame.fen());
    setCurrentMoveIndex(moveIndex);
  };

  const goToPreviousMove = () => {
    if (currentMoveIndex > 0) {
      goToMove(currentMoveIndex - 1);
    }
  };

  const goToNextMove = () => {
    if (gameData && currentMoveIndex < gameData.data.moveComments.length - 1) {
      goToMove(currentMoveIndex + 1);
    }
  };

  const resetToStart = () => {
    const newGame = new Chess();
    setGame(newGame);
    setGamePosition(newGame.fen());
    setCurrentMoveIndex(-1);
  };

  const getMoveTypeColor = (type) => {
    const colors = {
      Brilliant: 'bg-cyan-500 text-white',
      Great: 'bg-green-500 text-white',
      Best: 'bg-green-400 text-white',
      Excellent: 'bg-green-300 text-gray-800',
      Good: 'bg-blue-500 text-white',
      Inaccuracy: 'bg-yellow-500 text-gray-800',
      Mistake: 'bg-orange-500 text-white',
      Blunder: 'bg-red-500 text-white',
      Unknown: 'bg-gray-400 text-white'
    };
    return colors[type] || colors.Unknown;
  };

  const getEvaluationValue = (evalScore, gameResult) => {
    // If evaluation exists, return it
    if (evalScore !== null && evalScore !== undefined) {
      return parseFloat(evalScore);
    }

    // Handle null evaluations based on game result
    if (!gameResult) return 0;

    switch (gameResult) {
      case '1-0': // White wins
        return 10; // Large positive value for white advantage
      case '0-1': // Black wins
        return -10; // Large negative value for black advantage
      case '1/2-1/2': // Draw/Stalemate
      case '½-½': // Alternative draw notation
        return 0;
      default:
        return 0;
    }
  };

  const getEvaluationPercentage = (eval_score, gameResult) => {
    const score = getEvaluationValue(eval_score, gameResult);

    const transformedScore = Math.tanh(score / 4) * 5;
    const clampedEval = Math.max(-5, Math.min(5, transformedScore));
    return ((clampedEval + 5) / 10) * 100;
  };

  const getCurrentMove = () => {
    if (!gameData || currentMoveIndex < 0) return null;
    return gameData.data.moveComments[currentMoveIndex];
  };

  const getEvaluationDisplay = (evalScore, gameResult) => {
    const value = getEvaluationValue(evalScore, gameResult);
    
    // If original eval was null, show result-based display
    if (evalScore === null || evalScore === undefined) {
      switch (gameResult) {
        case '1-0':
          return '1-0';
        case '0-1':
          return '0-1';
        case '1/2-1/2':
        case '½-½':
          return '½-½';
        default:
          return '0.00';
      }
    }

    // Otherwise show normal evaluation
    return typeof evalScore === 'string' ? evalScore : (value > 0 ? '+' : '') + value.toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading game analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
          <Link to="/dashboard" className="text-amber-600 hover:text-amber-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentMove = getCurrentMove();
  const evaluation = currentMove ? currentMove.eval : 0;

  const chessboardOptions = {
    position: gamePosition,
    boardOrientation: 'white',
    showNotation: true,
    animationDurationInMs: 500,
    showAnimations: true,
    allowDragging: false,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Game Analysis</h1>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-600">
                <span className="text-white font-bold">♛</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chess Board Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              {/* Game Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {gameData.data.white} vs {gameData.data.black}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy size={16} className="text-amber-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Result: {gameData.data.result}
                    </span>
                  </div>
                </div>
              </div>

              {/* Evaluation Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Position Evaluation</span>
                  <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                    {getEvaluationDisplay(evaluation, gameData?.data?.result)}
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <div 
                      className="h-full bg-black"
                      style={{ 
                        width: `${getEvaluationPercentage(evaluation, gameData?.data?.result)}%`,
                        backgroundImage: 'linear-gradient(45deg, rgba(0, 0, 0, 0.1) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.1) 75%, transparent 75%, transparent)',
                        backgroundSize: '1rem 1rem',
                        transition: 'width 0.5s ease-in-out'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Black</span>
                  <span>White</span>
                </div>
              </div>

              {/* Chess Board */}
              <div className="mb-6">
                <div className="aspect-square max-w-lg mx-auto">
                  <Chessboard
                    options={chessboardOptions}
                  />
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={resetToStart}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  title="Reset to start"
                >
                  <RotateCcw size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={goToPreviousMove}
                  disabled={currentMoveIndex <= 0}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous move"
                >
                  <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-white">
                  Move {currentMoveIndex + 1} / {gameData.data.moveComments.length}
                </span>
                <button
                  onClick={goToNextMove}
                  disabled={!gameData || currentMoveIndex >= gameData.data.moveComments.length - 1}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next move"
                >
                  <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {/* Move List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Moves</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {gameData.data.moveComments.map((move, index) => (
                  <button
                    key={index}
                    onClick={() => goToMove(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      currentMoveIndex === index
                        ? 'bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                          {Math.ceil(move.moveNumber / 2)}.
                          {move.moveNumber % 2 === 1 ? '' : '..'}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {move.move}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getMoveTypeColor(move.type)}`}>
                          {move.type}
                        </span>
                        <span className="text-xs font-mono text-gray-500">
                          {move.eval > 0 ? '+' : ''}{move.eval ? move.eval.toFixed(2) : null} 
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Move Analysis */}
            {currentMove && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Move Analysis</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.ceil(currentMove.moveNumber / 2)}.
                      {currentMove.moveNumber % 2 === 1 ? '' : '..'} {currentMove.move}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoveTypeColor(currentMove.type)}`}>
                      {currentMove.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Evaluation: </span>
                      <span className="font-mono font-medium text-gray-900 dark:text-white">
                        {evaluation === null ? 0.00 : (typeof evaluation === 'string' ? evaluation : (evaluation > 0 ? '+' : '') + evaluation.toFixed(2))}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Evaluation: </span>
                      <span className="font-mono font-medium text-gray-900 dark:text-white">
                        {getEvaluationDisplay(evaluation, gameData?.data?.result)}
                      </span>
                    </div>
                  </div>
                  {currentMove.comment && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {currentMove.comment}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Game Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Game Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(gameData.data.overview).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getMoveTypeColor(type)}`}>
                      {type}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Review */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Final Review</h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {gameData.data.finalReview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessAnalysis;