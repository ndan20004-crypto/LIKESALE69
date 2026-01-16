import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  balance?: number;
}

export default function SuccessModal({ isOpen, onClose, title, message, balance }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border-2 border-green-500 max-w-md w-full shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 rounded-t-xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="size-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2">
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <h2 className="text-lg text-white">{title}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-slate-200 text-lg text-center whitespace-pre-line">
            {message}
          </p>

          {balance !== undefined && (
            <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Số dư còn lại</p>
                <p className="text-green-400 text-3xl">
                  {balance.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors text-lg"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}