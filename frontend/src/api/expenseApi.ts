import axios from 'axios'; 
import {Expense, ExpenseRequest, FilterState} from '../types/expense'; // Import the Expense, ExpenseRequest, and FilterState types from the expense types file

const BASE_URL = 'http://localhost:8080/api'; // Define the base URL for the API

const api = axios.create({ // Create an Axios instance with the base URL and headers
    baseURL: BASE_URL, // Set the base URL for the API
    headers: {
        'Content-Type': 'application/json' // Set the content type header to application/json
    }
}); // Export the Axios instance for use in other parts of the application

export const fetchExpenses = (filters?: Partial<FilterState>) => // Define a function to fetch expenses from the API, optionally with filters
    api.get<Expense[]>('/expenses', { params: filters }); // Make a GET request to the /expenses endpoint with optional filters as query parameters, and expect an array of Expense objects in the response

export const createExpense = (data: ExpenseRequest) => // Define a function to create a new expense in the API
    api.post<Expense>('/expenses', data); // Make a POST request to the /expenses endpoint with the expense data in the request body, and expect an Expense object in the response
export const editExpense = (id: number, data: ExpenseRequest) => // Define a function to edit an existing expense in the API
  api.put<Expense>(`/expenses/${id}`, data); // Make a PUT request to the /expenses/:id endpoint with the expense data in the request body, and expect an Expense object in the response
export const removeExpense = (id: number) => // Define a function to remove an existing expense from the API
  api.delete(`/expenses/${id}`); // Make a DELETE request to the /expenses/:id endpoint to remove the expense with the specified ID

// This file is the bridge between your React frontend and Spring Boot backend.
// Axios is an HTTP client — it's what actually sends requests over the internet to your backend. 
// Think of it like a postman that delivers your requests and brings back responses.
// Content-Type: application/json tells the backend "I'm sending JSON data" 
//  Spring Boot needs this header to parse the request body correctly.

/* User opens app / applies filter
        ↓
fetchExpenses({ category: 'FOOD' })
        ↓
GET http://localhost:8080/api/expenses?category=FOOD
        ↓
Spring Boot → ExpenseController.getExpenses()
        ↓
ExpenseService.getExpenses(FOOD, null, null)
        ↓
ExpenseRepository.findByCategoryOrderByDateDesc(FOOD)
        ↓
MySQL query: SELECT * FROM expenses WHERE category='FOOD'
        ↓
Returns: [{ id:1, amount:150, category:'FOOD', ... }]
        ↓
React updates the expense list on screen*/

/* USER ACTION
    ↓
React Component (button click)
    ↓
useExpenses.ts (hook manages state)
    ↓
expenseApi.ts (sends HTTP request)
    ↓
Spring Boot Backend (processes request)
    ↓
MySQL Database (stores/retrieves data)
    ↓
Response flows back up the same chain
    ↓
React updates UI automatically*/