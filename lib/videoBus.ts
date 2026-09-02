/**
 * Tiny registry so the single hero <video> decoder can also feed the
 * site-wide ambient background canvas (no second decode).
 */
let el: HTMLVideoElement | null = null;

export const videoBus = {
  set(v: HTMLVideoElement | null) {
    el = v;
  },
  get(): HTMLVideoElement | null {
    return el;
  },
};
