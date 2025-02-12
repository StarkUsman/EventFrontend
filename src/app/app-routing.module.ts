import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HallComponent } from './hall/hall.component';
import { EventComponent } from './event/event.component';
import { ReservationComponent } from './reservation/reservation.component';
import { MenuComponent } from './menu/menu.component';
import { AdditionalComponent } from './additional/additional.component';
import { SubMenuComponent } from './sub-menu/sub-menu.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/hall', pathMatch: 'full' },
  { path: 'hall', component: HallComponent, canActivate: [AuthGuard] },
  { path: 'event', component: EventComponent, canActivate: [AuthGuard] },
  { path: 'reservationList', component: ReservationListComponent, canActivate: [AuthGuard] },
  { path: 'reservation', component: ReservationComponent, canActivate: [AuthGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'add', component: AdditionalComponent, canActivate: [AuthGuard] },
  { path: 'menuItem', component: SubMenuComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
