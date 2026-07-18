import React, { useState } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { getUserCurrency } from './utils/currency';
import { Expense, ExpenseRequest, FilterState } from './types/expense';
import Navbar from './components/Layout/Navbar';
import SummaryCards from './components/Dashboard/SummaryCards';
import ExpenseFilters from './components/Expenses/ExpenseFilters';
import ExpenseList from './components/Expenses/ExpenseList';
import ExpenseForm from './components/Expenses/ExpenseForm';
import SpendingChart from './components/Dashboard/SpendingChart';
import MonthlySummary from './components/Dashboard/MonthlySummary';
import BudgetTracker from './components/Dashboard/BudgetTracker';
import RecurringExpenses from './components/Expenses/RecurringExpenses';
import TopExpenses from './components/Dashboard/TopExpenses';

const App: React.FC = () => {
  const {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    loadExpenses
  } = useExpenses();

  const [currency, setCurrency] = useState(getUserCurrency());
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleAddClick = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleFormSubmit = async (data: ExpenseRequest) => {
    if(editingExpense) {
      await updateExpense(editingExpense.id, data);
    } else {
      await addExpense(data);
    }
  };

  const handleFilter = (filters: Partial<FilterState>) => {
    loadExpenses(filters);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar
         selectedCurrency = {currency}
         onCurrencyChange = {setCurrency}
      />

      <main className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200
                          rounded-xl p-4 mb-6">
            <p className="text-red-600 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        <SummaryCards
           expenses={expenses}
           currency={currency}
        />

        <SpendingChart
           expenses={expenses}
           currency={currency}
        />

        <TopExpenses
          expenses={expenses}
          currency={currency}
        />

        <MonthlySummary
          expenses = {expenses}
          currency = {currency}
        />

        <BudgetTracker
          expenses={expenses}
          currency = {currency}
        />

        <RecurringExpenses
           currency = {currency}
        />

        <ExpenseFilters
           onFilter={handleFilter}
           onAddClick={handleAddClick}
           expenses = {expenses}
        />

        <ExpenseList 
           expenses={expenses}
           currency={currency}
           onEdit={handleEditClick}
           onDelete={deleteExpense}
           loading={loading}
        />

      </main>
      
      {showForm && (
        <ExpenseForm 
           onSubmit={handleFormSubmit}
           onClose={handleFormClose}
           editingExpense={editingExpense}
        />
      )}
    </div>
  );
};

export default App;