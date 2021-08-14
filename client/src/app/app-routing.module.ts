import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./shared/guards/auth.guard";

import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {SiteLayoutComponent} from "./shared/layouts/site-layout/site-layout.component";
import {LoginPageComponent} from "./auth/login-page/login-page.component";
import {RegisterPageComponent} from "./auth/register-page/register-page.component";
import {AnalyticsPageComponent} from "./pages/analytics-page/analytics-page.component";
import {OverviewPageComponent} from "./pages/overview-page/overview-page.component";
import {HistoryPageComponent} from "./pages/history-page/history-page.component";
import {OrderPageComponent} from "./pages/order-page/order-page.component";
import {CategoriesPageComponent} from "./pages/categories-page/categories-page.component";
import {CategoryFormComponent} from "./pages/categories-page/category-form/category-form.component";
import {CategoryPositionsComponent} from "./pages/categories-page/category-form/category-positions/category-positions.component";
import { PreloaderComponent } from './components/preloader/preloader.component';
import { OrderCategoriesComponent } from './pages/order-page/order-categories/order-categories.component';
import { OrderPositionsComponent } from './pages/order-page/order-positions/order-positions.component';
const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent},
      {path: 'registration', component: RegisterPageComponent}

    ]
  },
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      {path: 'overview', component: OverviewPageComponent},
      {path: 'analytics', component: AnalyticsPageComponent},
      {path: 'history', component: HistoryPageComponent},
      {path: 'order', component: OrderPageComponent, children: [
          {path:'', component: OrderCategoriesComponent},
          {path:':id', component: OrderPositionsComponent},
        ]},
      {path: 'categories', component: CategoriesPageComponent},
      {path: 'categories/new', component: CategoryFormComponent},
      {path: 'categories/:id', component: CategoryFormComponent}
    ]
  },
]

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule {
}

export const appRoutes = [
  AuthLayoutComponent,
  LoginPageComponent,
  RegisterPageComponent,
  SiteLayoutComponent,
  OverviewPageComponent,
  AnalyticsPageComponent,
  HistoryPageComponent,
  OrderPageComponent,
  CategoriesPageComponent,
  PreloaderComponent,
  CategoryFormComponent,
  CategoryPositionsComponent,
  OrderCategoriesComponent,
  OrderPositionsComponent
]
