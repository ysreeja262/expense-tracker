import React, { useState } from 'react';
import { Award, TrendingUp } from 'lucide-react';
import { Expense } from '../../types/expense';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/dateUtils';

interface TopExpensesProps {
    expenses: Expense[];
    currency: string;
}

const CATEGORY_COLORS: Record<string, string> = {
    FOOD: 'bg-emerald-100 text-emerald-700',
    TRANSPORTATION: 'bg-blue-100 text-blue-700',
    ENTERTAINMENT: 'bg-purple-100 text-purple-700',
    SHOPPING: 'bg-pink-100 text-pink-700',
    BILLS: 'bg-red-100 text-red-700',
    RENT: 'bg-orange-100 text-orange-700',
    OTHER: 'bg-gray-100 text-gray-700'
};

const MEDAL_COLORS = [
    'text-yellow-500',
    'text-gray-400',
    'text-amber-600',
    'text-indigo-400',
    'text-indigo-300'
];

const TopExpenses: React.FC<TopExpensesProps> = ({
    expenses,
    currency
}) => {
    const [view, setView] = useState<'alltime' | 'monthly'>('monthly');

    // Filter by current month if monthly view
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const filtered = view === 'monthly'
      ? expenses.filter(e => {
         const d = new Date(e.date);
         return d.getMonth() === currentMonth &&
                d.getFullYear() === currentYear;
      })
      : expenses;

    // Get top 5 by amount
    const top5 = [...filtered]
      .sort((a, b) => b.amount - a.amount)
      .slice(0,5);
    
    // Total for percentage calculation
    const total = filtered.reduce((sum, e) => sum + e.amount, 0);

    if(expenses.length === 0) {
        return (
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center mb-6">
            <p className="text-gray-400 text-lg font-medium">
                No expenses yet
            </p>
            <p className="text-gray-300 text-sm mt-1">
                Add expenses to see your top spending
            </p>
           </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border
                        border-gray-100 dark:border-gray-700 p-6 mb-6">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Award className="h=5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                        Top 5 Expenses
                    </h2>
                </div>

                {/* Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button 
                       onClick={() => setView('monthly')}
                       className={`px-4 py-1.5 rounded-md text-sm font-medium
                                   transition-all durantion-200
                                   ${view === 'monthly'
                                     ? 'bg-white text-indigo-600 shadow-sm'
                                     : 'text-gray-500 hover:text-gray-700'
                                   }`}
                    >
                        This Month
                    </button>
                    <button
                      onClick = {() => setView('alltime')}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium
                                  transition-all duration-200
                                  ${view === 'alltime'
                                     ? 'bg-white text-indigo-600 shadow-sm'
                                     : 'text-gray-500 hover:text-gray-700'
                                  }`}
                    >
                        All Time
                    </button>
                </div>
            </div>

            {/*Empty state for monthly */}
            {top5.length === 0 ? (
                <div className="text-center py-6">
                    <TrendingUp className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">
                        No expenses this month yet
                    </p>
               </div>
            ) : (
                <div className="space-y-3">
                    {top5.map((expense, index) => {
                        const percent = total > 0
                          ? Math.round((expense.amount / total) * 100)
                          : 0;

                        return (
                            <div key = {expense.id}
                              className="flex items-center gap-4">
                            
                            {/* Rank */}
                            <div className={`text-xl font-black w-6
                                             text-center shrink-0
                                             $[MEDAL_COLORS[index]]`}>
                                {index === 0 ? '🥇' :
                                 index === 1 ? '🥈' :
                                 index === 2 ? '🥉' :
                                 `${index + 1}`}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center
                                                justify-between mb-1">
                                   <div className="flex items-center gap-2 min-w-0">
                                      <span className = "text-sm font-semibold text-gray-800 dark:text-white truncate">
                                        {expense.description}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded-full
                                                        text-xs font-medium shrink-0
                                                        ${CATEGORY_COLORS[expense.category]}`}>
                                        {expense.category}
                                      </span>
                                   </div>
                                   <div className="text-right shrink-0 ml-2">
                                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                                        {formatCurrency(expense.amount, currency)}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-1">
                                        ({percent}%)
                                    </span>
                                   </div>
                                </div>
                                
                                {/*Progress Bar*/}
                                <div className="w-full bg-gray-100 dark:bg-gray-600 rounded-full h-1.5">
                                    <div 
                                       className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                                       style={{ width: `${percent}%`}}
                                    />
                                </div>

                                {/* Date */}
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                    {formatDate(expense.date)}
                                </p>
                            </div>
                            </div>
                        );
                    })}

                    {/*Summary*/}
                    <div className="mt-4 pt-4 border-t border-gray-100
                                    flex items-center justify-between">
                       <span className="text-xs text-gray-500 dark:text-gray-400">
                        Top 5 out of {filtered.length} expenses
                       </span>
                       <span className="text-xs font-semibold text-gray-600">
                         Total:{' '}
                         <span className="text-indigo-600">
                            {formatCurrency (
                                top5.reduce((s, e) => s + e.amount, 0),
                                currency
                            )}
                         </span>
                         {' '}of{' '}
                         {formatCurrency(total, currency)}
                       </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopExpenses;