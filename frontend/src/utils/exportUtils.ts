import { Expense } from '../types/expense';

export const exportToCSV = (expenses: Expense[], filename = 'expense.csv') => {
    if(expenses.length === 0) {
        alert('No expenses to export');
        return;
    }

    //CSV Headers
    const headers = [
        'ID',
        'Date',
        'Description',
        'Category',
        'Amount',
        'Created At'
    ];

    //Format each row
    const rows = expenses.map(e => [
        e.id,
        new Date(e.date).toLocaleString(),
        `"${e.description.replace(/"/g, '""')}"`,
        e.category,
        e.amount.toFixed(2),
        new Date(e.createdAt).toLocaleString()
    ]);

    //Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    //Create download link
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
