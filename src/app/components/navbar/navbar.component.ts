import {
  Component,
  HostListener,
  signal,
  inject,
} from '@angular/core';
import { CommonModule }  from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter }        from 'rxjs/operators';

@Component({
  selector:    'app-navbar',
  standalone:  true,
  imports:     [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl:    './navbar.component.scss',
})
export class NavbarComponent {

  private router = inject(Router);

  scrolled     = signal(false);
  menuOpen     = signal(false);
  isDetailPage = signal(false);

  constructor() {
    // Detectar si estamos en página de detalle
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.isDetailPage.set(
          e.url.includes('/especialidad/') || e.url.includes('/nosotros')
        );
        this.menuOpen.set(false);
      });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 60);
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  goHome(): void {
    this.menuOpen.set(false);
    this.router.navigate(['/']);
  }

  // Scroll suave al id de contacto en la página actual
  scrollToContact(): void {
    this.menuOpen.set(false);
    const el = document.getElementById('contacto');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}
