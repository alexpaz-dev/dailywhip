// Generates the app icons from pixel art, with no image tools: the whip
// cracking on the alert red. 32×32 art pixels, so every size is an exact
// multiple: 32 (browser tab), 192 and 512 (installed app).
// W white, G grey, K black outline, . red background.
import { mkdirSync, writeFileSync } from 'node:fs';
import { crc32, deflateSync } from 'node:zlib';

const ART = [
  '................................',
  '................................',
  '..........................W.....',
  '.......................W..W..W..',
  '........................W.W.W...',
  '.........................KKK....',
  '......................WWWKWKWWW.',
  '........................KKWK....',
  '.......................KKWKKW...',
  '......................KKWKK..W..',
  '...................KKKKWKKW.....',
  '...............KKKKKWWWKK.......',
  '..............KKWWWWKKKK........',
  '.............KKWKKKKK...........',
  '............KKWKK...............',
  '............KWWK................',
  '...........KKWKK................',
  '...........KWWK.................',
  '...........KWKK.................',
  '..........KKWK..................',
  '.........KKWWK..................',
  '........KKGWWK..................',
  '.......KKWGGKK..................',
  '......KKWWWKK...................',
  '...KKKKGWWKK....................',
  '...KWWWWGKK.....................',
  '...KWWWWKK......................',
  '...KWWWWK.......................',
  '...KWWWWK.......................',
  '...KKKKKK.......................',
  '................................',
  '................................',
];
const COLORS = { '.': [238, 0, 0], W: [255, 255, 255], G: [128, 128, 128], K: [0, 0, 0] };
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
for (const size of [32, 192, 512]) writeFileSync(`public/icons/icon-${size}.png`, png(size));
