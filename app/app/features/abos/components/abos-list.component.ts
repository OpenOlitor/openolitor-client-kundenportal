import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { AbosService } from '../services/abos.service';
import { ProjektService } from '../../../core/services/projekt.service';
import { Abo } from '../models/abo.model';
import { Projekt } from '../../../core/models/projekt.model';
import { OrderByPipe } from '../../../shared/pipes/order-by.pipe';

@Component({
  selector: 'app-abos-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, OrderByPipe],
  templateUrl: './abos-list.component.html',
  styleUrls: ['./abos-list.component.scss']
})
export class AbosListComponent implements OnInit {
  private abosService = inject(AbosService);
  private projektService = inject(ProjektService);

  entries: Abo[] = [];
  entriesFiltered: Abo[] = [];
  hasAbgelaufen = false;
  showAbgelaufen = false;
  loading = false;
  projekt: Projekt | null = null;

  ngOnInit(): void {
    this.loadAbos();
    this.loadProjekt();
  }

  private loadAbos(): void {
    this.loading = true;
    this.abosService.getAbos().subscribe({
      next: (abos) => {
        this.entries = abos;
        this.filterEntries();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private loadProjekt(): void {
    this.projektService.projekt$.subscribe(projekt => {
      this.projekt = projekt;
    });
    this.projektService.loadProjekt().subscribe();
  }

  filterEntries(): void {
    if (this.showAbgelaufen) {
      this.entriesFiltered = this.entries;
    } else {
      this.entriesFiltered = [];
      this.hasAbgelaufen = false;
      
      this.entries.forEach(abo => {
        if (!abo.ende || !moment(abo.ende).isBefore(new Date())) {
          this.entriesFiltered.push(abo);
        } else {
          this.hasAbgelaufen = true;
        }
      });
    }
  }

  showAll(): void {
    this.showAbgelaufen = true;
    this.filterEntries();
  }

  trackByAbo(index: number, abo: Abo): number {
    return abo.id;
  }
}
