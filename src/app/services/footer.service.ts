import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  public readonly madeByVisible$ = new BehaviorSubject<boolean>(true);
} 