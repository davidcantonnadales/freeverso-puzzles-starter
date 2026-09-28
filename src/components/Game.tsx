"use client";
import { useEffect, useState, useRef } from "react";
import type { Mode, Picture } from "@/lib/puzzles";
import { modes } from "@/lib/puzzles";
import { shuffled, slidingBoard, moveTile, solved } from "@/lib/engine.mjs";
const symbols = ["🌻", "🦊", "🚀", "🍄", "🐳", "🌙"];
export default function Game({
  picture,
  mode,
}: {
  picture: Picture;
  mode: Mode;
}) {
  const [board, setBoard] = useState<number[]>([]),
    [selected, setSelected] = useState<number | null>(null),
    [moves, setMoves] = useState(0),
    [paused, setPaused] = useState(false),
    [peek, setPeek] = useState(false),
    [won, setWon] = useState(false),
    [open, setOpen] = useState<number[]>([]),
    [matched, setMatched] = useState<number[]>([]),
    [letters, setLetters] = useState<string[]>([]),
    [message, setMessage] = useState(""),
    [confirmReset, setConfirmReset] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    drag = useRef<number | null>(null);
  const info = modes.find((m) => m.id === mode)!;
  function reset() {
    if (timer.current) clearTimeout(timer.current);
    setBoard(
      mode === "sliding"
        ? slidingBoard()
        : mode === "memory"
          ? shuffled(12)
          : shuffled(9),
    );
    setSelected(null);
    setMoves(0);
    setPaused(false);
    setPeek(false);
    setWon(false);
    setOpen([]);
    setMatched([]);
    setLetters([]);
    setMessage("Una nueva partida. Vamos paso a paso.");
    setConfirmReset(false);
  }
  useEffect(() => {
    reset();
    const visibility = () => {
      if (document.hidden) setPaused(true);
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  function pause() {
    if (timer.current) clearTimeout(timer.current);
    setOpen([]);
    setPaused((p) => !p);
    setMessage("");
  }
  function finish(next: number[]) {
    setBoard(next);
    setMoves((m) => m + 1);
    if (solved(next)) {
      setWon(true);
      setMessage("¡Lo has conseguido! La imagen está completa.");
    }
  }
  function choose(i: number) {
    if (paused || won || peek) return;
    if (mode === "memory") {
      if (open.length === 2 || open.includes(i) || matched.includes(i)) return;
      const next = [...open, i];
      setOpen(next);
      if (next.length === 2) {
        setMoves((m) => m + 1);
        if (board[next[0]] % 6 === board[next[1]] % 6) {
          const found = [...matched, ...next];
          setMatched(found);
          setOpen([]);
          setMessage("¡Una pareja!");
          if (found.length === 12) {
            setWon(true);
            setMessage("¡Lo has conseguido! Has encontrado todas las parejas.");
          }
        } else {
          setMessage("Míralas un momento. Después puedes probar otra pareja.");
          timer.current = setTimeout(() => setOpen([]), 1100);
        }
      }
      return;
    }
    if (mode === "sliding") {
      const next = moveTile(board, i);
      if (next !== board) finish(next);
      else setMessage("Elige una pieza que esté al lado del hueco.");
      return;
    }
    if (selected === null) {
      setSelected(i);
      return;
    }
    if (selected === i) {
      setSelected(null);
      return;
    }
    const next = [...board];
    [next[i], next[selected]] = [next[selected], next[i]];
    setSelected(null);
    finish(next);
  }
  function guess(letter: string) {
    if (paused || won || letters.includes(letter)) return;
    const next = [...letters, letter];
    setLetters(next);
    setMoves((m) => m + 1);
    if ([...picture.word].every((c) => next.includes(c))) {
      setWon(true);
      setMessage("¡Lo has conseguido! La palabra es " + picture.word + ".");
    } else
      setMessage(
        picture.word.includes(letter)
          ? "¡Esa letra sí está!"
          : "Esa letra no está. Puedes seguir probando.",
      );
  }
  const progress =
    mode === "memory"
      ? Math.round((matched.length / 12) * 100)
      : mode === "word"
        ? Math.round(
            ([...picture.word].filter((x) => letters.includes(x)).length /
              picture.word.length) *
              100,
          )
        : Math.round((board.filter((x, i) => x === i).length / 9) * 100);
  return (
    <main className="wrap game-page" id="contenido">
      <a className="back" href="/">
        ← Elegir otro juego
      </a>
      <div className="game-heading">
        <div>
          <p className="eyebrow">{info.name.toUpperCase()} · SIN PRISAS</p>
          <h1>{picture.title}</h1>
          <p>
            {info.text}{" "}
            {mode === "word"
              ? "No pierdes vidas: puedes probar todas las letras."
              : ""}
          </p>
        </div>
        <div className="game-actions">
          <button className="button secondary" onClick={pause}>
            {paused ? "Continuar" : "Pausa"}
          </button>
          <button
            className="button secondary"
            onClick={() => setConfirmReset(true)}
          >
            Empezar de nuevo
          </button>
        </div>
      </div>
      {confirmReset && (
        <div className="confirm" role="group" aria-label="Confirmar reinicio">
          <span>¿Empezamos otra partida? Se perderá esta posición.</span>
          <button className="button" onClick={reset}>
            Sí, nueva partida
          </button>
          <button
            className="button secondary"
            onClick={() => setConfirmReset(false)}
          >
            Seguir jugando
          </button>
        </div>
      )}
      <div className="game-layout">
        <section className="board-panel" aria-label="Tablero">
          <div className="board-top">
            <span>
              {mode === "memory"
                ? "Parejas"
                : mode === "word"
                  ? "Palabra"
                  : "Imagen"}{" "}
              · {progress}%
            </span>
            <span>
              {moves} {mode === "memory" ? "intentos" : "movimientos"}
            </span>
          </div>
          {!board.length ? (
            <p>Preparando las piezas…</p>
          ) : (
            <div className="board-holder">
              {paused ? (
                <div className="paused">
                  <span>☾</span>
                  <h2>Tu juego te espera.</h2>
                  <p>Pulsa Continuar cuando te apetezca.</p>
                </div>
              ) : mode === "memory" ? (
                <div className="memory-board">
                  {board.map((value, i) => (
                    <button
                      key={i}
                      data-pair={value % 6}
                      className={
                        matched.includes(i)
                          ? "matched"
                          : open.includes(i)
                            ? "flipped"
                            : ""
                      }
                      disabled={won || matched.includes(i)}
                      onClick={() => choose(i)}
                      aria-label={
                        "Tarjeta " +
                        (i + 1) +
                        (matched.includes(i)
                          ? ", pareja encontrada"
                          : open.includes(i)
                            ? ", " + symbols[value % 6]
                            : ", boca abajo")
                      }
                    >
                      {open.includes(i) || matched.includes(i)
                        ? symbols[value % 6]
                        : "✦"}
                    </button>
                  ))}
                </div>
              ) : mode === "word" ? (
                <div className="word-board">
                  <img
                    src={picture.image}
                    alt={picture.title}
                    style={{ filter: won ? "none" : "blur(4px)" }}
                  />
                  <p
                    className="word"
                    aria-label={won ? picture.word : "Palabra por descubrir"}
                  >
                    {[...picture.word].map((l, i) => (
                      <span key={i}>{letters.includes(l) ? l : "_"}</span>
                    ))}
                  </p>
                  <p className="hint">Pista: {picture.hint}</p>
                  <div className="letters">
                    {"ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("").map((l) => (
                      <button
                        key={l}
                        onClick={() => guess(l)}
                        disabled={won || letters.includes(l)}
                        aria-label={"Letra " + l}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="tile-board" style={{ aspectRatio: "3/2" }}>
                  {(peek ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : board).map(
                    (value, i) => (
                      <button
                        key={i}
                        className={
                          (selected === i ? "chosen " : "") +
                          (mode === "sliding" && value === 8 && !won
                            ? "blank"
                            : "")
                        }
                        data-value={value}
                        disabled={
                          won || peek || (mode === "sliding" && value === 8)
                        }
                        aria-label={
                          mode === "sliding" && value === 8
                            ? "Hueco"
                            : `Pieza ${value + 1} en casilla ${i + 1}`
                        }
                        onClick={() => choose(i)}
                        draggable={mode === "pieces" && !peek && !won}
                        onDragStart={() => {
                          drag.current = i;
                          setSelected(i);
                        }}
                        onDragEnd={() => {
                          drag.current = null;
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (drag.current !== null && drag.current !== i) {
                            const next = [...board];
                            [next[i], next[drag.current]] = [
                              next[drag.current],
                              next[i],
                            ];
                            drag.current = null;
                            setSelected(null);
                            finish(next);
                          }
                        }}
                        style={{
                          backgroundImage: `url(${picture.image})`,
                          backgroundSize: "300% 300%",
                          backgroundPosition: `${(value % 3) * 50}% ${Math.floor(value / 3) * 50}%`,
                        }}
                      >
                        <span>
                          {mode === "sliding" && value === 8 && !won
                            ? ""
                            : value + 1}
                        </span>
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
          <p className="game-status" role="status">
            {paused ? "En pausa." : message || "Elige una pieza para empezar."}
          </p>
          {won && (
            <div className="celebration">
              <strong>¡Una aventura terminada! ✨</strong>
              <p>Puedes volver a jugar o elegir otra imagen.</p>
              <a className="button" href="/">
                Elegir otra aventura →
              </a>
            </div>
          )}
        </section>
        <aside className="game-guide">
          <span className="eyebrow">UNA AYUDA PARA MIRAR</span>
          <h2>Así es la imagen</h2>
          <img src={picture.image} alt={"Referencia: " + picture.title} />
          <p>
            {mode === "pieces"
              ? "Toca una pieza y después otra para intercambiarlas. También puedes usar Tab y Espacio, o arrastrar con el ratón."
              : mode === "sliding"
                ? "Solo se mueven las piezas que tocan el hueco por un lado. No se mueven en diagonal."
                : mode === "memory"
                  ? "Abre dos tarjetas. Si son iguales, se quedan descubiertas; si no, vuelve a intentarlo."
                  : "Elige una letra. Si está en la palabra, aparece en su sitio. No hay vidas ni cuenta atrás."}
          </p>
          {mode === "pieces" && (
            <button
              className="button secondary"
              disabled={paused || won}
              onClick={() => {
                setPeek((v) => !v);
                setSelected(null);
              }}
            >
              {peek ? "Volver a las piezas" : "Ver la imagen en el tablero"}
            </button>
          )}
          <p className="tiny">
            La partida no se guarda al cerrar o recargar. Puedes hacer una pausa
            mientras esta pestaña siga abierta.
          </p>
        </aside>
      </div>
    </main>
  );
}
