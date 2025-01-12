import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { SettingsComponent } from './pages/settings.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'settings', component: SettingsComponent },
  // Remove the contact routes as they're now handled in the split view
];
