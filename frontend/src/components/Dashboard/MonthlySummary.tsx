import React, { useState } from 'react';
import { Calendar, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Expense } from '../../types/expense';
import { formatCurrency } from '../../utils/currency';

interface MonthlySummaryProps {
  expenses: Expense[];
  currency: string;
}

interface MonthlyStat {
  month: string;
  year: number;
  monthYear: string;
  count: number;
  total: number;
  categories: Record<string, number>;
}

interface AnnualStat {
  year: number;
  count: number;
  total: number;
  months: number;
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  expenses,
  currency
}) => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'annual'>('monthly');
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  // Build monthly stats
  const monthlyStats: MonthlyStat[] = Object.values(
    expenses.reduce((acc, e) => {
      const date = new Date(e.date);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const key = `${month}-${year}`;

      if (!acc[key]) {
        acc[key] = {
          month,
          year,
          monthYear: key,
          count: 0,
          total: 0,
          categories: {}
        };
      }

      acc[key].count += 1;
      acc[key].total += e.amount;
      acc[key].categories[e.category] =
        (acc[key].categories[e.category] || 0) + e.amount;

      return acc;
    }, {} as Record<string, MonthlyStat>)
  ).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return new Date(`${b.month} 1`).getMonth() -
           new Date(`${a.month} 1`).getMonth();
  });

  // Build annual stats
  const annualStats: AnnualStat[] = Object.values(
    expenses.reduce((acc, e) => {
      const year = new Date(e.date).getFullYear();

      if (!acc[year]) {
        acc[year] = {
          year,
          count: 0,
          total: 0,
          months: 0
        };
      }

      acc[year].count += 1;
      acc[year].total += e.amount;
      return acc;
    }, {} as Record<number, AnnualStat>)
  ).map(stat => ({
    ...stat,
    months: monthlyStats.filter(m => m.year === stat.year).length
  }))
  .sort((a, b) => b.year - a.year);

  // Grand total
  const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border
                      border-gray-100 p-8 text-center mb-6">
        <p className="text-gray-400 text-lg font-medium">
          No data for summary
        </p>
        <p className="text-gray-300 text-sm mt-1">
          Add expenses to see monthly and annual breakdown
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm 
                    border border-gray-100 dark:border-gray-700
                    p-6 mb-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Spending Summary
          </h2>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium
                        transition-all duration-200
                        ${activeTab === 'monthly'
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                        }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab('annual')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium
                        transition-all duration-200
                        ${activeTab === 'annual'
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                        }`}
          >
            Annual
          </button>
        </div>
      </div>

      {/* Monthly Tab */}
      {activeTab === 'monthly' && (
        <div>
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 px-4 py-2
                          bg-gray-50 dark:bg-gray-700 rounded-lg mb-2">
            <span className="text-xs font-semibold text-gray-500
                             uppercase tracking-wider">
              Month
            </span>
            <span className="text-xs font-semibold text-gray-500
                             uppercase tracking-wider text-center">
              Expenses
            </span>
            <span className="text-xs font-semibold text-gray-500
                             uppercase tracking-wider text-center">
              Avg/Expense
            </span>
            <span className="text-xs font-semibold text-gray-500
                             uppercase tracking-wider text-right">
              Total
            </span>
          </div>

          {/* Monthly Rows */}
          <div className="space-y-1">
            {monthlyStats.map((stat) => (
              <div key={stat.monthYear}>

                {/* Row */}
                <div
                  className="grid grid-cols-4 gap-4 px-4 py-3
                             rounded-lg hover:bg-gray-50
                             dark:hover:bg-gray-700
                             cursor-pointer transition-colors"
                  onClick={() => setExpandedMonth(
                    expandedMonth === stat.monthYear
                      ? null
                      : stat.monthYear
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {stat.month} {stat.year}
                    </span>
                    {expandedMonth === stat.monthYear
                      ? <ChevronUp className="h-3 w-3 text-gray-400" />
                      : <ChevronDown className="h-3 w-3 text-gray-400" />
                    }
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300 text-center">
                    {stat.count}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 text-center">
                    {formatCurrency(stat.total / stat.count, currency)}
                  </span>
                  <span className="text-sm font-bold text-gray-800
                                   dark:text-white text-right">
                    {formatCurrency(stat.total, currency)}
                  </span>
                </div>

                {/* Expanded Category Breakdown */}
                {expandedMonth === stat.monthYear && (
                  <div className="mx-4 mb-2 p-3 bg-indigo-50
                                  rounded-lg border border-indigo-100">
                    <p className="text-xs font-semibold text-indigo-700
                                  mb-2 uppercase tracking-wider">
                      Category Breakdown
                    </p>
                    <div className="space-y-1.5">
                      {Object.entries(stat.categories)
                        .sort((a, b) => b[1] - a[1])
                        .map(([cat, amount]) => (
                          <div
                            key={cat}
                            className="flex items-center
                                       justify-between"
                          >
                            <span className="text-xs text-gray-600">
                              {cat}
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="w-24 bg-indigo-100
                                              rounded-full h-1.5">
                                <div
                                  className="bg-indigo-500 h-1.5
                                             rounded-full"
                                  style={{
                                    width: `${(amount / stat.total) * 100}%`
                                  }}
                                />
                              </div>
                              <span className="text-xs font-semibold
                                               text-gray-700 w-20
                                               text-right">
                                {formatCurrency(amount, currency)}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Monthly Grand Total */}
          <div className="mt-4 pt-4 border-t border-gray-100
                          grid grid-cols-4 gap-4 px-4">
            <span className="text-sm font-bold text-gray-800">
              Grand Total
            </span>
            <span className="text-sm font-bold text-gray-800
                             text-center">
              {expenses.length}
            </span>
            <span className="text-sm font-bold text-gray-800
                             text-center">
              {formatCurrency(grandTotal / expenses.length, currency)}
            </span>
            <span className="text-sm font-bold text-indigo-600
                             text-right">
              {formatCurrency(grandTotal, currency)}
            </span>
          </div>
        </div>
      )}

      {/* Annual Tab */}
      {activeTab === 'annual' && (
        <div>
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 px-4 py-2
                          bg-gray-50 rounded-lg mb-2">
            <span className="text-xs font-semibold text-gray-500
                             uppercase tracking-wider">
              Year
            </span>
            <span className="text-xs font-semibold text-gray-500
                             uppercase tracking-wider text-center">
              Months
            </span>
            <span className="text-xs font-semibold text-gray-500
                             uppercase tracking-wider text-center">
              Expenses
            </span>
            <span className="text-xs font-semibold text-gray-500
                             uppercase tracking-wider text-right">
              Total
            </span>
          </div>

          {/* Annual Rows */}
          <div className="space-y-1">
            {annualStats.map((stat) => (
              <div
                key={stat.year}
                className="grid grid-cols-4 gap-4 px-4 py-3
                           rounded-lg hover:bg-gray-50
                           transition-colors"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-medium text-gray-800">
                    {stat.year}
                  </span>
                </div>
                <span className="text-sm text-gray-600 text-center">
                  {stat.months}
                </span>
                <span className="text-sm text-gray-600 text-center">
                  {stat.count}
                </span>
                <span className="text-sm font-bold text-gray-800
                                 text-right">
                  {formatCurrency(stat.total, currency)}
                </span>
              </div>
            ))}
          </div>

          {/* Annual Grand Total */}
          <div className="mt-4 pt-4 border-t border-gray-100
                          grid grid-cols-4 gap-4 px-4">
            <span className="text-sm font-bold text-gray-800">
              Grand Total
            </span>
            <span className="text-sm font-bold text-gray-800
                             text-center">
              {annualStats.reduce((s, a) => s + a.months, 0)}
            </span>
            <span className="text-sm font-bold text-gray-800
                             text-center">
              {expenses.length}
            </span>
            <span className="text-sm font-bold text-indigo-600
                             text-right">
              {formatCurrency(grandTotal, currency)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlySummary;