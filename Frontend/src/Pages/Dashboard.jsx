import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useSelector } from "react-redux";
import { getStats } from '../services/User.js'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, Clock, Zap, Target, Globe, Shield, Eye, Menu, ArrowUp, ArrowDown, X } from 'lucide-react';
import { monthlyGames } from '../services/Games.js'
import ThemeToggle from '../components/ThemeToggle.jsx';

const Dashboard = () => {
  const [profile, setProfile] = useState({
    username: "",
    avatar: "",
    playerid: '',
    country: '',
    isVerified: false,
    league: '',
    stats: {
      blitz: {
        rating: 0,
        game: 0,
        win: 0,
        loss: 0,
        draw: 0,
        best: 0
      },
      rapid: {
        rating: 0,
        game: 0,
        win: 0,
        loss: 0,
        draw: 0,
        best: 0
      },
      bullet: {
        rating: 0,
        game: 0,
        win: 0,
        loss: 0,
        draw: 0,
        best: 0
      }
    }
  })
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate()

  useEffect(() => {

    ;(async () => {
      try {
        setLoading(true)

        const res = await getStats()
        const data = res.data.data
        setProfile({
          username: user.username,
          avatar: user.avatar,
          playerid: user.playerid,
          country: user.country,
          isVerified: user.isVerified,
          league: user.league,
          stats: {
            blitz: {
              rating: data.blitz.rating,
              game: data.blitz.game,
              win: data.blitz.win,
              loss: data.blitz.loss,
              draw: data.blitz.draw,
              best: data.blitz.best
            },
            rapid: {
              rating: data.rapid.rating,
              game: data.rapid.game,
              win: data.rapid.win,
              loss: data.rapid.loss,
              draw: data.rapid.draw,
              best: data.rapid.best
            },
            bullet: {
              rating: data.bullet.rating,
              game: data.bullet.game,
              win: data.bullet.win,
              loss: data.bullet.loss,
              draw: data.bullet.draw,
              best: data.bullet.best
            }
          }
        })

        const gameRes = await monthlyGames(user.username)
        setGames(gameRes.games.reverse())

      } catch (error) {
        console.error('User details fetching failed:', error.message);
        setError(error.message || "An Error Occured")
      } finally {
        setLoading(false)
      }

    })()
  }, [])

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getGameResult = (game, username) => {
    const isWhite = game.white.username.toLowerCase() === username.toLowerCase();
    const result = isWhite ? game.white.result : game.black.result;
    
    switch (result) {
      case 'win': return { text: 'Won', color: 'text-green-600 dark:text-green-400' };
      case 'checkmated': return { text: 'Lost', color: 'text-red-600 dark:text-red-400' };
      case 'agreed': return { text: 'Draw', color: 'text-yellow-600 dark:text-yellow-400' };
      case 'repetition': return { text: 'Draw', color: 'text-yellow-600 dark:text-yellow-400' };
      case 'timeout': return { text: 'Lost', color: 'text-red-600 dark:text-red-400' };
      case 'resigned': return { text: 'Lost', color: 'text-red-600 dark:text-red-400' };
      case 'stalemate': return { text: 'Draw', color: 'text-yellow-600 dark:text-yellow-400' };
      case 'insufficient': return { text: 'Draw', color: 'text-yellow-600 dark:text-yellow-400' };
      default: return { text: result, color: 'text-gray-600 dark:text-gray-400' };
    }
  };

  const getTimeControlIcon = (timeClass) => {
    switch (timeClass) {
      case 'rapid': return <Clock size={16} className="text-blue-500" />;
      case 'blitz': return <Zap size={16} className="text-yellow-500" />;
      case 'bullet': return <Target size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  if(loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div> {/* Loader */}
          <p className="text-gray-600 dark:text-gray-300">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  if(error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-$00">Error: {error}</p>
          <button onClick={() => navigate('/sign-in')} className='flex justify-center items-center space-x-3'>
            <ArrowLeft size={18}/>
            <span className='text-amber-600 hover:text-amber-700'>Return to Sign In</span>
          </button>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile sidebar toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              
              <div className="hidden sm:block h-5 w-px bg-gray-300 dark:bg-gray-600"></div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <ThemeToggle />
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-600">
                <span className="text-white font-bold text-base">♛</span>
              </div>
              <span className="hidden md:inline font-bold text-gray-900 dark:text-white text-xl mr-1">Open Review</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative overflow-hidden">
        {/* Sidebar - User Profile */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-96 sm:w-96 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out lg:transition-none overflow-y-auto`}>
          <div className="p-3 sm:p-4 pt-16 lg:pt-4">
            {profile && (
              <div className="space-y-4 sm:space-y-6">
                {/* Avatar and Basic Info */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={profile.avatar}
                      alt={profile.username}
                      className="w-16 sm:w-20 h-16 sm:h-20 rounded-full border-3 border-amber-600 dark:border-amber-500"
                    />
                    {profile.isVerified && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Shield size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold mt-2 text-gray-900 dark:text-white">
                    {profile.title && (
                      <span className="text-amber-600 dark:text-amber-400 mr-1">
                        {profile.title}
                      </span>
                    )}
                    {profile.username}
                  </h2>
                  {profile.name && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{profile.name}</p>
                  )}
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <Globe size={12} className="text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {profile.country || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <p className="text-center text-red-600 dark:text-red-400 text-wrap px-4">
                  NOTE: Ratings update every 20 minutes. Data is stale
                </p>
                <div className="space-y-3 px-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Ratings</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center space-x-1.5">
                        <Clock size={16} className="text-blue-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Rapid</span>
                      </div>
                      <div className='flex flex-col space-y-1 justify-center items-center'>
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          Rating: {profile.stats.rapid.rating || 'Unrated'}
                        </span>
                        <span className='font-bold text-sm text-gray-900 dark:text-white'>
                          Best: {profile.stats.rapid.best || 'Unrated'}
                        </span>
                        {(profile.stats.rapid.rating >= profile.stats.rapid.best) ? (
                          <div className='flex items-center space-x-1.5'>
                            <ArrowUp size={16} className='text-green-600 dark:text-green-400' />
                            <span className="text-xs text-green-600 dark:text-green-400">
                              {profile.stats.rapid.best - profile.stats.rapid.rating}
                            </span>
                          </div>
                        ) : (
                          <div className='flex items-center space-x-1.5'>
                            <ArrowDown size={16} className='text-red-600 dark:text-red-400' />
                            <span className="text-xs text-red-600 dark:text-red-400">
                              {profile.stats.rapid.best - profile.stats.rapid.rating}
                            </span>
                          </div>
                        )}
                        <span className='font-bold text-sm text-green-600 dark:text-green-400'>
                          Won: {profile.stats.rapid.win || 0}
                        </span>
                        <span className='font-bold text-sm text-red-600 dark:text-red-400'>
                          Loss: {profile.stats.rapid.loss || 0}
                        </span>
                        <span className='font-bold text-sm text-gray-900 dark:text-white'>
                          Draw: {profile.stats.rapid.draw || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center space-x-1.5">
                        <Zap size={16} className="text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Blitz</span>
                      </div>
                      <div className='flex flex-col space-y-1 justify-center items-center'>
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          Rating: {profile.stats.blitz.rating || 'Unrated'}
                        </span>
                        <span className='font-bold text-sm text-gray-900 dark:text-white'>
                          Best: {profile.stats.blitz.best || 'Unrated'}
                        </span>
                        {(profile.stats.blitz.rating >= profile.stats.blitz.best) ? (
                          <div className='flex items-center space-x-1.5'>
                            <ArrowUp size={16} className='text-green-600 dark:text-green-400' />
                            <span className="text-xs text-green-600 dark:text-green-400">
                              {profile.stats.blitz.best - profile.stats.blitz.rating}
                            </span>
                          </div>
                        ) : (
                          <div className='flex items-center space-x-1.5'>
                            <ArrowDown size={16} className='text-red-600 dark:text-red-400' />
                            <span className="text-xs text-red-600 dark:text-red-400">
                              {profile.stats.blitz.best - profile.stats.blitz.rating}
                            </span>
                          </div>
                        )}
                        <span className='font-bold text-sm text-green-600 dark:text-green-400'>
                          Won: {profile.stats.blitz.win || 0}
                        </span>
                        <span className='font-bold text-sm text-red-600 dark:text-red-400'>
                          Loss: {profile.stats.blitz.loss || 0}
                        </span>
                        <span className='font-bold text-sm text-gray-900 dark:text-white'>
                          Draw: {profile.stats.blitz.draw || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center space-x-1.5">
                        <Target size={16} className="text-red-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Bullet</span>
                      </div>
                      <div className='flex flex-col space-y-1 justify-center items-center'>
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          Rating: {profile.stats.bullet.rating || 'Unrated'}
                        </span>
                        <span className='font-bold text-sm text-gray-900 dark:text-white'>
                          Best: {profile.stats.bullet.best || 'Unrated'}
                        </span>
                        {(profile.stats.bullet.rating >= profile.stats.bullet.best) ? (
                          <div className='flex items-center space-x-1.5'>
                            <ArrowUp size={16} className='text-green-600 dark:text-green-400' />
                            <span className="text-xs text-green-600 dark:text-green-400">
                              {profile.stats.bullet.best - profile.stats.bullet.rating}
                            </span>
                          </div>
                        ) : (
                          <div className='flex items-center space-x-1.5'>
                            <ArrowDown size={16} className='text-red-600 dark:text-red-400' />
                            <span className="text-xs text-red-600 dark:text-red-400">
                              {profile.stats.bullet.best - profile.stats.bullet.rating}
                            </span>
                          </div>
                        )}
                        <span className='font-bold text-sm text-green-600 dark:text-green-400'>
                          Won: {profile.stats.bullet.win || 0}
                        </span>
                        <span className='font-bold text-sm text-red-600 dark:text-red-400'>
                          Loss: {profile.stats.bullet.loss || 0}
                        </span>
                        <span className='font-bold text-sm text-gray-900 dark:text-white'>
                          Draw: {profile.stats.bullet.draw || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 pt-3 px-4 border-t border-gray-200 dark:border-gray-600">
                  {profile.league && (
                    <div className="flex items-center space-x-1.5">
                      <Trophy size={14} className="text-amber-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        League: {profile.league}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content - Recent Games */}
        <div className="flex-1 lg:ml-0 p-3 sm:p-4 w-full min-w-0">
          <p className="text-center text-red-600 dark:text-red-400 text-wrap px-4 py-2 font-bold text-lg">
            NOTE: This page only shows the current month games and not the saved games.
          </p>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Recent Games</h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {games.length} games this month
              </span>
            </div>

            <div className="space-y-3">
              {games.length > 0 ? (
                games.map((game, index) => {
                  const isWhite = game.white.username.toLowerCase() === profile.username.toLowerCase();
                  const opponent = isWhite ? game.black : game.white;
                  const playerRating = isWhite ? game.white.rating : game.black.rating;
                  const result = getGameResult(game, profile.username);

                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center space-x-1.5">
                            {getTimeControlIcon(game.time_class)}
                            <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                              {game.time_class}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {game.time_control}
                            </span>
                            {game.rated && (
                              <span className="px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Rated
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-semibold ${result.color}`}>
                            {result.text}
                            </span>
                            <span className="text-xs text-gray-500">
                            {formatDate(game.end_time)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center justify-between sm:justify-start space-x-3 sm:space-x-4">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                              isWhite ? 'bg-white border-2 border-gray-300 text-black' : 'bg-gray-800 text-white'
                            }`}>
                              {isWhite ? '♔' : '♚'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {profile.username} ({playerRating})
                              </div>
                              <div className="text-xs text-gray-500">You</div>
                            </div>

                            <div className="text-gray-400 text-xs">vs</div>

                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                              !isWhite ? 'bg-white border-2 border-gray-300 text-black' : 'bg-gray-800 text-white'
                            }`}>
                              {!isWhite ? '♔' : '♚'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {opponent.username} ({opponent.rating})
                              </div>
                              <div className="text-xs text-gray-500">Opponent</div>
                            </div>
                          </div>

                          <button className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-all duration-200 text-sm w-full sm:w-auto cursor-pointer" onClick={() => navigate(`/analyze-games/${game.uuid}`)}>
                            <Eye size={14} />
                            <span>Analyze</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Trophy size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                    No recent games
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Play some games on Chess.com to see them here!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard