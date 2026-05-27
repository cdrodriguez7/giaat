import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule }                        from '@angular/common';
import { Subscription }                        from 'rxjs';
import { SPECIALTIES }    from '../../data/specialties.data';
import { PROJECTS }       from '../../data/projects.data';
import { Specialty, Project, SpecialtySlug } from '../../models/types';

@Component({
  selector:    'app-specialty-detail',
  standalone:  true,
  imports:     [CommonModule, RouterLink],
  templateUrl: './specialty-detail.component.html',
  styleUrl:    './specialty-detail.component.scss',
})
export class SpecialtyDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  specialty     = signal<Specialty | null>(null);
  activeProject = signal<Project | null>(null);
  activeTab     = signal<number>(0);
  entered       = signal(false);

  projects = computed<Project[]>(() => {
    const s = this.specialty();
    if (!s) return [];
    return PROJECTS.filter(p => p.category === s.slug);
  });

  allSpecialties = SPECIALTIES;

  private paramSub?: Subscription;
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    // Subscribe (not snapshot) so re-navigation between specialties works
    this.paramSub = this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') as SpecialtySlug;
      const found = SPECIALTIES.find(s => s.slug === slug);

      if (!found) {
        this.router.navigate(['/']);
        return;
      }

      this.specialty.set(found);
      this.activeTab.set(0);
      this.activeProject.set(null);
      this.entered.set(false);

      // Restaurar bg del body
      document.body.style.backgroundColor = '';
      document.body.style.overflow = '';

      // Aplicar color de acento como variable CSS para estilos dinámicos
      document.documentElement.style.setProperty('--specialty-accent', found.accentColor);

      // Re-trigger entry animation and observers on slug change
      setTimeout(() => {
        this.entered.set(true);
        this.resetRevealObserver();
      }, 50);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.entered.set(true);
      this.initRevealObserver();
    }, 50);
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    this.observer?.disconnect();
    document.documentElement.style.removeProperty('--specialty-accent');
  }

  // ── Tabs del proceso de trabajo ──────────────────────────
  setTab(index: number): void {
    this.activeTab.set(index);
  }

  // ── Modal de proyecto ────────────────────────────────────
  openProject(project: Project): void  { this.activeProject.set(project); }
  closeProject(): void                  { this.activeProject.set(null); }

  // ── Fallback si falla la carga de un logo ────────────────
  onLogoError(event: Event, name: string): void {
    const img = event.target as HTMLImageElement;
    // Reemplazar con un SVG placeholder con el nombre del software
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent && !parent.querySelector('.logo-fallback')) {
      const span = document.createElement('span');
      span.className = 'logo-fallback';
      span.textContent = name;
      parent.appendChild(span);
    }
  }

  // ── Navegar a otra especialidad ───────────────────────────
  goToSpecialty(slug: string): void {
    this.router.navigate(['/especialidad', slug]);
  }

  // ── Volver al hero grid ──────────────────────────────────
  goBack(): void {
    this.router.navigate(['/']);
  }

  // ── IntersectionObserver para .reveal-up / .reveal-fade ──
  private initRevealObserver(): void {
    this.observer?.disconnect();

    const targets = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right');
    if (!targets.length) return;

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            this.observer?.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(el => {
      const siblings = el.parentElement?.querySelectorAll('.reveal-up, .reveal-fade');
      if (siblings) {
        const idx = Array.from(siblings).indexOf(el);
        (el as HTMLElement).style.transitionDelay = `${idx * 0.1}s`;
      }
      this.observer!.observe(el);
    });
  }

  private resetRevealObserver(): void {
    // Remove visible class so elements re-animate on specialty change
    document.querySelectorAll('.reveal-up.visible, .reveal-fade.visible, .reveal-left.visible, .reveal-right.visible')
      .forEach(el => el.classList.remove('visible'));
    // Small delay to let Angular re-render the new specialty content
    setTimeout(() => this.initRevealObserver(), 100);
  }
}
