const userLocale = navigator.language || 'en-US'; //built into every browser. it reads the user's language or region setting. || 'en-US' - this is a fallback if browser doesn't provide the language or region


//it takes amount and optional currecy code and convert the amount(number) to string
//formatCurrency(150, 'USD') = "$150" (string)
export const formatCurrency = (amount: number, currency?: string): string => {
    return new Intl.NumberFormat(userLocale, {
        style: 'currency',                          //takes "amount" and optional (currency? - it means it's optional) "currency" code. currency || getUserCurrency() - use the provided currecy or auto-detect
        currency: currency || getUserCurrency()     //Intl.NumberFormat is a built-in browser formatter
    }).format(amount);                              //.format(amount) converts number to formatted string
};

//Browser supporting timezone? YES -> getCurrencyByLocale('en-IN) -> 'INR'
//Browser supporting timezone? NO -> 'USD'
//Any error thrown?     -> 'USD'
export const getUserCurrency = (): string => {
    try {                                                       //Intl.DateTimeFormat().resolvedOptions().timeZone - this checks if browser supports the timezone detection. 
        return Intl.DateTimeFormat().resolvedOptions().timeZone //if it detects, it calls getCurrencyByLocale to map locale to currency. if no, fall back to 'USD'. the try and catch block is, 
           ? getCurrencyByLocale(userLocale)                    //if anything goes worng safely return to USD
           : 'USD';
    } catch {
        return 'USD';
    }
};

const getCurrencyByLocale = (locale: string): string => {
    const currencyMap: Record<string, string> = { //Record<string, string> - typescript type for a key-value pair where both key and value are strings
        'en-US': 'USD',                           //currencyMap - a lookup table mapping locale codes to currency codes
        'en-IN': 'INR',                           
        'en-GB': 'GBP',
        'de-DE': 'EUR',
        'fr-FR': 'EUR',
        'ja-JP': 'JPY',
        'zh-CN': 'CNY',
        'ko-KR': 'KRW',
        'en-AU': 'AUD',
        'en-CA': 'CAD',
        'pt-BR': 'BRL',
        'es-MX': 'MXN',
        'ar-SA': 'SAR',
        'en-AE': 'AED',
        'en-SG': 'SGD',
    };
    return currencyMap[locale] || 'USD';          //currencyMap[locale] - looks up the currency for the given table. if locale not found in map, defalut to USD
};

export const SUPPORTED_CURRENCIES = [        //an array of objects, each with code and lable, code-the actual currecy code used by Intl.NumberFormat, label- human readable
    {code: 'USD', label: 'US Dollar $'},
    { code: 'INR', label: 'Indian Rupee ₹' },
  { code: 'GBP', label: 'British Pound £' },
  { code: 'EUR', label: 'Euro €' },
  { code: 'JPY', label: 'Japanese Yen ¥' },
  { code: 'CNY', label: 'Chinese Yuan ¥' },
  { code: 'AUD', label: 'Australian Dollar $' },
  { code: 'CAD', label: 'Canadian Dollar $' },
  { code: 'BRL', label: 'Brazilian Real R$' },
  { code: 'SGD', label: 'Singapore Dollar $' },
  { code: 'AED', label: 'UAE Dirham د.إ' },
  { code: 'SAR', label: 'Saudi Riyal ﷼' },
];


//working: 
//user opens the map 
  // ↓
//navigator.language -> checks browser language or region
  // ↓
//getUserCurrency() -> gets the currency given by user. getCurrencyByLocale('en-IN') -> 'INR'
  // ↓
//formatCurrency(150) -> Formats the currency to a string. Intl.NumberFormat('en-IN', {currency: 'INR'})
  // ↓
// displays "₹150.00"
  // ↓
//User changes to their desire currency in the dropdown 
  // ↓
//formatCurrency(150, 'USD') -> ""$150.00""