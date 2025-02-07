import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HallComponent } from './hall/hall.component';
import { EventComponent } from './event/event.component';
import { ReservationComponent } from './reservation/reservation.component';
import { MenuComponent } from './menu/menu.component';
import { AdditionalComponent } from './additional/additional.component';
import { SubMenuComponent } from './sub-menu/sub-menu.component';

const routes: Routes = [
  { path: '', redirectTo: '/hall', pathMatch: 'full' },
  { path: 'hall', component: HallComponent },
  { path: 'event', component: EventComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'add', component: AdditionalComponent },
  { path: 'menuItem', component: SubMenuComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
