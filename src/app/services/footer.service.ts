import { Service, signal } from '@angular/core';

@Service()
export class FooterService {
  readonly madeByVisible = signal(true);
}
