import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ProjektService } from '../../core/services/projekt.service';
import { User } from '../../core/models/user.model';
import { Projekt } from '../../core/models/projekt.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private projektService = inject(ProjektService);
  
  user: User | null = null;
  projekt: Projekt | null = null;

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.projektService.projekt$.subscribe(projekt => {
      this.projekt = projekt;
    });

    // Load project data
    this.projektService.loadProjekt().subscribe();
  }
}
