import { writable, derived } from 'svelte/store';
import type {
  Country,
  ProfitCenter,
  TimeFilter,
  TimePeriod,
  TimeSeriesData,
} from 'src/core/types/financial';
import { CSVParser } from 'src/core/services/csv-parser';
import {
  aggregateByCountry,
  aggregateByProfitCenter,
  aggregateByMonth,
} from 'src/core/utils/financial-calculations';

interface FinancialState {
  countries: Country[];
  profitCenters: ProfitCenter[];
  selectedCountry: string | null;
  timeFilter: TimeFilter;
  isLoading: boolean;
  error: string | null;
  showTimeSeries: boolean;
}

function createFinancialStore() {
  const initialState: FinancialState = {
    countries: [],
    profitCenters: [],
    selectedCountry: null,
    timeFilter: {
      period: 'monthly',
      startDate: new Date(2024, 9, 1), // October 2024
      endDate: new Date(2024, 11, 31), // December 2024
      compareWithPrevious: false,
    },
    isLoading: false,
    error: null,
    showTimeSeries: false,
  };

  const { subscribe, set, update } = writable<FinancialState>(initialState);

  const csvParser = CSVParser.getInstance();

  async function loadData() {
    update((state) => ({ ...state, isLoading: true, error: null }));

    try {
      await csvParser.loadCSVData();
      refreshData();
    } catch (error) {
      update((state) => ({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
      }));
    }
  }

  function refreshData() {
    const transactions = csvParser.filterByDateRange(
      get(financialStore).timeFilter.startDate,
      get(financialStore).timeFilter.endDate,
    );

    const countries = aggregateByCountry(transactions);
    const profitCenters = aggregateByProfitCenter(transactions);

    update((state) => ({
      ...state,
      countries,
      profitCenters,
      isLoading: false,
    }));
  }

  function setTimeFilter(filter: Partial<TimeFilter>) {
    update((state) => {
      const newFilter = { ...state.timeFilter, ...filter };

      // Auto-calculate date ranges based on period
      if (filter.period) {
        const now = new Date();
        const endDate = new Date(2024, 11, 31); // End of December 2024
        let startDate: Date;

        switch (filter.period) {
          case 'daily':
            startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 1);
            break;
          case 'weekly':
            startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 7);
            break;
          case 'monthly':
          default:
            startDate = new Date(endDate);
            startDate.setMonth(endDate.getMonth());
            startDate.setDate(1);
            break;
        }

        newFilter.startDate = startDate;
        newFilter.endDate = endDate;
      }

      return { ...state, timeFilter: newFilter };
    });

    refreshData();
  }

  function selectCountry(countryCode: string | null) {
    update((state) => ({ ...state, selectedCountry: countryCode }));
  }

  function toggleTimeSeries() {
    update((state) => ({ ...state, showTimeSeries: !state.showTimeSeries }));
  }

  function get(store: typeof financialStore): FinancialState {
    let value: FinancialState;
    store.subscribe((v: FinancialState) => (value = v))();
    return value!;
  }

  return {
    subscribe,
    loadData,
    setTimeFilter,
    selectCountry,
    toggleTimeSeries,
    refreshData,
  };
}

export const financialStore = createFinancialStore();

// Derived stores
export const filteredProfitCenters = derived(financialStore, ($financialStore) => {
  if (!$financialStore.selectedCountry) {
    return $financialStore.profitCenters;
  }
  return $financialStore.profitCenters.filter(
    (pc) => pc.country === $financialStore.selectedCountry,
  );
});

export const countryTimeSeries = derived(financialStore, ($financialStore) => {
  const csvParser = CSVParser.getInstance();
  const result = new Map<string, TimeSeriesData[]>();

  if ($financialStore.showTimeSeries) {
    $financialStore.countries.forEach((country) => {
      const transactions = csvParser.getTransactionsByCountry(country.code);
      const timeSeries = aggregateByMonth(transactions);
      result.set(country.code, timeSeries);
    });
  }

  return result;
});

export const profitCenterTimeSeries = derived(
  [financialStore, filteredProfitCenters],
  ([$financialStore, $filteredProfitCenters]) => {
    const csvParser = CSVParser.getInstance();
    const result = new Map<string, TimeSeriesData[]>();

    if ($financialStore.showTimeSeries && $financialStore.selectedCountry) {
      $filteredProfitCenters.forEach((pc) => {
        const transactions = csvParser.getTransactionsByCountryAndProfitCenter(
          $financialStore.selectedCountry!,
          pc.name,
        );
        const timeSeries = aggregateByMonth(transactions);
        result.set(pc.id, timeSeries);
      });
    }

    return result;
  },
);
