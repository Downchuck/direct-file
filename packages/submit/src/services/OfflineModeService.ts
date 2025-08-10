export class OfflineModeService {
  private shouldStayOffline: boolean;
  private offlineModeEnabled: boolean = false;

  constructor() {
    // TODO: Read this from a config file or environment variable
    this.shouldStayOffline = false;
  }

  public isOfflineModeEnabled(): boolean {
    return this.offlineModeEnabled;
  }

  public disableOfflineMode(): void {
    this.offlineModeEnabled = false;
  }

  public enableOfflineMode(): void {
    if (!this.isOfflineModeEnabled()) {
      this.offlineModeEnabled = true;
    }
  }

  public getShouldStayOffline(): boolean {
    return this.shouldStayOffline;
  }
}
