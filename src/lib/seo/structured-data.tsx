/**
 * Structured Data Components for DigiSence
 * Implements Schema.org JSON-LD for SEO
 * Returns JSON-LD as string for proper rendering in Next.js
 */

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mydigisence.com';

/**
 * Organization Schema - For the DigiSence platform
 */
export function generateOrganizationSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DigiSence',
    description: "India's leading global digital presence platform for businesses and professionals",
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      email: 'hello@digisence.com',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://facebook.com/digisence',
      'https://twitter.com/digisence',
      'https://instagram.com/digisence',
      'https://linkedin.com/company/digisence',
    ],
    founder: {
      '@type': 'Person',
      name: 'Digiconn Unite Pvt Ltd',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'India',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    serviceType: [
      'Digital Presence Platform',
      'Business Directory',
      'Professional Networking',
      'Business Profile Management',
      'Professional Profile Management',
    ],
  };
  return JSON.stringify(schema);
}

/**
 * WebSite Schema - For the main website
 */
export function generateWebSiteSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DigiSence',
    url: baseUrl,
    description: "India's leading global digital presence platform for businesses and professionals",
    publisher: {
      '@type': 'Organization',
      name: 'Digiconn Unite Pvt Ltd',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/businesses?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
  return JSON.stringify(schema);
}

/**
 * WebSite Schema for Businesses page
 */
export function generateBusinessDirectorySchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Business Directory - DigiSence',
    url: `${baseUrl}/businesses`,
    description: 'Discover top businesses and service providers on DigiSence. Browse local companies, explore products and services.',
    publisher: {
      '@type': 'Organization',
      name: 'Digiconn Unite Pvt Ltd',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/businesses?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
  return JSON.stringify(schema);
}

/**
 * WebSite Schema for Professionals page
 */
export function generateProfessionalDirectorySchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Professional Directory - DigiSence',
    url: `${baseUrl}/professionals`,
    description: 'Discover skilled professionals and experts on DigiSence. Find doctors, lawyers, developers, designers, and more.',
    publisher: {
      '@type': 'Organization',
      name: 'Digiconn Unite Pvt Ltd',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/professionals?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
  return JSON.stringify(schema);
}

/**
 * LocalBusiness Schema for a specific business
 */
export interface BusinessSchemaParams {
  name: string;
  description: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  priceRange?: string;
  openingHours?: string[];
  rating?: number;
  reviewCount?: number;
}

export function generateBusinessSchema(business: BusinessSchemaParams): string {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
  };

  if (business.logo) schema.image = business.logo;
  if (business.address) schema.address = { '@type': 'PostalAddress', streetAddress: business.address };
  if (business.phone) schema.telephone = business.phone;
  if (business.email) schema.email = business.email;
  if (business.website) schema.url = business.website;
  if (business.priceRange) schema.priceRange = business.priceRange;
  if (business.openingHours) schema.openingHours = business.openingHours;
  
  if (business.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: business.reviewCount || 0,
    };
  }

  schema.publisher = {
    '@type': 'Organization',
    name: 'Digiconn Unite Pvt Ltd',
  };

  return JSON.stringify(schema);
}

/**
 * Person Schema for a specific professional
 */
export interface ProfessionalSchemaParams {
  name: string;
  jobTitle?: string;
  description: string;
  image?: string;
  email?: string;
  phone?: string;
  address?: string;
  url?: string;
  sameAs?: string[];
}

export function generateProfessionalSchema(professional: ProfessionalSchemaParams): string {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: professional.name,
    description: professional.description,
  };

  if (professional.jobTitle) schema.jobTitle = professional.jobTitle;
  if (professional.image) schema.image = professional.image;
  if (professional.email) schema.email = professional.email;
  if (professional.phone) schema.telephone = professional.phone;
  if (professional.address) schema.address = { '@type': 'PostalAddress', addressLocality: professional.address };
  if (professional.url) schema.url = professional.url;
  if (professional.sameAs) schema.sameAs = professional.sameAs;

  schema.publisher = {
    '@type': 'Organization',
    name: 'Digiconn Unite Pvt Ltd',
  };

  return JSON.stringify(schema);
}

/**
 * ContactPage Schema
 */
export function generateContactPageSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact DigiSence',
    description: 'Get in touch with DigiSence for support, inquiries, or partnership opportunities.',
    url: `${baseUrl}/contact`,
    publisher: {
      '@type': 'Organization',
      name: 'Digiconn Unite Pvt Ltd',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      email: 'hello@digisence.com',
      availableLanguage: ['English', 'Hindi'],
      areaServed: {
        '@type': 'Place',
        name: 'Worldwide',
      },
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    },
  };
  return JSON.stringify(schema);
}

/**
 * Product Schema for Pricing
 */
export function generatePricingSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'DigiSence Pricing Plans',
    description: 'View DigiSence pricing plans for businesses and professionals.',
    url: `${baseUrl}/pricing`,
    publisher: {
      '@type': 'Organization',
      name: 'Digiconn Unite Pvt Ltd',
    },
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Basic Plan',
        description: 'Essential features for getting started with digital presence',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Professional Plan',
        description: 'Advanced features for professionals to grow their presence',
        price: '29',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Business Plan',
        description: 'Complete solution for businesses to manage their digital presence',
        price: '49',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Enterprise Plan',
        description: 'Custom solution for large organizations',
        price: '99',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    ],
  };
  return JSON.stringify(schema);
}

/**
 * FAQ Schema
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: 'Frequently Asked Questions - DigiSence',
    publisher: {
      '@type': 'Organization',
      name: 'Digiconn Unite Pvt Ltd',
    },
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  return JSON.stringify(schema);
}

/**
 * Component to render JSON-LD script
 */
export interface JsonLdProps {
  schema: string;
}

export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schema }}
    />
  );
}
