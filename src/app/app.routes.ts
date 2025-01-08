import { Routes } from '@angular/router';
import { createUserComponent } from './auth/createUser/createuser.component';
import { LoginComponent } from './auth/login/login.component';
import { ChatComponent } from './chat/chat.component';
import { ResetpasswordComponent } from './auth/resetpassemail/resetPassEmail.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'chatrooms', component: ChatComponent },
  { path: 'createUser', component: createUserComponent },
  { path: 'forgotPassword', component: ResetpasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
];
