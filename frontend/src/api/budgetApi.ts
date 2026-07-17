import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export interface Budget {
    id: number;
    category: string;
    monthlyLimit: number;
    createdAt: string;
    updatedAt: string;
}

export const fetchBudgets = () =>
    api.get<Budget[]>('/budgets');

export const setBudget = (category: string, monthlyLimit: number) => 
    api.post<Budget>('/budgets', {
        category,
        monthlyLimit: monthlyLimit.toString()
    });

export const deleteBudget = (id: number) => 
    api.delete(`/budgets/${id}`);