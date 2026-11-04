"""Build registered anthology-v1 episodes without installing tools or using the network."""
from pathlib import Path
import json,re,subprocess,sys
ROOT=Path(__file__).resolve().parent
registry=json.loads((ROOT/'registry.json').read_text())
for episode in registry['episodes']:
    if episode.get('adapter')!='anthology-v1' or episode.get('status') not in ('playable-prototype','existing-playable'):
        continue
    id=episode['id']
    if not re.fullmatch(r'[a-z][a-z0-9-]*',id):raise ValueError('Invalid episode ID')
    builder=ROOT/'build.py' if id=='scope' else ROOT/'episodes'/id/'build.py'
    if not builder.is_file():raise FileNotFoundError('Registered episode lacks builder: '+id)
    subprocess.run([sys.executable,str(builder)],check=True)
