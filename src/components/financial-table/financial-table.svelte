<script lang="ts">
	import type { Country, ProfitCenter } from 'src/core/types/financial';
	import { formatCurrency, formatPercentage } from 'src/core/utils/financial-calculations';
	import { cn } from 'src/core/utils';

	export let data: (Country | ProfitCenter)[] = [];
	export let grandTotal: Country | ProfitCenter | null = null;
	export let onRowClick: ((item: Country | ProfitCenter) => void) | undefined = undefined;
	export let showCountryColumn = true;

	function getCellClass(value: number, isPercentage = false): string {
		if (isPercentage) {
			return value >= 0 ? 'text-green-600' : 'text-red-600';
		}
		return '';
	}

	function isCountry(item: Country | ProfitCenter): item is Country {
		return 'code' in item;
	}
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
	<div class="overflow-x-auto">
		<table class="w-full table-fixed">
			<colgroup>
				<col class="w-32" />
				<col class="w-32" />
				<col class="w-28" />
				<col class="w-28" />
				<col class="w-32" />
				<col class="w-28" />
				<col class="w-36" />
				<col class="w-32" />
				<col class="w-24" />
				<col class="w-32" />
				<col class="w-28" />
				<col class="w-28" />
			</colgroup>
			<thead class="sticky top-0 z-10">
				<tr class="bg-gray-50 border-b border-gray-200">
					<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						{showCountryColumn ? 'Country' : 'Profit Center'}
					</th>
					<th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Net Trading Income
					</th>
					<th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Other Income
					</th>
					<th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Total Income
					</th>
					<th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Operating Expense
					</th>
					<th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Op. Margin
					</th>
					<th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Non Op. Expense
					</th>
					<th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Profit Before Tax
					</th>
					<th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Tax
					</th>
					<th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Profit After Tax
					</th>
					<th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Capital
					</th>
					<th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						ROE
					</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#each data as item, index}
					<tr 
						class={cn(
							"transition-colors",
							index % 2 === 0 ? "bg-white" : "bg-gray-50",
							onRowClick ? "hover:bg-blue-50 cursor-pointer" : ""
						)}
						on:click={() => onRowClick?.(item)}
					>
						<td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
							{item.name}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums">
							{formatCurrency(item.metrics.netTradingIncome)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums">
							{formatCurrency(item.metrics.otherIncome)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums font-medium">
							{formatCurrency(item.metrics.totalIncome)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums">
							{formatCurrency(item.metrics.operatingExpense)}
						</td>
						<td class={cn(
							"px-4 py-3 whitespace-nowrap text-sm text-right tabular-nums font-medium",
							getCellClass(item.metrics.operatingMargin, true)
						)}>
							{formatPercentage(item.metrics.operatingMargin)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums">
							{formatCurrency(item.metrics.nonOperatingExpense)}
						</td>
						<td class={cn(
							"px-4 py-3 whitespace-nowrap text-sm text-right tabular-nums",
							getCellClass(item.metrics.profitBeforeTax)
						)}>
							{formatCurrency(item.metrics.profitBeforeTax)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums">
							{formatCurrency(item.metrics.tax)}
						</td>
						<td class={cn(
							"px-4 py-3 whitespace-nowrap text-sm text-right tabular-nums font-medium",
							getCellClass(item.metrics.profitAfterTax)
						)}>
							{formatCurrency(item.metrics.profitAfterTax)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums">
							{formatCurrency(item.metrics.capital)}
						</td>
						<td class={cn(
							"px-4 py-3 whitespace-nowrap text-sm text-right tabular-nums font-medium",
							getCellClass(item.metrics.returnOnEquity, true)
						)}>
							{formatPercentage(item.metrics.returnOnEquity)}
						</td>
					</tr>
				{/each}
				
				{#if grandTotal}
					<tr class="bg-gray-100 font-bold border-t-2 border-gray-300">
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
							Grand Total
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums">
							{formatCurrency(grandTotal.metrics.netTradingIncome)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums">
							{formatCurrency(grandTotal.metrics.otherIncome)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums">
							{formatCurrency(grandTotal.metrics.totalIncome)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums">
							{formatCurrency(grandTotal.metrics.operatingExpense)}
						</td>
						<td class={cn(
							"px-4 py-3 whitespace-nowrap text-sm text-right tabular-nums",
							getCellClass(grandTotal.metrics.operatingMargin, true)
						)}>
							{formatPercentage(grandTotal.metrics.operatingMargin)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums">
							{formatCurrency(grandTotal.metrics.nonOperatingExpense)}
						</td>
						<td class={cn(
							"px-4 py-3 whitespace-nowrap text-sm text-right tabular-nums",
							getCellClass(grandTotal.metrics.profitBeforeTax)
						)}>
							{formatCurrency(grandTotal.metrics.profitBeforeTax)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums">
							{formatCurrency(grandTotal.metrics.tax)}
						</td>
						<td class={cn(
							"px-4 py-3 whitespace-nowrap text-sm text-right tabular-nums",
							getCellClass(grandTotal.metrics.profitAfterTax)
						)}>
							{formatCurrency(grandTotal.metrics.profitAfterTax)}
						</td>
						<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right tabular-nums">
							{formatCurrency(grandTotal.metrics.capital)}
						</td>
						<td class={cn(
							"px-4 py-3 whitespace-nowrap text-sm text-right tabular-nums",
							getCellClass(grandTotal.metrics.returnOnEquity, true)
						)}>
							{formatPercentage(grandTotal.metrics.returnOnEquity)}
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>