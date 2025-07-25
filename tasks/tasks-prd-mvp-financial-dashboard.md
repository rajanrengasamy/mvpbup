## Relevant Files

- `src/routes/(dashboard)/+page.svelte` - Main dashboard page component displaying country-level financial overview
- `src/routes/(dashboard)/[country]/+page.svelte` - Country detail page showing profit center breakdown
- `src/components/financial-table/index.ts` - Financial data table component exports
- `src/components/financial-table/financial-table.svelte` - Implementation of the standard financial table
- `src/components/financial-table/financial-table-transposed.svelte` - Transposed view with metrics as rows
- `src/components/time-period-filter/index.ts` - Time period filter dropdown component
- `src/components/time-period-filter/time-period-filter.svelte` - Implementation of time period filter
- `src/core/services/csv-parser.ts` - Service for parsing and processing the static CSV financial data
- `src/core/types/financial.ts` - TypeScript interfaces for financial data structures
- `src/core/utils/financial-calculations.ts` - Utility functions for trend calculations, MoM changes, aggregations and formatting
- `src/components/trend-indicator/index.ts` - Component for displaying trend indicators or sparklines
- `src/components/trend-indicator/trend-indicator.svelte` - Implementation of trend visualization
- `src/core/stores/financial.svelte.ts` - Svelte store for managing financial data state
- `static/data/q4_2024_financial_data_200k.csv` - Static financial data source (already exists)

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Set up financial data models and CSV data processing

  - [x] 1.1 Create TypeScript interfaces for financial metrics (Net Trading Income, Other Income, Total Income, Operating Expense, Operating Margin, Non Operating Expense, Profit Before Tax, Tax, Profit After Tax, Capital, Return on Equity)
  - [x] 1.2 Define interfaces for Country and Profit Center data structures based on CSV columns
  - [x] 1.3 Create CSV parser service to load and process the static financial data from q4_2024_financial_data_200k.csv
  - [x] 1.4 Implement data aggregation functions to calculate country-level metrics from transaction-level CSV data
  - [x] 1.5 Implement data aggregation functions to calculate profit center metrics (D1, IXO, FICC, SSO) for each country
  - [x] 1.6 Create time series data structure to store monthly aggregated values
  - [x] 1.7 Set up Svelte store to manage financial data state and selected filters
  - [x] 1.8 Create utility functions for currency formatting (K for thousands) and percentage calculations

- [x] 2.0 Create country-level financial overview interface

  - [x] 2.1 Build main dashboard route with table layout structure
  - [x] 2.2 Create financial table component with fixed-width columns and right-aligned numbers
  - [x] 2.3 Implement sticky table headers for scrolling
  - [x] 2.4 Add zebra striping for improved row tracking
  - [x] 2.5 Display all required financial metrics as columns
  - [x] 2.6 Add Grand Total row at bottom of table
  - [x] 2.7 Style interface with Optiver branding (dark blue header) and high contrast design
  - [x] 2.8 Create transposed table view with metrics as rows and countries as columns

- [ ] 3.0 Implement financial calculation formulas

  - [ ] 3.1 Create formula calculation engine in `financial-calculations.ts`
  - [ ] 3.2 Implement Net Trading Income formula: `[Gross Trading Income] + [Direct Trading Expense]`
  - [ ] 3.3 Implement Other Income formula: `IF CONTAINS([Nspb L3 Name],'Other Income') then [value] else 0`
  - [ ] 3.4 Implement Total Income formula: `[Net Trading Income] + [Other Income]`
  - [ ] 3.5 Implement Operating Expense formula: `IF [Nspb L2 Name] = 'Operating expenses' then [value] else 0`
  - [ ] 3.6 Implement Non Operating Expense formula: `IF CONTAINS([Nspb L2 Name],'Non-operating ex') THEN [value] else 0`
  - [ ] 3.7 Implement Operating Margin formula: `[Total Income] + [Operating Expense]`
  - [ ] 3.8 Implement Profit Before Tax formula: `[Operating Margin] + [Non Operating Expense]`
  - [ ] 3.9 Implement Tax formula: `IF [Nspb L2 Name] = 'Income tax' THEN [value] else 0`
  - [ ] 3.10 Define Capital values per entity (pre-defined static values)
  - [ ] 3.11 Implement Return on Equity formula: `([Profit After Tax] / [Capital]) * 100`
  - [ ] 3.12 Write unit tests for all formula calculations
  - [ ] 3.13 Integrate formulas with CSV data processing to calculate derived metrics

- [ ] 4.0 Implement time period filtering functionality

  - [ ] 4.1 Create time period filter dropdown component with Daily, Weekly, Monthly options
  - [ ] 4.2 Set default view to current month-to-date
  - [ ] 4.3 Implement filter logic in CSV parser service to filter data by date ranges
  - [ ] 4.4 Add period comparison functionality (current vs. previous period)
  - [ ] 4.5 Update table to show comparison data when enabled
  - [ ] 4.6 Connect filter component to financial data store

- [ ] 5.0 Build drill-down navigation to profit center view

  - [ ] 5.1 Make country rows clickable with hover state indication
  - [ ] 5.2 Create dynamic route for country detail page
  - [ ] 5.3 Implement profit center breakdown table with same financial metrics
  - [ ] 5.4 Add breadcrumb navigation component for easy return to country view
  - [ ] 5.5 Pass selected country context to profit center view
  - [ ] 5.6 Maintain selected time period filter when navigating

- [ ] 6.0 Add time series analysis features
  - [ ] 6.1 Extend data models to include monthly breakdown for each metric
  - [ ] 6.2 Add toggle component for time series/trend view
  - [ ] 6.3 Calculate month-over-month (MoM) percentage changes for each metric
  - [ ] 6.4 Implement color coding logic (green for positive trends, red for negative trends)
  - [ ] 6.5 Add trend highlighting for significant monthly changes (>10%)
  - [ ] 6.6 Create sparkline charts or trend indicators for visualizing monthly trends
  - [ ] 6.7 Update table component to display monthly columns (Oct, Nov, Dec) when time series view is enabled
