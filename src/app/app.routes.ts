import { Routes } from '@angular/router';
import { AppDownloadComponent } from './pages/app-download/app-download.component';
import { CustomCalculatorComponent } from './pages/custom-calculator/custom-calculator.component';
import { DefaultCalculatorComponent } from './pages/default-calculator/default-calculator.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
    },
    {
        path: 'home',
        redirectTo: '/',
        pathMatch: 'full'
    },
    {
        path: 'default-calculator',
        component: DefaultCalculatorComponent
    },
    {
        path: 'custom-calculator',
        component: CustomCalculatorComponent
    },
    {
        path: 'app-download',
        component: AppDownloadComponent
    },
    {
        path: '**',
        redirectTo: '/'
    }
];
