export interface FinancialMetrics {
  netTradingIncome: number;
  otherIncome: number;
  totalIncome: number;
  operatingExpense: number;
  operatingMargin: number;
  nonOperatingExpense: number;
  profitBeforeTax: number;
  tax: number;
  profitAfterTax: number;
  capital: number;
  returnOnEquity: number;
}

export interface Country {
  code: string;
  name: string;
  metrics: FinancialMetrics;
}

export interface ProfitCenter {
  id: string;
  name: string;
  country: string;
  metrics: FinancialMetrics;
}

export interface RawTransaction {
  transaction_id: string;
  transaction_line_id: string;
  transaction_type: string;
  transaction_date: string;
  accounting_period_id: string;
  accounting_period_start_date: string;
  accounting_period_end_date: string;
  accounting_period_name: string;
  accounting_period_parent_name: string;
  l3_profit_centre_id: string;
  l3_profit_centre_name: string;
  subsidiary_id: string;
  subsidiary_name: string;
  subsidiary_country: string;
  subsidiary_suffix: string;
  currency_symbol: string;
  l3_cost_centre_id: string;
  l3_cost_centre_name: string;
  l2_cost_centre_id: string;
  l2_cost_centre_name: string;
  l1_cost_centre_id: string;
  l1_cost_centre_name: string;
  category_id: string;
  category_name: string;
  shared_label_id: string;
  shared_label_name: string;
  spend_key_id: string;
  spend_key_name: string;
  apac_tax_status_id: string;
  apac_tax_status_name: string;
  account_id: string;
  account_number: string;
  rule: string;
  account_l1_name: string;
  account_l2_name: string;
  account_l3_name: string;
  account_l4_name: string;
  nspb_l2_name: string;
  nspb_l3_name: string;
  nspb_l4_name: string;
  account_type_id: string;
  is_income_statement: string;
  is_balance_sheet: string;
  accounting_period_is_closed: string;
  amount: string;
  l2_profit_centre_id: string;
  l2_profit_centre_name: string;
  l1_profit_centre_id: string;
  l1_profit_centre_name: string;
  allocation_country: string;
  key_id: string;
  allocation_id: string;
  comment: string;
  amount_eur: string;
  amount_aud: string;
  amount_usd: string;
  amount_cny: string;
  amount_inr: string;
  amount_gbp: string;
  amount_sgd: string;
  amount_twd: string;
  exchange_rate_local_eur: string;
  exchange_rate_aud_eur: string;
  exchange_rate_usd_eur: string;
  exchange_rate_cny_eur: string;
  exchange_rate_inr_eur: string;
  exchange_rate_gbp_eur: string;
  exchange_rate_sgd_eur: string;
  exchange_rate_twd_eur: string;
  from_region: string;
  to_region: string;
  employee_id: string;
  allocation: string;
  timesheet_profit_centre: string;
  fte: string;
  fte_allocation: string;
  marbles: string;
  marble_allocation: string;
  is_capital: string;
}

export interface TimeSeriesData {
  month: string;
  metrics: FinancialMetrics;
  momChange?: number;
}

export interface CountryTimeSeriesData {
  country: Country;
  timeSeries: TimeSeriesData[];
}

export interface ProfitCenterTimeSeriesData {
  profitCenter: ProfitCenter;
  timeSeries: TimeSeriesData[];
}

export type TimePeriod = 'daily' | 'weekly' | 'monthly';

export interface TimeFilter {
  period: TimePeriod;
  startDate: Date;
  endDate: Date;
  compareWithPrevious: boolean;
}
