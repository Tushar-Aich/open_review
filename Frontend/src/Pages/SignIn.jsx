import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, User } from 'lucide-react';
import { useForm } from 'react-hook-form'
import { loginUser } from '../services/User.js';
import { useDispatch } from 'react-redux'
import { storeLogin } from '../store/Auth/authSlice.js';

const SignIn = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false);
  const {handleSubmit, register, formState: {errors}} = useForm({
    defaultValues: {
      Username: ''
    }
  })
  const dispatch = useDispatch()
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginUser(data.Username)
      dispatch(storeLogin(res.data.data))
      navigate('/dashboard');
    } catch (error) {
      // Handle error appropriately
      console.error('Login failed:', error.message);
      alert(`Error: ${error.message}`); // Show error message to user
      return;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Crect x='0' y='0' width='30' height='30'/%3E%3Crect x='30' y='30' width='30' height='30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Back to Home Link */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 mb-8 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200 animate-fadeInUp"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        {/* Sign In Card */}
        <div className="bg-white/95 backdrop-blur-sm dark:bg-gray-900/95 rounded-2xl shadow-2xl p-8 animate-scaleIn">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 bg-amber-600 dark:bg-amber-500 animate-scaleIn animate-delay-100">
              <span className="text-white text-3xl">♛</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white animate-fadeInUp animate-delay-200">
              Welcome
            </h1>
            <p className="text-gray-600 dark:text-gray-300 animate-fadeInUp animate-delay-300">
              Sign in to continue analyzing your chess games
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="animate-fadeInUp animate-delay-400">
              <label htmlFor="Username" className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className='text-gray-400'/>
                </div>
                <input
                  type='text'
                  id='Username'
                  name='Username'
                  placeholder='Enter your Chess.com username'
                  autoComplete='on'
                  {...register("Username", {required: true})}
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white'
                />
              </div>
            </div>

            {/* Sign In Button */}
            {loading ? (
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-amber-600 hover:bg-amber-700 focus:ring-4 focus:ring-amber-500/50 transition-all duration-200 transform hover:scale-[1.02] animate-fadeInUp animate-delay-700"
                disabled
              >
                Sign In
                <Loader2 size={18} className='animate-spin'/>
              </button>
            ) : (
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-amber-600 hover:bg-amber-700 focus:ring-4 focus:ring-amber-500/50 transition-all duration-200 transform hover:scale-[1.02] animate-fadeInUp animate-delay-700"
              >
                Sign In
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;