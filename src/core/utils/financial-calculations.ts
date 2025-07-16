import type {
  RawTransaction,
  FinancialMetrics,
  Country,
  ProfitCenter,
  TimeSeriesData,
} from 'src/core/types/financial';

export function calculateFinancialMetrics(transactions: RawTransaction[]): FinancialMetrics {
  let netTradingIncome = 0;
  let otherIncome = 0;
  let operatingExpense = 0;
  let nonOperatingExpense = 0;
  let tax = 0;
  let capital = 0;

  transactions.forEach((transaction) => {
    const amount = parseFloat(transaction.amount) || 0;
    const accountL1 = (transaction.account_l1_name || '').toLowerCase();
    const accountL2 = (transaction.account_l2_name || '').toLowerCase();
    const accountL3 = (transaction.account_l3_name || '').toLowerCase();
    const accountL4 = (transaction.account_l4_name || '').toLowerCase();
    const nspbL2 = (transaction.nspb_l2_name || '').toLowerCase();
    const nspbL3 = (transaction.nspb_l3_name || '').toLowerCase();
    const nspbL4 = (transaction.nspb_l4_name || '').toLowerCase();
    const isCapital = transaction.is_capital === 'True';
    const isIncomeStatement = transaction.is_income_statement === 'True';

    // Check if it's capital
    if (isCapital) {
      capital += Math.abs(amount);
    }
    // Only process income statement items
    else if (isIncomeStatement) {
      // Revenue/Trading income - positive amounts in Direct category or revenue accounts
      if (
        accountL1.includes('direct') ||
        accountL1.includes('revenue') ||
        accountL1.includes('trading') ||
        accountL2.includes('revenue') ||
        accountL2.includes('trading income')
      ) {
        if (amount > 0) {
          netTradingIncome += amount;
        }
      }
      // Other income
      else if (
        accountL1.includes('other income') ||
        accountL2.includes('other income') ||
        accountL1.includes('interest income')
      ) {
        otherIncome += Math.abs(amount);
      }
      // Tax
      else if (
        accountL1.includes('tax') ||
        accountL2.includes('tax') ||
        accountL3.includes('tax')
      ) {
        tax += Math.abs(amount);
      }
      // Non-operating expenses - check this BEFORE general expense categories
      else if (
        accountL1.includes('non-operating') || 
        accountL1.includes('non operating') ||
        accountL1.includes('financial expense') ||
        accountL2.includes('interest expense') ||
        accountL2.includes('financial charges')
      ) {
        nonOperatingExpense += Math.abs(amount);
      }
      // Personnel expenses
      else if (accountL1.includes('personnel')) {
        operatingExpense += Math.abs(amount);
      }
      // General and administrative expenses
      else if (accountL1.includes('general and administrative')) {
        operatingExpense += Math.abs(amount);
      }
      // Operating expenses
      else if (accountL1.includes('operating expense')) {
        operatingExpense += Math.abs(amount);
      }
      // Any other expenses
      else if (accountL1.includes('expense')) {
        operatingExpense += Math.abs(amount);
      }
    }
  });

  const totalIncome = netTradingIncome + otherIncome;
  const operatingMargin =
    totalIncome > 0 ? ((totalIncome - operatingExpense) / totalIncome) * 100 : 0;
  const profitBeforeTax = totalIncome - operatingExpense - nonOperatingExpense;
  const profitAfterTax = profitBeforeTax - tax;
  const returnOnEquity = capital > 0 ? (profitAfterTax / capital) * 100 : 0;

  return {
    netTradingIncome,
    otherIncome,
    totalIncome,
    operatingExpense,
    operatingMargin,
    nonOperatingExpense,
    profitBeforeTax,
    tax,
    profitAfterTax,
    capital,
    returnOnEquity,
  };
}

export function aggregateByCountry(transactions: RawTransaction[]): Country[] {
  const countryMap = new Map<string, RawTransaction[]>();

  transactions.forEach((transaction) => {
    const country = transaction.subsidiary_country;
    if (country) {
      if (!countryMap.has(country)) {
        countryMap.set(country, []);
      }
      countryMap.get(country)!.push(transaction);
    }
  });

  const countries: Country[] = [];
  countryMap.forEach((countryTransactions, countryCode) => {
    const metrics = calculateFinancialMetrics(countryTransactions);
    countries.push({
      code: countryCode,
      name: getCountryName(countryCode),
      metrics,
    });
  });

  return countries.sort((a, b) => a.name.localeCompare(b.name));
}

export function aggregateByProfitCenter(
  transactions: RawTransaction[],
  country?: string,
): ProfitCenter[] {
  const profitCenterMap = new Map<string, RawTransaction[]>();

  const filteredTransactions = country
    ? transactions.filter((t) => t.subsidiary_country === country)
    : transactions;

  filteredTransactions.forEach((transaction) => {
    const profitCenterId = transaction.l1_profit_centre_id;
    const profitCenterName = transaction.l1_profit_centre_name;

    if (profitCenterId && profitCenterName) {
      const key = `${profitCenterId}_${profitCenterName}_${transaction.subsidiary_country}`;
      if (!profitCenterMap.has(key)) {
        profitCenterMap.set(key, []);
      }
      profitCenterMap.get(key)!.push(transaction);
    }
  });

  const profitCenters: ProfitCenter[] = [];
  profitCenterMap.forEach((pcTransactions, key) => {
    const [id, name, countryCode] = key.split('_');
    const metrics = calculateFinancialMetrics(pcTransactions);
    profitCenters.push({
      id: id || '',
      name: name || '',
      country: countryCode || '',
      metrics,
    });
  });

  return profitCenters.sort((a, b) => a.name.localeCompare(b.name));
}

export function aggregateByMonth(transactions: RawTransaction[]): TimeSeriesData[] {
  const monthMap = new Map<string, RawTransaction[]>();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.transaction_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, []);
    }
    monthMap.get(monthKey)!.push(transaction);
  });

  const timeSeries: TimeSeriesData[] = [];
  const sortedMonths = Array.from(monthMap.keys()).sort();

  sortedMonths.forEach((month, index) => {
    const monthTransactions = monthMap.get(month)!;
    const metrics = calculateFinancialMetrics(monthTransactions);

    let momChange: number | undefined;
    if (index > 0 && sortedMonths[index - 1]) {
      const previousMonth = sortedMonths[index - 1]!;
      const previousTransactions = monthMap.get(previousMonth);
      if (previousTransactions) {
        const previousMetrics = calculateFinancialMetrics(previousTransactions);
        if (previousMetrics.totalIncome > 0) {
          momChange =
            ((metrics.totalIncome - previousMetrics.totalIncome) / previousMetrics.totalIncome) *
            100;
        }
      }
    }

    timeSeries.push({
      month,
      metrics,
      momChange,
    });
  });

  return timeSeries;
}

export function formatCurrency(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1000) {
    return `${sign}${(absValue / 1000).toFixed(1)}K`;
  }
  return `${sign}${absValue.toFixed(0)}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function calculateGrandTotal(items: Country[]): Country {
  const totals: FinancialMetrics = {
    netTradingIncome: 0,
    otherIncome: 0,
    totalIncome: 0,
    operatingExpense: 0,
    operatingMargin: 0,
    nonOperatingExpense: 0,
    profitBeforeTax: 0,
    tax: 0,
    profitAfterTax: 0,
    capital: 0,
    returnOnEquity: 0,
  };

  items.forEach((item) => {
    totals.netTradingIncome += item.metrics.netTradingIncome;
    totals.otherIncome += item.metrics.otherIncome;
    totals.totalIncome += item.metrics.totalIncome;
    totals.operatingExpense += item.metrics.operatingExpense;
    totals.nonOperatingExpense += item.metrics.nonOperatingExpense;
    totals.profitBeforeTax += item.metrics.profitBeforeTax;
    totals.tax += item.metrics.tax;
    totals.profitAfterTax += item.metrics.profitAfterTax;
    totals.capital += item.metrics.capital;
  });

  totals.operatingMargin =
    totals.totalIncome > 0
      ? ((totals.totalIncome - totals.operatingExpense) / totals.totalIncome) * 100
      : 0;

  totals.returnOnEquity = totals.capital > 0 ? (totals.profitAfterTax / totals.capital) * 100 : 0;

  return {
    code: 'TOTAL',
    name: 'Grand Total',
    metrics: totals,
  };
}

function getCountryName(code: string): string {
  const countryNames: Record<string, string> = {
    AU: 'Australia',
    CN: 'China',
    SG: 'Singapore',
    IN: 'India',
    TW: 'Taiwan',
    NL: 'Netherlands',
    GB: 'United Kingdom',
    US: 'United States',
    HK: 'Hong Kong',
  };

  return countryNames[code] || code;
}
