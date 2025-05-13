import React, { useState, useEffect } from 'react';
import RedirectForm from '../components/RedirectForm';
import RedirectList from '../components/RedirectList';
import { Redirect } from '../types/redirect';
import { getRedirects } from '../utils/storage';
import { supabase } from '../utils/supabase';
import { LogIn, Mail, Lock } from 'lucide-react';

const HomePage: React.FC = () => {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      loadRedirects();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadRedirects = async () => {
    setLoading(true);
    const data = await getRedirects();
    setRedirects(data);
    setLoading(false);
  };

  const handleRedirectUpdate = () => {
    loadRedirects();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setLoginError('Invalid email or password');
      }
    } catch (error) {
      setLoginError('An error occurred during login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome to RedirectHub</h1>
        <p className="text-gray-600 mb-8 text-center">Please sign in to manage your redirects.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {loginError && (
            <div className="text-red-500 text-sm text-center">{loginError}</div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn size={18} />
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">URL Redirect Manager</h1>
      
      <div className="mb-12">
        <RedirectForm onSuccess={handleRedirectUpdate} />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Redirects</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading redirects...</div>
        ) : (
          <RedirectList redirects={redirects} onUpdate={handleRedirectUpdate} />
        )}
      </div>
    </div>
  );
};

export default HomePage;