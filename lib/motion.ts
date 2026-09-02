'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

export { gsap, ScrollTrigger, ScrollSmoother };

/** Easing vocabulary for the whole site so motion feels consistent. */
export const EASE = {
  cine: 'expo.out',
  soft: 'power3.out',
  inout: 'power2.inOut',
} as const;
