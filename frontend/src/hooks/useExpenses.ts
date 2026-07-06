//This is a custom React hook that manages the state and operations related to expenses. 
// It provides functionality to fetch, add, update, and delete expenses while handling loading and error states. 
// The hook uses TypeScript for type safety and ensures that the data structures used are consistent with the defined types in the project.

import { useState, useEffect, useCallback } from 'react'; //useState -> manages state of expenses, useEffect -> performs side effects (like fetching data), useCallback -> memoizes function to prevent unnecessary re-renders
import { Expense, ExpenseRequest, FilterState} from '../types/expense'; 
import {
    fetchExpenses,
    createExpense, //The 4 API functions imported from the expenseApi module are used to interact with the backend for fetchin, creating, updating, and deleting expenses.
    editExpense,
    removeExpense
} from '../api/expenseApi';

export const useExpenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]); //empty array at start, gets filled when API responds with data. every component that uses this hook will have access to the expenses state and can render the list of expenses accordingly.
    const [loading, setLoading] = useState(false); //loading state is false at start, set to true when API call is made, and set back to false when API call is completed. This state can be used to show a loading spinner or message in the UI while data is being fetched.
    const [error, setError] = useState(''); // '' empty at start, set to error message when API call fails. This state can be used to display an error message in the UI if the API call fails.

    const loadExpenses = useCallback(async (filters?: Partial<FilterState>) => { //useCallback is used to memoize the loadExpenses function, preventing it from being recreated on every render. async function that fetches expenses from the backend API. It accepts an optional filters parameter of type Partial<FilterState> to filter the expenses based on category and date range.
        setLoading(true); //tell react that we are loading data, so it can show a loading spinner or message in the UI.
        try {
            const res = await fetchExpenses(filters); //await the response from the fetchExpenses API call, passing in the filters if provided. The response is expected to contain the list of expenses.
            setExpenses(res.data);      //fetchExpenses - API function that makes a GET request to the backend to retrieve the list of expenses. //res - contains the response from the API call, including the data (list of expenses) and any other relevant information. //setExpenses - updates the expenses state with the data received from the API response, triggering a re-render of any components that use this hook.
            setError('');
        } catch {
            setError('Failed to load expenses. Is the backend running properly?');
        } finally { // runs whether success or failure, ensures that the loading state is reset to false after the API call is completed, allowing the UI to stop showing the loading spinner or message.
            setLoading(false);
        }
    }, []); //[] - The empty dependency array ensures that the loadExpenses function is only created once when the component mounts, and it won't be recreated on subsequent renders unless the dependencies change. 

    useEffect(() => {
        loadExpenses();  //automatically fetches the expenses when the component using this hook mounts. This ensures that the expenses are loaded and available for display as soon as the component is rendered.
    }, [loadExpenses]);

    const addExpense = async (data: ExpenseRequest) => {
        await createExpense(data);
        await loadExpenses();
    };

    const updateExpense = async (id: number, data: ExpenseRequest) => {
        await editExpense(id, data);
        await loadExpenses();
    };

    const deleteExpense = async (id: number) => {
        await removeExpense(id);
        await loadExpenses();
    };

    return {
        expenses,
        loading,
        error,
        addExpense,
        updateExpense,
        deleteExpense,
        loadExpenses
    };
};

//loadExpenses() called
         //↓
//setLoading(true) -> spinner shows
            //↓
//GET/api/expenses -> Spring Boot -> MySQL
        //↓
//Success?
  //YES -> setExpenses(data) -> list updates
  //NO -> setError('Failed to load expenses. Is the backend running properly?') -> error message shows
//finally -> setLoading(false) -> spinner hides

//addExpense workflow
//user fills out form and submits -> addExpense(data) called
            //↓
//await createExpense(data) -> POST/api/expenses -> Spring Boot saves to MySQl -> waits for confirmation.
            //↓
//await loadExpenses() -> fetches updated list of expenses and updates the state, triggering a re-render of the component to reflect the new expense in the UI.

//updateExpense workflow
//user edits an existing expense and submits -> updateExpense(id, data) called
            //↓
//await editExpense(id, data) -> PUT/api/expenses/:id -> Spring Boot updates the expense in MySQL -> waits for confirmation.
            //↓
//await loadExpenses() -> fetches updated list of expenses and updates the state, triggering a re-render of the component to reflect the updated expense in the UI.

//deleteExpense workflow
//user clicks delete button on an expense -> deleteExpense(id) called
            //↓
//await removeExpense(id) -> DELETE/api/expenses/:id -> Spring Boot removes the expense from MySQL -> waits for confirmation.
            //↓
//await loadExpenses() -> fetches updated list of expenses and updates the state, triggering a re-render of the component to reflect the removed expense in the UI.

/*APP LOADS
    ↓
useExpenses() initializes
    ↓
useState sets: expenses=[], loading=false, error=''
    ↓
useEffect fires → loadExpenses()
    ↓
loading=true → spinner shows
    ↓
fetchExpenses() → GET /api/expenses
    ↓
Spring Boot → MySQL → returns data
    ↓
setExpenses(data) → list renders
loading=false → spinner hides
    ↓
USER ADDS EXPENSE
    ↓
addExpense(formData)
    ↓
createExpense() → POST /api/expenses → saved to MySQL
    ↓
loadExpenses() → fresh list → UI updates
    ↓
USER EDITS EXPENSE
    ↓
updateExpense(id, formData)
    ↓
editExpense() → PUT /api/expenses/id → updated in MySQL
    ↓
loadExpenses() → fresh list → UI updates
    ↓
USER DELETES EXPENSE
    ↓
deleteExpense(id)
    ↓
removeExpense() → DELETE /api/expenses/id → removed from MySQL
    ↓
loadExpenses() → fresh list → UI updates
    ↓
USER APPLIES FILTER
    ↓
loadExpenses({ category: 'FOOD' })
    ↓
fetchExpenses({ category: 'FOOD' })
→ GET /api/expenses?category=FOOD
    ↓
filtered list → UI updates */