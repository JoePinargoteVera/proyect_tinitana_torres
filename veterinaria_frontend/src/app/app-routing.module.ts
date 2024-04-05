import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { lockGuard } from './guards/lock.guard';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductComponent } from './pages/product/product.component';
import { ClientComponent } from './pages/client/client.component';
import { UserComponent } from './pages/user/user.component';
import { ProviderComponent } from './pages/provider/provider.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { TransactionComponent } from './pages/transaction/transaction.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent, canActivate: [lockGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'productos', component: ProductComponent, canActivate: [AuthGuard] },
  { path: 'clientes', component: ClientComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'proveedores', component: ProviderComponent, canActivate: [AuthGuard] },
  { path: 'categorias', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'inventario', component: InventoryComponent, canActivate: [AuthGuard] },
  { path: 'transaccion', component: TransactionComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
