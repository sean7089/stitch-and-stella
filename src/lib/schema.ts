import business from '../data/business.json';
import faq from '../data/faq.json';
import neighborhoods from '../data/neighborhoods.json';
import { formatMoney, priceBounds } from './pricing';

type Node = Record<string, unknown>;

export function originOf(site: URL | undefined): string {
  return (site ?? new URL(business.url)).origin;
}

export function absolute(site: URL | undefined, path: string): string {
  return new URL(path, originOf(site)).href;
}

export function localBusinessNode(site: URL | undefined): Node {
  const bounds = priceBounds();
  return {
    '@type': 'LocalBusiness',
    '@id': absolute(site, '/#business'),
    name: business.name,
    description: business.description,
    url: absolute(site, '/'),
    email: business.email,
    image: absolute(site, business.image),
    logo: absolute(site, business.logo),
    priceRange: `${formatMoney(bounds.minCents)}–${formatMoney(bounds.maxCents)}`,
    currenciesAccepted: 'USD',
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.city.name,
      addressRegion: business.city.region,
      addressCountry: business.city.country,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Houston',
        sameAs: [business.city.wikidata, business.city.wikipedia],
      },
      ...neighborhoods.map((item) => ({
        '@type': 'AdministrativeArea',
        name: `${item.name}, Houston, Texas`,
        sameAs: [item.wikidata, item.wikipedia],
        ...(item.geo
          ? { geo: { '@type': 'GeoCoordinates', latitude: item.geo.lat, longitude: item.geo.lng } }
          : {}),
      })),
    ],
    openingHoursSpecification: neighborhoods.map((item) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: item.handoff.dayOfWeek,
      opens: item.handoff.opens,
      closes: item.handoff.closes,
      description: item.handoff.label,
    })),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: business.email,
      areaServed: 'US-TX',
      availableLanguage: 'English',
    },
    makesOffer: {
      '@type': 'Offer',
      url: absolute(site, '/customize'),
      priceCurrency: 'USD',
      price: (bounds.minCents / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: (bounds.minCents / 100).toFixed(2),
        maxPrice: (bounds.maxCents / 100).toFixed(2),
        priceCurrency: 'USD',
      },
    },
  };
}

export function websiteNode(site: URL | undefined): Node {
  return {
    '@type': 'WebSite',
    '@id': absolute(site, '/#website'),
    name: business.name,
    url: absolute(site, '/'),
    description: business.description,
    publisher: { '@id': absolute(site, '/#business') },
    inLanguage: 'en-US',
  };
}

export function graph(site: URL | undefined, extra: Node[] = []): Node {
  return {
    '@context': 'https://schema.org',
    '@graph': [localBusinessNode(site), websiteNode(site), ...extra],
  };
}

export function breadcrumb(site: URL | undefined, items: { name: string; path: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(site, item.path),
    })),
  };
}

export function faqNode(): Node {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.join(' '),
      },
    })),
  };
}

export function productNode(site: URL | undefined): Node {
  const bounds = priceBounds();
  return {
    '@type': 'Product',
    '@id': absolute(site, '/customize#bandana'),
    name: 'Custom dog bandana',
    description: 'A made-to-order cotton or linen dog bandana. The cloth, edge stitch, thread, motif, and name are chosen on the design page.',
    brand: { '@type': 'Brand', name: business.name },
    category: 'Dog bandana',
    image: absolute(site, business.image),
    offers: {
      '@type': 'Offer',
      url: absolute(site, '/customize'),
      priceCurrency: 'USD',
      price: (bounds.minCents / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: (bounds.minCents / 100).toFixed(2),
        maxPrice: (bounds.maxCents / 100).toFixed(2),
        priceCurrency: 'USD',
      },
    },
  };
}
