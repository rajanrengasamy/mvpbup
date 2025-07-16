import type { RawTransaction, FinancialMetrics, Country, ProfitCenter, TimeFilter } from 'src/core/types/financial';

export class CSVParser {
  private static instance: CSVParser;
  private transactions: RawTransaction[] = [];
  
  private constructor() {}
  
  static getInstance(): CSVParser {
    if (!CSVParser.instance) {
      CSVParser.instance = new CSVParser();
    }
    return CSVParser.instance;
  }
  
  async loadCSVData(): Promise<void> {
    try {
      const response = await fetch('/data/q4_2024_financial_data_200k.csv');
      const text = await response.text();
      this.transactions = this.parseCSV(text);
    } catch (error) {
      console.error('Error loading CSV data:', error);
      throw error;
    }
  }
  
  private parseCSV(text: string): RawTransaction[] {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1)
      .filter(line => line.trim() !== '')
      .map(line => {
        const values = this.parseCSVLine(line);
        const transaction: any = {};
        
        headers.forEach((header, index) => {
          transaction[header] = values[index] || '';
        });
        
        return transaction as RawTransaction;
      });
  }
  
  private parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current);
    return values;
  }
  
  filterByDateRange(startDate: Date, endDate: Date): RawTransaction[] {
    return this.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.transaction_date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }
  
  getCountries(): string[] {
    const countries = new Set(this.transactions.map(t => t.subsidiary_country));
    return Array.from(countries).filter(c => c !== '').sort();
  }
  
  getProfitCenters(): string[] {
    const profitCenters = new Set(this.transactions.map(t => t.l1_profit_centre_name));
    return Array.from(profitCenters).filter(pc => pc !== '').sort();
  }
  
  getTransactionsByCountry(country: string): RawTransaction[] {
    return this.transactions.filter(t => t.subsidiary_country === country);
  }
  
  getTransactionsByProfitCenter(profitCenter: string): RawTransaction[] {
    return this.transactions.filter(t => t.l1_profit_centre_name === profitCenter);
  }
  
  getTransactionsByCountryAndProfitCenter(country: string, profitCenter: string): RawTransaction[] {
    return this.transactions.filter(
      t => t.subsidiary_country === country && t.l1_profit_centre_name === profitCenter
    );
  }
  
  getTransactions(): RawTransaction[] {
    return this.transactions;
  }
}