import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ChatbotComponent } from '../../components/chatbot/chatbot.component';
import { SiteFooterComponent } from '../../components/site-footer/site-footer.component';
import { SiteHeaderComponent } from '../../components/site-header/site-header.component';

@Component({
  selector: 'app-site-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    SiteHeaderComponent,
    SiteFooterComponent,
    ChatbotComponent,
  ],
  templateUrl: './site-shell.component.html',
  styleUrl: './site-shell.component.scss'
})
export class SiteShellComponent {

}
