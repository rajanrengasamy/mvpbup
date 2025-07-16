#!/usr/bin/env python3
import csv
import random
from datetime import datetime, timedelta
import uuid

# Countries and profit centers
COUNTRIES = {
    'AU': 'Australia',
    'CN': 'China', 
    'HK': 'Hong Kong',
    'IN': 'India',
    'NL': 'Netherlands',
    'SG': 'Singapore',
    'TW': 'Taiwan',
    'GB': 'United Kingdom',
    'US': 'United States'
}

PROFIT_CENTERS = [
    (1, 'D1'),
    (2, 'IXO'),
    (3, 'FICC'),
    (4, 'SSO')
]

# Account categories with realistic ranges
ACCOUNT_TYPES = {
    'revenue': {
        'l1': 'Revenue',
        'l2_options': ['Trading Revenue', 'Commission Income', 'Market Making Revenue'],
        'l3_options': ['Equity Trading', 'Options Trading', 'Fixed Income Trading'],
        'amount_range': (500000, 5000000),
        'is_income_statement': True,
        'is_capital': False
    },
    'other_income': {
        'l1': 'Other Income',
        'l2_options': ['Interest Income', 'Fee Income', 'Other Revenue'],
        'l3_options': ['Investment Income', 'Service Fees', 'Miscellaneous Income'],
        'amount_range': (10000, 500000),
        'is_income_statement': True,
        'is_capital': False
    },
    'personnel': {
        'l1': 'Personnel expenses',
        'l2_options': ['Wages', 'Bonuses', 'Benefits', 'Pensions'],
        'l3_options': ['Base Salary', 'Performance Bonus', 'Health Benefits', 'Retirement'],
        'amount_range': (-2000000, -100000),
        'is_income_statement': True,
        'is_capital': False
    },
    'operating': {
        'l1': 'General and administrative expenses',
        'l2_options': ['IT Expenses', 'Office Expenses', 'Professional Fees', 'Marketing'],
        'l3_options': ['Software Licenses', 'Rent', 'Legal Fees', 'Advertising'],
        'amount_range': (-500000, -50000),
        'is_income_statement': True,
        'is_capital': False
    },
    'non_operating': {
        'l1': 'Non-operating expenses',
        'l2_options': ['Interest Expense', 'Financial Charges', 'Other Non-operating'],
        'l3_options': ['Loan Interest', 'Bank Charges', 'Foreign Exchange Loss'],
        'amount_range': (-200000, -10000),
        'is_income_statement': True,
        'is_capital': False
    },
    'tax': {
        'l1': 'Tax',
        'l2_options': ['Corporate Tax', 'Income Tax', 'Other Tax'],
        'l3_options': ['Federal Tax', 'State Tax', 'International Tax'],
        'amount_range': (-500000, -50000),
        'is_income_statement': True,
        'is_capital': False
    },
    'capital': {
        'l1': 'Capital',
        'l2_options': ['Equity Capital', 'Regulatory Capital', 'Working Capital'],
        'l3_options': ['Share Capital', 'Retained Earnings', 'Reserves'],
        'amount_range': (1000000, 10000000),
        'is_income_statement': False,
        'is_capital': True
    }
}

def generate_transaction_id():
    return random.randint(8000000, 8999999)

def generate_date_in_month(year, month):
    day = random.randint(1, 28)  # Safe for all months
    return datetime(year, month, day)

def get_accounting_period(date):
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    month_name = month_names[date.month - 1]
    year_short = str(date.year)[2:]
    period_name = f"{month_name}-{year_short}"
    
    # Calculate quarter
    quarter = (date.month - 1) // 3 + 1
    parent_name = f"Q{quarter} {date.year}"
    
    # Period ID (simplified)
    period_id = 290 + date.month - 10  # October 2024 = 291
    
    # First and last day of month
    start_date = date.replace(day=1)
    if date.month == 12:
        end_date = date.replace(year=date.year + 1, month=1, day=1) - timedelta(days=1)
    else:
        end_date = date.replace(month=date.month + 1, day=1) - timedelta(days=1)
    
    return {
        'id': period_id,
        'start': start_date.strftime('%Y-%m-%d'),
        'end': end_date.strftime('%Y-%m-%d'),
        'name': period_name,
        'parent': parent_name
    }

def generate_financial_data():
    # CSV headers based on the original file
    headers = [
        'transaction_id', 'transaction_line_id', 'transaction_type', 'transaction_date',
        'accounting_period_id', 'accounting_period_start_date', 'accounting_period_end_date',
        'accounting_period_name', 'accounting_period_parent_name', 'l3_profit_centre_id',
        'l3_profit_centre_name', 'l2_profit_centre_id', 'l2_profit_centre_name',
        'l1_profit_centre_id', 'l1_profit_centre_name', 'subsidiary_id', 'subsidiary_name',
        'subsidiary_country', 'subsidiary_country_code', 'region_id', 'region_name',
        'business_id', 'business_name', 'gl_account_code', 'bookrunner', 'currency',
        'currency_is_homeoffice', 'apac_tax_status_id', 'apac_tax_status_name',
        'account_id', 'account_number', 'Personnel expenses', 'account_l1_name',
        'account_l2_name', 'account_l3_name', 'account_l4_name', 'nspb_l2_name',
        'nspb_l3_name', 'nspb_l4_name', 'account_type_id', 'is_income_statement',
        'account_type_name', 'accounting_period_is_closed', 'amount', 'amount_local_currency',
        'FY_2025', 'Jul-24', 'Aug-24', 'Sep-24', 'Oct-24', 'Nov-24', 'Dec-24',
        'amount_eur', 'amount_aud', 'amount_usd', 'amount_cny', 'amount_inr',
        'amount_gbp', 'amount_sgd', 'amount_twd', 'rate_to_eur', 'rate_to_aud',
        'rate_to_usd', 'rate_to_cny', 'rate_to_inr', 'rate_to_gbp', 'rate_to_sgd',
        'rate_to_twd', 'created', 'status', 'entity_lock_version', 'created_date',
        'last_updated_date', 'internal_reference', 'l1_profit_centre_orderby',
        'currency_symbol', 'amount_hkd', 'rate_to_hkd', 'account_l1_orderby',
        'is_capital', 'is_expense', 'is_local_gaap', 'account_grouping_1',
        'account_grouping_2', 'account_grouping_3', 'reporting_node_id', 'reporting_node_name'
    ]
    
    rows = []
    
    # Generate transactions for each month (Oct, Nov, Dec 2024)
    for month in [10, 11, 12]:
        # Generate transactions for each country
        for country_code, country_name in COUNTRIES.items():
            # Generate transactions for each profit center
            for pc_id, pc_name in PROFIT_CENTERS:
                # Generate multiple transactions per account type
                for account_type, config in ACCOUNT_TYPES.items():
                    # Generate 5-10 transactions per type
                    num_transactions = random.randint(5, 10)
                    
                    for _ in range(num_transactions):
                        date = generate_date_in_month(2024, month)
                        period = get_accounting_period(date)
                        
                        # Generate amount based on country size (some countries bigger than others)
                        size_multiplier = {
                            'US': 2.0, 'GB': 1.8, 'NL': 1.5, 'SG': 1.3,
                            'AU': 1.0, 'HK': 0.9, 'CN': 0.8, 'TW': 0.7, 'IN': 0.6
                        }.get(country_code, 1.0)
                        
                        base_amount = random.uniform(*config['amount_range'])
                        amount = round(base_amount * size_multiplier, 2)
                        
                        # Create row
                        row = {
                            'transaction_id': generate_transaction_id(),
                            'transaction_line_id': random.randint(1, 500),
                            'transaction_type': random.choice(['Journal', 'Invoice', 'Payment']),
                            'transaction_date': date.strftime('%Y-%m-%dT00:00:00.000000Z'),
                            'accounting_period_id': period['id'],
                            'accounting_period_start_date': period['start'],
                            'accounting_period_end_date': period['end'],
                            'accounting_period_name': period['name'],
                            'accounting_period_parent_name': period['parent'],
                            'l3_profit_centre_id': pc_id,
                            'l3_profit_centre_name': pc_name,
                            'l2_profit_centre_id': pc_id,
                            'l2_profit_centre_name': pc_name,
                            'l1_profit_centre_id': pc_id,
                            'l1_profit_centre_name': pc_name,
                            'subsidiary_id': random.randint(100, 999),
                            'subsidiary_name': country_name,
                            'subsidiary_country': country_name,
                            'subsidiary_country_code': country_code,
                            'region_id': 1,
                            'region_name': 'APAC',
                            'business_id': 1,
                            'business_name': 'Trading',
                            'gl_account_code': f"{random.randint(1000, 9999)}",
                            'bookrunner': 'System',
                            'currency': country_code,
                            'currency_is_homeoffice': 'True' if country_code == 'NL' else 'False',
                            'apac_tax_status_id': '',
                            'apac_tax_status_name': '',
                            'account_id': random.randint(1000, 9999),
                            'account_number': f"{random.randint(100000, 999999)}",
                            'Personnel expenses': '',
                            'account_l1_name': config['l1'],
                            'account_l2_name': random.choice(config['l2_options']),
                            'account_l3_name': random.choice(config['l3_options']),
                            'account_l4_name': '',
                            'nspb_l2_name': '',
                            'nspb_l3_name': '',
                            'nspb_l4_name': '',
                            'account_type_id': 1,
                            'is_income_statement': 'True' if config['is_income_statement'] else 'False',
                            'account_type_name': 'P&L' if config['is_income_statement'] else 'Balance Sheet',
                            'accounting_period_is_closed': 'False',
                            'amount': str(amount),
                            'amount_local_currency': str(amount),
                            'FY_2025': '',
                            'Jul-24': '',
                            'Aug-24': '',
                            'Sep-24': '',
                            'Oct-24': str(amount) if month == 10 else '',
                            'Nov-24': str(amount) if month == 11 else '',
                            'Dec-24': str(amount) if month == 12 else '',
                            'amount_eur': str(round(amount * 0.85, 2)),
                            'amount_aud': str(round(amount * 1.5, 2)),
                            'amount_usd': str(round(amount * 1.0, 2)),
                            'amount_cny': str(round(amount * 7.0, 2)),
                            'amount_inr': str(round(amount * 83.0, 2)),
                            'amount_gbp': str(round(amount * 0.73, 2)),
                            'amount_sgd': str(round(amount * 1.35, 2)),
                            'amount_twd': str(round(amount * 31.0, 2)),
                            'rate_to_eur': '0.85',
                            'rate_to_aud': '1.5',
                            'rate_to_usd': '1.0',
                            'rate_to_cny': '7.0',
                            'rate_to_inr': '83.0',
                            'rate_to_gbp': '0.73',
                            'rate_to_sgd': '1.35',
                            'rate_to_twd': '31.0',
                            'created': datetime.now().strftime('%Y-%m-%d'),
                            'status': 'Active',
                            'entity_lock_version': '1',
                            'created_date': datetime.now().strftime('%Y-%m-%d'),
                            'last_updated_date': datetime.now().strftime('%Y-%m-%d'),
                            'internal_reference': f"REF{random.randint(100000, 999999)}",
                            'l1_profit_centre_orderby': str(pc_id),
                            'currency_symbol': '$',
                            'amount_hkd': str(round(amount * 7.8, 2)),
                            'rate_to_hkd': '7.8',
                            'account_l1_orderby': '1',
                            'is_capital': 'True' if config['is_capital'] else 'False',
                            'is_expense': 'True' if amount < 0 else 'False',
                            'is_local_gaap': 'True',
                            'account_grouping_1': '',
                            'account_grouping_2': '',
                            'account_grouping_3': '',
                            'reporting_node_id': '',
                            'reporting_node_name': ''
                        }
                        
                        rows.append(row)
    
    return headers, rows

def write_csv(filename, headers, rows):
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            # Ensure all fields exist
            full_row = {h: row.get(h, '') for h in headers}
            writer.writerow(full_row)
    
    print(f"Generated {len(rows)} transactions in {filename}")

if __name__ == "__main__":
    headers, rows = generate_financial_data()
    write_csv('/Users/rajan/Library/Mobile Documents/com~apple~CloudDocs/repo/svelte-tailwind4-starter/static/data/q4_2024_financial_data_200k.csv', headers, rows)