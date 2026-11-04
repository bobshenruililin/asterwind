import json
from pathlib import Path
p=Path(__file__).parent

def shot(asset,ms,lines=(),camera=None,slate='',sfx='',alt=''):
 d=dict(asset=asset,ms=ms,lines=[dict(at=a,until=b,who=w,text=t) for a,b,w,t in lines],alt=alt)
 if camera:d['camera']=camera
 if slate:d['slate']=slate
 if sfx:d['sfx']=sfx
 return d
setup=[
 shot('brush',7000,[(2800,5200,'Julian','Again.')],[1,50,50,1.05,50,50],sfx='snap',alt='Julian’s brush slips beside the cracked paper rib.'),
 shot('left',9000,[(1700,7000,'Mara','The louvres catch every time it bends.')],[1.02,50,50,1.07,55,50],slate='03:14\nARCHITECTURE STUDIO',alt='Mara and Julian face the unstable pavilion.'),
 shot('offer',13000,[(1000,6800,'Mara','I cut this at midnight. It fits. We could finish, and you could sleep.'),(7900,11800,'Mara','I need something working to film at eight.')],[1,50,50,1.04,50,50],alt='Mara presents the clean spare rib across the table.'),
 shot('julian',12000,[(1000,4300,'Julian','I designed it to move.'),(5700,11000,'Julian','I know. I just… wanted to be here when it did.')],[1,50,50,1.045,50,50],alt='Julian holds his hand above the damaged rib.'),
 shot('left',9000,[(1600,5800,'Ren','We have time for one of these.')],[1.03,50,50,1,50,50],alt='The clean backup lies left; the damaged original is on the right.')]
backup=[shot('left',8000,[(500,4100,'Ren','Use the backup. Julian, get some sleep.'),(5700,7500,'Julian','Okay.')]),shot('workA',12000,[(7100,11000,'Ren','Leave his original here.')],[1,50,50,1.06,50,50],sfx='paper',alt='Ren and Mara install the spare, keeping the original on the bench.'),shot('black',1200),shot('morningA',17000,[(4000,6000,'Mara','There.'),(7100,9200,'Julian','I missed it.'),(10000,13300,'Ren','The test? We can run it again.'),(14200,16500,'Julian','Finishing it.')],[1,50,50,1.04,50,50],slate='08:00',sfx='fan',alt='The replaced rib supports the open canopy during the morning test.'),shot('payoffA',15000,[(1700,7000,'Ren',"Let’s record what happened. Both of you."),(10300,13200,'Julian','Start here.')],[1,50,50,1.03,50,50],alt='The camera includes both contributors as Julian begins explaining the original seam.')]
repair=[shot('right',8500,[(500,3300,'Ren',"Let’s splint it. Together."),(4300,7700,'Mara','Then I need you on the canopy with me.')]),shot('workB',12000,[(4200,6500,'Julian','Hold it there.'),(7700,10000,'Mara','I am.')],[1,50,50,1.06,50,50],sfx='paper',alt='Hands support the louvres as a new splint is added to the rib.'),shot('black',1200),shot('morningB',14500,[(4300,6900,'Julian','It held.'),(9100,11900,'Mara','Half of it.')],[1,50,50,1.04,50,50],slate='08:00',sfx='fan',alt='The rib survives but the crowded louvres cannot fully open.'),shot('payoffB',15000,[(1700,7000,'Ren',"Let’s record what happened. Both of you."),(10300,13200,'Julian','Start here.')],[1,50,50,1.03,50,50],alt='Both contributors face the camera as Julian begins explaining the splinted seam.')]
s=dict(cover='brush',setup=setup,backup=backup,repair=repair,decision=dict(asset='left',alt='Clean backup on the left, original pavilion on the right.',prompt='Where will you put the light?',backup=dict(label='Fit the backup',detail='Mara’s pre-cut rib',asset='left'),repair=dict(label='Repair together',detail='Julian’s original rib',asset='right')),endings={k:dict(line='The Seam',reflection='') for k in ('backup','repair')})
(p/'story.json').write_text(json.dumps(s,ensure_ascii=False,indent=2))
