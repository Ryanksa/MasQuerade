import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { CreditsComponent } from './components/credits/credits.component';

const routes: Routes = [
  {path: 'chat/:id', component: ChatComponent},
  {path: 'credits', component: CreditsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }