// @ts-check
import { defineConfig } from 'astro/config';

// Static site served from a custom domain (public/CNAME → tokenmonitor.dev),
// so the base is root. `format: 'file'` emits /how-it-works.html (not
// /how-it-works/) to preserve the existing URLs and inbound links.
export default defineConfig({
  site: 'https://tokenmonitor.dev',
  build: { format: 'file' },
  // Code blocks use `.code-block { white-space: pre }` and rely on literal
  // newlines between sibling <span>s. HTML compression collapses that
  // inter-element whitespace to a single space, merging lines — keep it off.
  compressHTML: false,
});
