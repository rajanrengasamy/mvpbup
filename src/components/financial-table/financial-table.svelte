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
</script>

<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
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
        <tr class="border-b border-gray-200 bg-gray-50">
          <th
            class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            {showCountryColumn ? 'Country' : 'Profit Center'}
          </th>
          <th
            class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Net Trading Income
          </th>
          <th
            class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Other Income
          </th>
          <th
            class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Total Income
          </th>
          <th
            class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Operating Expense
          </th>
          <th
            class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Op. Margin
          </th>
          <th
            class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Non Op. Expense
          </th>
          <th
            class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Profit Before Tax
          </th>
          <th
            class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Tax
          </th>
          <th
            class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Profit After Tax
          </th>
          <th
            class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            Capital
          </th>
          <th
            class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
          >
            ROE
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        {#each data as item, index}
          <tr
            class={cn(
              'transition-colors',
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
              onRowClick ? 'cursor-pointer hover:bg-blue-50' : '',
            )}
            on:click={() => onRowClick?.(item)}
          >
            <td class="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
              {item.name}
            </td>
            <td class="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900 tabular-nums">
              {formatCurrency(item.metrics.netTradingIncome)}
            </td>
            <td class="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900 tabular-nums">
              {formatCurrency(item.metrics.otherIncome)}
            </td>
            <td
              class="px-4 py-3 text-right text-sm font-medium whitespace-nowrap text-gray-900 tabular-nums"
            >
              {formatCurrency(item.metrics.totalIncome)}
            </td>
            <td class="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900 tabular-nums">
              {formatCurrency(item.metrics.operatingExpense)}
            </td>
            <td
              class={cn(
                'px-4 py-3 text-right text-sm font-medium whitespace-nowrap tabular-nums',
                getCellClass(item.metrics.operatingMargin, true),
              )}
            >
              {formatPercentage(item.metrics.operatingMargin)}
            </td>
            <td class="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900 tabular-nums">
              {formatCurrency(item.metrics.nonOperatingExpense)}
            </td>
            <td
              class={cn(
                'px-4 py-3 text-right text-sm whitespace-nowrap tabular-nums',
                getCellClass(item.metrics.profitBeforeTax),
              )}
            >
              {formatCurrency(item.metrics.profitBeforeTax)}
            </td>
            <td class="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900 tabular-nums">
              {formatCurrency(item.metrics.tax)}
            </td>
            <td
              class={cn(
                'px-4 py-3 text-right text-sm font-medium whitespace-nowrap tabular-nums',
                getCellClass(item.metrics.profitAfterTax),
              )}
            >
              {formatCurrency(item.metrics.profitAfterTax)}
            </td>
            <td class="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900 tabular-nums">
              {formatCurrency(item.metrics.capital)}
            </td>
            <td
              class={cn(
                'px-4 py-3 text-right text-sm font-medium whitespace-nowrap tabular-nums',
                getCellClass(item.metrics.returnOnEquity, true),
              )}
            >
              {formatPercentage(item.metrics.returnOnEquity)}
            </td>
          </tr>
        {/each}

        {#if grandTotal}
          <tr class="border-t-2 border-gray-300 bg-gray-100 font-bold">
            <td class="px-4 py-3 text-sm whitespace-nowrap text-gray-900"> Grand Total </td>
            <td class="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900 tabular-nums">
              {formatCurrency(grandTotal.metrics.netTradingIncome)}
            </td>
            <td class="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900 tabular-nums">
              {formatCurrency(grandTotal.metrics.otherIncome)}
            </td>
            <td class="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900 tabular-nums">
              {formatCurrency(grandTotal.metrics.totalIncome)}
            </td>
            <td class="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900 tabular-nums">
              {formatCurrency(grandTotal.metrics.operatingExpense)}
            </td>
            <td
              class={cn(
                'px-4 py-3 text-right text-sm whitespace-nowrap tabular-nums',
                getCellClass(grandTotal.metrics.operatingMargin, true),
              )}
            >
              {formatPercentage(grandTotal.metrics.operatingMargin)}
            </td>
            <td class="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900 tabular-nums">
              {formatCurrency(grandTotal.metrics.nonOperatingExpense)}
            </td>
            <td
              class={cn(
                'px-4 py-3 text-right text-sm whitespace-nowrap tabular-nums',
                getCellClass(grandTotal.metrics.profitBeforeTax),
              )}
            >
              {formatCurrency(grandTotal.metrics.profitBeforeTax)}
            </td>
            <td class="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900 tabular-nums">
              {formatCurrency(grandTotal.metrics.tax)}
            </td>
            <td
              class={cn(
                'px-4 py-3 text-right text-sm whitespace-nowrap tabular-nums',
                getCellClass(grandTotal.metrics.profitAfterTax),
              )}
            >
              {formatCurrency(grandTotal.metrics.profitAfterTax)}
            </td>
            <td class="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900 tabular-nums">
              {formatCurrency(grandTotal.metrics.capital)}
            </td>
            <td
              class={cn(
                'px-4 py-3 text-right text-sm whitespace-nowrap tabular-nums',
                getCellClass(grandTotal.metrics.returnOnEquity, true),
              )}
            >
              {formatPercentage(grandTotal.metrics.returnOnEquity)}
            </td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
</div>
