import React, { useState } from 'react';
import { Clipboard, ExternalLink, Trash2, QrCode } from 'lucide-react';
import { Redirect } from '../types/redirect';
import { deleteRedirect, incrementRedirectClicks } from '../utils/storage';
import QrCodeModal from './QrCodeModal';

interface RedirectListProps {
  redirects: Redirect[];
  onUpdate: () => void;
}

const RedirectList: React.FC<RedirectListProps> = ({ redirects, onUpdate }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrCodeRedirect, setQrCodeRedirect] = useState<Redirect | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const copyToClipboard = async (redirect: Redirect) => {
    const fullUrl = `${window.location.origin}/r/${redirect.shortCode}`;
    
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(redirect.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this redirect?')) {
      setDeleting(id);
      try {
        await deleteRedirect(id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting redirect:', error);
        alert('Failed to delete redirect');
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleRedirectClick = async (redirect: Redirect) => {
    try {
      await incrementRedirectClicks(redirect.id);
      onUpdate();
    } catch (error) {
      console.error('Error incrementing clicks:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (redirects.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
        <p>You haven't created any redirects yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {redirects.map(redirect => (
          <div key={redirect.id} className="card animate-slide-up">
            <div className="p-4 border-b">
              <h3 className="font-medium text-gray-900 truncate" title={redirect.targetUrl}>
                {redirect.targetUrl}
              </h3>
              
              <div className="mt-1">
                <a
                  href={`/r/${redirect.shortCode}`}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                  onClick={() => handleRedirectClick(redirect)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {window.location.origin}/r/{redirect.shortCode}
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
              <div className="flex gap-3">
                <span title="Created date">{formatDate(redirect.createdAt)}</span>
                <span title="Click count" className="flex items-center gap-1">
                  <ExternalLink size={14} />
                  {redirect.clicks}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setQrCodeRedirect(redirect)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  title="Generate QR Code"
                >
                  <QrCode size={16} />
                </button>
                
                <button
                  onClick={() => copyToClipboard(redirect)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  title={copiedId === redirect.id ? 'Copied!' : 'Copy to clipboard'}
                >
                  <Clipboard size={16} className={copiedId === redirect.id ? 'text-green-600' : ''} />
                </button>
                
                <button
                  onClick={() => handleDelete(redirect.id)}
                  disabled={deleting === redirect.id}
                  className="p-1.5 text-gray-500 hover:text-red-600 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                  title="Delete redirect"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {qrCodeRedirect && (
        <QrCodeModal
          redirect={qrCodeRedirect}
          onClose={() => setQrCodeRedirect(null)}
        />
      )}
    </>
  );
}

export default RedirectList;