import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HallComponent } from './hall/hall.component';
import { EventComponent } from './event/event.component';

const routes: Routes = [
  { path: '', redirectTo: '/hall', pathMatch: 'full' },
  { path: 'hall', component: HallComponent },
  { path: 'event', component: EventComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
