import React, { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { Redirect } from '../types/redirect';

interface QrCodeModalProps {
  redirect: Redirect;
  onClose: () => void;
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({ redirect, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const fullUrl = `${window.location.origin}/r/${redirect.shortCode}`;
  
  useEffect(() => {
    // Generate QR code for the URL using QR code API
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}`;
    setQrCodeUrl(qrCodeApiUrl);
    
    // Handle clicks outside modal to close
    const handleClickOutside = (e: MouseEvent) => {
      const modal = document.getElementById('qr-modal-content');
      if (modal && !modal.contains(e.target as Node)) {
        onClose();
      }
    };
    
    window.addEventListener('mousedown', handleClickOutside);
    
    // Prevent scrolling of background
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [redirect.shortCode, fullUrl, onClose]);
  
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  const handleDownload = () => {
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `qrcode-${redirect.shortCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4 py-6">
      <div id="qr-modal-content" className="bg-white rounded-lg shadow-xl max-w-md w-full animate-slide-up">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="font-semibold text-lg text-gray-800">QR Code</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col items-center">
            <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
              {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />}
            </div>
            
            <p className="text-sm text-gray-700 mb-4 text-center">
              Scan this QR code to be redirected to:<br />
              <span className="font-medium break-all">{fullUrl}</span>
            </p>
            
            <button 
              onClick={handleDownload}
              className="btn btn-primary flex items-center gap-2"
            >
              <Download size={16} />
              Download QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodeModal;