import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { CreditsComponent } from './components/credits/credits.component';
import { HomeComponent } from './components/home/home.component';
import { UnauthViewComponent } from './components/unauth-view/unauth-view.component';
import { AuthViewComponent } from './components/auth-view/auth-view.component';

const routes: Routes = [
  { 
    path: '',
    component: UnauthViewComponent,
    data: { component: 'landing' } },
  {
    path: 'signup',
    component: UnauthViewComponent,
    data: { component: 'signup' },
  },
  {
    path: 'login',
    component: UnauthViewComponent,
    data: { component: 'login' },
  },
  { 
    path: 'home',
    component: AuthViewComponent,
    data: { component: 'home' }
  },
  { 
    path: 'chats',
    component: AuthViewComponent,
    data: { component: 'chats' }
  },
  { 
    path: 'settings',
    component: AuthViewComponent,
    data: { component: 'settings' }
  },
  // TODO: refactor these to their correct place
  { path: 'chat/:id', component: ChatComponent },
  { path: 'credits', component: CreditsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
