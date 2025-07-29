import * as XLSX from 'xlsx';

interface ExportData {
  title: string;
  data: any[];
  metadata?: {
    generatedAt: string;
    generatedBy: string;
    filters?: any;
  };
}

interface ExportOptions {
  format: 'excel' | 'csv' | 'json' | 'pdf';
  filename?: string;
  includeMetadata?: boolean;
}

class ExportService {
  async exportData(exportData: ExportData, options: ExportOptions): Promise<void> {
    try {
      const filename = options.filename || `${exportData.title}_${new Date().toISOString().split('T')[0]}`;
      
      switch (options.format) {
        case 'excel':
          await this.exportToExcel(exportData, filename);
          break;
        case 'csv':
          await this.exportToCSV(exportData, filename);
          break;
        case 'json':
          await this.exportToJSON(exportData, filename);
          break;
        case 'pdf':
          await this.exportToPDF(exportData, filename);
          break;
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async exportToExcel(exportData: ExportData, filename: string): Promise<void> {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Main data sheet
      const worksheet = XLSX.utils.json_to_sheet(exportData.data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      
      // Metadata sheet if available
      if (exportData.metadata) {
        const metadataSheet = XLSX.utils.json_to_sheet([exportData.metadata]);
        XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');
      }
      
      // Style the header row
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!worksheet[cellAddress]) continue;
        
        worksheet[cellAddress].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "4ADE80" } },
          alignment: { horizontal: "center" }
        };
      }
      
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } catch (error) {
      throw new Error('Excel export failed');
    }
  }

  private async exportToCSV(exportData: ExportData, filename: string): Promise<void> {
    try {
      if (exportData.data.length === 0) {
        throw new Error('No data to export');
      }

      const headers = Object.keys(exportData.data[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      this.downloadFile(blob, `${filename}.csv`);
    } catch (error) {
      throw new Error('CSV export failed');
    }
  }

  private async exportToJSON(exportData: ExportData, filename: string): Promise<void> {
    try {
      const jsonData = {
        title: exportData.title,
        exportedAt: new Date().toISOString(),
        metadata: exportData.metadata,
        data: exportData.data,
        summary: {
          totalRecords: exportData.data.length,
          fields: exportData.data.length > 0 ? Object.keys(exportData.data[0]) : []
        }
      };
      
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { 
        type: 'application/json' 
      });
      
      this.downloadFile(blob, `${filename}.json`);
    } catch (error) {
      throw new Error('JSON export failed');
    }
  }

  private async exportToPDF(exportData: ExportData, filename: string): Promise<void> {
    try {
      // For PDF export, we'll create a simple HTML table and convert it
      const htmlContent = this.generateHTMLTable(exportData);
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup blocked - please allow popups for PDF export');
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${exportData.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #4ADE80; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4ADE80; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .metadata { margin-bottom: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
    } catch (error) {
      throw new Error('PDF export failed');
    }
  }

  private generateHTMLTable(exportData: ExportData): string {
    if (exportData.data.length === 0) {
      return `<h1>${exportData.title}</h1><p>No data available</p>`;
    }

    const headers = Object.keys(exportData.data[0]);
    const metadataHtml = exportData.metadata ? `
      <div class="metadata">
        <p><strong>Generated:</strong> ${exportData.metadata.generatedAt || new Date().toISOString()}</p>
        <p><strong>Generated by:</strong> ${exportData.metadata.generatedBy || 'Statsor'}</p>
        <p><strong>Total records:</strong> ${exportData.data.length}</p>
      </div>
    ` : '';

    const tableHtml = `
      <h1>${exportData.title}</h1>
      ${metadataHtml}
      <table>
        <thead>
          <tr>
            ${headers.map(header => `<th>${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${exportData.data.map(row => `
            <tr>
              ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    return tableHtml;
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  // Utility method to format data for export
  formatDataForExport(rawData: any[], formatOptions?: {
    dateFormat?: 'iso' | 'locale';
    numberFormat?: 'raw' | 'formatted';
    booleanFormat?: 'true/false' | 'yes/no' | '1/0';
  }): any[] {
    const options = {
      dateFormat: 'locale',
      numberFormat: 'formatted',
      booleanFormat: 'yes/no',
      ...formatOptions
    };

    return rawData.map(item => {
      const formatted: any = {};
      
      Object.entries(item).forEach(([key, value]) => {
        if (value instanceof Date) {
          formatted[key] = options.dateFormat === 'iso' 
            ? value.toISOString() 
            : value.toLocaleDateString();
        } else if (typeof value === 'number') {
          formatted[key] = options.numberFormat === 'formatted' 
            ? value.toLocaleString() 
            : value;
        } else if (typeof value === 'boolean') {
          switch (options.booleanFormat) {
            case 'yes/no':
              formatted[key] = value ? 'Yes' : 'No';
              break;
            case '1/0':
              formatted[key] = value ? 1 : 0;
              break;
            default:
              formatted[key] = value ? 'true' : 'false';
          }
        } else {
          formatted[key] = value;
        }
      });
      
      return formatted;
    });
  }

  // Method to validate export data
  validateExportData(data: any[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!Array.isArray(data)) {
      errors.push('Data must be an array');
      return { valid: false, errors };
    }

    if (data.length === 0) {
      errors.push('No data to export');
      return { valid: false, errors };
    }

    // Check for consistent structure
    const firstItemKeys = Object.keys(data[0]);
    const inconsistentItems = data.filter(item => {
      const itemKeys = Object.keys(item);
      return itemKeys.length !== firstItemKeys.length || 
             !firstItemKeys.every(key => itemKeys.includes(key));
    });

    if (inconsistentItems.length > 0) {
      errors.push(`${inconsistentItems.length} items have inconsistent structure`);
    }

    return { valid: errors.length === 0, errors };
  }
}

export const exportService = new ExportService();
export type { ExportData, ExportOptions };