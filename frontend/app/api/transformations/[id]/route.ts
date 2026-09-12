import { NextResponse } from "next/server";
import { getInitialSeedTransformations } from "@/lib/storage";
import { Transformation } from "@/types";

let memoryTransformations: Transformation[] = getInitialSeedTransformations();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const found = memoryTransformations.find(t => t.id === id);
  
  if (found) {
    return NextResponse.json(found);
  }

  // If not found in memory, generate on-demand for seed IDs
  const seeds = getInitialSeedTransformations();
  const seed = seeds.find(s => s.id === id);
  if (seed) {
    return NextResponse.json(seed);
  }

  return NextResponse.json({ detail: `Transformation #${id} not found.` }, { status: 404 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  memoryTransformations = memoryTransformations.filter(t => t.id !== id);
  return NextResponse.json({ message: "Deleted successfully", id });
}
