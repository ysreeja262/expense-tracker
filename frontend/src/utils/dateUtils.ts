// Backend sends "2026-06-26T10:00:00". this is an ISO string. we need to convert it to a date object and then format it to a string that is human readable. we use date-fns library for this. the format function takes a date object and a format string and returns a formatted string. converts to "Jun 26, 2026 10:00 AM".
import { format, parseISO } from 'date-fns'; // format - a converts a date object into a string based on a specified format. parseISO - a function that takes an ISO 8601 formatted string and converts it into a JavaScript Date object.

export const formatDate = (date: string): string => { //export - makes this function available to other files. formatDate - a function that takes a date string as input and returns a formatted date string. date: string - the input date string in ISO 8601 format. : string -  the return type of the function is a string.
    try {
        return format(parseISO(date), 'MMM dd, yyyy hh:mm a'); //'MMM' -> "June", ''dd' => "26", 'yyyy' -> "2026", 'hh' -> "10", 'mm' -> "00", 'a' -> "AM". the format function takes a date object and a fomat string and returns a fomatted string. parseISO takes an ISO 8601 formatted string and converts it into a JavaScript Date object.
    } catch {
        return date; //if parseISO fails, return the original date string. this is a fallback to ensure that the function always returns a string, even if the input is not a valid date.
    }
};

export const formatDateForInput = (date: string): string => {
    try {
        return format(parseISO(date), "yyyy-MM-dd'T'HH:mm"); //this is the format that the HTML input element of type "datetime-local" expects. it is a subset of ISO 8601 format. the format function takes a date object and a format string and returns a formatted string. parseISO takes an ISO 8601 formatted string and converts it into a JavaScript Date object.
    } catch {
        return ''; //if parseISO fails, return an empty string. this is a fallback to ensure that the function always returns a string, even if the input is not a valid date.
    }
};

//formatDate() → ExpenseList.tsx. shows "Jun 26, 2026 10:00 AM" in the expense table
//formatDateForInput() → ExpenseForm.tsx. pre-fills the date picker when editing an existing expense

/* Backend sends:
"2026-06-26T10:00:00"
        ↓
In ExpenseList (display):
formatDate("2026-06-26T10:00:00")
→ parseISO → Date object
→ format   → "Jun 26, 2026 10:00 AM"
→ shown in table

In ExpenseForm (edit mode):
formatDateForInput("2026-06-26T10:00:00")
→ parseISO → Date object
→ format   → "2026-06-26T10:00"
→ pre-fills the date input field */