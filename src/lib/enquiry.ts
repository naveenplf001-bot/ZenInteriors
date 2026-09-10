import { projectTypes, investmentBands } from '@data/enquiry';
import type { ProjectType, InvestmentBand } from '@data/enquiry';

/**
 * The enquiry contract.
 *
 * This shape is deliberately wider than today's needs. Right now it feeds a
 * WhatsApp deep link and a Netlify Forms capture. Later the same object posts
 * to an API that fans out to a CRM, email and analytics. The form component
 * does not change when that happens.
 */
export interface Enquiry {
  name: string;
  phone: string;
  email: string;
  location: string;
  projectType: ProjectType | '';
  investment: InvestmentBand | '';
  requirements: string;
  /** Where the enquiry originated, for later attribution. */
  source: string;
  createdAt: string;
}

export type EnquiryField = keyof Omit<Enquiry, 'source' | 'createdAt'>;

export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export function createEnquiry(partial: Partial<Enquiry> = {}): Enquiry {
  return {
    name: '',
    phone: '',
    email: '',
    location: '',
    projectType: '',
    investment: '',
    requirements: '',
    source: 'website',
    createdAt: new Date().toISOString(),
    ...partial,
  };
}

/** Digits only, so validation is not defeated by spaces, dashes or brackets. */
export function normalisePhone(input: string): string {
  return input.replace(/\D/g, '');
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validates an enquiry and returns one message per invalid field.
 * An empty object means the enquiry is safe to send.
 */
export function validateEnquiry(enquiry: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (enquiry.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }

  const digits = normalisePhone(enquiry.phone);
  if (digits.length < 10 || digits.length > 13) {
    errors.phone = 'Please enter a valid phone number.';
  }

  if (!EMAIL_PATTERN.test(enquiry.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (enquiry.location.trim().length < 2) {
    errors.location = 'Please tell us where the project is located.';
  }

  if (!enquiry.projectType || !projectTypes.includes(enquiry.projectType)) {
    errors.projectType = 'Please select a project type.';
  }

  if (!enquiry.investment || !investmentBands.includes(enquiry.investment)) {
    errors.investment = 'Please select an estimated investment range.';
  }

  if (enquiry.requirements.length > 2000) {
    errors.requirements = 'Please keep your note under 2000 characters.';
  }

  return errors;
}

export function isValid(errors: EnquiryErrors): boolean {
  return Object.keys(errors).length === 0;
}
