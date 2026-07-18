import React, { useState } from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';
import { Expense } from '../../types/expense';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/dateUtils';

interface ExpenseListProps {
    expenses: Expense[];
    currency: string;
    onEdit: (expense: Expense) => void;
    onDelete: (id: number) => void;
    loading: boolean;
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

const ExpenseList: React.FC<ExpenseListProps> = ({
    expenses,
    currency,
    onEdit,
    onDelete,
    loading
}) => {
    const [search, setSearch] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    // Filter expenses by search term
    const filtered = expenses.filter(e => 
        e.description.toLowerCase().includes(search.toLowerCase()) || 
        e.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleDeleteClick = (id: number) => {
        setConfirmDeleteId(id);
    };

    const handleConfirmDelete = () => {
        if(confirmDeleteId !== null) {
            onDelete(confirmDeleteId);
            setConfirmDeleteId(null);
        }
    };

    //Loading state
    if(loading) {
        return (
            <div className = "bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="animate-spin rounded-full h-10 w-10
                                border-b-2 border-indigo-600 mx-auto" />
                <p className = "text-gray-400 mt-3">Loading expenses...</p>
            </div>     
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">

            {/* Header + Search */}
            <div className="p-5 border-b border-gray-100 flex flex-col
                            sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-gray-800">
                    Expenses
                    <span className="ml-2 text-sm font-normal text-gray-400">
                        ({filtered.length} records)
                    </span>
                </h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2
                                       h-4 w-4 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="Search expenses..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="p1-9 pr-4 py-2 text-sm border border-gray-200
                                 rounded-lg focus:outline-non focus:ring-2
                                 focus: ring-indigo-300 w-full sm:w-64"
                      />
                </div>
            </div>

            {/*Empty State*/}
            {filtered.length === 0 ? (
                <div className="p-12 text-center">
                    <p className="text-gray-400 text-lg font-meduim">
                        {search ? 'No expenses match your search' : 'No expenses yet'}
                    </p>
                    <p className="text-gray-300 text-sm mt-1">
                        {search ? 'Try a different search term' : 'Add your first expense above'}
                    </p>
                </div>
            ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['Date', 'Description', 'Category', 'Amount', 'Actions']
                                  .map(h => (
                                    <th
                                      key={h}
                                      className="px-5 py-3 text-left text-xs font-semibold
                                                 text-gray-500 uppercase tracking-wider"
                                    >
                                        {h}
                                    </th>
                                  ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(expense => (
                                <tr
                                 key={expense.id}
                                 className="hover:bg-gray-50 transistion-colors duration-150"
                                 >
                                    <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {formatDate(expense.date)}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-800 font-medium">
                                       <div>{expense.description}</div> 
                                       {expense.notes && (
                                        <div className="text-xs text-gray-400 mt-0.5">
                                            {expense.notes}
                                        </div>
                                       )}
                                       {expense.tags && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {expense.tags.split(',')
                                               .map(t => t.trim())
                                               .filter(Boolean)
                                               .map((tag, i) => (
                                                <span
                                                  key={i}
                                                  className="px-1.5 py-0.5 bg-indigo-50
                                                             text-indigo-500 text-xs
                                                             rounded-full"
                                                >
                                                    #{tag}
                                                </span>
                                               ))}
                                        </div>
                                       )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs
                                                          font-semibold ${CATEGORY_COLORS[expense.category]}`}>
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                                        {formatCurrency(expense.amount, currency)}
                                    </td>
                                    <td className="px-5 py-4">
                                      <div className="flex items-center gap-2">
                                        <button
                                        onClick={() => onEdit(expense)}
                                        className="p-1.5 text-indigo-500 hover:bg-indigo-50
                                                   rounded-lg transistion-colors duration-150"
                                        title="Edit"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick(expense.id)}
                                      className="p-1.5 text-red-400 hover:bg-red-50
                                                 rounded-lg transistion-colors duration-150"
                                      title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    </div>
                                    </td>
                                 </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md-hidden divide-y divide-gray-100">
                    {filtered.map(expense => (
                        <div key={expense.id} className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {expense.description}
                                    </p>
                                    <p className="text-xs text-gray400 mt-0.5">
                                        {formatDate(expense.date)}
                                    </p>
                                </div>
                                <p className="text-sm font-bold text-gray-800">
                                    {formatCurrency(expense.amount, currency)}
                                </p>
                            </div>
                            <div className="flex items-center justofy-between">
                                <span className={`px-2.5 py-1 rounded-full text-xs
                                                  font-semibold ${CATEGORY_COLORS[expense.category]}`}>
                                    {expense.category}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                    onClick = {() => onEdit(expense)}
                                    className="p-1.5 text0-indigo-500 hover:bg-indigo-50
                                               roinded-lg transistion-colors"
                                    >
                                        <Pencil className="h-4 w-4"/>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick(expense.id)}
                                      className="p-1.5 text-red-400 hover:bg-red-50
                                                 rounded-lg transistion-clors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                  </div>
                </>
            )}

            {/* Delete Confirmation Modal */}

            {confirmDeleteId !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-40
                                flex items-center justify-center z-50 px-4">
                  <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                        Delete Expense
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                         Are you sure you want to delete this expense? This action cannot be undone
                    </p>
                    <div className="flex gap-3">
                        <button 
                         onClick={() => setConfirmDeleteId(null)}
                         className="flex-1 px-4 py-2 border border-gray-200
                                    rounded-lg text-sm font-medium text-gray-600
                                    hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                         onClick={handleConfirmDelete}
                         className="flex-1 px-4 py-2 bg-red-500 text-white
                                    rounded-lg text-sm font-medium
                                    hover:bg-red-600 transition-colors"
                        > 
                         Delete
                        </button>
                    </div>
                  </div>
                </div>
            )}
        </div>

    );
};
export default ExpenseList;