import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ChatbotComponent } from '../../components/chatbot/chatbot.component';
import { SiteFooterComponent } from '../../components/site-footer/site-footer.component';
import { SiteHeaderComponent } from '../../components/site-header/site-header.component';
import { ToastHostComponent } from '../../components/toast-host/toast-host.component';

@Component({
  selector: 'app-site-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    SiteHeaderComponent,
    SiteFooterComponent,
    ChatbotComponent,
    ToastHostComponent,
  ],
  templateUrl: './site-shell.component.html',
  styleUrl: './site-shell.component.scss'
})
export class SiteShellComponent {}
