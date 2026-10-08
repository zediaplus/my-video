// Render review stills: node scripts/stills.mjs 100 400 900 ...  (frames) → out/stills/
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';

const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const browserExecutable = process.env.REMOTION_BROWSER || null;
const composition = await selectComposition({ serveUrl, id: 'ZediaMapsAd', browserExecutable });
for (const frame of frames) {
  const output = `out/stills/f${String(frame).padStart(4, '0')}.jpg`;
  await renderStill({ serveUrl, composition, frame, output, imageFormat: 'jpeg', jpegQuality: 80, scale: 0.5, browserExecutable });
  console.log(output);
}
