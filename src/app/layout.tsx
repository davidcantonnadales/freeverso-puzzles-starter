import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Freeverso Puzzles · Pequeñas piezas, grandes descubrimientos",
  description:
    "Cuatro formas de jugar con imágenes: piezas, parejas, deslizante y palabras. Sin cuentas, anuncios ni clasificaciones.",
  icons: { icon: "/logo.svg" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <a className="skip" href="#contenido">
          Ir al juego
        </a>
        <header className="wrap header">
          <a className="brand" href="/">
            <img src="/logo.svg" alt="" width="42" height="42" />
            freeverso<span>puzzles</span>
          </a>
          <a className="family-note" href="/#familias">
            Para jugar en familia ↗
          </a>
        </header>
        {children}
        <footer className="wrap footer">
          <span>Freeverso Puzzles · David Cantón</span>
          <a href="https://github.com/davidcantonnadales/freeverso-puzzles-starter">
            Código abierto ↗
          </a>
          <span>Sin cuentas · Sin anuncios · Sin seguimiento</span>
        </footer>
      </body>
    </html>
  );
}
