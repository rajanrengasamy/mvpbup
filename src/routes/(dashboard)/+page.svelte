<script lang="ts">
	import { onMount } from 'svelte';
	import { financialStore } from 'src/core/stores/financial.svelte';
	import { csvParser } from 'src/core/services/csv-parser';
	import { aggregateByCountry, calculateGrandTotal } from 'src/core/utils/financial-calculations';
	import { FinancialTable } from 'src/components/financial-table';
	import type { Country } from 'src/core/types/financial';
	import { goto } from '$app/navigation';

	let countries: Country[] = [];
	let grandTotal: Country | null = null;
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			loading = true;
			await csvParser.loadCSV('/data/q4_2024_financial_data_200k.csv');
			
			const allTransactions = csvParser.getFilteredTransactions(
				financialStore.timeFilter.startDate,
				financialStore.timeFilter.endDate
			);
			
			countries = aggregateByCountry(allTransactions);
			grandTotal = calculateGrandTotal(countries);
			
			financialStore.countries = countries;
			financialStore.loading = false;
			financialStore.error = null;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load financial data';
			financialStore.error = error;
		} finally {
			loading = false;
			financialStore.loading = false;
		}
	});

	function handleCountryClick(country: Country) {
		financialStore.selectedCountry = country.code;
		goto(`/dashboard/${country.code.toLowerCase()}`);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-[#003366] text-white px-6 py-4 shadow-lg">
		<h1 class="text-2xl font-bold">Optiver Financial Performance Dashboard</h1>
		<p class="text-sm mt-1 opacity-90">Global Country Overview</p>
	</header>

	<!-- Main Content -->
	<main class="container mx-auto px-6 py-8">
		{#if loading}
			<div class="flex items-center justify-center h-64">
				<div class="text-gray-600">Loading financial data...</div>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
				Error: {error}
			</div>
		{:else}
			<FinancialTable 
				data={countries} 
				{grandTotal}
				onRowClick={handleCountryClick}
			/>
		{/if}
	</main>
</div>