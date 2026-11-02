import { describeSelection, formatMoney, hasDesignQuery, priceConfiguration, resolveSelection } from '../lib/pricing';
import {
  fulfillmentChoices,
  isHoneypotTripped,
  mailtoHref,
  neighborhoodChoices,
  readCustomer,
  ticketId,
  ticketText,
} from '../lib/ticket';

const params = () => new URLSearchParams(window.location.search);

function show(id: string, visible: boolean) {
  document.getElementById(id)?.toggleAttribute('hidden', !visible);
}

function setText(id: string, text: string) {
  const node = document.getElementById(id);
  if (node) node.textContent = text;
}

export function initTicket(): void {
  const source = params();
  const form = document.querySelector<HTMLFormElement>('#ticket-form');
  if (!form) return;

  ['theme', 'shape', 'fabric', 'size', 'edge', 'thread', 'motif', 'monogram'].forEach((key) => {
    const input = form.querySelector<HTMLInputElement>(`input[name="${key}"]`);
    if (input && source.get(key)) input.value = source.get(key) ?? '';
  });

  const name = form.querySelector<HTMLInputElement>('#name');
  const email = form.querySelector<HTMLInputElement>('#email');
  const dog = form.querySelector<HTMLInputElement>('#dog');
  const note = form.querySelector<HTMLTextAreaElement>('#note');
  const neighborhood = form.querySelector<HTMLSelectElement>('#neighborhood');
  const fulfillment = form.querySelector<HTMLSelectElement>('#fulfillment');
  if (name && source.get('name')) name.value = source.get('name') ?? '';
  if (email && source.get('email')) email.value = source.get('email') ?? '';
  if (dog && source.get('dog')) dog.value = source.get('dog') ?? '';
  if (note && source.get('note')) note.value = source.get('note') ?? '';
  if (neighborhood && neighborhoodChoices.some((item) => item.id === source.get('neighborhood'))) {
    neighborhood.value = source.get('neighborhood') ?? '';
  }
  if (fulfillment && fulfillmentChoices.some((item) => item.id === source.get('fulfillment'))) {
    fulfillment.value = source.get('fulfillment') ?? '';
  }

  const designed = hasDesignQuery(source);
  const selection = designed ? resolveSelection(source) : null;
  const priced = selection ? priceConfiguration(selection) : null;
  if (selection && priced) {
    setText('ticket-heading', 'Send this stitch');
    setText(
      'ticket-intro',
      `${describeSelection(selection)} The total is ${formatMoney(priced.totalCents)}, ready in ${priced.leadDays} studio days after the studio confirms.`,
    );
    if (dog && !dog.value && selection.monogram) dog.value = selection.monogram;
  }

  if (isHoneypotTripped(source)) {
    show('ticket-form-wrap', false);
    show('ticket-bot', true);
    return;
  }

  if (source.get('ticket') !== '1') return;

  const { customer, errors } = readCustomer(source);
  const messages = Object.values(errors);
  if (messages.length) {
    const alert = document.getElementById('ticket-alert');
    if (alert) {
      alert.hidden = false;
      alert.textContent = messages.join(' ');
    }
    return;
  }

  const id = ticketId(source.toString());
  const body =
    selection && priced
      ? ticketText(selection, priced, customer, id)
      : [`NOTE ${id}`, `Name: ${customer.name}`, `Email: ${customer.email}`, `Neighborhood: ${customer.neighborhoodId}`, `Fulfillment: ${customer.fulfillmentId}`, `Note: ${customer.note || 'none'}`].join('\n');
  setText('ticket-id', id);
  setText('ticket-body', body);
  if (selection && priced) {
    setText(
      'ticket-lead',
      `${describeSelection(selection)} ${formatMoney(priced.totalCents)}. Ready in ${priced.leadDays} studio days after that reply.`,
    );
  } else {
    setText('ticket-lead', 'This note does not include a bandana yet. Design one if you want a price.');
  }
  const mail = document.querySelector<HTMLAnchorElement>('#ticket-mail');
  if (mail) mail.href = mailtoHref(selection ? `Stitch ticket ${id}` : `Note ${id}`, body);
  show('ticket-form-wrap', false);
  show('ticket-ready', true);
}
