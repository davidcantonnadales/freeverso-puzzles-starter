export const pictures = [
  {
    id: "bosque",
    title: "El bosque del zorro",
    description: "Un sendero, una casita y un nuevo amigo.",
    image: "/art/bosque.webp",
    word: "ZORRO",
    hint: "Tiene orejas puntiagudas y una cola muy grande.",
    color: "#e0f1e6",
  },
  {
    id: "faro",
    title: "Una luz en el mar",
    description: "Sigue las olas hasta la pequeña isla.",
    image: "/art/faro.webp",
    word: "FARO",
    hint: "Su luz ayuda a los barcos a encontrar el camino.",
    color: "#dceef6",
  },
  {
    id: "ciudad",
    title: "La ciudad de papel",
    description: "Descubre sus tejados y escaleras.",
    image: "/art/ciudad.webp",
    word: "CASA",
    hint: "Un lugar con puertas y ventanas donde vivir.",
    color: "#ffeadc",
  },
  {
    id: "cosmos",
    title: "Un jardín espacial",
    description: "Las plantas también tienen grandes sueños.",
    image: "/art/cosmos.webp",
    word: "LUNA",
    hint: "La vemos en el cielo muchas noches.",
    color: "#eae3f5",
  },
] as const;
export const modes = [
  {
    id: "pieces",
    name: "Piezas",
    icon: "▦",
    text: "Intercambia dos piezas hasta formar el dibujo.",
  },
  {
    id: "memory",
    name: "Parejas",
    icon: "◈",
    text: "Descubre dos tarjetas y encuentra sus parejas.",
  },
  {
    id: "sliding",
    name: "Deslizante",
    icon: "▧",
    text: "Mueve una pieza al hueco para ordenar la imagen.",
  },
  {
    id: "word",
    name: "Palabra",
    icon: "Aa",
    text: "Elige letras y descubre la palabra escondida.",
  },
] as const;
export type Mode = (typeof modes)[number]["id"];
export type Picture = (typeof pictures)[number];
