import * as XLSX from 'xlsx';

interface ExportData {
  title: string;
  data: any[];
  metadata?: {
    generatedAt: string;
    generatedBy: string;
    filters?: any;
    sport?: string;
  };
}

interface ExportOptions {
  format: 'excel' | 'csv' | 'json' | 'pdf';
  filename?: string;
  includeMetadata?: boolean;
  includeCharts?: boolean;
}

class AnalyticsExportService {
  async exportAnalytics(exportData: ExportData, options: ExportOptions): Promise<void> {
    try {
      const filename = options.filename || `${exportData.title}_${new Date().toISOString().split('T')[0]}`;
      
      switch (options.format) {
        case 'excel':
          await this.exportToExcel(exportData, filename, options);
          break;
        case 'csv':
          await this.exportToCSV(exportData, filename);
          break;
        case 'json':
          await this.exportToJSON(exportData, filename);
          break;
        case 'pdf':
          await this.exportToPDF(exportData, filename, options);
          break;
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async exportToExcel(exportData: ExportData, filename: string, options: ExportOptions): Promise<void> {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Main data sheet
      if (exportData.data.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(exportData.data);
        
        // Style the header row
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
          if (!worksheet[cellAddress]) continue;
          
          worksheet[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4ADE80" } },
            alignment: { horizontal: "center" }
          };
        }
        
        // Auto-size columns
        const colWidths = [];
        for (let col = range.s.c; col <= range.e.c; col++) {
          let maxWidth = 10;
          for (let row = range.s.r; row <= range.e.r; row++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const cell = worksheet[cellAddress];
            if (cell && cell.v) {
              const cellLength = cell.v.toString().length;
              maxWidth = Math.max(maxWidth, cellLength);
            }
          }
          colWidths.push({ wch: Math.min(maxWidth + 2, 50) });
        }
        worksheet['!cols'] = colWidths;
        
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Analytics Data');
      }
      
      // Metadata sheet if available
      if (exportData.metadata && options.includeMetadata) {
        const metadataArray = Object.entries(exportData.metadata).map(([key, value]) => ({
          Property: key,
          Value: typeof value === 'object' ? JSON.stringify(value) : value
        }));
        const metadataSheet = XLSX.utils.json_to_sheet(metadataArray);
        XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');
      }
      
      // Summary sheet
      if (exportData.data.length > 0) {
        const summary = this.generateSummaryData(exportData.data);
        const summarySheet = XLSX.utils.json_to_sheet(summary);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
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
            return value ?? '';
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
        summary: exportData.data.length > 0 ? this.generateSummaryData(exportData.data) : [],
        data: exportData.data,
        analytics: {
          totalRecords: exportData.data.length,
          fields: exportData.data.length > 0 ? Object.keys(exportData.data[0]) : [],
          dataTypes: exportData.data.length > 0 ? this.analyzeDataTypes(exportData.data[0]) : {}
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

  private async exportToPDF(exportData: ExportData, filename: string, options: ExportOptions): Promise<void> {
    try {
      const htmlContent = this.generatePDFContent(exportData, options);
      
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
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 20px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 3px solid #4ADE80;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #1f2937;
              margin: 0;
              font-size: 28px;
            }
            .metadata { 
              background: #f8f9fa; 
              padding: 15px; 
              border-radius: 8px; 
              margin-bottom: 20px;
              border-left: 4px solid #4ADE80;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0;
              font-size: 12px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
            }
            th { 
              background-color: #4ADE80; 
              color: white; 
              font-weight: bold;
              text-align: center;
            }
            tr:nth-child(even) { 
              background-color: #f8f9fa; 
            }
            .summary {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin: 20px 0;
            }
            .summary-card {
              background: #f1f5f9;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              border: 1px solid #e2e8f0;
            }
            .summary-card h3 {
              margin: 0 0 10px 0;
              color: #4ADE80;
              font-size: 16px;
            }
            .summary-card .value {
              font-size: 24px;
              font-weight: bold;
              color: #1f2937;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
              table { font-size: 10px; }
            }
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
      }, 1000);
      
    } catch (error) {
      throw new Error('PDF export failed');
    }
  }

  private generatePDFContent(exportData: ExportData, options: ExportOptions): string {
    const summary = exportData.data.length > 0 ? this.generateSummaryData(exportData.data) : [];
    
    return `
      <div class="header">
        <h1>${exportData.title}</h1>
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        ${exportData.metadata?.sport ? `<p>Sport: ${exportData.metadata.sport}</p>` : ''}
      </div>
      
      ${exportData.metadata && options.includeMetadata ? `
        <div class="metadata">
          <h3>Export Information</h3>
          <p><strong>Generated by:</strong> ${exportData.metadata.generatedBy || 'Statsor Analytics'}</p>
          <p><strong>Total records:</strong> ${exportData.data.length}</p>
          ${exportData.metadata.filters ? `<p><strong>Filters applied:</strong> ${JSON.stringify(exportData.metadata.filters)}</p>` : ''}
        </div>
      ` : ''}

      ${summary.length > 0 ? `
        <h3>Summary Statistics</h3>
        <div class="summary">
          ${summary.map(item => `
            <div class="summary-card">
              <h3>${item.Metric}</h3>
              <div class="value">${item.Value}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${exportData.data.length > 0 ? `
        <h3>Detailed Data</h3>
        <table>
          <thead>
            <tr>
              ${Object.keys(exportData.data[0]).map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${exportData.data.map(row => `
              <tr>
                ${Object.values(row).map(value => `<td>${value || ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<p>No data available for export.</p>'}
    `;
  }

  private generateSummaryData(data: any[]): any[] {
    if (data.length === 0) return [];

    const summary = [];
    const firstItem = data[0];
    
    // Basic statistics
    summary.push({ Metric: 'Total Records', Value: data.length });
    
    // Analyze numeric fields
    Object.keys(firstItem).forEach(key => {
      const values = data.map(item => item[key]).filter(val => typeof val === 'number' && !isNaN(val));
      
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);
        
        summary.push(
          { Metric: `${key} - Average`, Value: avg.toFixed(2) },
          { Metric: `${key} - Maximum`, Value: max },
          { Metric: `${key} - Minimum`, Value: min },
          { Metric: `${key} - Total`, Value: sum.toFixed(2) }
        );
      }
    });

    return summary;
  }

  private analyzeDataTypes(sampleRow: any): Record<string, string> {
    const types: Record<string, string> = {};
    
    Object.entries(sampleRow).forEach(([key, value]) => {
      if (typeof value === 'number') {
        types[key] = 'number';
      } else if (typeof value === 'boolean') {
        types[key] = 'boolean';
      } else if (value instanceof Date) {
        types[key] = 'date';
      } else if (typeof value === 'string') {
        // Check if it's a date string
        if (!isNaN(Date.parse(value))) {
          types[key] = 'date_string';
        } else {
          types[key] = 'string';
        }
      } else {
        types[key] = 'object';
      }
    });

    return types;
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

  // Export player statistics
  async exportPlayerStats(players: any[], options: Partial<ExportOptions> = {}): Promise<void> {
    const exportData: ExportData = {
      title: 'Player Statistics Report',
      data: players.map(player => ({
        Name: player.name,
        Position: player.position,
        Number: player.number,
        Goals: player.goals || 0,
        Assists: player.assists || 0,
        'Games Played': player.games || 0,
        'Minutes Played': player.minutes || 0,
        'Yellow Cards': player.yellowCards || 0,
        'Red Cards': player.redCards || 0,
        'Pass Accuracy': player.passAccuracy ? `${player.passAccuracy}%` : '0%'
      })),
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedBy: 'Statsor Analytics',
        sport: 'football'
      }
    };

    await this.exportAnalytics(exportData, {
      format: 'excel',
      includeMetadata: true,
      ...options
    });
  }

  // Export match statistics
  async exportMatchStats(matches: any[], options: Partial<ExportOptions> = {}): Promise<void> {
    const exportData: ExportData = {
      title: 'Match Statistics Report',
      data: matches.map(match => ({
        Date: new Date(match.date).toLocaleDateString(),
        'Home Team': match.homeTeam,
        'Away Team': match.awayTeam,
        'Home Score': match.homeScore,
        'Away Score': match.awayScore,
        Venue: match.venue,
        Status: match.status
      })),
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedBy: 'Statsor Analytics',
        sport: 'football'
      }
    };

    await this.exportAnalytics(exportData, {
      format: 'excel',
      includeMetadata: true,
      ...options
    });
  }

  // Export team analytics
  async exportTeamAnalytics(teamData: any, options: Partial<ExportOptions> = {}): Promise<void> {
    const exportData: ExportData = {
      title: 'Team Analytics Report',
      data: [
        { Metric: 'Total Matches', Value: teamData.totalMatches || 0 },
        { Metric: 'Wins', Value: teamData.wins || 0 },
        { Metric: 'Draws', Value: teamData.draws || 0 },
        { Metric: 'Losses', Value: teamData.losses || 0 },
        { Metric: 'Goals For', Value: teamData.goalsFor || 0 },
        { Metric: 'Goals Against', Value: teamData.goalsAgainst || 0 },
        { Metric: 'Win Percentage', Value: `${teamData.winPercentage || 0}%` }
      ],
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedBy: 'Statsor Analytics',
        sport: 'football'
      }
    };

    await this.exportAnalytics(exportData, {
      format: 'pdf',
      includeMetadata: true,
      ...options
    });
  }
}

export const analyticsExportService = new AnalyticsExportService();
export type { ExportData, ExportOptions };