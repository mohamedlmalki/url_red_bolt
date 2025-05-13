import React, { useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { createRedirect } from '../utils/storage';
import { validateUrl } from '../utils/helpers';

interface RedirectFormProps {
  onSuccess: () => void;
}

const RedirectForm: React.FC<RedirectFormProps> = ({ onSuccess }) => {
  const [targetUrl, setTargetUrl] = useState('');
  const [customPath, setCustomPath] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error
    setError(null);
    
    // Validate URL
    if (!validateUrl(targetUrl)) {
      setError('Please enter a valid URL including http:// or https://');
      return;
    }
    
    // Validate custom path if provided
    if (customPath && !/^[a-zA-Z0-9-_]+$/.test(customPath)) {
      setError('Custom path can only contain letters, numbers, hyphens, and underscores');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createRedirect(targetUrl, customPath || undefined);
      setTargetUrl('');
      setCustomPath('');
      setFormVisible(false);
      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card p-6 animate-slide-up">
      {!formVisible ? (
        <button 
          onClick={() => setFormVisible(true)}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Create New Redirect
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Create a New Redirect</h3>
          
          <div>
            <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Destination URL
            </label>
            <input
              id="targetUrl"
              type="text"
              placeholder="https://destination.com/long-path"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="input border"
              required
            />
          </div>
          
          <div>
            <label htmlFor="customPath" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Path (optional)
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                {window.location.origin}/r/
              </span>
              <input
                id="customPath"
                type="text"
                placeholder="my-link"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                className="input border rounded-l-none flex-1"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to generate a random short code
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormVisible(false)}
              className="btn btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1 gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : (
                <>
                  Create <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RedirectForm;