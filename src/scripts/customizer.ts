import catalog from '../data/catalog.json';
import themes from '../data/themes.json';
import { describeSelection, formatMoney, priceConfiguration, resolveSelection, type ParamSource } from '../lib/pricing';

function readForm(form: HTMLFormElement): ParamSource {
  const data = new FormData(form);
  return {
    get(name: string) {
      const value = data.get(name);
      return typeof value === 'string' ? value : null;
    },
  };
}

function money(cents: number): string {
  return formatMoney(cents);
}

export function initCustomizer(): void {
  const form = document.querySelector<HTMLFormElement>('#design-form');
  if (!form) return;

  const cloth = document.querySelector<SVGPolygonElement>('#bandana-cloth');
  const pattern = document.querySelector<SVGPolygonElement>('#bandana-pattern');
  const stitch = document.querySelector<SVGPolygonElement>('#bandana-stitch');
  const title = document.querySelector('#bandana-title');
  const caption = document.querySelector('#bandana-caption');
  const monogram = document.querySelector<SVGTextElement>('#bandana-monogram');
  const motifs = document.querySelector<SVGGElement>('#motifs');
  const lines = document.querySelector('#price-lines');
  const total = document.querySelector('#price-total');
  const lead = document.querySelector('#lead-time');
  const button = document.querySelector('#continue-button');

  const applyPreset = (themeId: string) => {
    const theme = themes.find((item) => item.id === themeId);
    if (!theme) return;
    const values: Record<string, string> = {
      shape: theme.preset.shapeId,
      fabric: theme.preset.fabricId,
      size: theme.preset.sizeId,
      edge: theme.preset.edgeId,
      thread: theme.preset.threadId,
      motif: theme.preset.motifId,
    };
    Object.entries(values).forEach(([name, value]) => {
      const input = form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${value}"]`);
      if (input) input.checked = true;
    });
  };

  const render = () => {
    const selection = resolveSelection(readForm(form));
    const priced = priceConfiguration(selection);
    const shape = catalog.shapes.find((item) => item.id === selection.shapeId) ?? catalog.shapes[0];
    const fabric = catalog.fabrics.find((item) => item.id === selection.fabricId) ?? catalog.fabrics[0];
    const edge = catalog.edges.find((item) => item.id === selection.edgeId) ?? catalog.edges[0];
    const thread = catalog.threads.find((item) => item.id === selection.threadId) ?? catalog.threads[0];
    const description = describeSelection(selection);

    if (cloth && stitch) {
      cloth.setAttribute('points', shape.points);
      cloth.setAttribute('fill', fabric.hex);
      stitch.setAttribute('points', shape.points);
      stitch.setAttribute('stroke', thread.hex);
      stitch.setAttribute('stroke-width', String(edge.width));
      stitch.setAttribute('stroke-dasharray', edge.dash === '0' ? 'none' : edge.dash);
    }
    if (pattern) {
      pattern.setAttribute('points', shape.points);
      pattern.setAttribute('fill', fabric.pattern === 'dots' ? 'url(#dots)' : 'url(#gingham)');
      pattern.toggleAttribute('hidden', fabric.pattern === 'solid');
    }
    if (monogram) {
      monogram.textContent = selection.monogram;
      monogram.setAttribute('x', String(shape.text[0]));
      monogram.setAttribute('y', String(shape.text[1]));
      monogram.setAttribute('fill', thread.hex);
    }
    if (motifs) {
      motifs.setAttribute('fill', thread.hex);
      motifs.setAttribute('stroke', thread.hex);
      motifs.setAttribute('color', thread.hex);
      motifs.querySelectorAll<SVGGElement>('[data-motif]').forEach((group) => {
        group.toggleAttribute('hidden', group.dataset.motif !== selection.motifId);
      });
    }
    if (title) title.textContent = description;
    if (caption) caption.textContent = description;
    if (lines) {
      lines.replaceChildren(
        ...priced.lines.map((line) => {
          const item = document.createElement('li');
          item.className = 'flex justify-between gap-4';
          const label = document.createElement('span');
          label.textContent = line.label;
          const amount = document.createElement('span');
          amount.textContent = money(line.amountCents);
          item.append(label, amount);
          return item;
        }),
      );
    }
    if (total) total.textContent = money(priced.totalCents);
    if (lead) lead.textContent = `Ready in ${priced.leadDays} studio days after the studio confirms.`;
    if (button) button.textContent = `Continue · ${money(priced.totalCents)}`;
  };

  form.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.name === 'theme') applyPreset(target.value);
    render();
  });
  render();
}
