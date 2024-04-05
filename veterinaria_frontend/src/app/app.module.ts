import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { ServiceStorage } from './Service/storage.service';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { ProductComponent } from './pages/product/product.component';
import { ClientComponent } from './pages/client/client.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProviderComponent } from './pages/provider/provider.component';
import { UserComponent } from './pages/user/user.component';

import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireStorageModule} from '@angular/fire/compat/storage';
import { AppSettings } from 'appsettings-json-reader';
import { CategoryComponent } from './pages/category/category.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { FilterPipeModule} from 'ngx-filter-pipe';
import { OrderModule} from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { NgApexchartsModule} from 'ng-apexcharts';
import { TransactionComponent } from './pages/transaction/transaction.component'

const appSettings = AppSettings.readAppSettings();

export const url = 'http://127.0.0.1:8000/api/';

export function jwtOptionsFactory(cookieService: CookieService) {
  return {
    tokenGetter: () => cookieService.get('token'),
    allowedDomains: ['localhost:4200'], // Dominio(s) permitido(s) para las solicitudes
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    SidebarComponent,
    NavbarComponent,
    ProductComponent,
    ClientComponent,
    ProfileComponent,
    ProviderComponent,
    UserComponent,
    CategoryComponent,
    InventoryComponent,
    TransactionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgApexchartsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(appSettings.firebaseConfig),
    AngularFireStorageModule,
    NgxPaginationModule,

    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [CookieService],
      },
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [ServiceStorage],
  bootstrap: [AppComponent]
})
export class AppModule { }
