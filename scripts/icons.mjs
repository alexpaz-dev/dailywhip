// Generates the PWA icons from a pixel matrix, with no image tools.
// Placeholder until the final icon (F7).
import { mkdirSync, writeFileSync } from 'node:fs';
import { crc32, deflateSync } from 'node:zlib';

const ART = [
  '................',
  '................',
  '................',
  '.RR..........RR.',
  '.RR..........RR.',
  '.RR..........RR.',
  '.RR....RR....RR.',
  '.RR....RR....RR.',
  '.RR...RRRR...RR.',
  '.RR..RR..RR..RR.',
  '.RR.RR....RR.RR.',
  '.RRRR......RRRR.',
  '.RRR........RRR.',
  '................',
  '................',
  '................',
];
const COLORS = { '.': [0, 0, 0], R: [255, 0, 0] };
const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function png(size) {
  const scale = size / ART.length;
  const stride = 1 + size * 3; // filter byte + RGB pixels
  const raw = Buffer.alloc(stride * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const color = COLORS[ART[Math.floor(y / scale)][Math.floor(x / scale)]];
      raw.set(color, y * stride + 1 + x * 3);
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // truecolor RGB
  return Buffer.concat([
    SIGNATURE,
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public/icons', { recursive: true });
for (const size of [192, 512]) writeFileSync(`public/icons/icon-${size}.png`, png(size));
