import { notFound } from "next/navigation";
import { pictures, modes, type Mode } from "@/lib/puzzles";
import Game from "@/components/Game";
export function generateStaticParams() {
  return pictures.map((p) => ({ id: p.id }));
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ modo?: string }>;
}) {
  const { id } = await params,
    { modo } = await searchParams;
  const picture = pictures.find((p) => p.id === id);
  if (!picture) notFound();
  const mode = modes.some((m) => m.id === modo) ? (modo as Mode) : "pieces";
  return <Game key={picture.id + mode} picture={picture} mode={mode} />;
}
