import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';

export const routes: Routes = [
    { path: '', redirectTo: 'map', pathMatch: 'full' }, // Redirect root to the map
    { path: 'map', component: MapComponent },
];

