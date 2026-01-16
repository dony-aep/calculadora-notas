import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterService } from '../../services/footer.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-app-download',
  imports: [RouterLink, TranslateModule],
  templateUrl: './app-download.component.html',
  styleUrl: './app-download.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
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
