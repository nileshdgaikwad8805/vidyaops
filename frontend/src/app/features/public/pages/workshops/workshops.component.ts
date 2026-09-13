import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkshopsService } from '../../../../core/services/workshops.service';
import { Workshop } from '../../../../core/models/site.models';

@Component({
  selector: 'app-workshops',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './workshops.component.html',
  styleUrl: './workshops.component.scss'
})
export class WorkshopsComponent implements OnInit {
  private readonly workshopsService = inject(WorkshopsService);

  workshops = signal<Workshop[]>(this.workshopsService.fallbackWorkshops);

  ngOnInit(): void {
    void this.workshopsService
      .getWorkshops()
      .then(w => this.workshops.set(w))
      .catch(() => {});
  }
}
