(function(){
  'use strict';
  const L=window.LastLight,$=id=>document.getElementById(id),s=L.create(),canvas=$('scene'),ctx=canvas.getContext('2d'),assets={
  }
  ;
  const motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
  s.reduced=motionQuery.matches;
  let loaded=false,loading=0,last=0,captions=true,dragPointer=null,oldPhase='',oldCaption='',helpPaused=false,returnFocus=null;
  const audio={
    on:false,ctx:null,nodes:[],tones:new Set(),chain:Promise.resolve(),desired:false,
    init(){
      if(this.ctx)return;
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return;
      try{
        const c=this.ctx=new AC(),gain=c.createGain(),filter=c.createBiquadFilter(),src=c.createBufferSource(),buf=c.createBuffer(1,c.sampleRate*4,c.sampleRate),d=buf.getChannelData(0);
        let seed=71,v=0;
        for(let i=0;
        i<d.length;
        i++){
          seed=(seed*16807)%2147483647;
          v=.985*v+.015*(seed/2147483647*2-1);
          d[i]=v*4;
        }
        src.buffer=buf;
        src.loop=true;
        filter.type='lowpass';
        filter.frequency.value=420;
        gain.gain.value=.2;
        src.connect(filter).connect(gain).connect(c.destination);
        src.start();
        this.nodes=[src,filter,gain];
      }
      catch{
        this.ctx=null;
        this.on=false;
      }
    }
    ,
    sync(){
      this.desired=this.on&&!s.paused&&!document.hidden&&s.phase!=='title'&&s.phase!=='ended';
      if(!this.ctx)return;
      this.chain=this.chain.catch(()=>{
      }
      ).then(async()=>{
        const c=this.ctx,want=this.desired;
        if(want&&c.state==='suspended')await c.resume();
        if(!want&&c.state==='running')await c.suspend();
      }
      ).catch(()=>{
        this.on=false;
        this.desired=false;
        $('sound').textContent='Sound unavailable';
        $('sound').setAttribute('aria-pressed','false');
      }
      );
    }
    ,
    stopTones(){
      for(const n of this.tones){
        try{
          n.stop();
        }
        catch{
        }
      }
      this.tones.clear();
    }
    ,
    chime(choice){
      if(!this.on||!this.ctx||s.paused)return;
      this.stopTones();
      const c=this.ctx;
      [220,329.63,440].forEach((f,i)=>{
        const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+i*.4;
        o.type='sine';
        o.frequency.value=f;
        g.gain.setValueAtTime(0,t);
        g.gain.linearRampToValueAtTime(.035,t+.08);
        g.gain.exponentialRampToValueAtTime(.0001,t+2.9);
        o.connect(g).connect(c.destination);
        o.start(t);
        o.stop(t+3);
        this.tones.add(o);
        o.onended=()=>{
          o.disconnect();
          g.disconnect();
          this.tones.delete(o);
        }
        ;
      }
      );
    }
  }
  ;
  function announce(text){
    if(text)$('narration').textContent=text;
  }
  function draw(){
    L.render(ctx,s,assets);
  }
  function sync(){
    const phase=s.phase,choice=phase==='choice';
    $('opening').hidden=phase!=='title';
    $('choices').hidden=!choice||s.paused;
    $('ending').hidden=phase!=='ended';
    $('paused').hidden=!s.paused;
    $('pause').disabled=phase==='title'||phase==='ended';
    $('pause').textContent=s.paused?'Continue':'Pause';
    $('pause').setAttribute('aria-label',s.paused?'Continue story':'Pause story');
    $('motion').setAttribute('aria-pressed',String(s.reduced));
    $('caption').hidden=!captions;
    $('lamp').setAttribute('aria-pressed',String(!!s.drag));
    const text=L.caption(s);
    if(text!==oldCaption){
      oldCaption=text;
      $('caption').textContent=text;
      if(text)announce(text);
    }
    if(phase!==oldPhase){
      oldPhase=phase;
      if(phase==='arrival')announce('The harbor beacon is out. A traveler approaches through rough water. A surge hits the jetty and the keeper braces, protecting the lantern.');
      if(phase==='choice')announce('The boat waits beside the keeper. Choose: keep the light on the shore, or give it to the traveler. You may use either button.');
      if(phase==='departure')announce(s.choice==='shore'?'The keeper sets the lantern on the jetty. The traveler leaves.':'The keeper hands the lantern to the traveler. Its light leaves with the boat.');
      if(phase==='ended'){
        announce((s.choice==='shore'?'The light remains on shore. Another distant boat finds it.':'The light travels with her across the dark water.')+' The story has ended. Return to the shore to play again.');
        $('replay').focus({
          preventScroll:true
        }
        );
        audio.stopTones();
        audio.sync();
      }
    }
  }
  function setPaused(value){
    if(s.phase==='title'||s.phase==='ended')return;
    s.paused=value;
    L.cancel(s);
    dragPointer=null;
    audio.stopTones();
    audio.sync();
    sync();
    draw();
  }
  function choose(which){
    if(L.choose(s,which)){
      audio.chime(which);
      sync();
      $('pause').focus({
        preventScroll:true
      }
      );
      draw();
    }
  }
  function begin(){
    if(!loaded)return;
    if(L.begin(s)){
      oldCaption='';
      audio.stopTones();
      audio.sync();
      last=performance.now();
      sync();
      $('pause').focus({
        preventScroll:true
      }
      );
      draw();
    }
  }
  function loadImage(src){
    return new Promise((resolve,reject)=>{
      const image=new Image(),timer=setTimeout(()=>{
        image.onload=image.onerror=null;
        reject(new Error('Image load timed out'));
      }
      ,15000);
      image.onload=async()=>{
        try{
          if(!image.naturalWidth)throw new Error('Empty image');
          if(image.decode)await image.decode();
          clearTimeout(timer);
          resolve(image);
        }
        catch(e){
          clearTimeout(timer);
          reject(e);
        }
      }
      ;
      image.onerror=()=>{
        clearTimeout(timer);
        reject(new Error('Missing image: '+src));
      }
      ;
      image.src=src;
    }
    );
  }
  async function load(){
    const epoch=++loading;
    loaded=false;
    $('begin').disabled=true;
    $('begin').textContent='Lighting the harbor…';
    $('load-error').hidden=true;
    try{
      const pairs=await Promise.all(['harbor','boat','keeper','lantern','departure','fishers','brace','reach','place','receive','surge'].map(async key=>[key,await loadImage('assets/'+key+'.png')]));
      if(epoch!==loading)return;
      Object.assign(assets,Object.fromEntries(pairs));
      loaded=true;
      $('begin').disabled=false;
      $('begin').textContent='Step into the rain';
      draw();
    }
    catch(e){
      if(epoch!==loading)return;
      $('begin').hidden=true;
      $('load-error').hidden=false;
      announce('The artwork could not load. Use Try again.');
      console.error(e);
    }
  }
  function point(e){
    const r=canvas.getBoundingClientRect(),scale=Math.min(r.width/L.W,r.height/L.H),x=r.left+(r.width-L.W*scale)/2,y=r.top+(r.height-L.H*scale)/2;
    return L.unproject(s,(e.clientX-x)/scale,(e.clientY-y)/scale);
  }
  $('stage').addEventListener('pointerdown',e=>{
    if(e.button!==0||dragPointer!==null)return;
    const button=e.target.closest('button');
    if(button&&button.id!=='lamp')return;
    const p=point(e);
    if(L.pickup(s,p.x,p.y)){
      dragPointer=e.pointerId;
      $('stage').setPointerCapture(e.pointerId);
      e.preventDefault();
      draw();
    }
  }
  );
  $('stage').addEventListener('pointermove',e=>{
    if(dragPointer!==null&&e.pointerId!==dragPointer)return;
    const p=point(e);
    L.move(s,p.x,p.y);
    if(s.paused)return;
    draw();
  }
  );
  $('stage').addEventListener('pointerup',e=>{
    if(e.pointerId!==dragPointer)return;
    const p=point(e),target=L.hit(p.x,p.y);
    L.cancel(s);
    dragPointer=null;
    if($('stage').hasPointerCapture(e.pointerId))$('stage').releasePointerCapture(e.pointerId);
    if(target)choose(target);
    else draw();
    e.preventDefault();
  }
  );
  $('stage').addEventListener('pointercancel',e=>{
    if(dragPointer!==null&&e.pointerId!==dragPointer)return;
    L.cancel(s);
    dragPointer=null;
    draw();
  }
  );
  $('stage').addEventListener('lostpointercapture',()=>{
    if(dragPointer!==null){
      L.cancel(s);
      dragPointer=null;
      draw();
    }
  }
  );
  $('stage').addEventListener('pointerleave',()=>{
    if(!s.drag){
      s.pointer.active=false;
      s.hover=null;
    }
  }
  );
  for(const key of ['shore','boat']){
    $(key).addEventListener('click',()=>choose(key));
    $(key).addEventListener('focus',()=>{
      s.hover=key;
      draw();
    }
    );
    $(key).addEventListener('blur',()=>{
      s.hover=null;
      draw();
    }
    );
  }
  // Optional keyboard manipulation gives the same physical toy as touch, never an extra gate.
  $('lamp').addEventListener('click', e => {
    if (e.detail > 0 || s.paused || s.phase !== 'choice') return;
    if (!s.drag) {
      L.pickup(s,s.light.x,s.light.y);
      announce('Lantern lifted. Use arrow keys to carry it, Enter to place it, or Escape to return it. The shore and traveler buttons also work directly.');
    } else {
      const destination=L.hit(s.drag.x,s.drag.y);
      if(destination) choose(destination);
      else { L.cancel(s); announce('Lantern returned to the keeper.'); }
    }
    sync(); draw();
  });
  $('begin').addEventListener('click',begin);
  $('replay').addEventListener('click',begin);
  $('retry').addEventListener('click',()=>{
    $('begin').hidden=false;
    load();
  }
  );
  $('pause').addEventListener('click',()=>setPaused(!s.paused));
  $('resume').addEventListener('click',()=>{
    setPaused(false);
    $('pause').focus({
      preventScroll:true
    }
    );
  }
  );
  $('sound').addEventListener('click',()=>{
    audio.on=!audio.on;
    if(audio.on)audio.init();
    audio.stopTones();
    audio.sync();
    $('sound').textContent=audio.on?'Sound on':'Sound off';
    $('sound').setAttribute('aria-pressed',String(audio.on));
  }
  );
  $('captions').addEventListener('click',()=>{
    captions=!captions;
    $('captions').textContent=captions?'Captions on':'Captions off';
    $('captions').setAttribute('aria-pressed',String(captions));
    sync();
  }
  );
  $('motion').addEventListener('click',()=>{
    s.reduced=!s.reduced;
    sync();
    draw();
  }
  );
  motionQuery.addEventListener?.('change',e=>{
    s.reduced=e.matches;
    sync();
    draw();
  }
  );
  function closeHelp(){
    if($('instructions').hidden)return;
    $('instructions').hidden=true;
    $('stage').inert=false;
    $('tools').inert=false;
    $('help').setAttribute('aria-expanded','false');
    if(!helpPaused&&s.paused)setPaused(false);
    returnFocus?.focus({
      preventScroll:true
    }
    );
  }
  $('help').addEventListener('click',()=>{
    if(!$('instructions').hidden){
      closeHelp();
      return;
    }
    returnFocus=document.activeElement;
    helpPaused=s.paused;
    setPaused(true);
    $('instructions').hidden=false;
    $('stage').inert=true;
    $('tools').inert=true;
    $('help').setAttribute('aria-expanded','true');
    $('close-help').focus({
      preventScroll:true
    }
    );
  }
  );
  $('close-help').addEventListener('click',closeHelp);
  document.addEventListener('keydown',e=>{
    if(e.key==='Tab'&&!$('instructions').hidden){
      e.preventDefault();
      $('close-help').focus({
        preventScroll:true
      }
      );
      return;
    }
    if(e.target.id==='lamp'&&s.drag&&!s.paused&&s.phase==='choice'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
      e.preventDefault();
      const before=s.hover,dx=e.key==='ArrowLeft'?-45:e.key==='ArrowRight'?45:0,dy=e.key==='ArrowUp'?-35:e.key==='ArrowDown'?35:0;
      L.move(s,s.drag.x+dx,s.drag.y+dy);
      if(s.hover&&s.hover!==before)announce(s.hover==='shore'?'Over the shore. Enter places the light.':'Over the traveler. Enter gives the light.');
      draw(); return;
    }
    if(e.key==='Escape'){
      const carrying=!!s.drag;
      L.cancel(s);
      if(carrying)announce('Lantern returned to the keeper.');
      dragPointer=null;
      if(!$('instructions').hidden)closeHelp();
      else if(s.paused)setPaused(false);
      draw();
    }
    if(e.code==='Space'&&!['BUTTON','INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)&&$('instructions').hidden){
      e.preventDefault();
      setPaused(!s.paused);
    }
  }
  );
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      if(!$('instructions').hidden)helpPaused=true;
      setPaused(true);
      audio.sync();
    }
  }
  );
  window.addEventListener('pagehide',()=>{
    if(!$('instructions').hidden)helpPaused=true;
    setPaused(true);
    audio.stopTones();
    audio.desired=false;
    if(audio.ctx)audio.chain=audio.chain.catch(()=>{
    }
    ).then(()=>audio.ctx.suspend()).catch(()=>{
    }
    );
  }
  );
  window.addEventListener('pageshow',()=>{
    last=performance.now();
    if(s.phase==='title'||s.phase==='ended')s.paused=false;
    sync();
    draw();
    audio.sync();
  }
  );
  function frame(now){
    const dt=last?Math.min((now-last)/1000,.1):0;
    last=now;
    const phase=s.phase;
    L.step(s,dt);
    sync();
    if(!s.paused&&(phase!==s.phase||(s.phase!=='title'&&s.phase!=='ended')))draw();
    requestAnimationFrame(frame);
  }
  sync();
  load();
  requestAnimationFrame(frame);
  // Read-only inspection for automated QA. Deliberately no story-skipping or mutation hooks.
  window.LastLightInspection=Object.freeze({
    snapshot:()=>JSON.parse(JSON.stringify(s)),ready:()=>loaded,assetCount:()=>Object.keys(assets).length
  }
  );
}
)();
