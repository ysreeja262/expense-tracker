import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Save } from 'lucide-react';
import { Expense, ExpenseRequest, Category } from '../../types/expense';
import { formatDateForInput } from '../../utils/dateUtils';

interface ExpenseFormProps {
    onSubmit: (data: ExpenseRequest) => void;
    onClose: () => void;
    editingExpense?: Expense | null
}

const CATEGORIES: Category[] = [
    'FOOD', 'TRANSPORTATION', 'ENTERTAINMENT', 'SHOPPING', 'BILLS', 'RENT', 'OTHER'
];

interface FormErrors {
    date?: string;
    amount?: string;
    category?: string;
    description?: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
    onSubmit,
    onClose,
    editingExpense
}) => {
    const[form, setForm] = useState<ExpenseRequest>({
        date: '',
        amount: 0,
        category: 'FOOD',
        description: '',
        notes: '',
        tags: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    //Pre-fill form when editing
    useEffect(() => {
        if(editingExpense) {
            setForm({
                date: formatDateForInput(editingExpense.date),
                amount: editingExpense.amount,
                category: editingExpense.category,
                description: editingExpense.description,
                notes: editingExpense.notes || '',
                tags: editingExpense.tags || ''
            });
        } else {
            setForm({
                date: '',
                amount: 0,
                category: 'FOOD',
                description: '',
                notes: '',
                tags: ''
            });
        }
    }, [editingExpense]);

    //Validation
    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if(!form.date) {
            newErrors.date = 'Date is required';
        }
        if(!form.amount || form.amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }
        if(!form.category) { 
            newErrors.category = 'Category is required';
        }
        if(!form.description.trim()) {
            newErrors.description = 'Description is required';
        } else if(form.description.trim().length < 3) {
            newErrors.description = 'Description must be at least 3 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async() => {
        if(!validate()) return;

        setSubmitting(true);

        try{
            await onSubmit({
                ...form,
                date: new Date(form.date).toISOString(),
                amount: parseFloat(form.amount.toString())
            });
            onClose();
        } catch {
            setErrors({ description: 'Failed to save expense. Try again.'});
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setForm(prev => ({ ...prev, [name]: value}));
        if(errors[name as keyof FormErrors]){
            setErrors(prev => ({...prev, [name]: undefined}));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40
                        flex items-center justify-center z-50 px-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/*Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-x1 font-bold text-gray-800">
                    {editingExpense? 'Edit Expense': 'Add Expense'}
                </h2>
                <button
                   onClick={onClose}
                   className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transistion-colors"
                >
                    <X className="h-5 w-5" />
                </button>
              </div>

              {/*Form Body*/}
              <div className="p-6 space-y-4">
                {/*Date*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date & Time
                    </label>
                    <input 
                      type="datetime-local"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm
                                  focus:outline-none focus:ring-2 focus:ring-indigo-300
                                  ${errors.date
                                    ? 'border-red-400 bg-red-50'
                                    : 'border-gray-200'
                                  }`}
                   />
                   {errors.date && (
                    <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                   )}
                </div>

                {/*Amount*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                    </label>
                    <input 
                      type="number"
                      name="amount"
                      value={form.amount || ''}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-lg text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-300
                          ${errors.amount
                            ? 'border-red-400 bg-red-50'
                            : 'border-gray-200'
                          }`}
                    />
                    {errors.amount && (
                        <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                    )}
                </div>

                {/*Category*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <select
                       name="category"
                       value={form.category}
                       onChange={handleChange}
                       className={`w-full px-3 py-2 border rounded-lg text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-300
                          ${errors.category
                            ? 'border-red-400 bg-red-50'
                            : 'border-gray-200'
                          }`}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0) + cat.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                    )}
                </div>

                {/*Description*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                      name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="What did you spend on?"
                        rows={3}
                         className={`w-full px-3 py-2 border rounded-lg text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-300
                          resize-none
                          ${errors.description
                            ? 'border-red-400 bg-red-50'
                            : 'border-gray-200'
                          }`}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/*Notes*/}
                <div>
                    <label className="block text-sm font-meduim text-gray-700 mb-1">
                        Notes
                        <span className="text-gray-400 font-normal ml-1">
                            (optional)
                        </span>
                    </label>
                    <textarea
                       name="notes"
                       value={form.notes || ''}
                       onChange={handleChange}
                       placeholder="Any additional notes..."
                       rows={2}
                       className="w-full px-3 py-2 border border-gray-200
                                  rounded-lg text-sm focus:outline-none
                                  focus:ring-2 focus:ring-indigo-300 resize-none"
                    />
                </div>

                {/*Tags*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                        <span className="text-gray-400 font-normal ml-1">
                            (optional, comma separated)
                        </span>
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={form.tags || ''}
                      onChange={handleChange}
                      placeholder="e.g. weekly, essential, work"
                      className="w-full px-3 py-2 border border-grauy-200
                                 rounded-lg text-sm focus:outline-none
                                 focus:ring-2 focus:ring-indigo-300"
                    />
                    {form.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {form.tags.split(',')
                               .map(t => t.trim())
                               .filter(Boolean)
                               .map((tag, i) => (
                                 <span
                                  key={i}
                                  className="px-2 py-0.5 bg-indigo-100
                                             text-indigo-600 text-xs
                                             rounded-full font-medium"
                                  >
                                    #{tag}
                                  </span>
                            ))}
                        </div>
                    )}
                </div>
              </div>

              {/*Footer buttons*/}
              <div className="flex gap-3 p-6 pt-0">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-200
                       rounded-lg text-sm font-medium text-gray-600
                       hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white
                       rounded-lg text-sm font-medium
                       hover:bg-indigo-700 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"/>
                    ): editingExpense ? (
                        <>
                         <Save className="h-4 w-4" />
                         Save Changes
                        </>
                    ) : (
                        <>
                         <PlusCircle className="h-4 w-4"/>
                         Add Expense
                        </>
                    )}
                </button>
              </div>
           </div>
        </div>
    );
};

export default ExpenseForm;