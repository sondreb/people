import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { ContactComponent } from './pages/contact.component';
import { SettingsComponent } from './pages/settings.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'contact/:id', component: ContactComponent },
  { path: 'settings', component: SettingsComponent },
];
