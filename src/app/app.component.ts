import { Component, inject as angularInject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutFooterComponent } from './components/layout-footer/layout-footer.component';
import { TranslationService } from './services/translation.service';
import { inject as injectVercelAnalytics } from '@vercel/analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'calculadora-notas-angular';

  constructor() {
    angularInject(TranslationService); // Activa el servicio de traducción
    injectVercelAnalytics(); // Inyecta las analíticas de Vercel
  }
}
