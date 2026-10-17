(function () {
  'use strict';
  const E = window.FoldHarbor;
  const $ = id => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const STORAGE = 'fold-harbor-free-v2';
  const directions = ['北','东','南','西'];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let saved;
  try { saved = JSON.parse(localStorage.getItem(STORAGE) || '{}'); } catch (_) { saved = {}; }
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) saved = {};
  if (!saved.completed || typeof saved.completed !== 'object' || Array.isArray(saved.completed)) saved.completed = {};
  let index = Number.isInteger(saved.current) && E.LEVELS[saved.current] ? saved.current : 0;
  let level, state, busy = false, hints = 0, hinted = null, audioContext = null, viewedChapter = 1;
  let soundOn = saved.sound === true, flightFrame = 0, flashTimer;
  let pathLayer, flightLayer;
  const svg = $('board-svg'), stage = $('board-stage');
  const CELL = 80, PAD = 22;
  const center = p => ({x: Math.max(4,Math.min(level.width*CELL+PAD*2-4,PAD+(p.x+.5)*CELL)), y: Math.max(4,Math.min(level.height*CELL+PAD*2-4,PAD+(p.y+.5)*CELL))});
  const geometry = points => points.map((p,i) => { const c = center(p); return `${i===0||p.jump?'M':'L'}${c.x} ${c.y}`; }).join(' ');
  const chapterDescriptions = {1:'熟悉折光与换相，从第一封来信开始。',2:'金色镜面保持方向，把固定与变化连成航线。',3:'穿过配对星门，探索相隔两端的出口。',4:'看准潮汐闸的开合，让三种机关协同领航。'};
  function element(tag, attrs = {}, parent, text) {
    const node = document.createElementNS(NS,tag);
    for (const [key,value] of Object.entries(attrs)) node.setAttribute(key,String(value));
    if (text !== undefined) node.textContent = text;
    if (parent) parent.append(node);
    return node;
  }
  function persist() {
    saved.current = index; saved.sound = soundOn;
    try { localStorage.setItem(STORAGE,JSON.stringify(saved)); } catch (_) {}
  }
  function say(message, kind = 'normal') {
    $('status-line').textContent = message;
    $('status-line').closest('.board-status').dataset.kind = kind;
  }
  function chime(kind) {
    if (!soundOn) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      const notes = kind === 'win' ? [523,659,784,1047] : kind === 'clear' ? [659,880] : kind === 'flip' ? [392,587] : [220];
      notes.forEach((freq,i) => {
        const oscillator = audioContext.createOscillator(), gain = audioContext.createGain(), t = audioContext.currentTime + i*.07;
        oscillator.type = 'sine'; oscillator.frequency.value = freq;
        gain.gain.setValueAtTime(0,t); gain.gain.linearRampToValueAtTime(.045,t+.015); gain.gain.exponentialRampToValueAtTime(.0001,t+.22);
        oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(t); oscillator.stop(t+.24);
      });
    } catch (_) { soundOn = false; updateSound(); }
  }
  function updateSound() {
    $('sound-btn').setAttribute('aria-pressed',String(soundOn));
    $('sound-btn').setAttribute('aria-label',soundOn ? '关闭音效' : '开启音效');
    $('sound-btn').classList.toggle('enabled',soundOn);
  }
  function closeDialog(id) { if ($(id).open) $(id).close(); }
  function updateNavigation() {
    const chapters = [...new Set(E.LEVELS.map(entry=>entry.chapter||1))];
    const tabs = $('chapter-tabs'); tabs.replaceChildren();
    for(const chapter of chapters){
      const entries=E.LEVELS.filter(entry=>(entry.chapter||1)===chapter), done=entries.filter(entry=>saved.completed[entry.id]).length;
      const button=document.createElement('button');button.type='button';button.className=`chapter-tab${chapter===viewedChapter?' active':''}`;
      button.setAttribute('role','tab');button.setAttribute('aria-selected',String(chapter===viewedChapter));
      button.setAttribute('aria-label',`${entries[0].chapterTitle||'初航群岛'}，已完成${done}/${entries.length}关`);
      const name=document.createElement('span'),progress=document.createElement('small');
      name.textContent=entries[0].chapterTitle||'初航群岛';progress.textContent=`${done} / ${entries.length}`;button.append(name,progress);
      button.addEventListener('click',()=>{viewedChapter=chapter;updateNavigation();});tabs.append(button);
    }
    const chapterLevels=E.LEVELS.filter(entry=>(entry.chapter||1)===viewedChapter);
    $('chapter-summary').textContent=`${chapterLevels[0]?.chapterTitle||'初航群岛'} · 已完成 ${chapterLevels.filter(entry=>saved.completed[entry.id]).length}/${chapterLevels.length}`;
    $('chapter-description').textContent=chapterDescriptions[viewedChapter]||'';
    const container = $('level-list'); container.replaceChildren();
    E.LEVELS.forEach((entry,i) => {
      if((entry.chapter||1)!==viewedChapter)return;
      const button = document.createElement('button'); button.type = 'button';
      button.className = `level-pill${i === index ? ' active' : ''}${saved.completed[entry.id] ? ' completed' : ''}`;
      button.setAttribute('aria-label',`第 ${i+1} 关，${entry.title}${saved.completed[entry.id] ? '，已完成' : ''}`);
      if (i === index) button.setAttribute('aria-current','step');
      const number = document.createElement('span'), name = document.createElement('span');
      number.className = 'level-index'; number.textContent = String(i+1).padStart(2,'0');
      name.className = 'level-name'; name.textContent = entry.title;
      button.append(number,name); button.disabled = busy;
      if(entry.mechanicIntro){const badge=document.createElement('small');badge.className='level-new';badge.textContent='新机关';button.append(badge);}
      button.addEventListener('click',() => { if (!busy) { closeDialog('levels-dialog'); loadLevel(i); } });
      container.append(button);
    });
  }
  function updateMechanicGuide(){
    const guide=$('mechanic-guide');guide.replaceChildren();
    const items=[];
    if(level.mirrors.some(m=>m.fixed))items.push(['fixed','╱','金色定向镜','固定方向，不随镜相翻转。']);
    if((level.portals||[]).length)items.push(['portal','◎','双生星门','同编号两端互通，传送后保持航向。']);
    if((level.gates||[]).length)items.push(['gate','A','潮汐闸','字母对应开启相位；换相即可开合。']);
    for(const [kind,symbol,title,description] of items){const item=document.createElement('div'),icon=document.createElement('span'),copy=document.createElement('div'),strong=document.createElement('strong'),text=document.createElement('span');item.className='mechanic-item';icon.className=`mechanic-icon ${kind}`;icon.textContent=symbol;copy.className='mechanic-copy';strong.textContent=title;text.textContent=description;copy.append(strong,text);item.append(icon,copy);guide.append(item);}
    guide.hidden=items.length===0;
  }
  function updateControls() {
    const won = E.isWon(state);
    $('remaining').textContent = state.remaining.length;
    $('phase-label').textContent = state.phase ? 'B 相' : 'A 相';
    $('phase-label').dataset.phase = state.phase;
    stage.dataset.phase = state.phase;
    document.body.dataset.phase = state.phase;
    if ($('moves')) $('moves').textContent = state.moves;
    const phaseChangesRoutes = E.canFlip(level,state);
    $('flip-btn').disabled = busy || !phaseChangesRoutes;
    $('flip-btn').setAttribute('aria-label',phaseChangesRoutes ? `切换镜相，当前${state.phase ? 'B' : 'A'}相，不限次数` : '本关无需换相');
    if ($('flip-note')) $('flip-note').textContent = phaseChangesRoutes ? '免费 · 不限次数' : '本关无需换相';
    for (const id of ['hint-btn','restart-btn','help-btn','levels-btn']) $(id).disabled = busy || (id === 'hint-btn' && won);
    const completed = level.ships.length - state.remaining.length;
    $('progress-fill').style.width = `${completed/level.ships.length*100}%`;
    $('progress-fill').parentElement.setAttribute('aria-label',`已离港 ${completed} / ${level.ships.length} 艘`);
    if ($('progress-value')) $('progress-value').textContent = `${completed} / ${level.ships.length}`;
    stage.setAttribute('aria-busy',String(busy));
    for (const node of svg.querySelectorAll('.ship')) node.setAttribute('tabindex',busy ? '-1' : '0');
    updateNavigation();
  }
  function drawShip(group,color) {
    element('path',{d:'M0 -26 Q2 -27 5 -21 L23 17 Q25 23 18 20 L0 13 L-18 20 Q-25 23 -23 17 L-5 -21 Q-2 -27 0 -26Z',class:'ship-body',fill:color,stroke:color,'stroke-width':1},group);
    element('path',{d:'M0 -19 L0 12 L-17 18Z',fill:'#fff','fill-opacity':.26,'pointer-events':'none'},group);
    element('path',{d:'M0 -18 L6 4 L0 1 L-6 4Z',class:'ship-window',fill:'#fff','fill-opacity':.85},group);
    element('path',{d:'M-7 24 L-7 29 M7 24 L7 29',stroke:color,'stroke-width':2.4,'stroke-linecap':'round',opacity:.5},group);
  }
  function renderBoard(previousPhase = null) {
    const width = level.width*CELL+PAD*2, height = level.height*CELL+PAD*2;
    svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    svg.setAttribute('role','group'); svg.setAttribute('aria-label',`${level.title}，点邮船放行`);
    svg.replaceChildren();
    element('title',{},svg,`第${index+1}关 ${level.title}`);
    const background = element('g',{'aria-hidden':'true'},svg);
    element('rect',{x:PAD-7,y:PAD-7,width:level.width*CELL+14,height:level.height*CELL+14,rx:26,fill:'#f4f9fc',stroke:'#dbe9ee','stroke-width':1.5},background);
    for (let y=0;y<level.height;y++) {
      const cy=center({x:0,y}).y;
      element('line',{x1:PAD+12,y1:cy,x2:width-PAD-12,y2:cy,class:'grid-line',stroke:'#e3edf1','stroke-width':1},background);
      for (const x of [PAD-12,width-PAD+12]) element('line',{x1:x,y1:cy-6,x2:x,y2:cy+6,class:'port-line',stroke:'#7dc9bd','stroke-width':3,'stroke-linecap':'round'},background);
    }
    for (let x=0;x<level.width;x++) {
      const cx=center({x,y:0}).x;
      element('line',{x1:cx,y1:PAD+12,x2:cx,y2:height-PAD-12,class:'grid-line',stroke:'#e3edf1','stroke-width':1},background);
      for (const y of [PAD-12,height-PAD+12]) element('line',{x1:cx-6,y1:y,x2:cx+6,y2:y,class:'port-line',stroke:'#7dc9bd','stroke-width':3,'stroke-linecap':'round'},background);
      for(let y=0;y<level.height;y++) {const p=center({x,y});element('circle',{cx:p.x,cy:p.y,r:2.4,fill:'#c8dce3',class:'grid-dot'},background);}
    }
    pathLayer=element('g',{'aria-hidden':'true','pointer-events':'none',id:'route-layer'},svg);
    const objects=element('g',{},svg);
    for(const wall of level.walls) {
      const p=center(wall),g=element('g',{transform:`translate(${p.x} ${p.y})`,class:'wall','aria-hidden':'true'},objects);
      element('rect',{x:-19,y:-19,width:38,height:38,rx:12,fill:'#e2eaf0',stroke:'#bdccd6','stroke-width':1.5},g);
      element('path',{d:'M-6 -6 L6 6 M6 -6 L-6 6',stroke:'#94a9b6','stroke-width':2.3,'stroke-linecap':'round'},g);
    }
    level.mirrors.forEach((mirror,i) => {
      const p=center(mirror),orientation=mirror.slash^(mirror.fixed?0:state.phase);
      const group=element('g',{transform:`translate(${p.x} ${p.y})`,class:`mirror-group${mirror.fixed?' fixed-mirror':''}`,'data-orientation':orientation,'aria-hidden':'true'},objects);
      element('rect',{x:-20,y:-20,width:40,height:40,rx:9,transform:'rotate(45)',class:'mirror-gem',fill:mirror.fixed?'#f7e7b7':'#c5ece1',stroke:mirror.fixed?'#c99d45':'#8bc9b8','stroke-width':1.4},group);
      if(mirror.fixed)element('rect',{x:-15,y:-15,width:30,height:30,rx:6,transform:'rotate(45)',fill:'none',stroke:'#d2ae63','stroke-width':1},group);
      const direction=element('g',{transform:`rotate(${orientation*90})`},group);
      element('line',{x1:-15,y1:15,x2:15,y2:-15,class:'mirror-line',stroke:mirror.fixed?'#9e7329':'#258b7d','stroke-width':5,'stroke-linecap':'round'},direction);
      element('circle',{cx:0,cy:0,r:3,fill:'#f0fff9'},group);
      if(!mirror.fixed && previousPhase !== null && previousPhase !== state.phase && !reduced) element('animateTransform',{attributeName:'transform',type:'rotate',from:(mirror.slash^previousPhase)*90,to:orientation*90,dur:'.28s',fill:'freeze'},direction);
      element('title',{},group,`${mirror.fixed?'定向镜':'折光镜'}${i+1}，镜面${orientation ? '反斜线' : '斜线'}`);
    });
    for(const portal of level.portals||[]){
      const p=center(portal),color=String(portal.pair)==='2'?'#b36d9b':'#8970bc';
      const group=element('g',{transform:`translate(${p.x} ${p.y})`,class:'portal-group','data-pair':portal.pair,'aria-hidden':'true'},objects);
      element('circle',{r:25,fill:color,'fill-opacity':.11,stroke:color,'stroke-width':2},group);
      element('circle',{r:17,fill:'#fbf8ff',stroke:color,'stroke-width':2,'stroke-dasharray':'5 4'},group);
      element('text',{x:0,y:6,'text-anchor':'middle','font-size':18,'font-weight':750,fill:color},group,portal.pair);
      element('title',{},group,`${portal.pair}号星门，传送至同编号星门并保持航向`);
    }
    for(const gate of level.gates||[]){
      const p=center(gate),open=gate.openPhase===state.phase,color=gate.openPhase?'#b67463':'#578fa8';
      const group=element('g',{transform:`translate(${p.x} ${p.y})`,class:`tide-gate ${open?'open':'closed'}`,'data-open':open,'aria-hidden':'true'},objects);
      element('rect',{x:-23,y:-23,width:46,height:46,rx:10,fill:open?'#f1faf8':'#f3e8e2','fill-opacity':open?.6:1,stroke:color,'stroke-width':2,'stroke-dasharray':open?'4 5':'none'},group);
      if(!open)element('path',{d:'M-16 -12 H16 M-16 12 H16',stroke:color,'stroke-width':4,'stroke-linecap':'round'},group);
      element('text',{x:0,y:6,'text-anchor':'middle','font-size':17,'font-weight':750,fill:color},group,gate.openPhase?'B':'A');
      element('title',{},group,`${gate.openPhase?'B':'A'}相潮汐闸，当前${open?'开启':'关闭'}`);
    }
    const remaining=new Set(state.remaining);
    level.ships.forEach((ship,i) => {
      if(!remaining.has(ship.id)) return;
      const p=center(ship),color=i%3===1?'#4f83bd':'#ed8b78';
      const group=element('g',{transform:`translate(${p.x} ${p.y})`,class:`ship${hinted===ship.id?' hinted':''}`,role:'button',tabindex:busy?-1:0,'aria-label':`邮船 ${ship.id}，朝${directions[ship.dir]}，放行`,'data-id':ship.id},objects);
      element('rect',{x:-40,y:-40,width:80,height:80,rx:15,fill:'transparent',class:'ship-hit'},group);
      const body=element('g',{transform:`rotate(${ship.dir*90})`,'pointer-events':'none'},group); drawShip(body,color);
      element('text',{x:0,y:38,'text-anchor':'middle','font-size':18,'font-weight':650,'font-family':'ui-rounded,system-ui,sans-serif',fill:'#486075',class:'ship-number','pointer-events':'none'},group,ship.id);
      group.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')showRoute(ship.id);});
      group.addEventListener('pointerleave',()=>{if(!busy)clearRoute();});
      group.addEventListener('focus',()=>showRoute(ship.id));
      group.addEventListener('blur',()=>{if(!busy)clearRoute();});
      group.addEventListener('click',()=>depart(ship.id));
      group.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();depart(ship.id);}});
    });
    flightLayer=element('g',{'aria-hidden':'true','pointer-events':'none'},svg);
  }
  function showRoute(id,force=false) {
    if(busy&&!force)return;
    const route=E.trace(level,state,id); pathLayer.replaceChildren();
    if(route.points.length<2)return;
    element('path',{d:geometry(route.points),class:`route-line ${route.ok?'safe':'blocked'}`,fill:'none',stroke:route.ok?'#3baf99':'#dc7d70','stroke-width':5,'stroke-linecap':'round','stroke-linejoin':'round','stroke-dasharray':'5 9',opacity:.85},pathLayer);
    const end=center(route.points.at(-1)); element('circle',{cx:end.x,cy:end.y,r:7,fill:route.ok?'#3baf99':'#dc7d70'},pathLayer);
    $('route-label').textContent=route.ok?`邮船${id}，折光${route.reflections}次，传送${route.portalJumps||0}次，从${directions[route.exitDir]}侧离港`:`邮船${id}当前航路受阻，可切换镜相或先放行其他船`;
  }
  function clearRoute(){if(pathLayer)pathLayer.replaceChildren();$('route-label').textContent='点击邮船放行，换相不限次数';}
  function flash() {
    clearTimeout(flashTimer);stage.classList.remove('phase-flash');
    requestAnimationFrame(()=>stage.classList.add('phase-flash'));
    flashTimer=setTimeout(()=>stage.classList.remove('phase-flash'),420);
  }
  function fly(ship,route) {
    return new Promise(resolve=>{
      const points=route.points.map(p=>({...center(p),jump:!!p.jump})),lengths=[],sums=[0];let total=0;
      for(let i=1;i<points.length;i++){const length=points[i].jump?CELL*.75:Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);lengths.push(length);total+=length;sums.push(total);}
      const ghost=element('g',{class:'ghost-ship'},flightLayer);drawShip(ghost,level.ships.findIndex(s=>s.id===ship.id)%3===1?'#4f83bd':'#ed8b78');
      const source=[...svg.querySelectorAll('.ship')].find(n=>n.dataset.id===ship.id);if(source)source.style.opacity=0;
      const start=performance.now(),duration=reduced?80:Math.min(1250,280+total*.65);
      function frame(now){
        const progress=Math.min(1,(now-start)/duration),distance=progress*total;let k=0;
        while(k<lengths.length-1&&sums[k+1]<distance)k++;
        const a=points[k],b=points[k+1]||a,t=lengths[k]?(distance-sums[k])/lengths[k]:1;
        let angle=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI+90,px=a.x+(b.x-a.x)*t,py=a.y+(b.y-a.y)*t,opacity=1;
        if(b.jump){const prior=points[k-1];angle=prior?Math.atan2(a.y-prior.y,a.x-prior.x)*180/Math.PI+90:ship.dir*90;px=t<.5?a.x:b.x;py=t<.5?a.y:b.y;opacity=Math.abs(t-.5)*2;}
        ghost.setAttribute('transform',`translate(${px} ${py}) rotate(${angle})`);
        ghost.setAttribute('opacity',opacity*(progress>.88?(1-progress)/.12:1));
        if(progress<1)flightFrame=requestAnimationFrame(frame);else{ghost.remove();resolve();}
      }
      flightFrame=requestAnimationFrame(frame);
    });
  }
  function describeProgress(prefix) {
    const available=state.remaining.filter(id=>E.trace(level,state,id).ok);
    $('flip-btn').classList.toggle('suggested',available.length===0&&!E.isWon(state));
    say(available.length?prefix:'当前航线都被挡住了，切换镜相就能继续。',available.length?'normal':'switch');
  }
  async function depart(id) {
    if(busy||E.isWon(state))return;
    const result=E.dispatch(level,state,id);
    if(!result.ok){
      showRoute(id);chime('blocked');
      const node=[...svg.querySelectorAll('.ship')].find(n=>n.dataset.id===id);
      if(node){node.classList.remove('bumped');requestAnimationFrame(()=>{node.classList.add('bumped');setTimeout(()=>node.classList.remove('bumped'),420);});}
      const end=result.trace.points.at(-1),gate=(level.gates||[]).find(g=>end&&g.x===end.x&&g.y===end.y);
      say(result.trace.reason==='gate'&&gate?`这道潮汐闸在 ${gate.openPhase?'B':'A'} 相开启，切换镜相试试。`:'这条航线暂时受阻。换个镜相，或先放行其他船。','blocked');return;
    }
    const oldPhase=state.phase;busy=true;hinted=null;$('flip-btn').classList.remove('hinted','suggested');
    showRoute(id,true);updateControls();say(`邮船 ${id} 正在离港……`);chime('clear');
    await fly(level.ships.find(s=>s.id===id),result.trace);
    state=result.state;busy=false;renderBoard(oldPhase);updateControls();clearRoute();flash();
    if(E.isWon(state)){win();return;}
    describeProgress(result.trace.portalJumps?'穿过星门，顺利离港！继续寻找畅通航线。':E.canFlip(level,state)?'顺利离港！镜相已切换，继续寻找畅通航线。':'顺利离港，空出的航道可以通行了。');
  }
  function changePhase() {
    if(busy||E.isWon(state))return;
    const result=E.flip(level,state);if(!result.ok)return;
    const oldPhase=state.phase;state=result.state;hinted=null;$('flip-btn').classList.remove('hinted');
    renderBoard(oldPhase);updateControls();clearRoute();flash();chime('flip');
    describeProgress(`已切到 ${state.phase?'B':'A'} 相。换相不限次数，放心寻找出口。`);
  }
  function hint() {
    if(busy||E.isWon(state))return;
    const solution=E.solve(level,state);hinted=null;$('flip-btn').classList.remove('hinted');
    if(!solution||!solution.actions.length){say('请重开本关恢复航线。','blocked');return;}
    hints++;
    if(solution.actions[0].type==='flip'){$('flip-btn').classList.add('hinted');say('切换一下镜相，就有新的邮船可以离港。','switch');}
    else{hinted=solution.actions[0].id;renderBoard();showRoute(hinted);say(`邮船 ${hinted} 的航线畅通，点它就能继续。`);}
  }
  function win() {
    saved.completed[level.id]={flips:state.flipsUsed,hints};persist();updateNavigation();chime('win');
    const final=index===E.LEVELS.length-1,chapterEnd=!final&&E.LEVELS[index+1].chapter!==level.chapter;
    $('win-title').textContent=final?`${E.LEVELS.length}站来信，全部送达`:chapterEnd?`${level.chapterTitle}，顺利抵达`:'这一站，顺利清港';
    $('win-detail').textContent=final?'所有邮船都找到了出口。再挑一站，享受一段轻松航行。':`${level.ships.length} 艘邮船全部抵达，下一段航线正在等你。`;
    $('next-btn').textContent=final?'再航行一次':chapterEnd?'驶向下一片海域':'前往下一站';
    const entries=E.LEVELS.filter(entry=>entry.chapter===level.chapter),done=entries.filter(entry=>saved.completed[entry.id]).length,totalDone=E.LEVELS.filter(entry=>saved.completed[entry.id]).length;
    $('chapter-completion').textContent=`本海域 ${done}/${entries.length} · 全航程 ${totalDone}/${E.LEVELS.length}`;
    say('全部邮船已离港。做得好！','success');$('win-dialog').showModal();
  }
  function loadLevel(nextIndex) {
    if(busy)return;cancelAnimationFrame(flightFrame);closeDialog('win-dialog');
    index=nextIndex;level=E.LEVELS[index];state=E.createState(level);hints=0;hinted=null;viewedChapter=level.chapter||1;
    $('flip-btn').classList.remove('hinted','suggested');
    $('level-number').textContent=`${level.chapterTitle||'初航群岛'} · ${String(index+1).padStart(2,'0')} / ${E.LEVELS.length}`;
    $('level-title').textContent=level.title;$('level-subtitle').textContent=level.subtitle;$('level-tip').textContent=level.tip;
    renderBoard();updateControls();updateMechanicGuide();clearRoute();persist();
    const introductions={fixed:'金色定向镜保持方向，普通镜面才会随镜相转动。',portal:'同编号星门互通，传送后邮船保持原来的航向。',gate:'潮汐闸的字母就是开启相位，切换镜相试试。'};
    describeProgress(introductions[level.mechanicIntro]||(index===0?'点一艘前方畅通的邮船，让它驶出港口。':level.brief||'镜面会让航线转弯，换相随时都可以。'));
  }
  $('flip-btn').addEventListener('click',changePhase);
  $('hint-btn').addEventListener('click',hint);
  $('restart-btn').addEventListener('click',()=>loadLevel(index));
  $('help-btn').addEventListener('click',()=>$('help-dialog').showModal());
  $('close-help-btn').addEventListener('click',()=>closeDialog('help-dialog'));
  $('levels-btn').addEventListener('click',()=>$('levels-dialog').showModal());
  $('close-levels-btn').addEventListener('click',()=>closeDialog('levels-dialog'));
  $('next-btn').addEventListener('click',()=>loadLevel((index+1)%E.LEVELS.length));
  $('replay-btn').addEventListener('click',()=>loadLevel(index));
  $('sound-btn').addEventListener('click',()=>{soundOn=!soundOn;updateSound();persist();if(soundOn)chime('flip');});
  document.addEventListener('keydown',event=>{
    if(event.ctrlKey||event.metaKey||event.altKey||event.repeat||document.querySelector('dialog[open]')||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;
    if(event.key.toLowerCase()==='f'){event.preventDefault();changePhase();}
    if(event.key.toLowerCase()==='h'){event.preventDefault();hint();}
    if(event.key.toLowerCase()==='r'){event.preventDefault();loadLevel(index);}
  });
  const well=document.querySelector('.board-well');
  const resize=new ResizeObserver(entries=>{const rect=entries[0].contentRect;const size=Math.max(1,Math.floor(Math.min(rect.width,rect.height)));stage.style.width=`${size}px`;stage.style.height=`${size}px`;});
  resize.observe(well);
  updateSound();loadLevel(index);
})();
