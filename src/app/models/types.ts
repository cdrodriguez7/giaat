// ============================================================
// GIAAT — INTERFACES Y TIPOS
// ============================================================

export type SpecialtySlug =
  | 'geotecnia'
  | 'ingenieria'
  | 'arquitectura'
  | 'ambiental'
  | 'topografia';

export interface Specialty {
  slug:        SpecialtySlug;
  letter:      string;         // G, I, A, A, T
  name:        string;         // Nombre completo
  shortName:   string;         // Nombre corto para la card
  description: string;         // Descripción larga
  accentColor: string;         // Color de acento propio
  bgImage:     string;         // Ruta imagen de fondo de la card
  services:    string[];       // Lista de servicios específicos
  software:      string[];          // Herramientas usadas en esta área
  softwareTools: SoftwareTool[];    // Logos para el carrusel
}

export interface Project {
  id:          number;
  title:       string;
  client:      string;
  year:        number;
  location:    string;
  category:    SpecialtySlug;
  description: string;
  image:       string;
  tags:        string[];
  featured:    boolean;
}

export interface StatItem {
  value:  number;
  suffix: string;       // '+', '%', etc.
  label:  string;
}

export interface SoftwareTool {
  name:    string;
  logoUrl: string;  // URL o ruta al logo SVG/PNG
}
