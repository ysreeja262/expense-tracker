import React, { useState } from 'react';
import {
    PieChart, Pie, Cell, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer
} from 'recharts';
import { Expense } from '../../types/expense';
import { formatCurrency } from '../../utils/currency';

interface SpendingChartProps {
    expenses: Expense[];
    currency: string;
}

const COLORS = [
    '#6366f1', '#10b981', '#f59e0b',
    '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'
];

const SpendingChart: React.FC<SpendingChartProps> = ({ expenses, currency }) => {
    const [activeChart, setActiveChart] = useState<'pie' | 'bar'>('pie');

    // Category wise data for pie chart
    const categoryData = Object.entries(
        expenses.reduce((acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + e.amount;
            return acc;
        }, {} as Record<string, number>)
    ).map(([name, value]) => ({name, value}));

    // Monthly data for bar chart
    const monthlyData = Object.entries(
        expenses.reduce((acc, e) => {
            const month = new Date(e.date).toLocaleString('default', {
                month: 'short', year: '2-digit'
            });
            acc[month] = (acc[month] || 0) + e.amount;
            return acc;
        }, {} as Record<string, number>)
    )
    .map(([month, amount]) => ({month, amount}))
    .slice(-6);

    //Custom tooltip shown on hover
    const CustomTooltip = ({ active, payload }: any) => {
        if(active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200
                                rounded-lg shadow-lg p-3">
                  <p className="font-medium text-gray-700">
                    {payload[0].name || payload[0].payload.month}
                  </p>
                  <p className="text-indigo-600 font-bold">
                    {formatCurrency(payload[0].value, currency)}
                  </p>              
                </div>
            );
        }
        return null;
    };

    if(expenses.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border
                            border-gray-100 p-8 text-center mb-6">
             <p className="text-gray-400 text-lg font-medium">
                No expense data to display charts
             </p>
             <p className = "text-gray-300 text-sm mt-1">
                Add some expenses to see spending patterns
             </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border
                        border-gray-100 p-6 mb-6">
           {/*Header + Toogle */}
           <div className = "flex items-center justify-between mb-6">
             <h2 className="text-lg font-bold text-gray-800">
                Spending Analytics
             </h2>
             <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                   onClick={() => setActiveChart('pie')}
                   className={`px-4 py-1.5 rounded-md text-sm font-medium
                               transistion-all duration-200
                               ${activeChart === 'pie'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                               }`}
                >
                    By Category
                </button>
                <button 
                   onClick={() => setActiveChart('bar')}
                   className={`px-4 py-1.5 rounded-md text-sm font-medium
                               transition-all duration-200
                               ${activeChart === 'bar'
                                 ? 'bg-white text-indigo-600 shadow-sm'
                                 : 'text-gray-500 hover:text-gray-700'
                               }`}
                >
                    By Month
                </button>
             </div>
           </div>

           {/* Pie Chart - By Category */}
           {activeChart === 'pie' && (
            <div className="flex flex-col lg:flex-row items-center gap-6">
                <ResponsiveContainer width = "100%" height={280}>
                    <PieChart>
                        <Pie
                           data={categoryData}
                           cx="50%"
                           cy="50%"
                           innerRadius={70}
                           outerRadius={110}
                           paddingAngle={3}
                           dataKey="value"
                        >
                            {categoryData.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>

                {/* Category Breakdown List */}
                <div className="w-full lg:w-64 space-y-2">
                    {categoryData
                       .sort((a,b) => b.value - a.value)
                       .map((item, index) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between
                                       p-2 rounded-lg bg-gray-50"
                          >
                            <div className="flex items-center gap-2">
                              <div 
                                 className="w-3 h-3 rounded-full shrink-0"
                                 style={{
                                    backgroundColor: COLORS[index % COLORS.length]
                                 }}
                                />
                                <span className = "text-sm text-gray-600">
                                    {item.name}
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-800">
                                {formatCurrency(item.value, currency)}
                            </span>
                        </div>
                       ))}
                </div>
            </div>
           )}

           {/*Bar Chart - By Month */}
           {activeChart === 'bar' && (
            <ResponsiveContainer width = "100%" height={280}>
                <BarChart
                  data={monthlyData}
                  margin={{top: 5, right: 20, left: 20, bottom: 5}}
                >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey = "month"
                  tick = {{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280'}}
                  tickFormatter={(value) => 
                     formatCurrency(value, currency)
                  }
                />
                <Tooltip content = {<CustomTooltip />} />
                <Bar
                   dataKey="amount"
                   fill="#6366f1"
                   radius={[6, 6, 0, 0]}
                   name="Spending"
                />
                </BarChart>
            </ResponsiveContainer>
           )}
        </div>
    );
};

export default SpendingChart;