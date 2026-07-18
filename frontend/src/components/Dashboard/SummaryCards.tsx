import React from 'react';
import { TrendingUp, Calendar, Tag, DollarSign } from 'lucide-react';
import { Expense } from '../../types/expense';
import { formatCurrency } from '../../utils/currency';

interface SummaryCardsProps {
  expenses: Expense[];
  currency: string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ expenses, currency }) => {

  // Total all time spending
  const totalSpending = expenses.reduce(
    (sum, e) => sum + e.amount, 0
  );

  // This month spending
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlySpending = expenses
    .filter(e => {
      const date = new Date(e.date);
      return date.getMonth() === currentMonth &&
             date.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  // Top category this month
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])[0];

  // Total number of expenses
  const totalTransactions = expenses.length;

  const cards = [
    {
      title: 'Total Spending',
      value: formatCurrency(totalSpending, currency),
      icon: <DollarSign className="h-6 w-6" />,
      bg: 'bg-indigo-500',
      description: 'All time expenses'
    },
    {
      title: 'This Month',
      value: formatCurrency(monthlySpending, currency),
      icon: <Calendar className="h-6 w-6" />,
      bg: 'bg-emerald-500',
      description: new Date().toLocaleString('default', {
        month: 'long', year: 'numeric'
      })
    },
    {
      title: 'Top Category',
      value: topCategory ? topCategory[0] : 'None',
      icon: <Tag className="h-6 w-6" />,
      bg: 'bg-amber-500',
      description: topCategory
        ? `${formatCurrency(topCategory[1], currency)} spent`
        : 'No expenses yet'
    },
    {
      title: 'Transactions',
      value: totalTransactions.toString(),
      icon: <TrendingUp className="h-6 w-6" />,
      bg: 'bg-rose-500',
      description: 'Total expenses recorded'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm
                     border border-gray-100 dark:border-gray-700"
        >
          <div className={`${card.bg} text-white p-3 rounded-lg shrink-0`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500 dark: text-gray-400 font-medium">
              {card.title}
            </p>
            <p className="text-xl font-bold text-gray-800 dark: text-white mt-0.5">
              {card.value}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {card.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;