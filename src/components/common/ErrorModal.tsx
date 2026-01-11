import React from 'react';
import { XCircle, X } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function ErrorModal({ isOpen, onClose, title, message }: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border-2 border-red-500 max-w-sm w-full shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 rounded-t-xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="size-5" />
          </button>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white rounded-full p-2">
              <XCircle className="size-8 text-red-600" />
            </div>
            <h2 className="text-2xl text-white">{title}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-slate-200 text-center whitespace-pre-line">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors text-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}