"""Depth maps for painted plates with Depth Anything V2 Small (Apache-2.0, ONNX). Writes 8-bit grey PNG/WebP
depth (near = white) at the plate's size, lightly smoothed so parallax never tears thin edges.
Usage: python depth.py out_dir img1 img2 ..."""
import sys, pathlib, numpy as np, onnxruntime as ort
from PIL import Image, ImageFilter
from huggingface_hub import hf_hub_download
out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
sess = ort.InferenceSession(hf_hub_download('onnx-community/depth-anything-v2-small', 'onnx/model.onnx'), providers=['CPUExecutionProvider'])
name = sess.get_inputs()[0].name
mean, std = np.array([0.485, 0.456, 0.406]), np.array([0.229, 0.224, 0.225])
for f in sys.argv[2:]:
    im = Image.open(f).convert('RGB'); W, H = im.size
    h = 518; w = int(round(W / H * h / 14)) * 14
    x = (np.asarray(im.resize((w, h), Image.BICUBIC), dtype=np.float32) / 255 - mean) / std
    d = sess.run(None, {name: x.transpose(2, 0, 1)[None].astype(np.float32)})[0].squeeze()
    d = (d - d.min()) / (d.max() - d.min() + 1e-6)
    dm = Image.fromarray((d * 255).astype(np.uint8)).resize((W // 2, H // 2), Image.BICUBIC).filter(ImageFilter.GaussianBlur(2.2))
    p = out / (pathlib.Path(f).stem + '-depth.webp'); dm.save(p, 'WEBP', quality=88); print(p, dm.size)
