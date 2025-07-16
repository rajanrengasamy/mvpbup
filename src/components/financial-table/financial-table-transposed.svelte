<script lang="ts">
  import type { Country, ProfitCenter } from 'src/core/types/financial';
  import { formatCurrency, formatPercentage } from 'src/core/utils/financial-calculations';
  import { cn } from 'src/core/utils';

  export let data: (Country | ProfitCenter)[] = [];
  export let grandTotal: Country | ProfitCenter | null = null;
  export let onCountryClick: ((item: Country | ProfitCenter) => void) | undefined = undefined;

  const metrics = [
    { key: 'netTradingIncome', label: 'Net Trading Income', isPercentage: false },
    { key: 'otherIncome', label: 'Other Income', isPercentage: false },
    { key: 'totalIncome', label: 'Total Income', isPercentage: false, highlight: true },
    { key: 'operatingExpense', label: 'Operating Expense', isPercentage: false },
    { key: 'operatingMargin', label: 'Operating Margin', isPercentage: true },
    { key: 'nonOperatingExpense', label: 'Non Operating Expense', isPercentage: false },
    { key: 'profitBeforeTax', label: 'Profit Before Tax', isPercentage: false },
    { key: 'tax', label: 'Tax', isPercentage: false },
    { key: 'profitAfterTax', label: 'Profit After Tax', isPercentage: false, highlight: true },
    { key: 'capital', label: 'Capital', isPercentage: false },
    { key: 'returnOnEquity', label: 'Return on Equity', isPercentage: true },
  ];

  function getCellClass(value: number, isPercentage = false): string {
    if (isPercentage) {
      return value >= 0 ? 'text-green-600' : 'text-red-600';
    }
    return value < 0 ? 'text-red-600' : '';
  }

  function getValue(item: Country | ProfitCenter, metricKey: string): number {
    return item.metrics[metricKey as keyof typeof item.metrics];
  }
</script>

<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead class="sticky top-0 z-10">
        <tr class="border-b border-gray-200 bg-gray-50">
          <th class="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
            Metric
          </th>
          {#each data as item}
            <th 
              class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase whitespace-nowrap"
              class:cursor-pointer={onCountryClick}
              class:hover:bg-gray-100={onCountryClick}
              on:click={() => onCountryClick?.(item)}
            >
              {item.name}
            </th>
          {/each}
          {#if grandTotal}
            <th class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase whitespace-nowrap">
              Grand Total
            </th>
          {/if}
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        {#each metrics as metric, index}
          <tr class={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td class={cn(
              "sticky left-0 z-10 px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900",
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
              metric.highlight ? 'font-bold' : ''
            )}>
              {metric.label}
            </td>
            {#each data as item}
              <td class={cn(
                "px-4 py-3 text-right text-sm whitespace-nowrap tabular-nums",
                getCellClass(getValue(item, metric.key), metric.isPercentage),
                metric.highlight ? 'font-bold' : ''
              )}>
                {#if metric.isPercentage}
                  {formatPercentage(getValue(item, metric.key))}
                {:else}
                  {formatCurrency(getValue(item, metric.key))}
                {/if}
              </td>
            {/each}
            {#if grandTotal}
              <td class={cn(
                "px-4 py-3 text-right text-sm whitespace-nowrap tabular-nums font-bold",
                getCellClass(getValue(grandTotal, metric.key), metric.isPercentage)
              )}>
                {#if metric.isPercentage}
                  {formatPercentage(getValue(grandTotal, metric.key))}
                {:else}
                  {formatCurrency(getValue(grandTotal, metric.key))}
                {/if}
              </td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  /* Ensure sticky positioning works properly */
  .sticky {
    position: sticky;
  }
</style>