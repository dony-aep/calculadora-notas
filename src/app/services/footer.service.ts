import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Service()
export class FooterService {
  public readonly madeByVisible$ = new BehaviorSubject<boolean>(true);
} 