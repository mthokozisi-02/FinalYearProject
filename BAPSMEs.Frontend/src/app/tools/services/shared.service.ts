import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private refreshTrigger = new BehaviorSubject<void>(null);

  triggerRefresh() {
    this.refreshTrigger.next();
  }

  getRefreshObservable() {
    return this.refreshTrigger.asObservable();
  }
}
