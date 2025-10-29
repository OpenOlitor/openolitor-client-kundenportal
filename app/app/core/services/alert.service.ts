import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$ = this.alertsSubject.asObservable();
  private alertIdCounter = 0;

  addAlert(type: Alert['type'], message: string): void {
    const alert: Alert = {
      id: `alert-${++this.alertIdCounter}`,
      type,
      message
    };
    
    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next([...currentAlerts, alert]);

    // Auto-remove after 5 seconds
    setTimeout(() => this.removeAlert(alert.id), 5000);
  }

  removeAlert(id: string): void {
    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next(currentAlerts.filter(alert => alert.id !== id));
  }

  removeAllAlerts(): void {
    this.alertsSubject.next([]);
  }
}
