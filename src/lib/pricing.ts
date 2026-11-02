import catalog from '../data/catalog.json';
import themes from '../data/themes.json';

export type ParamSource = { get(name: string): string | null };

export interface Selection {
  themeId: string;
  shapeId: string;
  fabricId: string;
  sizeId: string;
  edgeId: string;
  threadId: string;
  motifId: string;
  monogram: string;
}

export interface PriceLine {
  id: string;
  label: string;
  amountCents: number;
}

export interface Priced {
  lines: PriceLine[];
  totalCents: number;
  leadDays: number;
}

const byId = <T extends { id: string }>(list: readonly T[], id: string) => list.find((item) => item.id === id);

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function sanitizeMonogram(value: string | null): string {
  return (value ?? '').replace(/[^A-Za-z0-9 '&-]/g, '').slice(0, catalog.monogram.maxLength);
}

export function priceBounds(): { minCents: number; maxCents: number } {
  const minOf = (values: number[]) => Math.min(...values);
  const maxOf = (values: number[]) => Math.max(...values);
  const base = catalog.basePriceCents;
  return {
    minCents:
      base +
      minOf(catalog.shapes.map((item) => item.priceCents)) +
      minOf(catalog.sizes.map((item) => item.priceCents)) +
      minOf(catalog.fabrics.map((item) => item.priceCents)) +
      minOf(catalog.edges.map((item) => item.priceCents)) +
      minOf(catalog.motifs.map((item) => item.priceCents)),
    maxCents:
      base +
      maxOf(catalog.shapes.map((item) => item.priceCents)) +
      maxOf(catalog.sizes.map((item) => item.priceCents)) +
      maxOf(catalog.fabrics.map((item) => item.priceCents)) +
      maxOf(catalog.edges.map((item) => item.priceCents)) +
      maxOf(catalog.motifs.map((item) => item.priceCents)) +
      catalog.monogram.priceCents,
  };
}

export function resolveSelection(source: ParamSource): Selection {
  const requestedTheme = source.get('theme');
  const theme = themes.find((item) => item.id === requestedTheme) ?? themes[0];
  const pick = (key: 'shapeId' | 'fabricId' | 'sizeId' | 'edgeId' | 'threadId' | 'motifId', list: readonly { id: string }[]) => {
    const raw = source.get(key.replace('Id', ''));
    if (raw && list.some((item) => item.id === raw)) return raw;
    return theme.preset[key];
  };

  return {
    themeId: theme.id,
    shapeId: pick('shapeId', catalog.shapes),
    fabricId: pick('fabricId', catalog.fabrics),
    sizeId: pick('sizeId', catalog.sizes),
    edgeId: pick('edgeId', catalog.edges),
    threadId: pick('threadId', catalog.threads),
    motifId: pick('motifId', catalog.motifs),
    monogram: sanitizeMonogram(source.get('monogram')),
  };
}

export function priceConfiguration(selection: Selection): Priced {
  const shape = byId(catalog.shapes, selection.shapeId) ?? catalog.shapes[0];
  const size = byId(catalog.sizes, selection.sizeId) ?? catalog.sizes[0];
  const fabric = byId(catalog.fabrics, selection.fabricId) ?? catalog.fabrics[0];
  const edge = byId(catalog.edges, selection.edgeId) ?? catalog.edges[0];
  const motif = byId(catalog.motifs, selection.motifId) ?? catalog.motifs[0];
  const lines: PriceLine[] = [{ id: 'base', label: 'Handmade bandana', amountCents: catalog.basePriceCents }];

  if (shape.priceCents) lines.push({ id: 'shape', label: shape.name, amountCents: shape.priceCents });
  if (size.priceCents) lines.push({ id: 'size', label: `Size ${size.name}`, amountCents: size.priceCents });
  if (fabric.priceCents) lines.push({ id: 'fabric', label: fabric.name, amountCents: fabric.priceCents });
  if (edge.priceCents) lines.push({ id: 'edge', label: edge.name, amountCents: edge.priceCents });
  if (motif.priceCents) lines.push({ id: 'motif', label: `${motif.name} motif`, amountCents: motif.priceCents });
  if (selection.monogram) {
    lines.push({
      id: 'monogram',
      label: `Name “${selection.monogram}”`,
      amountCents: catalog.monogram.priceCents,
    });
  }

  return {
    lines,
    totalCents: lines.reduce((sum, line) => sum + line.amountCents, 0),
    leadDays: catalog.leadDays + edge.extraDays,
  };
}

export function describeSelection(selection: Selection): string {
  const shape = byId(catalog.shapes, selection.shapeId);
  const fabric = byId(catalog.fabrics, selection.fabricId);
  const edge = byId(catalog.edges, selection.edgeId);
  const thread = byId(catalog.threads, selection.threadId);
  const motif = byId(catalog.motifs, selection.motifId);
  const motifText = motif && motif.id !== 'none' ? `, ${motif.name.toLowerCase()} motif` : '';
  const nameText = selection.monogram ? `, name ${selection.monogram}` : '';
  return `${fabric?.name ?? 'Cloth'} ${shape?.name.toLowerCase() ?? 'bandana'} with ${edge?.name.toLowerCase() ?? 'stitching'} in ${thread?.name.toLowerCase() ?? 'thread'}${motifText}${nameText}.`;
}

export function designQuery(selection: Selection): URLSearchParams {
  const params = new URLSearchParams();
  params.set('theme', selection.themeId);
  params.set('shape', selection.shapeId);
  params.set('fabric', selection.fabricId);
  params.set('size', selection.sizeId);
  params.set('edge', selection.edgeId);
  params.set('thread', selection.threadId);
  params.set('motif', selection.motifId);
  if (selection.monogram) params.set('monogram', selection.monogram);
  return params;
}

export function hasDesignQuery(source: ParamSource): boolean {
  return ['theme', 'shape', 'fabric', 'size', 'edge', 'thread', 'motif', 'monogram'].some((key) => source.get(key));
}
