//useState -> tracks filter values and whether panel is expanded

//Filter -> funnel icon on filter button
//X -> close icon on clear button
//PlusCircle -> + icon on add expense button

//Category -> the 7 category types
//FilterState -> {category, from, to}

import React, { useState } from 'react';
import { Filter, X, PlusCircle} from 'lucide-react';
import {Category, FilterState} from '../../types/expense';
import { Download } from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';
import { Expense } from '../../types/expense';

interface ExpenseFiltersProps {
    onFilter: (filters: Partial<FilterState>) => void;
    onAddClick: () => void;
    expenses: Expense[];
}

//onFilter->function called when filters change and tells App.tsx to reaload expenses with new filters from backend
//onAddClick->function called when Add Expense clicked - opens form modal in App.tsx

const CATEGORIES: Category[] = [
    'FOOD', 'TRANSPORTATION', 'ENTERTAINMENT', 'SHOPPING', 'BILLS', 'RENT', 'OTHER'
];

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
    onFilter,
    onAddClick,
    expenses
}) => {
    const [filters, setFilters] = useState<FilterState>({
        category: '',
        from: '',
        to: ''
    });

    const [isExpanded, setIsExpanded] = useState(false);

    //filters -> tracks current filter values. empty string = no filter applied
    //isExpanded -> false = filter panel hidden hidden, true = filter panel visible

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const {name, value} = e.target;
        const updated = { ...filters, [name]: value };
        setFilters(updated);
        applyFilters(updated);
    };

    //e.target.name -> which field changed "category" or "from" or "to"
    //e.target.value -> what the new value is "FOOD" or "2026-06-01T00:00"
    //{ ...filters, [name]: value } -> spread existing filters. update only the changed field.
                                       //Example: {category: 'FOOD', <- updated, from: '', <- unchanged, to: '', <- unchanged}
    //setFilters(updated) -> update local state. re-renders the component.
    //applyFilters(updated) -> immediately sends the applied filters to backend.

    const applyFilters = (current: FilterState) => {
        const active: Partial<FilterState> = {};
        if (current.category) active.category = current.category as Category;
        if (current.from) active.from = current.from;
        if (current.to) active.to = current.to;
        onFilter(active);
    };

    /* Example: User selected FOOD, no dates:
    current = {category: 'FOOD', from: '', to:''}
                ↓
    active = {category: 'FOOD'}. user didn't give from and to - empty strings
                ↓
    onFilter({category: 'FOOD'}). user applied filter and selected category: food
                ↓
    App.tsx -> loadExpenses({category: 'FOOD'})
                ↓
    GET /api/expenses?category=FOOD
                ↓
    Spring Boot filters by FOOD
                ↓
    Only FOOD expenses show in list
                ↓
    If user does not select any filters = active{} -> onFilter({}) -> GET /api/expenses (no params) -> All expenses return
     */

    const clearFilters = () => {
        const empty: FilterState = {category: '', from: '', to: ''};
        setFilters(empty);
        onFilter({});
    };

    /* Reset local state -> all fields empty (when user clicks clear filter)
       onFilter({}) -> reload all expenses. no filters applied
       UI updates -> shows all expenses. clear button disappears */

    const hasActiveFilters = 
       filters.category !== '' || 
       filters.from !== '' ||
       filters.to !== '';

    return (
        <div className = "bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">

            {/* TopRow */}
            <div className = "flex items-center justify-between gap-3">

                {/* Add Expense Button */}

                <button
                  onClick = {onAddClick}
                  className ="flex items-center gap-2 px-4 py-2.5
                               bg-indigo-600 text-white text-sm font-medium
                               rounded-lg hover:bg-indigo-700
                               transition-colors duration-200"
                >
                    <PlusCircle className="h-4 w-4" />
                    Add Expense
                </button> 

                {/* Filter Toggle */}
                <button
                   onClick={() => setIsExpanded(!isExpanded)}
                   className={`flex items-center gap-2 px-4 py-2.5
                               text-sm font-medium rounded-lg
                               border transisition-colors duration-200
                               ${hasActiveFilters
                                ? 'border-indigo-300 text-indigo-600 bg-indigo-50'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                               }`}
                >
                
                    <Filter className="h-4 w-4"/>
                     Filters
                     {hasActiveFilters && (
                        <span className="bg-indigo-600 text-white text-xs
                                         rounded-full w-4 h-4 flex items-center
                                         justify-center">
                            {[filters.category, filters.from, filters.to]
                               .filter(Boolean).length}
                        </span>
                     )}
                </button>
                <button
                   onClick={() => exportToCSV(expenses)}
                   className="flex items-center gap-2 px-4 py-2.5
                              bg-emerald-600 text-white text-sm font-medium
                              rounded-lg hover:bg-emerald-700
                              transition-colors duration-200"
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 px-3 py-2.5
                                 text-sm font-medium text-red-500
                                 hover:bg-red-50 rounded-lg
                                 transition-colors duration-200"
                    >
                        <X className="h-4 w-4" />
                        Clear
                    </button>
                )}
            </div>

            {/* Expanded Filter Panel */}
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100
                                grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-xs font-medium
                                          text-gray-500 mb-1">
                            Category
                        </label>
                        <select 
                          name="category"
                          value={filters.category}
                          onChange = {handleChange}
                          className="w-full px-3 py-2 border border-gray-200
                                     rounded-lg text-sm focus:outline-none
                                     focus:ring-2 focus:ring-indigo-300"
                        >
                            <option value="">All Categories</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/*Form Date */}
                    <div>
                        <label className="block text-xs font-medium
                                          text-gray-500 mb-1">
                            From Date
                        </label>
                        <input 
                           type="datetime-local"
                           name="from"
                           value={filters.from}
                           onChange={handleChange}
                           className="w-full px-3 py-2 border border-gray-200
                                      rounded-lg text-sm focus:outline-none
                                      focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>

                    {/* To Date */}
                    <div>
                        <label className="block text-xs font-medium
                                          text-gray-500 mb-1">
                            To Date
                        </label>
                        <input
                           type="datetime-local"
                           name="to"
                           value={filters.to}
                           onChange={handleChange}
                           className="w-full px-3 py-2 border border-gray-200
                                      rounded-lg text-sm focus:outline-none
                                      focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                </div>
            )}
  
        </div>
    );
};

export default ExpenseFilters;

/* What this component does

Add Expense button -> opens the form modal
Filters button -> shows/hides filter pane
Clear button -> resets all filters
Category dropdown -> filter by category
From/To dates -> filter by date range */

/*App Loads
    ↓
filters = {category: '', from: '',  to:''}
isExpanded = false
    ↓
Shows: [Add Expense] [filters]
    ↓
USER CLICKS FILTERS BUTTON
    ↓
setIsExpanded(true)
    ↓
Filter panel slides open
Shows: Category | From Date | to Date
User will select the food category
    ↓
handle Change fires
    ↓
user selects the values updated = {Category: 'FOOD', from: '', to: ''}
setFilters(updated)
    ↓
applyFilters(updated)
    ↓
active = {category: 'FOOD'}
onFilter({category: 'FOOD'})
    ↓
App.tsx -> loadExpenses({category:'FOOD'}) -> it asks backend for the list of expenses filtered by food
    ↓
GET /api/expenses?category=FOOD
    ↓
Spring Boot -> MySQL -> returns FOOD only
    ↓
Expense list updates instantly. Filter button appears in center and turns purple. and count badge shows 1
    ↓
USER clicks Clear
    ↓
clearFilters will be called
   ↓
setFilters({category: '', from: '', to: ''})
onFilter({})
    ↓
GET /api/expenses (no filters)
    ↓
All expenses will be returned
Filter button goes gray and appear at the right of the screen
clear button disappears
    ↓
USER clicks add expense
    ↓
onAddClick()
    ↓
App.tsx -> setShowForm(true)
    ↓
Expense Form modal opens */
