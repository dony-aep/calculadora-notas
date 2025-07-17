import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterService } from '../../services/footer.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-app-download',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './app-download.component.html',
  styleUrl: './app-download.component.css'
})
export class AppDownloadComponent implements OnInit, OnDestroy {

  constructor(private footerService: FooterService) {}

  ngOnInit(): void {
    this.footerService.madeByVisible$.next(false);
  }

  ngOnDestroy(): void {
    this.footerService.madeByVisible$.next(true);
  }
}
