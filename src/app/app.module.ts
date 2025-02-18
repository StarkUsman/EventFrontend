import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HallComponent } from './hall/hall.component';
import { EventComponent } from './event/event.component';
import { ReservationComponent } from './reservation/reservation.component';
import { MenuComponent } from './menu/menu.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdditionalComponent } from './additional/additional.component';
import { SubMenuComponent } from './sub-menu/sub-menu.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HallComponent,
    EventComponent,
    ReservationComponent,
    MenuComponent,
    SidebarComponent,
    AdditionalComponent,
    SubMenuComponent,
    ReservationListComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
