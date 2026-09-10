/**
 * Capabilities are stated broadly and never itemised.
 *
 * "Modular kitchen" and "false ceiling" are commodity words. They tell a
 * high-value client that Zen installs components. These six say Zen creates
 * complete environments.
 */

export interface Capability {
  index: string;
  title: string;
  description: string;
}

export const capabilities: Capability[] = [
  {
    index: '01',
    title: 'Residential Interiors',
    description:
      'Complete environments for private residences, villas and apartments, resolved from architecture through to the final detail.',
  },
  {
    index: '02',
    title: 'Bespoke Furniture',
    description:
      'Pieces designed for a specific room, proportion and material palette, then built to a specification we control.',
  },
  {
    index: '03',
    title: 'Architectural Interiors',
    description:
      'Spatial planning, joinery, surfaces and lighting treated as one composition rather than separate trades.',
  },
  {
    index: '04',
    title: 'Material Sourcing',
    description:
      'Access to global manufacturing partners for surfaces, architectural elements and finishes rarely available locally.',
  },
  {
    index: '05',
    title: 'Commercial Spaces',
    description:
      'Workplaces, hospitality and retail interiors where brand, function and finish have to hold up under daily use.',
  },
  {
    index: '06',
    title: 'Turnkey Execution',
    description:
      'One accountable team from first drawing to handover, with sequencing, quality control and site supervision in-house.',
  },
];
