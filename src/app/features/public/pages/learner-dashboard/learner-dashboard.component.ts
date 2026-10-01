import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RuntimeConfigService } from '../../../../core/services/runtime-config.service';

@Component({
  selector: 'app-learner-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './learner-dashboard.component.html',
  styleUrl: './learner-dashboard.component.scss'
})
export class LearnerDashboardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly runtimeConfig = inject(RuntimeConfigService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly enrollment = signal<any>(null);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.loading.set(false);
      this.error.set('No access token found. Please use the link from your enrollment email.');
      return;
    }
    this.loadDashboard(token);
  }

  private async loadDashboard(token: string): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<any>(this.runtimeConfig.apiUrl(`/api/learner-dashboard?token=${encodeURIComponent(token)}`)),
      );
      this.enrollment.set(data);
    } catch {
      this.error.set('Unable to load dashboard. The link may have expired or is invalid.');
    } finally {
      this.loading.set(false);
    }
  }
}
