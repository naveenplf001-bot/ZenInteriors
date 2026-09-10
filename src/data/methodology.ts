/**
 * The Zen method.
 *
 * High-value clients are not buying interiors. They are buying certainty.
 * A named, sequenced process is what communicates that.
 */

export interface MethodStage {
  index: string;
  title: string;
  description: string;
}

export const methodStages: MethodStage[] = [
  {
    index: '01',
    title: 'Discover',
    description:
      'We begin with how you actually live. Proportion, light, routine and the way a space will be used long after handover.',
  },
  {
    index: '02',
    title: 'Design',
    description:
      'Spatial planning, material palettes and detailing developed together, so nothing is decided in isolation or resolved on site.',
  },
  {
    index: '03',
    title: 'Source',
    description:
      'Surfaces, architectural products and finishes selected from global partners, verified against the design before anything is committed.',
  },
  {
    index: '04',
    title: 'Craft',
    description:
      'Execution supervised by our own team, with joinery, stone, metal and finishing held to a single standard across every trade.',
  },
  {
    index: '05',
    title: 'Deliver',
    description:
      'A complete space, snagged, commissioned and handed over. The detail you notice last is the one we spent the longest on.',
  },
];

/**
 * The material story. Macro photography of each replaces the placeholder
 * treatment in Phase 6.
 */
export const materials = [
  { name: 'Marble', note: 'Selected slab by slab for vein, tone and continuity.' },
  { name: 'Wood', note: 'Natural grain that deepens rather than dates.' },
  { name: 'Metal', note: 'Custom brass, blackened steel and machined detail.' },
  { name: 'Fabric', note: 'Weight and texture chosen for how a room sounds and feels.' },
  { name: 'Light', note: 'Architectural lighting layered into the structure itself.' },
  { name: 'Stone', note: 'Surfaces that carry weight, temperature and permanence.' },
];
