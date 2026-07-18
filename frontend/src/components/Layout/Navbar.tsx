//This is a React functional component that represents the navigation bar of the ExpenseTracker application.
// It includes a logo, a currency selector, and a mobile menu toggle button. The component uses React hooks for state management and handles user interactions such as changing the selected currency and toggling the mobile menu.

import React, { useState } from 'react'; //React - needed to create React components, useState - hook to manage the state of the mobile menu (open/closed)
import { DollarSign, Menu, X, Moon, Sun } from 'lucide-react'; 
import { SUPPORTED_CURRENCIES, getUserCurrency } from '../../utils/currency'; //SUPPORTED_CURRENCIES - array of supported currency codes and labels, getUserCurrency - function to get the user's preferred currency from local storage or default to USD.

interface NavbarProps {
    onCurrencyChange: (currency: string) => void; //onCurrencyChange - callback function that is called when the user selects a different currency from the dropdown. It takes the selected currency code as an argument.
    selectedCurrency: string; //selectedCurrency - the currently selected currency code, which is passed as a prop to the Navbar component. This value is used to set the default value of the currency selector dropdown.
    isDark: boolean;
    onToggleDark: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCurrencyChange, selectedCurrency, isDark, onToggleDark }) => { //React.FC<NavbarProps> - tells Type
    const [menuOpen, setMenuOpen] = useState(false); //menuOpen = false -> hamburger icon shown, menu hidden. menuOpen = true -> X icon shown, menu visible.

    return (
        <nav className = "bg-indigo-700 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/*logo*/}
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-8 w-8 text-indigo-200" />  
                        <span className="text-xl font-bold tracking-tight">
                            ExpenseTracker
                        </span>
                    </div>

                    {/*Desktop Currency Selector */}
                    <div className="hidden md:flex items-center gap-4"> 
                         <label className="text-indigo-200 text-sm font-medium">
                            Currency:
                         </label>
                         <select
                           value={selectedCurrency} //value={selectedCurrency} - controlled input, always shows current currency. selectedCurrency is passed as a prop to the Navbar component, and it represents the currently selected currency code.
                           onChange={(e) => onCurrencyChange(e.target.value)} //onChange -> when user picks new currency, call onCurrencyChange with new value. e.target.value is the new selected currency code from the dropdown.
                           className="bg-indigo-600 text-white text-sm rounded-lg px-3 py-1.5 border border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                         >
                            {SUPPORTED_CURRENCIES.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.label}
                                </option>
                            ))}
                         </select>

                         {/* Dark Mode Toggle */}
                         <button 
                           onClick={onToggleDark}
                           className="p-2 rounded-lg bg-indigo-600
                                      dark:bg-gray-700 hover:bg-indigo-500
                                      dark:hover:bg-gray-600"
                            title={isDark ? 'Switch to Light' : 'Switch to Dark'}
                         >
                            {isDark
                              ? <Sun className="h-5 w-5 text-yellow-300" />
                              : <Moon className="h-5 w-5 text-indigo-200" />
                            }
                         </button>
                    </div>

                    {/*Mobile Menu Button*/}
                    <div className="md:hidden items-center gap-2"> 
                        <button
                            onClick={onToggleDark} 
                            className="p-2 rounded-lg bg-indigo-600 dark:bg-gray-700 transition-colors"
                        >
                            {isDark
                              ? <Sun className="h-5 w-5 text-yellow-300" />
                              : <Moon className="h-5 w-5 text-indigo-200" />
                            }
                        </button>
                        <button
                          onClick={() => setMenuOpen(!menuOpen)}
                          className="text-indigo-200 hover:text-white"
                        >
                            {menuOpen 
                              ? <X className="h-6 w-6" />
                              : <Menu className="h-6 w-6" />
                            } 
                        </button>
                    </div>
                </div>
            </div>
            {/*Mobile Menu*/}
            {menuOpen && (
                <div className="md:hidden bg-indigo-800 dark: bg-gray-800 px-4 py-3">
                        <label className="text-indigo-200 text-sm font-medium block mb-1">
                            Currency:
                        </label>
                        <select
                            value={selectedCurrency}
                            onChange={(e) => {
                                onCurrencyChange(e.target.value);
                                setMenuOpen(false);
                            }} //onChange -> when user picks new currency, call onCurrencyChange with new value. e.target.value is the new selected currency code from the dropdown. setMenuOpen(false) -> close the mobile menu after selecting a currency.
                            className="w-full bg-indigo-600 dark: bg-gray text-white text-sm rounded-lg 
                                       px-3 py-1.5 border border-indigo-500 focus:outline-none 
                                       focus:ring-2 focus:ring-indigo-300"
                        >
                            {SUPPORTED_CURRENCIES.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
             </nav>
          );
};

export default Navbar;

//Why props instead of managing state here:
/*Navbar changes currency
      ↓
SummaryCards needs to know
SpendingChart needs to know
ExpenseList needs to know

Solution: keep currency state in App.tsx
          pass it down to everyone who needs it
          Navbar just tells App.tsx when it changes*/

/*Complete Workflow
APP LOADS
    ↓
App.tsx renders Navbar with:
  selectedCurrency="INR" (auto-detected)
  onCurrencyChange={handleCurrencyChange}
    ↓
Navbar renders with INR selected in dropdown

DESKTOP - USER CHANGES CURRENCY
    ↓
User clicks dropdown → selects "USD"
    ↓
onChange fires → onCurrencyChange("USD")
    ↓
App.tsx updates selectedCurrency="USD"
    ↓
App.tsx passes "USD" back to Navbar
    ↓
All components re-render with USD formatting

MOBILE - USER OPENS MENU
    ↓
User clicks ☰ hamburger
    ↓
setMenuOpen(true)
    ↓
X icon replaces ☰
Mobile dropdown appears below navbar
    ↓
User selects currency
    ↓
onCurrencyChange fires
setMenuOpen(false)
    ↓
Menu closes, currency updates everywhere*/