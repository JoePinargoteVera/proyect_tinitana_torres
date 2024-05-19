import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule,  HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { TransactionComponent } from './pages/transaction/transaction.component'
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ConfirmInterceptor } from './confirm.interceptor';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { OverlayscrollbarsModule } from "overlayscrollbars-ngx";
import { SettingsComponent } from './pages/settings/settings.component';

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
    TransactionComponent,
    FormatDatePipe,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    NgScrollbarModule,
    BrowserAnimationsModule,
    NgSelectModule,
    AppRoutingModule,
    NgxSelectModule,
    AngularFireModule.initializeApp(appSettings.firebaseConfig),
    AngularFireStorageModule,
    NgxPaginationModule,
    OverlayscrollbarsModule,
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
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [ServiceStorage,  { provide: HTTP_INTERCEPTORS, useClass: ConfirmInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
