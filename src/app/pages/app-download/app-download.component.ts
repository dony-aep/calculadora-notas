import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterService } from '../../services/footer.service';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideArrowLeft, LucideHistory } from '@lucide/angular';

@Component({
  selector: 'app-app-download',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe, LucideArrowLeft, LucideHistory],
  templateUrl: './app-download.component.html',
  styleUrl: './app-download.component.css'
})
export class AppDownloadComponent implements OnInit, OnDestroy {
  private readonly footerService = inject(FooterService);

  ngOnInit(): void {
    this.footerService.madeByVisible$.next(false);
  }

  ngOnDestroy(): void {
    this.footerService.madeByVisible$.next(true);
  }
}
