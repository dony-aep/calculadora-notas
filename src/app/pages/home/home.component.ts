import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideCalculator, LucideSlidersHorizontal } from '@lucide/angular';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslatePipe, LucideCalculator, LucideSlidersHorizontal],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {} 