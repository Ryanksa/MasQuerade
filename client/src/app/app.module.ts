import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { CreditsComponent } from './components/credits/credits.component';
import { LandingComponent } from './components/landing/landing.component';
import { MasquerTextComponent } from './components/masquer-text/masquer-text.component';
import { UnauthHeaderComponent } from './components/unauth-header/unauth-header.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatMessageComponent,
    CreditsComponent,
    LandingComponent,
    MasquerTextComponent,
    UnauthHeaderComponent,
    SignupComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
