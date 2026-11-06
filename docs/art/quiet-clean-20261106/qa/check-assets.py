#!/usr/bin/env python3
"""Read-only asset dimensions, hashes, exact-pixel and local registration checks.
No generated or source image is edited by this script.
Requires Pillow, NumPy and SciPy in the QA environment, not at runtime.
"""
from pathlib import Path
from PIL import Image
import numpy as np
from scipy.signal import fftconvolve
import hashlib,json
root=Path(__file__).resolve().parents[4]
folder=Path(__file__).resolve().parents[1]
source=root/'anthology/episodes/standup/assets/reference-v1/02-turn-or-pass-decision.webp'
a=np.asarray(Image.open(source).convert('RGB'),dtype=np.float64)
patches={
 'left_face':[180,30,80,100], 'center_face':[810,10,80,90],
 'right_glasses':[1415,30,100,100], 'center_resting_hand':[780,180,90,70],
 'left_foreground_hand':[340,725,100,95], 'right_foreground_hand':[995,735,100,100],
 'wooden_token':[615,780,90,85], 'background_window':[1100,20,100,90],
 'left_map':[170,290,95,85], 'right_map':[1350,330,100,50]}
res={'source':str(source.relative_to(root)),'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'source_dimensions':list(Image.open(source).size),'method':'Integer-pixel normalized cross-correlation in +/-8px search windows over 10 preserved detail patches. Coordinates are source [x,y,width,height]. This tests local translation only; it does not prove nonrigid identity preservation. No images transformed.','takes':[]}
for p in sorted(folder.glob('quiet-clean-take-*.png')):
 b=np.asarray(Image.open(p).convert('RGB'),dtype=np.float64)
 row={'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'dimensions':list(Image.open(p).size),'native_dimensions_pass':b.shape==a.shape,'patches':{}}
 if a.shape==b.shape:
  for name,(x,y,w,h) in patches.items():
   n=8; src=a[y:y+h,x:x+w]; dst=b[y-n:y+h+n,x-n:x+w+n]
   t=src.mean(axis=2); t=t-t.mean(); d=dst.mean(axis=2)
   raw=fftconvolve(d,t[::-1,::-1],mode='valid')
   ones=np.ones(t.shape); sums=fftconvolve(d,ones,mode='valid'); sq=fftconvolve(d*d,ones,mode='valid')
   den=np.sqrt(np.maximum(sq-sums*sums/t.size,0)*np.sum(t*t))
   scores=raw/np.maximum(den,1e-12); yy,xx=np.unravel_index(scores.argmax(),scores.shape)
   same=b[y:y+h,x:x+w]; mae=float(np.abs(src-same).mean())
   row['patches'][name]={'source_xywh':[x,y,w,h],'best_shift_xy':[int(xx-n),int(yy-n)],'normalized_correlation':round(float(scores[yy,xx]),5),'unshifted_mean_absolute_channel_error_0_255':round(mae,3),'unshifted_exact_rgb_pixel_percent':round(float(np.mean(np.all(src==same,axis=2))*100),3)}
  row['maximum_patch_shift_pixels']=max(max(abs(v) for v in s['best_shift_xy']) for s in row['patches'].values())
  row['minimum_patch_correlation']=min(s['normalized_correlation'] for s in row['patches'].values())
  row['exact_preserved_pixels_pass']=all(s['unshifted_exact_rgb_pixel_percent']==100 for s in row['patches'].values())
 res['takes'].append(row)
print(json.dumps(res,indent=2))
