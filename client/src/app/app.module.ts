import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { LandingComponent } from './components/landing/landing.component';
import { MasquerTextComponent } from './components/masquer-text/masquer-text.component';
import { UnauthHeaderComponent } from './components/unauth-header/unauth-header.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UnauthViewComponent } from './components/unauth-view/unauth-view.component';
import { AuthViewComponent } from './components/auth-view/auth-view.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { NewMessageComponent } from './components/new-message/new-message.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatMessageComponent,
    LandingComponent,
    MasquerTextComponent,
    UnauthHeaderComponent,
    SignupComponent,
    LoginComponent,
    HomeComponent,
    SidebarComponent,
    UnauthViewComponent,
    AuthViewComponent,
    ChatListComponent,
    NewMessageComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
