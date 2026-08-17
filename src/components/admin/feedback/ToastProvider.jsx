import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X, Loader2 } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

let nextId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'info', duration = 5000 }) => {
    const id = ++nextId;
    const newToast = { id, title, message, type };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration !== Infinity && type !== 'loading') {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const toast = {
    success: (options) => addToast({ type: 'success', ...(typeof options === 'string' ? { title: options } : options) }),
    error: (options) => addToast({ type: 'error', duration: 8000, ...(typeof options === 'string' ? { title: options } : options) }),
    warning: (options) => addToast({ type: 'warning', ...(typeof options === 'string' ? { title: options } : options) }),
    info: (options) => addToast({ type: 'info', ...(typeof options === 'string' ? { title: options } : options) }),
    loading: (options) => addToast({ type: 'loading', duration: Infinity, ...(typeof options === 'string' ? { title: options } : options) }),
    dismiss: removeToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div 
        aria-live="polite" 
        className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none sm:top-6 sm:right-6"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onDismiss }) => {
  const { title, message, type } = toast;

  const typeConfig = {
    success: {
      icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      titleColor: 'text-emerald-800',
      messageColor: 'text-emerald-600',
    },
    error: {
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-800',
      messageColor: 'text-red-600',
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      titleColor: 'text-amber-800',
      messageColor: 'text-amber-600',
    },
    info: {
      icon: <Info className="h-5 w-5 text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-600',
    },
    loading: {
      icon: <Loader2 className="h-5 w-5 text-brand-blue animate-spin" />,
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      titleColor: 'text-slate-800',
      messageColor: 'text-slate-600',
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div 
      className={`pointer-events-auto flex w-full flex-col p-4 rounded-[16px] border shadow-lg animate-fade-in ${config.bgColor} ${config.borderColor}`}
      style={{ fontFamily: 'Poppins, sans-serif' }}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${config.titleColor}`}>
            {title}
          </p>
          {message && (
            <p className={`mt-1 text-sm ${config.messageColor}`}>
              {message}
            </p>
          )}
        </div>
        <div className="shrink-0 flex ml-4">
          <button
            onClick={onDismiss}
            className={`inline-flex rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.messageColor} hover:bg-black/5 focus:ring-offset-${config.bgColor.split('-')[1]}-50 transition-colors`}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
