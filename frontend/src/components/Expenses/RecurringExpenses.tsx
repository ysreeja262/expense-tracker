import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Plus, Trash2, X } from 'lucide-react';
import { Category } from '../../types/expense';
import { formatCurrency } from '../../utils/currency';
import {
    RecurringExpense,
    Frequency,
    fetchRecurring,
    addRecurring,
    deleteRecurring
} from '../../api/recurringApi';

interface RecurringexpenseProps { 
    currency: string;
}

const CATEGORIES: Category[] = [
    'FOOD', 'TRANSPORTATION', 'ENTERTAINMENT', 'SHOPPING', 'BILLS', 'RENT', 'OTHER'
];

const FREQUENCIES: Frequency[] = [
    'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'
];

const FREQUENCY_COLORS: Record<Frequency, string> = {
    DAILY: 'bg-red-100 text-red-700',
    WEEKLY: 'bg-amber-100 text-amber-700',
    MONTHLY: 'bg-blue-100 text-blue-700',
    YEARLY: 'bg-purple-100 text-purple-700'
};

const RecurringExpenses: React.FC<RecurringexpenseProps> = ({
    currency
}) => {
    const [recurring, setRecurring] = useState<RecurringExpense[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const[form, setForm] = useState({
        description: '',
        amount: '',
        category: 'FOOD' as Category,
        frequency: 'MONTHLY' as Frequency
    });

    const loadRecurring = useCallback(async () => {
        try {
            const res = await fetchRecurring();
            setRecurring(res.data);
        } catch {
            setError('Failed to load recurring expenses');
        }
    }, []);

    useEffect(() => {
        loadRecurring();
    }, [loadRecurring]);

    const handleSubmit = async () => {
        if(!form.description.trim()) {
            setError('Description is required');
            return;
        }
        if(!form.amount || parseFloat(form.amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setLoading(true);
        try{
            await addRecurring(
                form.description,
                parseFloat(form.amount),
                form.category,
                form.frequency
            );
            await loadRecurring();
            setShowForm(false);
            setForm({
                description: '',
                amount: '',
                category: 'FOOD',
                frequency: 'MONTHLY'
            });
            setError('');
        } catch {
            setError('Failed to add recurring expense');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteRecurring(id);
            await loadRecurring();
        } catch {
            setError('Failed to delete');
        }
    };

    // Calculate monthly equivalent
    const getMonthlyAmount = (amount: number, frequency: Frequency) => {
        switch (frequency) {
            case 'DAILY' : return amount * 30;
            case 'WEEKLY': return amount * 4;
            case 'MONTHLY': return amount;
            case 'YEARLY': return amount / 12;
        }
    };

    const totalMonthly = recurring.reduce(
        (sum, r) => sum + getMonthlyAmount(r.amount, r.frequency), 0
    );

    return (
        <div className = "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            {/*Header*/}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                        Recurring Expense
                    </h2>
                    {recurring.length>0 && (
                        <span className="text-xs bg-indigo-100 text-indigo-600
                                         px-2 py-0.5 rounded-full font-medium">
                             {formatCurrency(totalMonthly, currency)}/mp      
                        </span>
                    )}
                </div>
                <button
                  onClick = {() => setShowForm(!showForm)}
                  className="flex items-center gap-2 px-3 py-1.5
                             bg-indigo-600 text-white text-sm
                             font-medium rounded-lg hover:bg-indigo-700
                             transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Recurring
                </button>
            </div>

            {/*Error*/}
            {error && (
                <div className="bg-red-50 border border-red-200
                                rounded-lg p-3 mb-4">
                   <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/*Add Form*/}
            {showForm && (
                <div className="bg-indigo-50 border border-indigo-200
                                rounded-xl p-4 mb-4">
                   <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-indigo-800">
                        Add Recurring Expense
                    </h3>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-indigo-400 hover:text-indigo-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Description
                        </label>
                        <input
                          type="text"
                          value={form.description}
                          onChange={(e) => 
                            setForm({ ...form, description: e.target.value})
                          }
                          placeholder="e.g. Netflix, Rent, Gym"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Amount
                        </label>
                        <input 
                           type="number"
                           value={form.amount}
                           onChange={(e) => 
                            setForm({ ...form, amount: e.target.value })
                           }
                           placeholder="0.00"
                           min = "0.01"
                            className="w-full px-3 py-2 border border-gray-200
                                       rounded-lg text-sm focus:outline-none
                                       focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Category
                        </label>
                        <select
                          value={form.category}
                          onChange={(e) => 
                            setForm({
                                ...form,
                                category: e.target.value as Category
                            })
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
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Frequency
                    </label>
                    <select
                      value={form.frequency}
                      onChange={(e) =>
                        setForm({
                            ...form,
                            frequency: e.target.value as Frequency
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200
                                 rounded-lg text-sm focus:outline-none
                                 focus:ring-2 focus:ring-indigo-300"
                    >
                        {FREQUENCIES.map(f => (
                            <option key={f} value={f}>
                                {f.charAt(0) + f.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                   </div>
                </div>

                <button
                   onClick={handleSubmit}
                   disabled={loading}
                   className="w-full px-4 py-2 bg-indigo-600
                              text-white text-sm font-medium
                              rounded-lg hover:bg-indigo-700
                              transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Recurring Expense'}
                </button>
             </div>
            )}

            {/* Recurring List */}
            {recurring.length === 0 ? (
                <div className="text-center py-8">
                    <RefreshCw className="h-10 w-10 text-gray-200 mx-auto mb-2"/>
                    <p className="text-gray-400 text-sm font-medium">
                        No recurring expenses yet
                    </p>
                    <p className="text-gray-300 text-xs mt-1">
                         Add subscriptions, rent, bills that repeat
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {recurring.map(r => (
                        <div 
                          key = {r.id}
                          className="flex items-center justify-between
                                      p-3 rounded-lg bg-gray-50
                                      hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <RefreshCw className="h-4 w-4 text-indigo-600"/>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                        {r.description}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {r.category}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="{`text-xs px-2 py-0.5 rounded-full
                                                   font-medium
                                                   ${FREQUENCY_COLORS[r.frequency]}`}">
                                    {r.frequency}
                                </span>
                                <span className="text-sm font-bold text-gray-800 dark:text-white">
                                    {formatCurrency(r.amount, currency)}
                                </span>
                                <span className="text-xs text-gray-400">
                                  ({formatCurrency(
                                  getMonthlyAmount(r.amount, r.frequency),
                                  currency
                                  )}/mo)
                                </span>
                                <button
                                   onClick = {() => handleDelete(r.id)}
                                   className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>

                            </div>
                        </div>
                    ))}
                     {/* Total Monthly */}
                     <div className="mt-3 pt-3 border-t border-gray-100
                                     dark:border-gray-700
                                     flex items-center justify-between px-1">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                            Total Monthly Cost
                        </span>
                        <span className="text-sm font-bold text-indigo-600">
                            {formatCurrency(totalMonthly, currency)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecurringExpenses;
