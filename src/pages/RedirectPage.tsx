import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getRedirectByShortCode, incrementRedirectClicks } from '../utils/storage';
import { ExternalLink } from 'lucide-react';

const RedirectPage: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let timer: number;
    let redirectTimer: number;

    const loadRedirect = async () => {
      if (!shortCode) {
        setNotFound(true);
        return;
      }
      
      try {
        const redirect = await getRedirectByShortCode(shortCode);
        if (redirect) {
          setTargetUrl(redirect.targetUrl);
          await incrementRedirectClicks(redirect.id);
          
          // Start countdown
          timer = window.setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer);
              }
              return prev - 1;
            });
          }, 1000);
          
          // Set up redirect
          redirectTimer = window.setTimeout(() => {
            window.location.href = redirect.targetUrl;
          }, 3000);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        setError('Failed to load redirect. Please try again.');
        console.error('Redirect error:', err);
      }
    };

    loadRedirect();
    
    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [shortCode]);
  
  if (notFound) {
    return <Navigate to="/not-found" />;
  }
  
  if (error) {
    return (
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md text-center animate-fade-in">
        <div className="text-red-500 mb-4">{error}</div>
        <a href="/" className="btn btn-primary">
          Return Home
        </a>
      </div>
    );
  }
  
  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md text-center animate-fade-in">
      <ExternalLink size={48} className="text-blue-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Redirecting you...</h1>
      
      {targetUrl && (
        <>
          <p className="text-gray-600 mb-6">
            You'll be redirected to:
            <span className="block mt-2 text-blue-600 font-medium break-all">{targetUrl}</span>
          </p>
          
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Redirecting in {countdown} seconds...
            </p>
          </div>
          
          <a 
            href={targetUrl}
            className="btn btn-primary"
          >
            Go now
          </a>
        </>
      )}
    </div>
  );
};

export default RedirectPage;