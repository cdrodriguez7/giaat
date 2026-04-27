import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  inject,
} from '@angular/core';
import { Router }          from '@angular/router';
import { CommonModule }    from '@angular/common';
import { SPECIALTIES }     from '../../data/specialties.data';
import { Specialty }       from '../../models/types';

@Component({
  selector:    'app-hero-grid',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './hero-grid.component.html',
  styleUrl:    './hero-grid.component.scss',
})
export class HeroGridComponent implements OnInit, OnDestroy {

  private router = inject(Router);

  // Señal: qué card está siendo expandida (null = ninguna)
  expandingSlug = signal<string | null>(null);

  // Señal: qué card está en hover
  hoveredSlug = signal<string | null>(null);

  specialties: Specialty[] = SPECIALTIES;

  ngOnInit(): void {
    // Restaurar overflow cuando se navega de vuelta
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  // ── Hover ────────────────────────────────────────────────
  onHover(slug: string): void   { this.hoveredSlug.set(slug); }
  onLeave(): void               { this.hoveredSlug.set(null); }

  // ── Click → animación de expansión → navegar ─────────────
  onCardClick(specialty: Specialty): void {
    if (this.expandingSlug()) return; // Evitar doble click

    // 1. Marcar la carta como "expandiendo"
    this.expandingSlug.set(specialty.slug);

    // 2. Cambiar color de fondo del body para que la transición sea fluida
    document.body.style.backgroundColor = specialty.accentColor;

    // 3. Después de la animación CSS (600ms) → navegar
    setTimeout(() => {
      this.router.navigate(['/especialidad', specialty.slug]);
    }, 580);
  }

  // ── Helpers para template ─────────────────────────────────
  isExpanding(slug: string): boolean {
    return this.expandingSlug() === slug;
  }

  isHovered(slug: string): boolean {
    return this.hoveredSlug() === slug;
  }

  isDimmed(slug: string): boolean {
    const hovered  = this.hoveredSlug();
    const expanding = this.expandingSlug();
    if (expanding) return expanding !== slug;
    if (hovered)   return hovered !== slug;
    return false;
  }

  // Index: 0-based para delay escalonado
  cardDelay(index: number): string {
    return `${index * 0.08}s`;
  }
}
