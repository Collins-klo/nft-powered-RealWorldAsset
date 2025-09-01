'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase'
import Image from 'next/image'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/profile')
      }
    }
    checkUser()
  }, [router])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) throw error

        if (data.user) {
          router.push('/profile')
        }
      } else {
        // Signup
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match')
        }

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
            }
          }
        })

        if (error) throw error

        if (data.user) {
          router.push('/profile')
        }
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Background Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
        <Image
          src="/assets/images/login (2).jpg"
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
        {/* Decorative dashed line */}
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-dashed border-white border-opacity-30 rounded-full z-20"></div>
      </div>

      {/* Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#322543bd] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">TR</span>
              </div>
              <span className="text-white font-semibold">Tokenizer.</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#0a0a0a] bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="mb-6">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">INVEST NOW</p>
              <h1 className="text-3xl font-bold text-white mb-1">
                {isLogin ? 'Welcome back.' : 'Create new account.'}
                <span className="inline-block w-2 h-2 bg-[#322543bd] rounded-full ml-2"></span>
              </h1>
              <p className="text-gray-400">
                {isLogin ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={toggleMode}
                      className="text-[#7c54ae] hover:text-[#65468d] transition-colors"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already a member?{' '}
                    <button
                      onClick={toggleMode}
                      className="text-[#7c54ae] hover:text-[#65468d] transition-colors"
                    >
                      Log in
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      placeholder="First name"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      required={!isLogin}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Last name"
                      className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>

              {!isLogin && (
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    required={!isLogin}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                   Switch method
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#7c54ae] hover:bg-[#65468d] disabled:bg-[#7c54ae] text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? 'Loading...' : (isLogin ? 'Sign in' : 'Create account')}
                </button>
              </div>
            </form>
          </div>

          {/* Logo */}
          <div className="mt-8 flex justify-end">
            <div className="text-white text-2xl font-bold">TR</div>
          </div>
        </div>
      </div>
    </div>
  )
}
