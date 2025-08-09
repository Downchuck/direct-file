export interface ExportResponse {
  status: 'success' | 'error';
  taxReturn?: string;
  error?: string;
}
