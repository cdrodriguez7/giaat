import {
  Component,
  AfterViewInit,
  OnDestroy,
  signal,
  computed,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface TeamMember {
  name: string;
  role: string;
  tag: string;       // Role label shown on the card (uppercase short)
  image: string;
  accentColor: string;
}

interface CompanyValue {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements AfterViewInit, OnDestroy {

  // ── Valores de empresa ────────────────────────────────────
  values: CompanyValue[] = [
    {
      number: '01',
      title: 'Precisión Técnica',
      description: 'Cada proyecto se desarrolla con rigor metodológico y los más altos estándares técnicos internacionales, garantizando resultados confiables y documentados.',
    },
    {
      number: '02',
      title: 'Compromiso Local',
      description: 'Empresa lojana comprometida con el desarrollo sostenible del sur del Ecuador. Conocemos el territorio, sus condiciones geológicas y sus comunidades.',
    },
    {
      number: '03',
      title: 'Soluciones Integrales',
      description: 'Geotécnia, Ingeniería, Arquitectura, Ambiental y Topografía bajo un mismo equipo coordinado. Un solo interlocutor para proyectos multidisciplinarios.',
    },
    {
      number: '04',
      title: 'Innovación Aplicada',
      description: 'Usamos software de vanguardia — Civil 3D, Slide 2D/3D, Revit, Lumion, ArcGIS — para entregar proyectos con precisión y visualización de calidad superior.',
    },
  ];

  stats = [
    { value: '6+',  label: 'Años de experiencia' },
    { value: '30+', label: 'Proyectos realizados' },
    { value: '5',   label: 'Áreas de especialidad' },
    { value: '3',   label: 'Provincias de presencia' },
  ];

  // ── Equipo real desde ARCHIVOS/TEAM ──────────────────────
  team: TeamMember[] = [
    {
      name: 'Juan Pablo',
      role: 'Geólogo de Minas',
      tag: 'Geotécnia · Minería',
      image: 'assets/images/team/juanp.jpeg',
      accentColor: '#7CB842',
    },
    {
      name: 'Alejandra',
      role: 'Ingeniera Civil',
      tag: 'Estructuras · Ingeniería',
      image: 'assets/images/team/ale.jpeg',
      accentColor: '#5B9BD5',
    },
    {
      name: 'Michelle',
      role: 'Arquitecta en Jefe',
      tag: 'Diseño · Dirección',
      image: 'assets/images/team/mich.jpeg',
      accentColor: '#E8A020',
    },
    {
      name: 'Monse',
      role: 'Arquitecta Renderista',
      tag: 'Render · Visualización 3D',
      image: 'assets/images/team/monse.jpeg',
      accentColor: '#E8A020',
    },
    {
      name: 'Lesly',
      role: 'Arquitecta Junior',
      tag: 'Concepto · Proyectos',
      image: 'assets/images/team/les.jpeg',
      accentColor: '#E8A020',
    },
    {
      name: 'Erick',
      role: 'Arquitecto Colaborador',
      tag: 'Integración · Workflow',
      image: 'assets/images/team/erick.jpeg',
      accentColor: '#3DAA6A',
    },
    {
      name: 'Cristian',
      role: 'Diseñador Web',
      tag: 'Interfaz · Digital',
      image: 'assets/images/team/cris.jpeg',
      accentColor: '#9B6DB5',
    },
  ];

  // ── Carrusel state ────────────────────────────────────────
  activeIndex = signal(0);
  isAnimating = signal(false);
  isPaused    = signal(false);

  // Índice del miembro activo (nombre + role en panel lateral)
  activeMember = computed(() => this.team[this.activeIndex()]);

  private autoTimer: ReturnType<typeof setInterval> | null = null;
  private touchStartX = 0;

  // ── Scroll reveal ─────────────────────────────────────────
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    // IntersectionObserver para secciones
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right')
      .forEach((el) => this.observer?.observe(el));

    // Auto-avance del carrusel
    this.startAuto();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.stopAuto();
  }

  // ── Auto-avance ───────────────────────────────────────────
  startAuto(): void {
    this.autoTimer = setInterval(() => {
      if (!this.isPaused()) this.next();
    }, 3800);
  }

  stopAuto(): void {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
  }

  pauseAuto(): void  { this.isPaused.set(true);  }
  resumeAuto(): void { this.isPaused.set(false); }

  // ── Navegación ────────────────────────────────────────────
  goTo(index: number): void {
    if (this.isAnimating() || index === this.activeIndex()) return;
    this.isAnimating.set(true);
    this.activeIndex.set((index + this.team.length) % this.team.length);
    setTimeout(() => this.isAnimating.set(false), 550);
  }

  next(): void { this.goTo(this.activeIndex() + 1); }
  prev(): void { this.goTo(this.activeIndex() - 1); }

  isActive(i: number): boolean   { return this.activeIndex() === i; }
  isPrev(i: number): boolean     { return (this.activeIndex() - 1 + this.team.length) % this.team.length === i; }
  isNext(i: number): boolean     { return (this.activeIndex() + 1) % this.team.length === i; }

  // ── Touch / swipe ─────────────────────────────────────────
  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
    this.pauseAuto();
  }

  onTouchEnd(e: TouchEvent): void {
    const delta = this.touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? this.next() : this.prev();
    this.resumeAuto();
  }
}
