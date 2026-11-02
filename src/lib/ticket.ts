import business from '../data/business.json';
import neighborhoods from '../data/neighborhoods.json';
import { describeSelection, formatMoney, type Priced, type ParamSource, type Selection } from './pricing';

export interface Customer {
  name: string;
  email: string;
  dog: string;
  neighborhoodId: string;
  fulfillmentId: string;
  note: string;
}

export const neighborhoodChoices = [
  ...neighborhoods.map((item) => ({
    id: item.id,
    label: `${item.name} (${item.zips.join(', ')})`,
  })),
  { id: 'other-houston', label: 'Somewhere else in Houston' },
];

export const fulfillmentChoices = [
  ...neighborhoods.map((item) => ({ id: item.handoff.id, label: item.handoff.label })),
  { id: 'ask', label: 'Ask the studio what is possible' },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: string | null, max: number): string {
  return (value ?? '').replace(/[\u0000-\u001F]/g, '').trim().slice(0, max);
}

export function readCustomer(source: ParamSource): { customer: Customer; errors: Record<string, string> } {
  const neighborhoodId = source.get('neighborhood') ?? '';
  const fulfillmentId = source.get('fulfillment') ?? '';
  const customer: Customer = {
    name: clean(source.get('name'), 80),
    email: clean(source.get('email'), 120),
    dog: clean(source.get('dog'), 40),
    neighborhoodId: neighborhoodChoices.some((item) => item.id === neighborhoodId) ? neighborhoodId : '',
    fulfillmentId: fulfillmentChoices.some((item) => item.id === fulfillmentId) ? fulfillmentId : '',
    note: clean(source.get('note'), 280),
  };
  const errors: Record<string, string> = {};
  if (customer.name.length < 2) errors.name = 'Add the name we should reply to.';
  if (!emailPattern.test(customer.email)) errors.email = 'Add an email the studio can answer.';
  if (!customer.neighborhoodId) errors.neighborhood = 'Choose the Heights, Garden Oaks, or somewhere else in Houston.';
  if (!customer.fulfillmentId) errors.fulfillment = 'Choose a handoff, or ask the studio.';
  return { customer, errors };
}

export function ticketId(seed: string): string {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `SS-${(hash >>> 0).toString(36).toUpperCase().padStart(6, '0').slice(0, 6)}`;
}

export function ticketText(selection: Selection, priced: Priced, customer: Customer, id: string): string {
  const neighborhood = neighborhoodChoices.find((item) => item.id === customer.neighborhoodId)?.label ?? customer.neighborhoodId;
  const fulfillment = fulfillmentChoices.find((item) => item.id === customer.fulfillmentId)?.label ?? customer.fulfillmentId;
  return [
    `STITCH TICKET ${id}`,
    describeSelection(selection),
    `Total: ${formatMoney(priced.totalCents)}`,
    `Lead time after confirmation: ${priced.leadDays} studio days`,
    `Theme: ${selection.themeId}`,
    `Fulfillment: ${fulfillment}`,
    `Neighborhood: ${neighborhood}`,
    `Dog: ${customer.dog || 'not named'}`,
    `Name: ${customer.name}`,
    `Email: ${customer.email}`,
    `Note: ${customer.note || 'none'}`,
    '',
    'Nothing is charged until the studio confirms this email.',
    `Refs: theme=${selection.themeId} shape=${selection.shapeId} fabric=${selection.fabricId} size=${selection.sizeId} edge=${selection.edgeId} thread=${selection.threadId} motif=${selection.motifId} monogram=${selection.monogram || '-'}`,
  ].join('\n');
}

export function mailtoHref(subject: string, body: string): string {
  return `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function isHoneypotTripped(source: ParamSource): boolean {
  return clean(source.get('company_website'), 80).length > 0;
}
