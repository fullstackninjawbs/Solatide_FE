import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, Trash2, Info, CheckCircle } from 'lucide-react';
import { Modal } from './Modal';

const ConfirmContext = createContext(null);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmState({
        ...options,
        isOpen: true,
        onConfirm: () => {
          setConfirmState(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(null);
          resolve(false);
        }
      });
    });
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {confirmState && <ConfirmDialog {...confirmState} />}
    </ConfirmContext.Provider>
  );
};

const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary', // 'primary', 'danger', 'warning', 'info'
  icon, // custom icon component or mapped string
  onConfirm,
  onCancel,
  warningText
}) => {
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          button: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
          iconContainer: 'bg-red-100 text-red-600',
          defaultIcon: <Trash2 className="h-6 w-6" />
        };
      case 'warning':
        return {
          button: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500',
          iconContainer: 'bg-amber-100 text-amber-600',
          defaultIcon: <AlertTriangle className="h-6 w-6" />
        };
      case 'info':
        return {
          button: 'bg-brand-blue hover:bg-blue-700 text-white focus:ring-brand-blue',
          iconContainer: 'bg-blue-100 text-brand-blue',
          defaultIcon: <Info className="h-6 w-6" />
        };
      case 'primary':
      default:
        return {
          button: 'bg-brand-navy hover:bg-slate-800 text-white focus:ring-slate-900',
          iconContainer: 'bg-slate-100 text-brand-navy',
          defaultIcon: <CheckCircle className="h-6 w-6" />
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onCancel} 
      title="" 
      hideCloseButton 
      closeOnOutsideClick={variant !== 'danger'} // Prevent accidental closes on dangerous actions
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:flex-row gap-5">
        <div className={`shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:h-10 sm:w-10 ${styles.iconContainer}`}>
          {icon || styles.defaultIcon}
        </div>
        
        <div className="flex-1 w-full">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {description}
          </p>
          
          {warningText && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-left">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[13px] text-amber-800 font-medium leading-snug">
                {warningText}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${styles.button}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};
