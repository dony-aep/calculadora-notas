import { Routes } from '@angular/router';
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
        loadComponent: () => import('./pages/default-calculator/default-calculator.component').then(m => m.DefaultCalculatorComponent)
    },
    {
        path: 'custom-calculator',
        loadComponent: () => import('./pages/custom-calculator/custom-calculator.component').then(m => m.CustomCalculatorComponent)
    },
    {
        path: 'app-download',
        loadComponent: () => import('./pages/app-download/app-download.component').then(m => m.AppDownloadComponent)
    },
    {
        path: '**',
        redirectTo: '/'
    }
];
