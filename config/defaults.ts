export interface LetterConfig {
  title: string;
  dateFormat: Intl.DateTimeFormatOptions;
  locale: string;
  name: string;
  street: string;
  city: string;
  country?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  website?: string;
  bank?: string | false;
  iban?: string;
  bic?: string;
  vatId?: string;
  taxId?: string;
  closing: string;
  signatureEmail?: string;
  signature?: string;
  placeholders: {
    address: string;
    subject: string;
    text: string;
  };
  labels: {
    phone: string;
    mobile: string;
    email: string;
    website: string;
    bank: string;
    iban: string;
    bic: string;
    vatId: string;
    taxId: string;
  };
}

export const defaultConfig: LetterConfig = {
  title: 'Letter',
  dateFormat: { day: '2-digit', month: 'long', year: 'numeric' },
  locale: 'en-US',
  name: 'Dan',
  street: 'Infinite Loop 12',
  city: '34512 Examplia',
  country: 'Germany',
  phone: '+49 1234 349192',
  mobile: '+49 0171 12761878',
  email: 'john@doe.com',
  website: 'doe.com',
  bank: 'GLS',
  iban: 'DE 1283 1982 9182 91',
  bic: 'GENODEM1GLS',
  vatId: 'DE 2128127981729',
  taxId: '31281/12912',
  closing: 'Talk soon,',
  signatureEmail: 'd_schmidt@coloradocollege.edu',
  placeholders: {
    address: 'Acme Corp.<br>Sesamestreet 23<br>12345 Gotham City<br>USA',
    subject: 'Subject',
    text: '<p>Dear...</p><p>Start typing to begin your letter. This placeholder text will disappear when you type your first character.</p><p>Note: There is no backspace here. If you make a mistake, select the text and use the scribble tool to cross it out, just like a real handwritten letter.</p>',
  },
  labels: {
    phone: 'Phone',
    mobile: 'Mobile',
    email: 'Email',
    website: 'Web',
    bank: 'Bank',
    iban: 'IBAN',
    bic: 'BIC',
    vatId: 'VAT-ID',
    taxId: 'TAX-ID',
  },
};

