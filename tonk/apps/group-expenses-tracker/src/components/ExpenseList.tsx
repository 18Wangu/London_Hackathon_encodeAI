import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenseStore } from '../stores/expenseStore';

const ExpenseList: React.FC = () => {
  const navigate = useNavigate();
  const { expenses, users, balances } = useExpenseStore();

  const getUserName = (userId: string) => {
    return users[userId]?.name || 'Unknown';
  };

  const getCategoryEmoji = (description: string) => {
    // Map of expense categories to emojis
    const categoryMap: Record<string, string> = {
      // Food & Drinks
      'coffee': '☕️',
      'lunch': '🍽️',
      'dinner': '🍴',
      'breakfast': '🥞',
      'restaurant': '🍽️',
      'pizza': '🍕',
      'burger': '🍔',
      'sushi': '🍣',
      'beer': '🍺',
      'drinks': '🍹',
      'bar': '🥂',
      'cafe': '☕️',
      'groceries': '🛒',
      'snacks': '🍿',
      'bakery': '🥐',
      
      // Transportation
      'gas': '⛽',
      'uber': '🚗',
      'taxi': '🚕',
      'lyft': '🚙',
      'train': '🚆',
      'subway': '🚇',
      'bus': '🚌',
      'flight': '✈️',
      'parking': '🅿️',
      'car': '🚘',
      'rental': '🚙',
      
      // Entertainment
      'movie': '🎬',
      'cinema': '🎥',
      'theater': '🎭',
      'concert': '🎵',
      'show': '🎪',
      'game': '🎮',
      'ticket': '🎟️',
      'museum': '🏛️',
      'music': '🎧',
      'netflix': '📺',
      'spotify': '🎵',
      'subscription': '📱',
      
      // Home & Utilities
      'rent': '🏠',
      'mortgage': '🏡',
      'electricity': '💡',
      'water': '💧',
      'internet': '🌐',
      'wifi': '📶',
      'phone': '📱',
      'furniture': '🛋️',
      'repair': '🔧',
      'cleaning': '🧹',
      
      // Shopping
      'clothes': '👕',
      'shoes': '👟',
      'shopping': '🛍️',
      'amazon': '📦',
      'gift': '🎁',
      'electronics': '💻',
      'book': '📚',
      'makeup': '💄',
      
      // Health & Wellness
      'gym': '💪',
      'doctor': '👨‍⚕️',
      'dentist': '🦷',
      'medicine': '💊',
      'pharmacy': '💉',
      'therapy': '🧠',
      'haircut': '💇',
      'spa': '💆',
      
      // Travel
      'hotel': '🏨',
      'airbnb': '🏡',
      'vacation': '🏝️',
      'travel': '🧳',
      'tour': '🗺️',
      'beach': '🏖️',
      
      // Education
      'tuition': '🎓',
      'course': '📝',
      'book': '📚',
      'school': '🏫',
      'university': '🎓',
      'class': '📚',
      
      // Other
      'tax': '📋',
      'insurance': '🔒',
      'loan': '💰',
      'charity': '❤️',
      'donation': '🙏',
      'fee': '💸',
      'bill': '📄',
      'debt': '💳',
      'investment': '📈',
      'salary': '💵',
      'cash': '💵',
      'transfer': '🔄',
      'deposit': '🏦',
      'withdrawal': '💸'
    };
    
    // Convert description to lowercase for case-insensitive matching
    const lowerDesc = description.toLowerCase();
    
    // Find matching category
    for (const [category, emoji] of Object.entries(categoryMap)) {
      if (lowerDesc.includes(category)) {
        return emoji;
      }
    }
    
    // Default emoji if no category matches
    return '💰';
  };

  const getTotalOwed = () => {
    const userId = Object.keys(users)[0]; // For demo, using first user
    if (!userId || !balances[userId]) return 0;
    return Object.values(balances[userId].owes).reduce((sum, amount) => sum + amount, 0);
  };

  return (
    <div className="space-y-8">
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-primary-100 to-primary-50">
          <h3 className="text-lg font-semibold text-primary-700 mb-2">💰 Total Expenses</h3>
          <p className="text-3xl font-bold text-primary-800">
            ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="card bg-gradient-to-br from-accent-100 to-accent-50">
          <h3 className="text-lg font-semibold text-accent-700 mb-2">💸 You Owe</h3>
          <p className="text-3xl font-bold text-accent-800">
            ${getTotalOwed().toFixed(2)}
          </p>
        </div>
        <div className="card bg-gradient-to-br from-secondary-100 to-secondary-50">
          <h3 className="text-lg font-semibold text-secondary-700 mb-2">👥 Active Friends</h3>
          <p className="text-3xl font-bold text-secondary-800">{Object.keys(users).length}</p>
        </div>
      </div>

      {/* Recent Expenses */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold text-gray-800">💳 Recent Expenses</h2>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/balances')}
              className="btn-accent"
            >
              💸 View Balances
            </button>
            <button
              onClick={() => navigate('/add')}
              className="btn-primary"
            >
              + Add Expense
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {expenses.map((expense) => {
            const emoji = getCategoryEmoji(expense.description);
            return (
              <div key={expense.id} className="card hover:scale-[1.02] cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-2xl">
                    {emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{expense.description}</h3>
                        <p className="text-sm text-gray-600">
                          Paid by <span className="font-medium text-primary-600">{getUserName(expense.paidBy)}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-800">${expense.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {expense.participants.map((participantId) => (
                        <div
                          key={participantId}
                          className="avatar bg-gradient-to-br from-accent-400 to-accent-500"
                          title={getUserName(participantId)}
                        >
                          {getUserName(participantId).charAt(0)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;

