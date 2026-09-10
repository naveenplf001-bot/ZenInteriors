/**
 * Enquiry vocabulary.
 *
 * The investment bands are positioning, not just a form field. They tell the
 * visitor the level Zen Interior operates at before they type anything.
 */

export const projectTypes = [
  'Private Residence',
  'Luxury Villa',
  'Apartment',
  'Commercial',
  'Hospitality',
  'Office',
  'Other',
] as const;

export type ProjectType = (typeof projectTypes)[number];

export const investmentBands = [
  '₹40L – ₹75L',
  '₹75L – ₹1.5Cr',
  '₹1.5Cr – ₹3Cr',
  '₹3Cr – ₹5Cr',
  '₹5Cr – ₹10Cr',
  '₹10Cr – ₹25Cr',
  '₹25Cr and above',
  'Prefer to discuss privately',
] as const;

export type InvestmentBand = (typeof investmentBands)[number];
