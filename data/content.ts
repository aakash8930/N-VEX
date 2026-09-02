/**
 * Central content model for NØVEX.
 * Every string and number on the page lives here so real company data
 * (especially the TECHNICAL DATA readouts) can be swapped in one place.
 */

export const BRAND = {
  name: 'NØVEX',
  tagline: 'Advanced systems engineered for the next generation of intelligent machines.',
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const NAV: NavItem[] = [
  { label: 'PRODUCTS', href: '#capabilities' },
  { label: 'TECHNOLOGY', href: '#system' },
  { label: 'APPLICATIONS', href: '#applications' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CONTACT', href: '#contact' },
];

export interface Capability {
  id: string;
  index: string;
  title: string;
  description: string;
  meta: Array<{ k: string; v: string }>;
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'precision',
    index: '01',
    title: 'PRECISION ENGINEERING',
    description:
      'Sub-micron machining and tolerance stacking across every component. We hold geometry the way others hold opinions — absolutely.',
    meta: [
      { k: 'TOL', v: '±2.0µm' },
      { k: 'AXIS', v: '5-AX' },
      { k: 'CMM', v: 'PASS' },
    ],
  },
  {
    id: 'materials',
    index: '02',
    title: 'ADVANCED MATERIALS',
    description:
      'Aerospace-grade alloys, metal-matrix composites and thermal-stable substrates selected for strength-to-mass at the operating edge.',
    meta: [
      { k: 'ALLOY', v: 'Ti-6Al-4V' },
      { k: 'DENS', v: '4.43' },
      { k: 'CTE', v: 'LOW' },
    ],
  },
  {
    id: 'intelligent',
    index: '03',
    title: 'INTELLIGENT SYSTEMS',
    description:
      'On-edge sensing and closed-loop control. Every assembly reports its own state, so the machine reasons about itself in real time.',
    meta: [
      { k: 'LOOP', v: '1kHz' },
      { k: 'SENS', v: '32CH' },
      { k: 'AI', v: 'EDGE' },
    ],
  },
  {
    id: 'integration',
    index: '04',
    title: 'SYSTEM INTEGRATION',
    description:
      'Mechanical, electrical and software converge into a single validated package — delivered as one accountable system, not parts.',
    meta: [
      { k: 'BUS', v: 'TSN' },
      { k: 'MTBF', v: '50kH' },
      { k: 'CERT', v: 'AS9100' },
    ],
  },
];

export interface Stage {
  index: string;
  title: string;
  description: string;
}

export const PROCESS: Stage[] = [
  { index: '01', title: 'DISCOVER', description: 'Requirements, constraints and failure modes mapped before a single line is drawn.' },
  { index: '02', title: 'DESIGN', description: 'Generative and parametric modeling against real loads, not idealized ones.' },
  { index: '03', title: 'ENGINEER', description: 'Materials, machining and assembly resolved to production intent.' },
  { index: '04', title: 'VALIDATE', description: 'Physical and digital twins tested past the edge of the envelope.' },
  { index: '05', title: 'DEPLOY', description: 'Fielded with telemetry so the system keeps proving itself in service.' },
];

export interface Application {
  index: string;
  title: string;
  tag: string;
  spec: string;
}

export const APPLICATIONS: Application[] = [
  { index: '01', title: 'AEROSPACE', tag: 'FLIGHT-CRITICAL', spec: 'STRUCT / ACTUATION' },
  { index: '02', title: 'ROBOTICS', tag: 'HIGH-DYNAMIC', spec: 'JOINTS / DRIVES' },
  { index: '03', title: 'AUTOMOTIVE', tag: 'PERFORMANCE', spec: 'POWERTRAIN / EV' },
  { index: '04', title: 'DEFENSE', tag: 'RUGGEDIZED', spec: 'PLATFORMS / UAS' },
  { index: '05', title: 'ADVANCED MANUFACTURING', tag: 'PRECISION', spec: 'TOOLING / METROLOGY' },
];

export interface TechStat {
  id: string;
  value: number;
  decimals: number;
  prefix: string;
  suffix: string;
  label: string;
  note: string;
  animate: boolean;
}

export const TECH_DATA: TechStat[] = [
  { id: 'precision', value: 99.9, decimals: 1, prefix: '', suffix: '%', label: 'PRECISION', note: 'REPEATABLE ACCURACY', animate: true },
  { id: 'intelligence', value: 24, decimals: 0, prefix: '', suffix: '/7', label: 'SYSTEM INTELLIGENCE', note: 'ALWAYS-ON TELEMETRY', animate: false },
  { id: 'response', value: 1, decimals: 0, prefix: '<', suffix: 'ms', label: 'RESPONSE', note: 'EDGE CONTROL LOOP', animate: false },
  { id: 'engineered', value: 100, decimals: 0, prefix: '', suffix: '%', label: 'ENGINEERED', note: 'NO OFF-THE-SHELF CORE', animate: true },
];

export const FOOTER_COLUMNS = [
  {
    title: 'TECHNOLOGY',
    links: ['Precision Engineering', 'Advanced Materials', 'Intelligent Systems', 'System Integration'],
  },
  {
    title: 'APPLICATIONS',
    links: ['Aerospace', 'Robotics', 'Automotive', 'Defense'],
  },
  {
    title: 'COMPANY',
    links: ['About', 'Process', 'Careers', 'News'],
  },
  {
    title: 'CONTACT',
    links: ['Start a Project', 'hello@novex.systems', '+00 000 000 000', 'Press Kit'],
  },
];

export const COORDS = {
  lat: '28.4197° N',
  lon: '76.3126° E',
  build: 'NVX-2026.09',
} as const;
