// Review film from the production renderer. NOT a browser recording or interaction test.
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const L = require('../scene.js');
(async () => {
  const destination = process.argv[2] || '/tmp/last-light-performance-films';
  fs.mkdirSync(destination, { recursive: true });
  const assets = {};
  for (const name of ['harbor', 'boat', 'keeper', 'lantern', 'departure', 'fishers', 'brace', 'reach', 'place', 'receive', 'surge']) {
    assets[name] = await loadImage(path.join(__dirname, '../assets/' + name + '.png'));
  }
  const width = 960, height = 540, fps = 20;
  for (const choice of ['shore', 'boat']) {
    const file = path.join(destination, choice + '-renderer-preview.mp4');
    const encoder = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pixel_format', 'rgba', '-video_size', `${width}x${height}`, '-framerate', String(fps), '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', file], { stdio: ['pipe', 'ignore', 'inherit'] });
    const completed = new Promise((resolve, reject) => {
      encoder.on('error', reject);
      encoder.on('exit', code => code === 0 ? resolve() : reject(new Error('ffmpeg exited ' + code)));
    });
    const canvas = createCanvas(width, height), context = canvas.getContext('2d');
    const s = L.create(); L.begin(s);
    for (let frame = 0; frame < 68 * fps; frame++) {
      if (frame === 22 * fps) L.choose(s, choice);
      L.step(s, 1 / fps);
      L.render(context, s, assets, { width, height });
      context.save();
      context.fillStyle = 'rgba(3, 15, 20, .55)'; context.fillRect(12, 12, 315, 27);
      context.fillStyle = '#b8cec9'; context.font = '12px sans-serif';
      context.fillText('THE LAST LIGHT · RENDERER PREVIEW', 22, 30);
      const caption = L.caption(s);
      if (caption) {
        context.font = 'italic 20px Georgia'; context.textAlign = 'center';
        context.shadowColor = '#041319'; context.shadowBlur = 12;
        context.fillStyle = '#f1e7cd'; context.fillText(caption, width / 2, height - 28);
      }
      context.restore();
      const pixels = context.getImageData(0, 0, width, height).data;
      if (!encoder.stdin.write(Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength))) await once(encoder.stdin, 'drain');
    }
    encoder.stdin.end(); await completed;
    console.log(`${choice}: ${file} (${fs.statSync(file).size} bytes). Scripted model choice, not browser input.`);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
