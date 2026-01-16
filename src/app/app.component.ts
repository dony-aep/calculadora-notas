import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutFooterComponent } from './components/layout-footer/layout-footer.component';
import { TranslationService } from './services/translation.service';
import { inject as injectVercelAnalytics } from '@vercel/analytics';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'calculadora-notas-angular';

  // Inyección de servicios usando inject()
  private readonly translationService = inject(TranslationService);

  constructor() {
    injectVercelAnalytics(); // Inyecta las analíticas de Vercel
  }
}
