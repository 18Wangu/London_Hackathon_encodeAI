import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenseStore } from '../stores/expenseStore';
import { DebtGame } from './DebtGame';

interface SmallDebtPopupProps {
  fromId: string;
  toId: string;
  amount: number;
  onClose: () => void;
}

const SmallDebtPopup: React.FC<SmallDebtPopupProps> = ({ 
  fromId, 
  toId, 
  amount, 
  onClose 
}) => {
  const { users } = useExpenseStore();
  const [isVisible, setIsVisible] = useState(false);

  // Get user names
  const getUserName = (userId: string) => {
    return users[userId]?.name || 'Unknown';
  };

  useEffect(() => {
    // Delay the appearance for a smoother experience
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Listen for the debtCleared event
    const handleDebtCleared = (event: CustomEvent) => {
      const { fromId: clearedFromId, toId: clearedToId } = event.detail;
      
      // Check if this popup's debt was cleared
      if (clearedFromId === fromId && clearedToId === toId) {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }
    };

    // Add event listener
    window.addEventListener('debtCleared', handleDebtCleared as EventListener);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('debtCleared', handleDebtCleared as EventListener);
    };
  }, [fromId, toId, onClose]);

  const handleDismiss = () => {
    // Close with animation
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
          />
          
          {/* Popup */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
                      max-w-md w-full p-6 rounded-2xl shadow-2xl
                      bg-gradient-to-br from-french-blue via-french-white to-french-red"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
          >
            <div className="text-center mb-4">
              <motion.div 
                className="text-4xl mb-2 inline-block"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                💸
              </motion.div>
              <h3 className="text-xl font-bold text-white">Small Debt Challenge!</h3>
              <p className="text-sm text-white/80 mt-1">
                {getUserName(fromId)} owes {getUserName(toId)} <span className="font-bold">${amount.toFixed(2)}</span>
              </p>
            </div>
            
            <div className="bg-white/90 rounded-xl p-4 mb-4">
              {/* Embed the DebtGame component here */}
              <DebtGame 
                fromId={fromId}
                toId={toId}
                amount={amount}
                inPopup={true} // Pass a prop to indicate it's in a popup
              />
            </div>
            
            <div className="flex justify-center">
              <motion.button
                className="btn-secondary px-4 py-2 text-french-blue"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDismiss}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SmallDebtPopup;
