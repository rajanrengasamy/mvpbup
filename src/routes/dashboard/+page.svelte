<script lang="ts">
  import { onMount } from 'svelte';
  import { financialStore } from 'src/core/stores/financial.svelte';
  import { csvParser } from 'src/core/services/csv-parser';
  import { aggregateByCountry, calculateGrandTotal } from 'src/core/utils/financial-calculations';
  import { FinancialTable, FinancialTableTransposed } from 'src/components/financial-table';
  import type { Country, ProfitCenter } from 'src/core/types/financial';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let countries: Country[] = [];
  let grandTotal: Country | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      loading = true;
      await csvParser.loadCSVData();

      const state = get(financialStore);
      const allTransactions = csvParser.filterByDateRange(
        state.timeFilter.startDate,
        state.timeFilter.endDate,
      );

      countries = aggregateByCountry(allTransactions);
      grandTotal = calculateGrandTotal(countries);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load financial data';
    } finally {
      loading = false;
    }
  });

  function handleCountryClick(item: Country | ProfitCenter) {
    // Type guard to ensure it's a Country
    if ('code' in item) {
      financialStore.selectCountry(item.code);
      goto(`/dashboard/${item.code.toLowerCase()}`);
    }
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-[#003366] px-6 py-4 text-white shadow-lg">
    <h1 class="text-2xl font-bold">Optiver Financial Performance Dashboard</h1>
    <p class="mt-1 text-sm opacity-90">Global Country Overview</p>
  </header>

  <!-- Main Content -->
  <main class="container mx-auto px-6 py-8">
    {#if loading}
      <div class="flex h-64 items-center justify-center">
        <div class="text-gray-600">Loading financial data...</div>
      </div>
    {:else if error}
      <div class="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        Error: {error}
      </div>
    {:else}
      <FinancialTableTransposed data={countries} {grandTotal} onCountryClick={handleCountryClick} />
    {/if}
  </main>
</div>
