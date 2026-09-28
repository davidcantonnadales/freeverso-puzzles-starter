"use client";
import { useState } from "react";
import { pictures, modes, type Mode } from "@/lib/puzzles";
export default function Home() {
  const [mode, setMode] = useState<Mode>("pieces");
  return (
    <main id="contenido">
      <section className="wrap hero">
        <div>
          <p className="eyebrow">UN RATITO PARA JUGAR, A TU RITMO</p>
          <h1>
            Pequeñas piezas.
            <br />
            <span>Grandes descubrimientos.</span>
          </h1>
          <p className="intro">
            Un bosque por explorar, un faro junto al mar y cuatro formas de
            encontrar lo que encaja. Elige una imagen y vamos a jugar.
          </p>
          <a className="button" href="/jugar/bosque?modo=pieces">
            Montar mi primer puzzle →
          </a>
          <p className="tiny">
            Sin reloj que te meta prisa. Puedes parar cuando quieras.
          </p>
        </div>
        <a
          className="hero-picture"
          href="/jugar/bosque?modo=pieces"
          aria-label="Jugar con El bosque del zorro"
        >
          <img
            src="/art/bosque.webp"
            alt="Un zorro en un bosque de papel con una casita y setas"
          />
          <span className="sticker">
            ¡Te toca
            <br />
            descubrir!
          </span>
          <span className="picture-label">
            EL BOSQUE DEL ZORRO <span>9 piezas ↗</span>
          </span>
        </a>
      </section>
      <section className="wrap games" id="juegos">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HOY, ¿CÓMO TE APETECE JUGAR?</p>
            <h2>Una imagen. Muchas aventuras.</h2>
          </div>
        </div>
        <div className="mode-list" role="group" aria-label="Tipo de juego">
          {modes.map((m) => (
            <button
              key={m.id}
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
            >
              <span aria-hidden="true">{m.icon}</span>
              <strong>{m.name}</strong>
              <small>{m.text}</small>
            </button>
          ))}
        </div>
        <div className="cards">
          {pictures.map((p) => (
            <a
              href={`/jugar/${p.id}?modo=${mode}`}
              className="card"
              key={p.id}
              style={{ background: p.color }}
            >
              <img src={p.image} alt={p.title} />
              <div>
                <span className="card-mode">
                  {modes.find((m) => m.id === mode)?.name}
                </span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <span className="play-link">
                  Vamos a jugar <b>→</b>
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="wrap family" id="familias">
        <div>
          <p className="eyebrow">PARA FAMILIAS CURIOSAS</p>
          <h2>
            Probar, equivocarse
            <br />y volver a mirar.
          </h2>
        </div>
        <div>
          <p>
            En piezas, toca dos casillas para intercambiarlas. En parejas, busca
            dos iguales. Cada juego explica sus controles y tiene un botón para
            empezar de nuevo.
          </p>
          <p>
            No pedimos nombres, edad ni fotos. No hay clasificaciones, compras
            ni datos enviados a servicios externos. La partida se reinicia al
            salir o recargar. Las ilustraciones de ejemplo están generadas con
            IA.
          </p>
          <p>
            Son juegos para disfrutar y explorar; no se atribuyen beneficios
            terapéuticos ni se sustituye el acompañamiento familiar.
          </p>
        </div>
      </section>
    </main>
  );
}
