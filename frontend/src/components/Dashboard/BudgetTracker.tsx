import React, { useState, useEffect, useCallback } from 'react';
import { Target, Plus, Trash2, X, AlertTriangle } from 'lucide-react';
import { Expense, Category } from '../../types/expense';
import { formatCurrency } from '../../utils/currency';
import {
    Budget,
    fetchBudgets,
    setBudget,
    deleteBudget
} from '../../api/budgetApi';

interface BudgetTrackerProps {
    expenses: Expense[];
    currency: string;
}

const CATEGORIES: Category[] = [
    'FOOD', 'TRANSPORTATION', 'ENTERTAINMENT', 'SHOPPING', 'BILLS', 'RENT', 'OTHER'
];

const BudgetTracker: React.FC<BudgetTrackerProps> = ({
    expenses,
    currency
}) => {
    const [ budgets, setBudgets ] = useState<Budget[]>([]);
    const [ showForm, setShowForm ] = useState(false);
    const [ selectCategory, setSelectedCategory ] = useState<Category>('FOOD');
    const [ limitAmount, setLimitAmount ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState('');

    const loadBudgets = useCallback(async () => {
        try {
            const res = await fetchBudgets();
            setBudgets(res.data);
        } catch {
            setError('Failed to load budgets');
        }
    }, []);

    useEffect(() => {
        loadBudgets();
    }, [loadBudgets]);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlySpending = expenses.reduce((acc, e) => {
        const date = new Date(e.date);
        if(date.getMonth() === currentMonth &&
           date.getFullYear() === currentYear) {
           acc[e.category] = (acc[e.category] || 0) + e.amount;
        }
        return acc;
    }, {} as Record<string, number>);

    const handleSetBudget = async() => {
        if(!limitAmount || parseFloat(limitAmount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setLoading(true);
        try {
            await setBudget(selectCategory, parseFloat(limitAmount));
            await loadBudgets();
            setShowForm(false);
            setLimitAmount('');
            setError('');
        } catch {
            setError('Failed to set budget');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteBudget(id);
            await loadBudgets();
        } catch {
            setError('Failed to delete budget');
        }
    };

    const getStatusColor = (percent: number) => {
        if(percent >= 100) return 'bg-red-500';
        if(percent >= 80) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const getStatusBg = (percent: number) => {
        if(percent >= 100) return 'bg-red-50 border-red-200';
        if(percent >= 80) return 'bg-amber-50 border-amber-200';
        return 'bg-white border-gray-100';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border
                        border-gray-100 p-6 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-gray-800">
                        Budget Limits
                    </h2>
                </div>
                <button
                   onClick={() => setShowForm(!showForm)}
                   className="flex items-center gap-2 px-3 py-1.5
                              bg-indigo-600 text-white text-sm
                              font-medium rounded-lg hover: bg-indigo-700
                              transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    SetBudget
                </button>
            </div>

            {/*Error */}
            {error && (
                <div className="bg-red-50 border border-red-200
                                rounded=-lg p-3 mb-4">
                   <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Add Budget Form */}
            {showForm && (
                <div className="bg-indigo-50 border border-indigo-200
                                rounded-xl mb-4">
                   <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-indigo-800">
                        Set Monthly Budget
                    </h3>
                    <button 
                       onClick={() => setShowForm(false)}
                       className="text-indigo-400 hover:text-indigo-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs font-medium
                                          text-gray-600 mb-1">
                            Caetgory
                        </label>
                        <select
                           value={selectCategory}
                           onChange = {(e) => 
                              setSelectedCategory(e.target.value as Category)
                           }
                           className="w-full px-3 py-2 border border-gray-200
                                      rounded-lg text-sm focus:outline-none
                                      focus:ring-2 focus:ring-indigo-300"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium
                                          text-gray-600 mb-1">
                            Monthly Limit
                        </label>
                        <input
                          type="number"
                          value={limitAmount}
                          onChange={(e) => setLimitAmount(e.target.value)}
                          placeholder="0.00"
                          min="0.01"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-200
                                     rounded=lg text-sm focus:outline-none
                                     foucs:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                          onClick = {handleSetBudget}
                          disabled = {loading}
                          className="w-full px-4 py-2 bg-indigo-600
                                     text-white text-sm font-medium
                                     rounded-lg hover:bg-indigo-700
                                     transition-colors diasbled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Budget'}
                        </button>
                    </div>
                   </div>
                </div>
            )}

            {/*Budget List */}
            {budgets.length === 0 ? (
                <div className="text-center py-8">
                    <Target className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm font-medium">
                       No budgets set yet
                    </p>
                    <p className="text-gray-300 text-xs mt-1">
                        Click "Set Budget" to add category limits
                    </p>
                </div>
            ) : (
               <div className="space-y-3">
                 {budgets.map(budget => {
                  const spent = monthlySpending[budget.category] || 0;
                  const percent = Math.round(
                    (spent / budget.monthlyLimit) * 100
                  );
                  const isOver = percent >= 100;
                  const isWarning = percent >= 80 && percent < 100;

                  return (
                    <div 
                       key = {budget.id}
                       className={`p-4 rounded-xl border
                                   ${getStatusBg(percent)}`}
                    >
                        <div className="flex items-center
                                        justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {isOver && (
                                    <AlertTriangle className = "h-4 w-4 text-red-500" />
                                )}
                                {isWarning && (
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                )}
                                <span className="text-sm font-semibold text-gray-800">
                                    {budget.category}
                                </span>
                                {isOver && (
                                    <span className="text-xs bg-red-100
                                                     text-red-600 px-2 py-0.5
                                                     rounded-full font-medium">
                                        Over Budget!
                                    </span>
                                )}
                                {isWarning && (
                                    <span className="text-xs bg-amber-100
                                                     text-amber-600 px-2 py-0.5
                                                     rounded-full font-medium">
                                        Near Limit
                                    </span>
                                )}
                            </div>
                            <button
                              onClick={() => handleDelete(budget.id)}
                              className="p-1 text-gray-300
                                         hover:text-red-400
                                         transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className={`h-2 rounded-full transition-all
                                          duration-500
                                          ${getStatusColor(percent)}`}
                              style={{width: `${Math.min(percent, 100)}%`}}
                            />
                        </div>

                        {/* Amount Info */}
                        <div className = "flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                {formatCurrency(spent, currency)} spent
                            </span>
                            <span className="text-xs font-medium text-gray-600">
                                {percent}% of{' '}
                                {formatCurrency(budget.monthlyLimit, currency)}
                            </span>
                        </div>
                    </div>
                  );
                  })}
                </div>
            )}
        </div>
    );
};

export default BudgetTracker;