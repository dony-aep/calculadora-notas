import { Routes } from '@angular/router';
import { AppDownloadComponent } from './pages/app-download/app-download.component';
import { CustomCalculatorComponent } from './pages/custom-calculator/custom-calculator.component';
import { DefaultCalculatorComponent } from './pages/default-calculator/default-calculator.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
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
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/home'
    }
];
