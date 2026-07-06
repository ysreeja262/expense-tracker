export type Category = 
  | 'FOOD'
  | 'TRANSPORTATION'
  | 'ENTERTAINMENT'
  | 'SHOPPING'
  | 'BILLS'
  | 'RENT'
  | 'OTHER';

export interface Expense {
    id: number;
    date: string;
    amount: number;
    category: Category;
    description: string;
    createdAt: string;
}

export interface ExpenseRequest {
    date: string;
    amount: number;
    category: Category;
    description: string;
}

export interface FilterState {
    category: Category | '';
    from: string;
    to: string;
}