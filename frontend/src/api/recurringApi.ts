import axios from 'axios';
import { Category } from '../types/expense';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-type' : 'application/json'}
});

export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface RecurringExpense {
    id: number;
    description: string;
    amount: number;
    category: Category;
    frequency: Frequency;
    createdAt: string;
}

export const fetchRecurring = () =>
    api.get<RecurringExpense[]>('/recurring');

export const addRecurring = (
    description: string,
    amount: number,
    category: Category,
    frequency: Frequency
) => 
    api.post<RecurringExpense>('/recurring', {
        description,
        amount: amount.toString(),
        category,
        frequency
    });

export const deleteRecurring = (id:number) => 
    api.delete(`/recurring/${id}`);