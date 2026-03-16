const {useState,useEffect,useLayoutEffect,useCallback,useRef,useMemo,memo}=React;
let sparkSeq=0;
const Icon=memo(({path,size=16,...p})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d={path}/>
  </svg>
));
const PATH={
  plus:'M12 5v14M5 12h14',minus:'M5 12h14',arrowR:'M5 12h14M12 5l7 7-7 7',arrowL:'M19 12H5M12 19l-7-7 7-7',
  refresh:'M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16',
  check:'M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM9 12l2 2 4-4',
  coin:'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z',
  chevD:'M6 9l6 6 6-6',clock:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2',
  history:'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5M12 7v5l4 2',
  closeX:'M18 6L6 18M6 6l12 12',
  sun:'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
  moon:'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  settings:'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  trophy:'M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z',
  pencil:'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  share:'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
  copy:'M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z',
  changelog:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  search:'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
};
const BILL_DENOMS=[100,50,20,10,5,1];
const COIN_DENOMS=[
  {id:'1.00',label:'100¢',val:1.00,roll:null},{id:'0.50',label:'50¢',val:0.50,roll:null},
  {id:'0.25',label:'25¢',val:0.25,roll:40},{id:'0.10',label:'10¢',val:0.10,roll:50},
  {id:'0.05',label:'5¢',val:0.05,roll:40},{id:'0.01',label:'1¢',val:0.01,roll:50},
];
const COIN_ROLLS=Object.fromEntries(COIN_DENOMS.map(c=>[c.id,c.roll||0]));
const ALL_IDS=[...BILL_DENOMS.map(d=>String(d)),...COIN_DENOMS.map(c=>c.id)];
const EMPTY_CASH=Object.fromEntries(ALL_IDS.map(id=>[id,'']));
const EMPTY_ROLLS=Object.fromEntries(COIN_DENOMS.map(c=>[c.id,0]));
const LS_APP_STATE='ac_app_state',LS_HISTORY='ac_history_v2',LS_SETTINGS='ac_settings_v1',LS_TUTORIAL='ac_tutorial_v1',LS_RECORD='ac_record_v1',LS_THEME='ac_theme',LS_HINT='ac_hint_v1',LS_CHANGELOG='ac_changelog_v1';
const GH_COMMITS_URL='https://api.github.com/repos/cen0b-dev/apple-counter/commits?per_page=1';
function lsGet(k,fb){try{const r=localStorage.getItem(k);return r!=null?JSON.parse(r):fb;}catch{return fb;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}
const DEFAULT_APP_STATE={
  cash:EMPTY_CASH,
  targetInput:'200',
  billsMode:'count',
  coinsMode:'count',
  coinRolls:EMPTY_ROLLS,
  page:1,
};
const sanitizeMode=m=>m==='value'?'value':'count';
const normalizeCash=raw=>{
  const next={...EMPTY_CASH};
  if(raw&&typeof raw==='object'){
    for(const id of Object.keys(next)){
      const v=raw[id];
      if(v!==undefined&&v!==null&&v!=='') next[id]=String(v);
    }
  }
  return next;
};
const normalizeRolls=raw=>{
  const next={...EMPTY_ROLLS};
  if(raw&&typeof raw==='object'){
    for(const id of Object.keys(next)){
      const v=Math.floor(Number(raw[id])||0);
      if(v>0) next[id]=v;
    }
  }
  return next;
};
function loadAppState(){
  const raw=lsGet(LS_APP_STATE,null);
  if(!raw||typeof raw!=='object') return{...DEFAULT_APP_STATE,cash:{...EMPTY_CASH},coinRolls:{...EMPTY_ROLLS}};
  if(!raw.cash) return{...DEFAULT_APP_STATE,cash:normalizeCash(raw),coinRolls:{...EMPTY_ROLLS}};
  return{
    ...DEFAULT_APP_STATE,
    ...raw,
    cash:normalizeCash(raw.cash),
    targetInput:raw.targetInput!=null?String(raw.targetInput):DEFAULT_APP_STATE.targetInput,
    billsMode:sanitizeMode(raw.billsMode),
    coinsMode:sanitizeMode(raw.coinsMode),
    coinRolls:normalizeRolls(raw.coinRolls),
    page:raw.page===2?2:1,
  };
}
function saveAppState(state){lsSet(LS_APP_STATE,state);}
function applyTheme(theme){
  const html=document.documentElement;
  html.classList.add('thm');
  getComputedStyle(html).backgroundColor;
  html.setAttribute('data-theme',theme);
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content',theme==='dark'?'#0d1117':'#ffffff');
}
const REDUCE_MOTION=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const toCents=n=>Math.round(n*100);
const fromCents=c=>c/100;
const formatMoney=v=>`$${v.toFixed(2)}`;
function rowValue(raw,denom,mode,extraCount=0){
  const n=Number(raw)||0;
  if(mode==='count'){
    const count=Math.floor(n)+Math.floor(extraCount);
    return fromCents(count*toCents(denom));
  }
  return fromCents(Math.floor(toCents(n)/toCents(denom))*toCents(denom));
}
function rowCount(raw,denom,mode,extraCount=0){
  const n=Number(raw)||0;
  return mode==='count'
    ? Math.floor(n)+Math.floor(extraCount)
    : Math.floor(toCents(n)/toCents(denom));
}
function rowSubtotal(raw,denom,mode,extraCount=0){
  const n=Number(raw)||0;
  const extra=Math.floor(extraCount);
  if(!n&&!extra) return null;
  if(mode==='count'){
    const v=(Math.floor(n)+extra)*denom;
    return v?`=$${v.toFixed(2)}`:null;
  }
  const c=Math.floor(toCents(n)/toCents(denom));
  return c?`=${c}×`:null;
}
function rollExtraCount(id,rolls){
  const size=COIN_ROLLS[id]||0;
  if(!size) return 0;
  const r=Math.max(0,Math.floor(Number(rolls)||0));
  return r*size;
}
function convertCash(cash,from,to,denoms){
  if(from===to) return cash;
  const next={...cash};
  for(const{id,val}of denoms){
    const raw=Number(cash[id])||0;if(!raw) continue;
    if(from==='count'){const c=Math.floor(raw)*toCents(val);next[id]=c?fromCents(c).toString():'';}
    else{const c=Math.floor(toCents(raw)/toCents(val));next[id]=c?String(c):'';}
  }
  return next;
}
function computeMinKeep(t){
  return{100:0,50:0,20:Math.max(2,Math.ceil(t*.12/20)),10:Math.max(2,Math.ceil(t*.08/10)),5:Math.max(3,Math.ceil(t*.06/5)),1:Math.max(5,Math.ceil(t*.03/1))};
}
const DP_MAX_CENTS=100000; // $1000
let _dpArr=null,_chArr=null;
function _getDPBuffers(size){
  if(!_dpArr||_dpArr.length<size){
    _dpArr=new Int32Array(size);
    _chArr=new Int16Array(size);
  }
  return{dp:_dpArr,ch:_chArr};
}
function computeDrop(cash,bm,da,target){
  if(da<=0) return[];
  const tc=toCents(da),RANK={100:1,50:2,20:3,10:4,5:5,1:6};
  const avail={};for(const d of BILL_DENOMS)avail[d]=rowCount(cash[String(d)],d,bm);
  const mk=computeMinKeep(target);
  const mp={};for(const d of BILL_DENOMS)mp[d]=Math.max(0,avail[d]-mk[d]);
  const costs={};
  for(const d of BILL_DENOMS){
    const s=avail[d]-mk[d];
    const bc=s<=0?500+RANK[d]*50:RANK[d]*5-Math.min(Math.log1p(s/Math.max(mk[d],1)),2);
    costs[d]=Math.max(1,Math.round(bc*1e5));
  }
  if(tc>DP_MAX_CENTS) return greedyDrop(avail,mp,tc);
  const INF=2e9;
  const{dp,ch}=_getDPBuffers(tc+1);
  dp.fill(INF,0,tc+1);
  ch.fill(-1,0,tc+1);
  dp[0]=0;
  for(const d of BILL_DENOMS){
    const dc=toCents(d),cnt=mp[d];if(!cnt||!dc) continue;
    const c=costs[d];
    for(let k=0;k<cnt;k++) for(let a=tc;a>=dc;a--){const ca=dp[a-dc]+c;if(ca<dp[a]){dp[a]=ca;ch[a]=d;}}
  }
  let best=0;for(let a=tc;a>=0;a--)if(dp[a]<INF){best=a;break;}
  if(best===0) return greedyDrop(avail,mp,tc);
  const bills={};let rem=best;
  while(rem>0){const d=ch[rem];if(d===-1)break;bills[d]=(bills[d]||0)+1;rem-=toCents(d);}
  return BILL_DENOMS.filter(d=>bills[d]>0).map(d=>({label:`$${d}`,count:bills[d],value:bills[d]*d,denom:d}));
}
function greedyDrop(avail,mp,tc){
  const RANK={100:1,50:2,20:3,10:4,5:5,1:6};
  const order=[...BILL_DENOMS].sort((a,b)=>{
    const sa=mp[a],sb=mp[b];if(sa>0&&sb<=0)return-1;if(sb>0&&sa<=0)return 1;return RANK[a]-RANK[b];
  });
  let rem=tc;const out=[];
  for(const d of order){const dc=toCents(d),take=Math.min(mp[d],Math.floor(rem/dc));if(take>0){out.push({label:`$${d}`,count:take,value:take*d,denom:d});rem-=take*dc;}}
  return out.sort((a,b)=>b.denom-a.denom);
}
function loadHistory(){return lsGet(LS_HISTORY,[]);}
function pushHistory(e){lsSet(LS_HISTORY,[e,...loadHistory()].slice(0,50));}
function formatTime(ts){return new Date(ts).toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});}
function launchConfetti(){
  if(REDUCE_MOTION) return;
  const canvas=document.getElementById('confetti-canvas');if(!canvas)return;
  canvas.style.display='block';
  const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;};
  resize();
  const ctx=canvas.getContext('2d');
  const COLS=['#3fb950','#58a6ff','#e3b341','#f78166','#bc8cff','#ffa657'];
  const ps=Array.from({length:120},()=>({x:Math.random()*canvas.width,y:-10-Math.random()*200,vx:(Math.random()-.5)*6,vy:3+Math.random()*4,color:COLS[Math.random()*6|0],w:6+Math.random()*6,h:10+Math.random()*6,rot:Math.random()*360,rv:(Math.random()-.5)*8,alpha:1}));
  let raf;
  const stop=()=>{
    cancelAnimationFrame(raf);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    canvas.style.display='none';
    window.removeEventListener('resize',resize);
  };
  const tick=()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let alive=0;
    for(const p of ps){
      p.x+=p.vx;p.y+=p.vy;p.vy+=.08;p.rot+=p.rv;p.alpha-=.008;
      if(p.y<canvas.height&&p.alpha>0){
        alive++;
        ctx.save();ctx.globalAlpha=Math.max(0,p.alpha);
        ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
        ctx.restore();
      }
    }
    if(alive>0) raf=requestAnimationFrame(tick);
    else stop();
  };
  window.addEventListener('resize',resize);
  tick();
  setTimeout(stop,5000);
}
const HAPTIC={
  tap:      [[10]],           // light single tap — toggle, open, close
  step:     [[6]],            // stepper +/−
  success:  [[10,30,15]],     // reached target / calculate
  warning:  [[20,30,20]],     // error / empty state
  destruct: [[8,60,20]],      // reset / clear
  record:   [[12,24,12]],     // new record
};
let _audioCtx=null;
function _getAudio(){
  if(!_audioCtx){try{_audioCtx=new(window.AudioContext||window.webkitAudioContext)();}catch{}}
  return _audioCtx;
}
function _iosTap(durationMs=10){
  const ctx=_getAudio();if(!ctx) return;
  try{
    if(ctx.state==='suspended') ctx.resume();
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.connect(gain);gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.00001,ctx.currentTime); // silent — just needs audio activity
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime+durationMs/1000);
  }catch{}
}
function haptic(patternOrPreset){
  try{
    const patterns=typeof patternOrPreset==='string'
      ? (HAPTIC[patternOrPreset]||[[6]])
      : [patternOrPreset];
    const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;
    if(isIOS){
      let delay=0;
      for(const pattern of patterns){
        for(let i=0;i<pattern.length;i++){
          const dur=pattern[i];
          if(i%2===0){ // even indices are vibrate durations
            const d=delay;
            setTimeout(()=>_iosTap(dur),d);
          }
          delay+=dur;
        }
      }
    } else {
      if(navigator.vibrate){
        const flat=patterns[0];
        navigator.vibrate(flat);
      }
    }
  }catch{}
}
const Toggle=({on,onChange})=>(
  <button className={`toggle-track ${on?'on':'off'}`} onClick={onChange} role="switch" aria-checked={on}>
    <div className="toggle-thumb"/>
  </button>
);
const ModeToggle=({mode,onChange})=>{
  const MODES=['count','value'];
  const LABELS=['Count','Value'];
  const handleTrackClick=e=>{
    e.stopPropagation();
    const next=MODES.find(m=>m!==mode);
    haptic('tap');onChange(next);
  };
  return(
    <div className="mode-toggle-wrap" onClick={e=>e.stopPropagation()}>
      <div className="mode-toggle" onClick={handleTrackClick}>
        <div className="mode-toggle-pill" style={{
          left: mode==='value' ? 'calc(50% + 1px)' : '3px',
          width: 'calc(50% - 4px)',
        }}/>
        {MODES.map((m,i)=>(
          <button key={m} className={`mode-btn${mode===m?' active':''}`}>
            {LABELS[i]}
          </button>
        ))}
      </div>
    </div>
  );
};
function useSheetClose(onClose,duration=260){
  const [closing,setClosing]=useState(false);
  const tmRef=useRef(null);
  const triggerClose=useCallback(()=>{
    setClosing(true);
    clearTimeout(tmRef.current);
    tmRef.current=setTimeout(()=>{setClosing(false);onClose();},duration);
  },[onClose,duration]);
  useEffect(()=>()=>clearTimeout(tmRef.current),[]);
  return[closing,triggerClose];
}
function useSheetDismiss(triggerClose){
  const ref=useRef(null);
  const startY=useRef(null);
  const dragging=useRef(false);
  const scrollTop=useRef(0); // track sheet-body scroll position
  const rafId=useRef(null);
  const lastDy=useRef(0);
  useEffect(()=>{
    const el=ref.current;
    if(!el) return;
    el.style.willChange='transform';
    const onStart=e=>{
      const bodyEl=el.querySelector('.sheet-body');
      scrollTop.current=bodyEl?bodyEl.scrollTop:0;
      startY.current=e.touches[0].clientY;
      dragging.current=false;
    };
    const scheduleTransform=dy=>{
      lastDy.current=dy;
      if(rafId.current) return;
      rafId.current=requestAnimationFrame(()=>{
        rafId.current=null;
        el.style.transform=`translate3d(0,${Math.max(0,lastDy.current)}px,0)`;
      });
    };
    const onMove=e=>{
      if(startY.current===null) return;
      const dy=e.touches[0].clientY-startY.current;
      const bodyEl=el.querySelector('.sheet-body');
      scrollTop.current=bodyEl?bodyEl.scrollTop:0;
      if(dy>4&&scrollTop.current<=0){
        dragging.current=true;
        e.preventDefault(); // works because {passive:false}
        scheduleTransform(dy);
      }
    };
    const onEnd=e=>{
      if(startY.current===null) return;
      const dy=e.changedTouches[0].clientY-startY.current;
      if(rafId.current){cancelAnimationFrame(rafId.current);rafId.current=null;}
      el.style.transform='';
      if(dragging.current&&dy>80){haptic('tap');triggerClose();}
      startY.current=null;
      dragging.current=false;
    };
    el.addEventListener('touchstart',onStart,{passive:true});
    el.addEventListener('touchmove', onMove, {passive:false}); // ← key fix
    el.addEventListener('touchend',  onEnd,  {passive:true});
    el.addEventListener('touchcancel',onEnd,{passive:true});
    return()=>{
      el.removeEventListener('touchstart',onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend',  onEnd);
      el.removeEventListener('touchcancel',onEnd);
      if(rafId.current){cancelAnimationFrame(rafId.current);rafId.current=null;}
      el.style.willChange='';
    };
  },[triggerClose]);
  return{ref};
}
function useHoldRepeat(cb){
  const tmRef=useRef(null);
  const [rpt,setRpt]=useState(false);
  const touchStartY=useRef(null);
  const cancelled=useRef(false);
  const start=useCallback((startY)=>{
    touchStartY.current=startY??null;
    cancelled.current=false;
    cb();
    let delay=380;
    const loop=()=>{
      if(cancelled.current) return;
      cb();haptic('step');
      delay=Math.max(55,delay*.72);
      tmRef.current=setTimeout(loop,delay);
    };
    tmRef.current=setTimeout(()=>{
      if(cancelled.current) return;
      setRpt(true);loop();
    },380);
  },[cb]);
  const cancel=useCallback(()=>{
    cancelled.current=true;
    clearTimeout(tmRef.current);
    setRpt(false);
    touchStartY.current=null;
  },[]);
  const onTouchMove=useCallback((e)=>{
    if(touchStartY.current==null) return;
    const dy=Math.abs(e.touches[0].clientY-touchStartY.current);
    if(dy>8) cancel();
  },[cancel]);
  useEffect(()=>()=>clearTimeout(tmRef.current),[]);
  return{repeating:rpt,start,stop:cancel,onTouchMove};
}
function useToast(){
  const [toast,setToast]=useState(null);
  const tmRef=useRef(null);
  const show=useCallback((message,type='neutral',duration=1800)=>{
    clearTimeout(tmRef.current);
    setToast({message,type});
    tmRef.current=setTimeout(()=>setToast(null),duration);
  },[]);
  useEffect(()=>()=>clearTimeout(tmRef.current),[]);
  return{toast,show};
}
function useDebouncedAppState(state,delay=220){
  const stateRef=useRef(state);
  const tmRef=useRef(null);
  useEffect(()=>{stateRef.current=state;},[state]);
  const flush=useCallback(()=>{
    if(tmRef.current){clearTimeout(tmRef.current);tmRef.current=null;}
    try{saveAppState(stateRef.current);}catch{}
  },[]);
  useEffect(()=>{
    if(tmRef.current) clearTimeout(tmRef.current);
    tmRef.current=setTimeout(flush,delay);
    return()=>clearTimeout(tmRef.current);
  },[state,delay,flush]);
  useEffect(()=>{
    const onVis=()=>{if(document.visibilityState==='hidden') flush();};
    window.addEventListener('pagehide',flush);
    document.addEventListener('visibilitychange',onVis);
    return()=>{
      window.removeEventListener('pagehide',flush);
      document.removeEventListener('visibilitychange',onVis);
    };
  },[flush]);
}
function CollapsibleSection({id,label,badge,mode,onModeChange,children,defaultOpen=true}){
  const [open,setOpen]=useState(defaultOpen);
  const [pressing,setPressing]=useState(false);
  const innerRef=useRef(null);
  const [ht,setHt]=useState(0);
  useEffect(()=>{
    const el=innerRef.current;
    if(!el) return;
    let raf=null;
    const measure=()=>{
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>setHt(el.scrollHeight));
    };
    const ro=new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return()=>{ro.disconnect();cancelAnimationFrame(raf);};
  },[]);
  const onPointerDown=e=>{
    if(!e.target.closest('button,input,a,[role="button"]')) setPressing(true);
  };
  const clearPress=()=>setPressing(false);
  const onDivClick=e=>{
    if(e.target.closest('button,input,a')||e.target.closest('.mode-toggle-wrap')) return;
    haptic('tap');
    setOpen(v=>!v);
  };
  return(
    <div className="gh-card" id={id}>
      <div
        role="button" tabIndex={0}
        className={`section-toggle-btn${pressing?' pressing':''}${(parseFloat(badge)||0)>0?' has-value':''}`}
        onPointerDown={onPointerDown}
        onPointerUp={clearPress}
        onPointerLeave={clearPress}
        onPointerCancel={clearPress}
        onClick={onDivClick}
        onKeyDown={e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();haptic('tap');setOpen(v=>!v);}}}
      >
        <div className="section-toggle-left">
          <span className="section-label">{label}</span>
          <span className="badge">{badge}</span>
        </div>
        <div className="section-toggle-right">
          <ModeToggle mode={mode} onChange={onModeChange}/>
          <Icon path={PATH.chevD} size={16} className={`sec-chev${open?' open':''}`}/>
        </div>
      </div>
      <div className={`section-body-wrap${open?'':' closed'}`} style={{maxHeight:open?`${ht}px`:'0'}}>
        <div className="section-body-inner" ref={innerRef}>
          {children}
        </div>
      </div>
    </div>
  );
}
function BreakdownCollapse({open,children}){
  const innerRef=useRef(null);
  const [ht,setHt]=useState(0);
  useEffect(()=>{
    const el=innerRef.current;
    if(!el) return;
    const ro=new ResizeObserver(()=>setHt(el.scrollHeight));
    ro.observe(el);
    setHt(el.scrollHeight);
    return()=>ro.disconnect();
  },[]);
  return(
    <div ref={innerRef}
      className={`breakdown-collapse${open?'':' closed'}`}
      style={{maxHeight:open?`${ht}px`:'0'}}>
      {children}
    </div>
  );
}
const BillRow=memo(({id,label,denom,rollCount,rolls=0,onRoll,onRollSet,inputMode,value,onManualInput,onStep,showHint,onHintDismiss})=>{
  const hasRoll=Number.isFinite(rollCount)&&rollCount>0;
  const rollQty=Math.max(0,Math.floor(Number(rolls)||0));
  const extraCount=inputMode==='count'&&hasRoll?rollQty*rollCount:0;
  const has=Number(value)>0||extraCount>0;
  const sub=rowSubtotal(value,denom,inputMode,extraCount);
  const rollValueLabel=hasRoll?`$${(rollCount*denom).toFixed(2)}`:'';
  const rollLabel=hasRoll
    ?(inputMode==='count'
      ?`${rollCount}/roll`
      :rollValueLabel)
    :'';
  const plusCb=useCallback(()=>onStep(id,1,denom),[id,denom,onStep]);
  const minusCb=useCallback(()=>onStep(id,-1,denom),[id,denom,onStep]);
  const plus=useHoldRepeat(plusCb);
  const minus=useHoldRepeat(minusCb);
  const applyRollDelta=useCallback((delta)=>{
    if(inputMode==='count'&&onRoll){
      onRoll(id,delta);
      return;
    }
    onStep(id,delta*rollCount,denom);
  },[id,inputMode,onRoll,onStep,rollCount,denom]);
  const rollHoldRef=useRef(null);
  const rollFiredRef=useRef(false);
  const [rollHolding,setRollHolding]=useState(false);
  const rollTouchStartY=useRef(null);
  const startRollHold=useCallback((e)=>{
    haptic('destruct');
    rollFiredRef.current=false;
    rollTouchStartY.current=e.touches?.[0]?.clientY??null;
    rollHoldRef.current=setTimeout(()=>{
      haptic('success');
      rollFiredRef.current=true;
      setRollHolding(false);
      applyRollDelta(-1);
    },600);
    setRollHolding(true);
  },[applyRollDelta]);
  const cancelRollHold=useCallback(()=>{
    clearTimeout(rollHoldRef.current);
    setRollHolding(false);
    rollTouchStartY.current=null;
  },[]);
  useEffect(()=>()=>clearTimeout(rollHoldRef.current),[]);
  return(
    <div className={`denom-row${has?' has-value':''}`}>
      <span className={`denom-label${has?' active':''}`}>{label}</span>
      <div className="denom-input-wrap">
        {inputMode==='value'&&<span className="denom-prefix">$</span>}
        <input type="number" min="0" step={inputMode==='count'?1:'any'} inputMode={inputMode==='count'?'numeric':'decimal'}
          enterKeyHint="done" autoComplete="off"
          className={`denom-input${inputMode==='value'?' has-prefix':''}`}
          value={value} placeholder="0"
          onChange={e=>{onManualInput(id,e.target.value,inputMode);if(showHint)onHintDismiss();}}
          onFocus={e=>{e.target.select();if(showHint)onHintDismiss();}}
          onWheel={e=>e.target.blur()}/>
        {sub&&!showHint&&<span className="row-sub-inline">{sub}</span>}
        {showHint&&<span className="tap-hint"><Icon path={PATH.pencil} size={9}/> tap to type</span>}
      </div>
      <div className="stepper">
        {hasRoll&&inputMode==='count'&&(
          <button
            className={`roll-btn${rollHolding?' roll-holding':''}`}
            title={`Tap: +1 roll (${rollCount} coins) · Hold: −1 roll`}
            aria-label={`Add 1 roll (${rollCount} coins); hold to remove`}
            onTouchStart={e=>{e.stopPropagation();startRollHold(e);}}
            onTouchEnd={e=>{e.stopPropagation();if(!rollFiredRef.current)applyRollDelta(1);cancelRollHold();}}
            onTouchMove={e=>{const y=rollTouchStartY.current;if(y==null) return;const dy=Math.abs(e.touches[0].clientY-y);if(dy>10)cancelRollHold();}}
            onPointerDown={e=>{if(e.pointerType==='mouse'){haptic('destruct');}}}
            onClick={e=>{if(e.pointerType!=='touch')applyRollDelta(1);}}>
            <div className="roll-btn-icons">
              {rollHolding?<Icon path={PATH.minus} size={13}/>:<Icon path={PATH.plus} size={11}/>}
              <Icon path={PATH.coin} size={14}/>
            </div>
            <span className="roll-btn-label">{rollHolding?'−roll':rollLabel}</span>
            {rollQty>0&&!rollHolding&&<span className="roll-btn-count">×{rollQty}</span>}
          </button>
        )}
        <button className={`step-btn${minus.repeating?' repeating':''}`}
          onTouchStart={e=>{e.stopPropagation();haptic('step');minus.start(e.touches[0].clientY);}}
          onTouchEnd={e=>{e.stopPropagation();minus.stop();}}
          onTouchMove={minus.onTouchMove}
          onPointerDown={e=>{if(e.pointerType==='mouse'){haptic('step');minus.start();}}}
          onPointerUp={e=>{if(e.pointerType==='mouse')minus.stop();}}
          onPointerLeave={e=>{if(e.pointerType==='mouse')minus.stop();}}
          onPointerCancel={minus.stop}
          aria-label={`Decrease ${label}`}>
          <Icon path={PATH.minus} size={16}/>
        </button>
        <button className={`step-btn plus${has?' active':''}${plus.repeating?' repeating':''}`}
          onTouchStart={e=>{e.stopPropagation();haptic('step');plus.start(e.touches[0].clientY);}}
          onTouchEnd={e=>{e.stopPropagation();plus.stop();}}
          onTouchMove={plus.onTouchMove}
          onPointerDown={e=>{if(e.pointerType==='mouse'){haptic('step');plus.start();}}}
          onPointerUp={e=>{if(e.pointerType==='mouse')plus.stop();}}
          onPointerLeave={e=>{if(e.pointerType==='mouse')plus.stop();}}
          onPointerCancel={plus.stop}
          aria-label={`Increase ${label}`}>
          <Icon path={PATH.plus} size={16}/>
        </button>
      </div>
    </div>
  );
});
const CoinRow=BillRow;
function buildReport({totalCash,actualDropTotal,remainingDrawer,TARGET,dropDetails,billsMode,cash,coinsMode}){
  const lines=[];
  lines.push('Apple-Counter Drop Report');
  lines.push('─'.repeat(28));
  lines.push(`Counted:  $${totalCash.toFixed(2)}`);
  lines.push(`Target:   $${TARGET.toFixed(2)}`);
  lines.push(`Drop:     $${actualDropTotal.toFixed(2)}`);
  lines.push(`Remains:  $${remainingDrawer.toFixed(2)}`);
  if(dropDetails.length>0){
    lines.push('');
    lines.push('Pull from drawer:');
    dropDetails.forEach(d=>lines.push(`  ${d.count}× ${d.label}  = $${d.value.toFixed(2)}`));
  }
  lines.push('');
  lines.push(`Generated ${new Date().toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}`);
  return lines.join('\n');
}
function PullRows({dropDetails}){
  if(!dropDetails.length) return null;
  return(
    <>
      {dropDetails.map(item=>(
        <div key={item.label} className="pull-row">
          <div className="pull-row-left">
            <div className="pull-count">{item.count}</div>
            <span style={{fontSize:'12px',color:'var(--t2)'}}>×</span>
            <span className="pull-denom">{item.label}</span>
          </div>
          <span className="pull-value"><CountUp key={`pull-${item.label}`} value={item.value} format={formatMoney}/></span>
        </div>
      ))}
    </>
  );
}
function ShareButton({report}){
  const [state,setState]=useState('idle'); // idle | copied | shared
  const canShare=typeof navigator.share==='function';
  const handleShare=async()=>{
    haptic('tap');
    if(canShare){
      try{
        await navigator.share({title:'Drop Report',text:report});
        setState('shared');setTimeout(()=>setState('idle'),2000);
      }catch(e){
        if(e.name!=='AbortError') doCopy();
      }
    } else {
      doCopy();
    }
  };
  const doCopy=()=>{
    if(navigator.clipboard&&window.isSecureContext){
      navigator.clipboard.writeText(report)
        .then(()=>{setState('copied');setTimeout(()=>setState('idle'),2000);})
        .catch(()=>legacyCopy());
    } else {
      legacyCopy();
    }
  };
  const legacyCopy=()=>{
    try{
      const ta=document.createElement('textarea');
      ta.value=report;
      Object.assign(ta.style,{position:'fixed',top:'0',left:'0',opacity:'0',pointerEvents:'none'});
      document.body.appendChild(ta);ta.focus();ta.select();
      const ok=document.execCommand('copy');
      document.body.removeChild(ta);
      setState(ok?'copied':'idle');
      if(ok)setTimeout(()=>setState('idle'),2000);
    }catch{setState('idle');}
  };
  const label=state==='copied'?'Copied!'
    :state==='shared'?'Shared!'
    :canShare?'Share Report':'Copy Report';
  const iconPath=state==='copied'||state==='shared'?PATH.check
    :canShare?PATH.share:PATH.copy;
  return(
    <button className={`share-btn${state!=='idle'?' copied':''}`} onClick={handleShare}>
      <Icon path={iconPath} size={18}/>
      {label}
    </button>
  );
}
function AnimatedTotal({value,className}){
  const [bump,setBump]=useState(false);
  const prev=useRef(value),tm=useRef(null);
  useEffect(()=>{
    if(REDUCE_MOTION){prev.current=value;return;}
    if(value!==prev.current){prev.current=value;setBump(true);clearTimeout(tm.current);tm.current=setTimeout(()=>setBump(false),200);}
    return()=>clearTimeout(tm.current);
  },[value]);
  return<div className={`${className}${bump?' bump':''}`}>{value}</div>;
}
function Toast({toast,aboveFooter}){
  if(!toast) return null;
  return <div className={`toast ${toast.type||''}${aboveFooter?' above-footer':''}`} role="status" aria-live="polite">{toast.message}</div>;
}
function CountUp({value,format,className,duration=1500,startFrom=0}){
  const [display,setDisplay]=useState(startFrom);
  const fromRef=useRef(startFrom);
  const rafRef=useRef(null);
  useEffect(()=>{
    if(REDUCE_MOTION){fromRef.current=value;setDisplay(value);return;}
    const from=fromRef.current;
    const to=value;
    if(from===to){setDisplay(to);return;}
    const start=performance.now();
    const ease=t=>1-Math.pow(1-t,3);
    const tick=now=>{
      const t=Math.min(1,(now-start)/duration);
      const eased=ease(t);
      setDisplay(from+(to-from)*eased);
      if(t<1) rafRef.current=requestAnimationFrame(tick);
      else fromRef.current=to;
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(rafRef.current);
  },[value,duration]);
  const out=format?format(display):display;
  return <span className={className}>{out}</span>;
}
function ProgressBar({over,target,totalCash,recordDrop,gamification}){
  const beatAt=recordDrop>0?target+recordDrop:0;
  const barMax=Math.max(totalCash,beatAt>0?beatAt*1.08:0,target||1);
  const filledPct=Math.min(100,(totalCash/barMax)*100);
  const rawFlagPct=gamification&&recordDrop>0?(beatAt/barMax)*100:null;
  const beatLabel=`$${beatAt.toFixed(0)}`;
  const wrapRef=useRef(null);
  const [clampedPct,setClampedPct]=useState(rawFlagPct??50);
  useEffect(()=>{
    if(rawFlagPct==null) return;
    const el=wrapRef.current;
    if(!el) return;
    const W=el.offsetWidth;
    const TAG_HALF=34; // half of ~68px pill
    const minPct=(TAG_HALF/W)*100;
    const maxPct=((W-TAG_HALF)/W)*100;
    setClampedPct(Math.min(maxPct,Math.max(minPct,rawFlagPct)));
  },[rawFlagPct]);
  return(
    <div className="progress-wrap">
      <div className="progress-track" ref={wrapRef}>
        <div className={`progress-fill${over?' over':''}`} style={{width:`${filledPct}%`}}/>
        {rawFlagPct!=null&&(
          <div className="progress-flag" style={{left:`${clampedPct}%`}}>
            <div className="progress-flag-tag">Best {beatLabel}</div>
          </div>
        )}
      </div>
    </div>
  );
}
const TUT_STEPS=[
  {title:'Welcome to Apple-Counter!',body:"Count your drawer and calculate exactly what to drop. Quick tour — or skip anytime.",target:null},
  {title:'Enter Bill Counts',body:'Tap the input box to type a number directly, or use + / − buttons. Hold + or − to count fast!',target:'bills-card'},
  {title:'Enter Coins Too',body:'Tap the Coins header to expand. The blue roll button adds a whole roll at once!',target:'coins-card'},
  {title:'Watch the Progress Bar',body:'The bar fills as you count. It turns green when you hit target. A flag shows your record drop.',target:'progress-bar'},
  {title:'Calculate Your Drop',body:'Tap Calculate to see exactly which bills to pull. Your drop is auto-saved to history.',target:'calc-btn'},
  {title:'Your Header Buttons',body:'Sun/Moon = Dark Mode. Clock = Drop History. Gear = Settings. Refresh = Clear all counts.',target:'header-actions'},
  {title:"You're all set!",body:"Have a great shift! Tap Settings → Replay to see this tour again anytime.",target:null},
];
const SPAD=10;
function Tutorial({onDone}){
  const [step,setStep]=useState(0);
  const [spot,setSpot]=useState(null);
  const [bot,setBot]=useState(120);
  const [disp,setDisp]=useState({step:0,s:TUT_STEPS[0]});
  const [fading,setFading]=useState(false);
  const tmRef=useRef(null);
  const botTmRef=useRef(null);
  useEffect(()=>{
    const s=TUT_STEPS[step];
    setFading(true);
    tmRef.current=setTimeout(()=>{
      setDisp({step,s});  // update text while invisible
      if(!s.target){
        setSpot(null);
        window.scrollTo({top:0,behavior:'smooth'});
        setBot(120);
        setFading(false);
        return;
      }
      const el=document.getElementById(s.target);
      if(!el){setSpot(null);setFading(false);return;}
      el.scrollIntoView({behavior:'smooth',block:'center'});
      botTmRef.current=setTimeout(()=>{
        const r=el.getBoundingClientRect(),p=SPAD;
        setSpot({x:r.left-p,y:r.top-p,w:r.width+p*2,h:r.height+p*2,rx:10});
        const vh=window.innerHeight,mid=r.top+r.height/2;
        setBot(mid>vh*.45?Math.min(Math.max(110,vh-r.top+p+16),vh-240):80);
        setFading(false);  // fade content back in
      },380);
    },180);
    return()=>{clearTimeout(tmRef.current);clearTimeout(botTmRef.current);};
  },[step]);
  const next=()=>{haptic('tap');if(step<TUT_STEPS.length-1)setStep(s=>s+1);else onDone();};
  const W=window.innerWidth,H=window.innerHeight;
  const svgHtml=spot
    ?`<defs><mask id="tm"><rect width="${W}" height="${H}" fill="white"/><rect x="${spot.x}" y="${spot.y}" width="${spot.w}" height="${spot.h}" rx="${spot.rx}" fill="black"/></mask><filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="${W}" height="${H}" fill="rgba(0,0,0,0.78)" mask="url(#tm)"/><rect x="${spot.x}" y="${spot.y}" width="${spot.w}" height="${spot.h}" rx="${spot.rx}" fill="none" stroke="rgba(61,107,158,0.95)" stroke-width="2.5" filter="url(#glow)" style="animation:spotGlow 2s ease-in-out infinite"/>`
    :`<rect width="${W}" height="${H}" fill="rgba(0,0,0,0.78)"/>`;
  return(
    <div style={{position:'fixed',inset:0,zIndex:100,pointerEvents:'none'}}>
      <svg className="tutorial-svg" dangerouslySetInnerHTML={{__html:svgHtml}}/>
      {}
      <div className="tutorial-card" style={{bottom:`${bot}px`,pointerEvents:'all'}}>
        <div className={`tut-content${fading?' fading':''}`}>
          <div className="tut-step-num">Step {disp.step+1} of {TUT_STEPS.length}</div>
          <div className="tut-title">{disp.s.title}</div>
          <div className="tut-body">{disp.s.body}</div>
          <div className="tut-nav">
            <button className="tut-skip" onClick={()=>{haptic('tap');onDone();}}>Skip</button>
            <div className="tut-dots">
              {TUT_STEPS.map((_,i)=><div key={i} className={`tut-dot${i===disp.step?' active':''}`}/>)}
            </div>
            <button className="tut-btn primary" onClick={next} disabled={fading}>
              {disp.step===TUT_STEPS.length-1?'Done':'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
const GH_CACHE_KEY='ac_gh_cache_v1';
const GH_CACHE_TTL=4*60*60*1000; // 4 hours
function getCachedCommit(){
  try{
    const raw=localStorage.getItem(GH_CACHE_KEY);
    if(!raw) return null;
    const{ts,data}=JSON.parse(raw);
    if(Date.now()-ts>GH_CACHE_TTL) return null;
    return data;
  }catch{return null;}
}
function setCachedCommit(data){
  try{localStorage.setItem(GH_CACHE_KEY,JSON.stringify({ts:Date.now(),data}));}catch{}
}
function renderMarkdown(text){
  if(!text) return null;
  const lines=text.split('\n');
  const out=[];
  let listBuf=[];
  let key=0;
  const flushList=()=>{
    if(!listBuf.length) return;
    out.push(<ul key={key++} className="cl-md-list">{listBuf.map((l,i)=><li key={i}>{inlineRender(l)}</li>)}</ul>);
    listBuf=[];
  };
  const inlineRender=str=>{
    const parts=[];
    const re=/(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|~~(.+?)~~)/g;
    let last=0,m;
    while((m=re.exec(str))!==null){
      if(m.index>last) parts.push(str.slice(last,m.index));
      if(m[2]!==undefined) parts.push(<strong key={m.index}>{m[2]}</strong>);
      else if(m[3]!==undefined) parts.push(<em key={m.index}>{m[3]}</em>);
      else if(m[4]!==undefined) parts.push(<code key={m.index} className="cl-md-code">{m[4]}</code>);
      else if(m[5]!==undefined) parts.push(<s key={m.index}>{m[5]}</s>);
      last=m.index+m[0].length;
    }
    if(last<str.length) parts.push(str.slice(last));
    return parts.length===1&&typeof parts[0]==='string'?parts[0]:parts;
  };
  for(const line of lines){
    const hm=line.match(/^(#{1,3})\s+(.+)/);
    const lm=line.match(/^[-*]\s+(.*)/);
    const empty=line.trim()==='';
    if(hm){
      flushList();
      const Tag=`h${hm[1].length+2}`; // # → h3, ## → h4
      out.push(<Tag key={key++} className="cl-md-heading">{inlineRender(hm[2])}</Tag>);
    } else if(lm){
      listBuf.push(lm[1]);
    } else if(empty){
      flushList();
    } else {
      flushList();
      out.push(<p key={key++} className="cl-md-p">{inlineRender(line)}</p>);
    }
  }
  flushList();
  return out.length?out:null;
}
function ChangelogModal({onClose}){
  const [commit,setCommit]=useState(null);
  const [err,setErr]=useState(false);
  const [showAgain,setShowAgain]=useState(true);
  useEffect(()=>{
    const cached=getCachedCommit();
    if(cached){setCommit(cached);return;}
    fetch(GH_COMMITS_URL,{headers:{'Accept':'application/vnd.github.v3+json'}})
      .then(r=>{if(!r.ok)throw new Error('fetch failed');return r.json();})
      .then(data=>{
        if(!data||!data[0]) throw new Error('empty');
        const c=data[0];
        const parsed={
          sha:c.sha.slice(0,7),
          fullSha:c.sha,
          msg:c.commit.message.split('\n')[0],
          body:c.commit.message.split('\n').slice(2).join('\n').trim()||null,
          date:new Date(c.commit.author.date).toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'}),
        };
        setCachedCommit(parsed);
        setCommit(parsed);
      })
      .catch(()=>setErr(true));
  },[]);
  const handleClose=()=>{
    if(commit) lsSet(LS_CHANGELOG,{sha:commit.fullSha,showAgain});
    onClose();
  };
  return(
    <div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)handleClose();}}>
      <div className="changelog-card" onClick={e=>e.stopPropagation()}>
        <div className="changelog-header">
          <div className="changelog-icon-row">
            <div className="changelog-logo"><i className="fa-solid fa-apple-whole" style={{fontSize:'18px'}}/></div>
            <div>
              <div className="changelog-title">What's New</div>
              <div className="changelog-subtitle">Latest update · Apple-Counter</div>
            </div>
          </div>
        </div>
        <div className="changelog-body">
          {err?(
            <div className="changelog-error">
              <div style={{opacity:.4,marginBottom:'8px'}}><Icon path={PATH.closeX} size={22}/></div>
              <div>Couldn't load changelog.</div>
              <div style={{fontSize:'12px',marginTop:'4px',opacity:.6}}>Check your connection and try again.</div>
            </div>
          ):!commit?(
            <div className="changelog-loading">
              <div className="changelog-spinner"/>
              <span>Fetching update…</span>
            </div>
          ):(
            <div className="changelog-commit">
              <div className="changelog-commit-msg">{commit.msg}</div>
              {commit.body&&<div className="changelog-commit-body">{renderMarkdown(commit.body)}</div>}
              <div className="changelog-commit-meta">
                <span className="changelog-sha">{commit.sha}</span>
                <span className="changelog-date">{commit.date}</span>
                <span className="changelog-latest-badge">Latest</span>
              </div>
            </div>
          )}
        </div>
        <div className="changelog-footer">
          <div className="changelog-hide-row">
            <input id="cl-show" type="checkbox" className="changelog-checkbox"
              checked={showAgain} onChange={e=>setShowAgain(e.target.checked)}/>
            <label htmlFor="cl-show" className="changelog-hide-label">
              Notify me again when there's a new update
            </label>
          </div>
          <button className="changelog-close-btn" onClick={()=>{haptic('tap');handleClose();}}>Got it</button>
        </div>
      </div>
    </div>
  );
}
function ConfirmModal({title,body,confirmLabel,onConfirm,onCancel}){
  return(
    <div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)onCancel();}}>
      <div className="modal-card" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        <div className="modal-body">{body}</div>
        <div className="modal-actions">
          <button className="modal-btn danger" onClick={onConfirm}>{confirmLabel}</button>
          <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
function AboutModal({onClose}){
  return(
    <div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal-card" onClick={e=>e.stopPropagation()}>
        <div className="about-logo"><i className="fa-solid fa-apple-whole" style={{fontSize:'36px'}}/></div>
        <div className="about-tagline">"Counting is freakin' hard, man."</div>
        <div className="about-credit">Created by <strong>Garrett</strong> to make counting your drawer easier.<br/><br/>Apple-Counter helps you quickly total up your drawer and figure out exactly what needs to be dropped — almost set it and forget it!<br/><br/>Advanced algorithms calculate the best possible drawer makeup. No more ending up with barely any ones or way too many twenties.</div>
        <div className="modal-actions" style={{marginTop:'22px'}}><button className="modal-btn cancel" onClick={onClose}>Close</button></div>
      </div>
    </div>
  );
}
function NewRecord({amount,onDismiss}){
  return(
    <div className="record-overlay" onClick={onDismiss}>
      <div className="record-card" onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:'12px'}}>
          <Icon path={PATH.trophy} size={52} stroke="#d29922" strokeWidth="1.5"/>
        </div>
        <div className="record-title">New Drop Record!</div>
        <div className="record-amount">${amount.toFixed(2)}</div>
        <div className="record-sub">That's your biggest drop yet. Nice work!</div>
        <button className="record-dismiss" onClick={onDismiss}>Awesome!</button>
      </div>
    </div>
  );
}
function AnimatedSheet({onClose,children,scrollable=false}){
  const [closing,triggerClose]=useSheetClose(onClose);
  const drag=useSheetDismiss(triggerClose);
  useEffect(()=>{
    const body=document.body;
    const prevOverflow=body.style.overflow;
    const prevPadding=body.style.paddingRight;
    body.style.overflow='hidden';
    return()=>{body.style.overflow=prevOverflow;body.style.paddingRight=prevPadding;};
  },[]);
  const handleBackdropClick=e=>{
    if(e.target===e.currentTarget){haptic('tap');triggerClose();}
  };
  return(
    <div className={`sheet-backdrop${closing?' closing':''}`} onClick={handleBackdropClick}>
      <div
        className={`sheet${scrollable?' scrollable':''}`}
        ref={drag.ref}
      >
        {children(triggerClose)}
      </div>
    </div>
  );
}
function Sparkline({data,stroke=['var(--brand)','var(--green)'],fill=['rgba(88,166,255,.18)','rgba(88,166,255,0)']}){
  if(!data||data.length<2) return null;
  const idRef=useRef(++sparkSeq);
  const strokeId=`spark-stroke-${idRef.current}`;
  const fillId=`spark-fill-${idRef.current}`;
  const glowId=`spark-glow-${idRef.current}`;
  const clipId=`spark-clip-${idRef.current}`;
  const W=200,H=56,PAD=4;
  const min=Math.min(...data);
  const max=Math.max(...data);
  const range=max-min||1;
  const pts=data.map((d,i)=>{
    const x=PAD+(i/(data.length-1))*(W-PAD*2);
    const y=PAD+((1-(d-min)/range))*(H-PAD*2);
    return[x,y];
  });
  const buildPath=ps=>{
    if(ps.length<2) return '';
    let d=`M${ps[0][0]},${ps[0][1]}`;
    for(let i=1;i<ps.length;i++){
      const[x0,y0]=ps[i-1],[x1,y1]=ps[i];
      const cx=(x0+x1)/2;
      d+=` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
    }
    return d;
  };
  const linePath=buildPath(pts);
  const last=pts[pts.length-1];
  const fillPath=`${linePath} L${last[0]},${H} L${pts[0][0]},${H} Z`;
  return(
    <svg className="sparkline" viewBox={`0 0 ${W} ${H}`} style={{color:stroke[1],overflow:'visible'}}>
      <defs>
        <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor={stroke[0]}/>
          <stop offset="100%" stopColor={stroke[1]}/>
        </linearGradient>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill[0]}/>
          <stop offset="100%" stopColor={fill[1]}/>
        </linearGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.8" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id={clipId}><rect x="0" y="0" width={W} height={H}/></clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path d={fillPath} fill={`url(#${fillId})`} stroke="none"/>
        <path d={linePath} fill="none" stroke={`url(#${strokeId})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <circle cx={last[0]} cy={last[1]} r="3.2" fill={stroke[1]} filter={`url(#${glowId})`} className="sparkline-dot"/>
    </svg>
  );
}
const HISTORY_FILTERS=[
  {id:'all',label:'All'},
  {id:'over',label:'Over target'},
  {id:'under',label:'Under target'},
  {id:'record',label:'Record'},
];
function HistoryPanel({onClose,onRecordCleared}){
  const [history,setHistory]=useState(loadHistory);
  const [showCC,setShowCC]=useState(false);
  const [query,setQuery]=useState('');
  const [activeFilter,setActiveFilter]=useState('all');
  const searchRef=useRef(null);
  const record=lsGet(LS_RECORD,0);
  const clearHistory=()=>{haptic('destruct');localStorage.removeItem(LS_HISTORY);setHistory([]);setShowCC(false);onRecordCleared?.();};
  const ordered=history.slice().reverse();
  const recent=ordered.slice(-14);
  const drops=recent.map(e=>e.dropped);
  const avgDrop=drops.length?drops.reduce((s,v)=>s+v,0)/drops.length:0;
  const dropStroke=['#2ea043','#58a6ff'];
  const dropFill=['rgba(46,160,67,.25)','rgba(46,160,67,0)'];
  const filtered=ordered.filter(e=>{
    if(activeFilter==='over'&&e.totalCash<(e.target||0)) return false;
    if(activeFilter==='under'&&e.totalCash>=(e.target||0)) return false;
    if(activeFilter==='record'&&e.dropped!==record) return false;
    if(query.trim()){
      const q=query.trim().toLowerCase();
      const date=formatTime(e.ts).toLowerCase();
      const counted=`$${e.totalCash.toFixed(2)}`;
      const dropped=`$${e.dropped.toFixed(2)}`;
      const target=`$${(e.target||0).toFixed(2)}`;
      const bills=(e.dropDetails||[]).map(d=>`${d.count} ${d.label}`).join(' ').toLowerCase();
      if(![date,counted,dropped,target,bills].some(s=>s.includes(q))) return false;
    }
    return true;
  });
  const isFiltering=query.trim()!==''||activeFilter!=='all';
  return(
    <>
      <AnimatedSheet onClose={onClose} scrollable>
        {(close)=>(
          <>
            <div className="sheet-handle"><div className="sheet-handle-bar"/></div>
            <div className="sheet-hd">
              <span className="sheet-title">Drop History</span>
              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                {history.length>0&&<button className="clear-btn" onClick={()=>{haptic('tap');setShowCC(true);}}>Clear All</button>}
                <button className="icon-btn" onClick={()=>{haptic('tap');close();}}><Icon path={PATH.closeX} size={18}/></button>
              </div>
            </div>
            <div className="sheet-body">
              {history.length>0&&(
                <>
                  <div className="history-trends" style={{gridTemplateColumns:'1fr'}}>
                    <div className="trend-card">
                      <div className="trend-title">Avg drop</div>
                      <div className="trend-value">${avgDrop.toFixed(2)}</div>
                      <Sparkline data={drops} stroke={dropStroke} fill={dropFill}/>
                    </div>
                  </div>
                  <div className="history-search-wrap">
                    <div className="history-search-row">
                      <span className="history-search-icon"><Icon path={PATH.search} size={15}/></span>
                      <input
                        ref={searchRef}
                        className="history-search-input"
                        type="text"
                        placeholder="Search by date, amount, bills…"
                        value={query}
                        onChange={e=>setQuery(e.target.value)}
                      />
                      {query&&(
                        <button className="history-search-clear" onClick={()=>{setQuery('');searchRef.current?.focus();}}>
                          <Icon path={PATH.closeX} size={11}/>
                        </button>
                      )}
                    </div>
                    <div className="history-filter-chips">
                      {HISTORY_FILTERS.map(f=>(
                        <button key={f.id}
                          className={`history-filter-chip${activeFilter===f.id?' active':''}`}
                          onClick={()=>{haptic('tap');setActiveFilter(f.id);}}>
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {isFiltering&&(
                    <div className="history-results-count">
                      {filtered.length} result{filtered.length!==1?'s':''}
                    </div>
                  )}
                </>
              )}
              {history.length===0?(
                <div className="history-empty">
                  <div className="history-empty-icon"><Icon path={PATH.clock} size={22}/></div>
                  <div style={{fontWeight:700,fontSize:'15px',marginBottom:'6px'}}>No drops yet</div>
                  <div style={{fontSize:'13px',opacity:.6}}>Completed counts will appear here</div>
                </div>
              ):filtered.length===0?(
                <div className="history-empty">
                  <div className="history-empty-icon"><Icon path={PATH.search} size={22}/></div>
                  <div style={{fontWeight:700,fontSize:'15px',marginBottom:'6px'}}>No results</div>
                  <div style={{fontSize:'13px',opacity:.6}}>Try a different search or filter</div>
                </div>
              ):filtered.map((e,i)=>(
                <div key={i} className={`history-entry${e.dropped===record&&record>0?' record':''}`}>
                  <div className="history-meta">
                    <span className="history-time">{formatTime(e.ts)}</span>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      {e.dropped===record&&record>0&&<span className="record-badge">Record</span>}
                      <span className="history-target">target ${e.target?.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="stat-grid">
                    <div className="stat-pill neutral"><div className="stat-pill-label">Counted</div><div className="stat-pill-value">${e.totalCash.toFixed(2)}</div></div>
                    <div className="stat-pill green"><div className="stat-pill-label">Dropped</div><div className="stat-pill-value">${e.dropped.toFixed(2)}</div></div>
                    <div className="stat-pill dark"><div className="stat-pill-label">Remains</div><div className="stat-pill-value">${e.remaining.toFixed(2)}</div></div>
                  </div>
                  {e.dropDetails?.length>0&&<div className="history-chips">{e.dropDetails.map(d=><span key={d.label} className="history-chip">{d.count}× {d.label}</span>)}</div>}
                </div>
              ))}
            </div>
          </>
        )}
      </AnimatedSheet>
      {showCC&&<ConfirmModal title="Clear history?" body="This deletes all saved drops from this device. You can’t undo this action." confirmLabel="Delete all history" onConfirm={clearHistory} onCancel={()=>setShowCC(false)}/>}
    </>
  );
}
function SettingsPanel({onClose,settings,onChange,onReplayTutorial,onShowAbout,onShowChangelog,onShowHistory}){
  return(
    <AnimatedSheet onClose={onClose}>
      {(close)=>(
        <>
          <div className="sheet-handle"><div className="sheet-handle-bar"/></div>
          <div className="sheet-hd">
            <span className="sheet-title">Settings</span>
            <button className="icon-btn" onClick={()=>{haptic('tap');close();}}><Icon path={PATH.closeX} size={18}/></button>
          </div>
          <div style={{paddingBottom:'env(safe-area-inset-bottom, 20px)'}}>
            <div className="settings-row">
              <div><div className="settings-label">Drop History</div><div className="settings-sub">Review past drops &amp; totals</div></div>
              <button className="settings-action" onClick={()=>{haptic('tap');close();onShowHistory();}}>View</button>
            </div>
            <div className="settings-row">
              <div><div className="settings-label">Gamification</div><div className="settings-sub">High-score flag, record alerts & confetti</div></div>
              <Toggle on={settings.gamification} onChange={()=>{haptic('tap');onChange('gamification',!settings.gamification);}}/>
            </div>
            <div className="settings-row">
              <div><div className="settings-label">Tutorial</div><div className="settings-sub">Replay the onboarding walkthrough</div></div>
              <button className="settings-action" onClick={()=>{haptic('tap');onReplayTutorial();close();}}>Replay</button>
            </div>
            <div className="settings-row">
              <div><div className="settings-label">Changelog</div><div className="settings-sub">See recent updates & commit history</div></div>
              <button className="settings-action" onClick={()=>{haptic('tap');close();onShowChangelog();}}>View</button>
            </div>
            <div className="settings-row">
              <div><div className="settings-label">About</div><div className="settings-sub">Who made this and why</div></div>
              <button className="settings-action" onClick={()=>{haptic('tap');close();onShowAbout();}}>About</button>
            </div>
          </div>
        </>
      )}
    </AnimatedSheet>
  );
}


function ScrollToTop(){
  useLayoutEffect(()=>{
    window.scrollTo({top:0,behavior:'auto'});
  },[]);
  return null;
}
function App(){
  useEffect(()=>{
    const el=document.getElementById('pre-sk');
    const elFt=document.getElementById('pre-sk-footer');
    if(!el) return;
    const remove=()=>{try{el.remove();elFt?.remove();}catch{}};
    if(typeof requestAnimationFrame==='function'){
      requestAnimationFrame(()=>requestAnimationFrame(remove));
    } else {
      setTimeout(remove,0);
    }
  },[]);
  const {toast,show:showToast}=useToast();
  const prevOver=useRef(false);
  const thmTm=useRef(null);
  const [theme,setTheme]=useState(()=>document.documentElement.getAttribute('data-theme')||lsGet(LS_THEME,'dark'));
  const toggleTheme=useCallback(()=>{
    haptic('tap');
    const html=document.documentElement;
    const next=html.getAttribute('data-theme')==='dark'?'light':'dark';
    applyTheme(next);
    lsSet(LS_THEME,next);
    setTheme(next);
    thmTm.current=setTimeout(()=>html.classList.remove('thm'),250);
  },[]);
  const initialStateRef=useRef(null);
  if(initialStateRef.current===null) initialStateRef.current=loadAppState();
  const initialState=initialStateRef.current;
  const [settings,setSettings]=useState(()=>lsGet(LS_SETTINGS,{gamification:true}));
  const [recordDrop,setRecordDrop]=useState(()=>lsGet(LS_RECORD,0));
  const [showTutorial,setShowTutorial]=useState(()=>!lsGet(LS_TUTORIAL,false));
  const [targetInput,setTargetInput]=useState(initialState.targetInput);
  const [billsMode,setBillsMode]=useState(initialState.billsMode);
  const [coinsMode,setCoinsMode]=useState(initialState.coinsMode);
  const [cash,setCash]=useState(initialState.cash);
  const [coinRolls,setCoinRolls]=useState(initialState.coinRolls);
  const [page,setPage]=useState(initialState.page);
  const [pageDir,setPageDir]=useState(null); // 'fwd' | 'back' | null
  const [prevPage,setPrevPage]=useState(null);
  const [transitioning,setTransitioning]=useState(false);
  const [drawerOpen,setDrawerOpen]=useState(true);
  const [showHistory,setShowHistory]=useState(false);
  const [showSettings,setShowSettings]=useState(false);
  const [showAbout,setShowAbout]=useState(false);
  const [showChangelog,setShowChangelog]=useState(false);
  const [showResetConfirm,setShowResetConfirm]=useState(false);
  const [showRecord,setShowRecord]=useState(null);
  const [hintDone,setHintDone]=useState(()=>lsGet(LS_HINT,false));
  const dismissHint=useCallback(()=>{setHintDone(true);lsSet(LS_HINT,true);},[]);
  const appState=useMemo(()=>({cash,targetInput,billsMode,coinsMode,coinRolls,page}),[cash,targetInput,billsMode,coinsMode,coinRolls,page]);
  useDebouncedAppState(appState);
  const [anyFocused,setAnyFocused]=useState(false);
  useEffect(()=>{
    // Use visualViewport for reliable keyboard detection on iOS/Android
    const vv=window.visualViewport;
    if(vv){
      let baseHeight=vv.height;
      let tmRef=null;
      const onResize=()=>{
        clearTimeout(tmRef);
        tmRef=setTimeout(()=>{
          const shrunk=vv.height<baseHeight*0.85;
          setAnyFocused(shrunk);
          if(!shrunk) baseHeight=Math.max(baseHeight,vv.height);
        },60);
      };
      vv.addEventListener('resize',onResize);
      return()=>{vv.removeEventListener('resize',onResize);clearTimeout(tmRef);};
    }
    // Fallback: focus tracking
    const onFocus=e=>{if(e.target.tagName==='INPUT')setAnyFocused(true);};
    const onBlur=e=>{if(e.target.tagName==='INPUT')setAnyFocused(false);};
    document.addEventListener('focusin',onFocus);
    document.addEventListener('focusout',onBlur);
    return()=>{document.removeEventListener('focusin',onFocus);document.removeEventListener('focusout',onBlur);};
  },[]);
  const TARGET=Math.max(0,Number(targetInput)||0);
  let totalBillsCents=0;
  for(const d of BILL_DENOMS){
    totalBillsCents+=toCents(rowValue(cash[String(d)],d,billsMode));
  }
  let totalCoinsCents=0;
  for(const c of COIN_DENOMS){
    const extra=coinsMode==='count'?rollExtraCount(c.id,coinRolls[c.id]):0;
    totalCoinsCents+=toCents(rowValue(cash[c.id],c.val,coinsMode,extra));
  }
  const totalCents=totalBillsCents+totalCoinsCents;
  const totalCash=fromCents(totalCents);
  const overageCents=totalCents-toCents(TARGET);
  const dropAmount=fromCents(Math.max(0,overageCents));
  const dropDetails=computeDrop(cash,billsMode,dropAmount,TARGET);
  const actualDropTotal=dropDetails.reduce((s,i)=>s+i.value,0);
  const remainingCents=totalCents-toCents(actualDropTotal);
  const remainingDrawer=fromCents(remainingCents);
  const undroppableCents=overageCents>0?toCents(dropAmount)-toCents(actualDropTotal):0;
  const over=totalCash>=TARGET;
  useEffect(()=>{
    if(totalCash<=0){prevOver.current=over;return;}
    if(!prevOver.current&&over){haptic('success');showToast('Target reached','success');}
    prevOver.current=over;
  },[over,totalCash,showToast]);
  const changeSetting=(k,v)=>setSettings(prev=>{const n={...prev,[k]:v};lsSet(LS_SETTINGS,n);return n;});
  const handleBillsModeChange=useCallback(m=>{setCash(prev=>convertCash(prev,billsMode,m,BILL_DENOMS.map(d=>({id:String(d),val:d}))));setBillsMode(m);},[billsMode]);
  const handleCoinsModeChange=useCallback((nextMode)=>{
    if(nextMode===coinsMode) return;
    if(coinsMode==='count'&&nextMode==='value'){
      const nextCash={...cash};
      COIN_DENOMS.forEach(c=>{
        const loose=Number(cash[c.id])||0;
        const rolls=Number(coinRolls[c.id])||0;
        const totalCount=Math.floor(loose)+rollExtraCount(c.id,rolls);
        const totalValue=fromCents(totalCount*toCents(c.val));
        nextCash[c.id]=totalValue?totalValue.toFixed(2):'';
      });
      setCash(nextCash);
      setCoinRolls(EMPTY_ROLLS);
    } else if(coinsMode==='value'&&nextMode==='count'){
      const nextCash={...cash};
      const nextRolls={...EMPTY_ROLLS};
      COIN_DENOMS.forEach(c=>{
        const totalCount=Math.floor(toCents(Number(cash[c.id])||0)/toCents(c.val));
        if(c.roll){
          const rolls=Math.floor(totalCount/c.roll);
          const loose=totalCount-(rolls*c.roll);
          nextRolls[c.id]=rolls;
          nextCash[c.id]=loose?String(loose):'';
        } else {
          nextCash[c.id]=totalCount?String(totalCount):'';
        }
      });
      setCash(nextCash);
      setCoinRolls(nextRolls);
    } else {
      setCash(prev=>convertCash(prev,coinsMode,nextMode,COIN_DENOMS));
      setCoinRolls(EMPTY_ROLLS);
    }
    setCoinsMode(nextMode);
  },[coinsMode,cash,coinRolls]);
  const handleManualInput=useCallback((id,val,mode)=>{
    const re=mode==='count'?/^\d*$/:/^\d*\.?\d*$/;
    if(val===''||re.test(val)) setCash(prev=>({...prev,[id]:val}));
  },[]);
  const handleStep=useCallback((id,delta,denom,mode)=>{
    setCash(prev=>{
      const cur=Number(prev[id])||0,step=mode==='count'?1:denom,next=Math.max(0,cur+delta*step);
      const val=mode==='value'?parseFloat(next.toFixed(2)):Math.round(next);
      return{...prev,[id]:val===0?'':String(val)};
    });
  },[]);
  const handleCoinRoll=useCallback((id,delta)=>{
    setCoinRolls(prev=>{
      const cur=Math.max(0,Math.floor(Number(prev[id])||0));
      const next=Math.max(0,cur+delta);
      if(next===cur) return prev;
      return{...prev,[id]:next};
    });
  },[]);
  const handleCoinRollSet=useCallback((id,val)=>{
    setCoinRolls(prev=>{
      const next=Math.max(0,Math.floor(Number(val)||0));
      if(next===prev[id]) return prev;
      return{...prev,[id]:next};
    });
  },[]);
  const navTm=useRef(null);
  const navigateTo=(targetPage,dir)=>{
    if(transitioning) return;
    setPageDir(dir);
    setPrevPage(page);
    setTransitioning(true);
    setPage(targetPage);
    clearTimeout(navTm.current);
    navTm.current=setTimeout(()=>{setTransitioning(false);setPrevPage(null);setPageDir(null);},300);
  };
  useEffect(()=>()=>clearTimeout(navTm.current),[]);
  const goToResult=()=>{
    if(totalCash<=0){haptic('warning');showToast('Add your drawer counts before calculating','error');return;}
    haptic('success');
    pushHistory({ts:Date.now(),totalCash,dropped:actualDropTotal,remaining:remainingDrawer,target:TARGET,dropDetails});
    const CONFETTI_THRESHOLD = 5000; // cents — $50.00
    const isNewRecord = settings.gamification && actualDropTotal > 0 && actualDropTotal > recordDrop;
    const isBigDrop   = settings.gamification && toCents(actualDropTotal) >= CONFETTI_THRESHOLD;
    if(isNewRecord){
      lsSet(LS_RECORD,actualDropTotal); setRecordDrop(actualDropTotal);
      setTimeout(()=>{haptic('record'); launchConfetti(); setShowRecord(actualDropTotal);}, 400);
    } else if(isBigDrop){
      setTimeout(()=>{haptic('success'); launchConfetti();}, 350);
    }
    navigateTo(2,'fwd');
  };
  const goToCount=()=>{haptic('tap');navigateTo(1,'back');};
  const doReset=()=>{haptic('destruct');setCash(EMPTY_CASH);setCoinRolls(EMPTY_ROLLS);setPage(1);setShowResetConfirm(false);};
  const billStep=useCallback((id,d,denom)=>handleStep(id,d,denom,billsMode),[handleStep,billsMode]);
  const coinStep=useCallback((id,d,denom)=>handleStep(id,d,denom,coinsMode),[handleStep,coinsMode]);
  const anyModalOpen=showHistory||showSettings||showAbout||showChangelog||showResetConfirm||showTutorial||!!showRecord;
  return(
    <div style={{minHeight:'100vh'}}>
      <header className="gh-header">
        <div className="gh-header-brand">
          <div className="gh-logo"><i className="fa-solid fa-apple-whole" style={{fontSize:'20px'}}/></div>
          <div className="gh-header-title">Apple-Counter</div>
        </div>
        <div className="gh-header-actions" id="header-actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme" title={theme==='dark'?'Switch to light mode':'Switch to dark mode'}><Icon path={theme==='dark'?PATH.sun:PATH.moon} size={17}/></button>
          <button className="icon-btn" onClick={()=>{haptic('tap');setShowSettings(true);}} aria-label="Settings" title="Settings"><Icon path={PATH.settings} size={17}/></button>
          <button className="icon-btn" onClick={()=>{haptic('tap');setShowResetConfirm(true);}} aria-label="Reset counts" title="Reset counts"><Icon path={PATH.refresh} size={17}/></button>
        </div>
      </header>
      <main className="main-content">
        <div className="page-root">
            {page===1&&(
              <div className={`page-slide${pageDir==='back'&&page===1?' slide-enter-back':''}`} style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                <ScrollToTop/>
                <CollapsibleSection id="bills-card" label="Bills" badge={`$${fromCents(totalBillsCents).toFixed(2)}`} mode={billsMode} onModeChange={handleBillsModeChange} defaultOpen={true}>
                  <div className="section-body">
                    {BILL_DENOMS.map((d,i)=>(
                      <BillRow key={d} id={String(d)} label={`$${d}`} denom={d}
                        inputMode={billsMode} value={cash[String(d)]}
                        onManualInput={handleManualInput} onStep={billStep}
                        showHint={i===0&&!hintDone} onHintDismiss={dismissHint}/>
                    ))}
                  </div>
                </CollapsibleSection>
                <CollapsibleSection id="coins-card" label="Coins" badge={`$${fromCents(totalCoinsCents).toFixed(2)}`} mode={coinsMode} onModeChange={handleCoinsModeChange} defaultOpen={false}>
                  <div className="section-body">
                    {COIN_DENOMS.map((c,i)=>(
                      <CoinRow key={c.id} id={c.id} label={c.label} denom={c.val}
                        rollCount={c.roll} rolls={coinRolls[c.id]} onRoll={handleCoinRoll} onRollSet={handleCoinRollSet}
                        inputMode={coinsMode} value={cash[c.id]}
                        onManualInput={handleManualInput} onStep={coinStep}
                        showHint={i===0&&!hintDone} onHintDismiss={dismissHint}/>
                    ))}
                  </div>
                </CollapsibleSection>
                <div className="hold-hint">Tap input to type · hold +/- to repeat</div>
              </div>
            )}
            {page===2&&(
            <div style={{display:'flex',flexDirection:'column',gap:'12px',paddingBottom:'16px'}}>
            <ScrollToTop/>
            <button className="back-btn" onClick={goToCount}><Icon path={PATH.arrowL} size={18}/> Back to edit</button>
            <div className="rc drop-hero">
              <div className="drop-hero-top">
                <div className="drop-eyebrow">Drop Safe</div>
                <div className="drop-amount" title="Tap to copy" onClick={()=>{
                  const txt=`$${actualDropTotal.toFixed(2)}`;
                  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(txt).catch(()=>{});}
                  haptic('tap');
                }}>
                  <CountUp key="drop-total" value={actualDropTotal} format={formatMoney}/>
                </div>
                <div className="drop-sub">
                  from <CountUp key="counted-total" value={totalCash} format={formatMoney}/> counted · target <CountUp key="target-val" value={TARGET} format={formatMoney}/>
                </div>
              </div>
              <div style={{padding:'0 14px 14px'}}>
                <div className="pull-label" style={{marginTop:'14px'}}>Pull these bills</div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    {dropDetails.length>0?<PullRows dropDetails={dropDetails}/>:(
                    overageCents===0&&totalCash>0?(
                      <div className="perfect-state">
                        <span className="perfect-emoji">📋</span>
                        <div className="perfect-title">Perfect balance</div>
                        <div className="perfect-sub">Drawer is sitting right at ${TARGET.toFixed(2)}.<br/>Nothing to pull — you can close with confidence.</div>
                      </div>
                    ):(
                      <div className="empty-state">
                        <div className="empty-icon"><Icon path={PATH.check} size={22}/></div>
                        <div style={{fontWeight:700,fontSize:'16px',color:'var(--t0)',marginBottom:'6px'}}>No drop needed</div>
                        <div style={{fontSize:'13px',color:'var(--t1)'}}>Drawer is at or below target — you’re good to go.</div>
                      </div>
                    )
                  )}
                </div>
                {undroppableCents>0&&(
                  <div className="warn-banner">
                    <div className="warn-dot">!</div>
                    <div>
                      <div className="warn-title"><CountUp key="undrop" value={fromCents(undroppableCents)} format={formatMoney}/> couldn't be dropped</div>
                      <div className="warn-body">No matching bills — this overage stays in the drawer.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="rc drawer-card">
              <div className="drawer-header">
                <div>
                  <div style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.7px',color:'var(--t1)',marginBottom:'4px'}}>Leave in Drawer</div>
                  <div className="drawer-total"><CountUp key="drawer-total" value={remainingDrawer} format={formatMoney}/></div>
                </div>
                <button className="breakdown-btn" onClick={()=>{haptic('tap');setDrawerOpen(v=>!v);}}>
                  Breakdown
                  <Icon path={PATH.chevD} size={16} className={`breakdown-chev${drawerOpen?' open':''}`}/>
                </button>
              </div>
              <BreakdownCollapse open={drawerOpen}>
                <div className="breakdown-body">
                  <div style={{marginBottom:'16px'}}>
                    <div className="breakdown-section-title">
                      <span>Bills</span>
                      <span className="breakdown-subtotal">
                        <CountUp key="bills-subtotal" value={fromCents(totalBillsCents-toCents(actualDropTotal))} format={formatMoney}/>
                      </span>
                    </div>
                    {(()=>{
                      const rows=BILL_DENOMS.map(d=>{
                        const sv=rowValue(cash[String(d)],d,billsMode),drop=dropDetails.find(i=>i.denom===d);
                        const fv=sv-(drop?drop.value:0),fc=Math.round(fv/d);
                        if(fc<=0)return null;
                        return(
                          <div key={d} className="breakdown-row">
                            <div className="breakdown-left">
                              <div className="chip-bill">${d}</div>
                              <span className="breakdown-count">× {fc}</span>
                            </div>
                            <span className="breakdown-val">
                              <CountUp key={`bill-row-${d}`} value={fv} format={formatMoney}/>
                            </span>
                          </div>
                        );
                      }).filter(Boolean);
                      return rows.length>0?rows:<div className="breakdown-empty">No bills remaining</div>;
                    })()}
                  </div>
                  <div>
                    <div className="breakdown-section-title">
                      <span>Coins</span>
                      <span className="breakdown-subtotal">
                        <CountUp key="coins-subtotal" value={fromCents(totalCoinsCents)} format={formatMoney}/>
                      </span>
                    </div>
                    {(()=>{
                      const rows=COIN_DENOMS.map(c=>{
                        const extra=coinsMode==='count'?rollExtraCount(c.id,coinRolls[c.id]):0;
                        const val=rowValue(cash[c.id],c.val,coinsMode,extra);
                        const count=rowCount(cash[c.id],c.val,coinsMode,extra);
                        if(count<=0)return null;
                        return(
                          <div key={c.id} className="breakdown-row">
                            <div className="breakdown-left">
                              <div className="chip-coin">{c.label}</div>
                              <span className="breakdown-count">× {count}</span>
                            </div>
                            <span className="breakdown-val">
                              <CountUp key={`coin-row-${c.id}`} value={val} format={formatMoney}/>
                            </span>
                          </div>
                        );
                      }).filter(Boolean);
                      return rows.length>0?rows:<div className="breakdown-empty">No coins remaining</div>;
                    })()}
                  </div>
                </div>
              </BreakdownCollapse>
            </div>
            {}
            <div className="rc">
              <ShareButton report={buildReport({totalCash,actualDropTotal,remainingDrawer,TARGET,dropDetails,billsMode,cash,coinsMode})}/>
            </div>
            </div>
            )}
          </div>
      </main>
      {page===1&&(
        <>
        <div className="footer-floor"/>
        <div className={`sticky-footer${anyFocused?' keyboard-up':''}`}>
          {}
          <div className="footer-top-row">
            <div>
              <div className="footer-total-label">Total Counted</div>
              <AnimatedTotal value={`$${totalCash.toFixed(2)}`} className={`footer-total-value${over?' over':''}`}/>
            </div>
            <div className="target-row" style={{marginTop:0,textAlign:'right'}}>
              <div className="target-meta" style={{marginBottom:'5px',justifyContent:'flex-end'}}>
                <div className="target-label-group">
                  Target $
                  <input type="number" min="0" step="any" inputMode="decimal" enterKeyHint="done" autoComplete="off" className="target-input" value={targetInput} onChange={e=>setTargetInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}/>
                </div>
              </div>
              {totalCash>0&&(
                <span className={`target-status${over?' over':' under'}`}>
                  {over?`+$${(totalCash-TARGET).toFixed(2)} over`:`-$${(TARGET-totalCash).toFixed(2)} short`}
                </span>
              )}
            </div>
          </div>
          {}
          <div id="progress-bar" style={{marginBottom:'10px'}}>
            <ProgressBar over={over} target={TARGET} totalCash={totalCash} recordDrop={recordDrop} gamification={settings.gamification}/>
          </div>
          {}
          <button id="calc-btn" className={`btn-calc${over?' over-target':''}`} onClick={goToResult}>
            Calculate Drop <Icon path={PATH.arrowR} size={19}/>
          </button>
        </div>
        </>
      )}
      {showHistory&&<HistoryPanel onClose={()=>setShowHistory(false)} onRecordCleared={()=>{lsSet(LS_RECORD,0);setRecordDrop(0);}}/>}
      {showSettings&&<SettingsPanel onClose={()=>setShowSettings(false)} settings={settings} onChange={changeSetting} onReplayTutorial={()=>{lsSet(LS_TUTORIAL,false);setShowTutorial(true);}} onShowAbout={()=>setShowAbout(true)} onShowChangelog={()=>setShowChangelog(true)} onShowHistory={()=>setShowHistory(true)}/>}
      {showRecord&&<NewRecord amount={showRecord} onDismiss={()=>setShowRecord(null)}/>}
      {showTutorial&&<Tutorial onDone={()=>{lsSet(LS_TUTORIAL,true);setShowTutorial(false);}}/>}
      {showAbout&&<AboutModal onClose={()=>setShowAbout(false)}/>}
      {showChangelog&&<ChangelogModal onClose={()=>setShowChangelog(false)}/>}
      {showResetConfirm&&<ConfirmModal title="Reset counts?" body="This clears all current counts and starts a fresh drawer. Your drop history stays saved." confirmLabel="Reset counts" onConfirm={doReset} onCancel={()=>setShowResetConfirm(false)}/>}
      <Toast toast={toast} aboveFooter={page===1}/>
    </div>
  );
}
class ErrorBoundary extends React.Component{
  constructor(props){super(props);this.state={hasError:false};}
  static getDerivedStateFromError(){return{hasError:true};}
  componentDidCatch(err){try{console.error(err);}catch{}}
  handleReload=()=>{window.location.reload();};
  handleReset=()=>{
    try{
      const KEEP=[LS_HISTORY,LS_SETTINGS,LS_TUTORIAL,LS_RECORD,LS_THEME,LS_HINT,LS_CHANGELOG];
      const saved={};
      for(const k of KEEP){const v=localStorage.getItem(k);if(v!=null)saved[k]=v;}
      localStorage.clear();
      for(const[k,v]of Object.entries(saved))localStorage.setItem(k,v);
    }catch{}
    window.location.reload();
  };
  render(){
    if(!this.state.hasError) return this.props.children;
    return(
      <div className="error-boundary">
        <div className="error-card">
          <div className="error-title">Something went wrong</div>
          <div className="error-body">The app hit an unexpected error. You can reload, or clear local data and try again.</div>
          <div className="error-actions">
            <button className="error-btn" onClick={this.handleReload}>Reload</button>
            <button className="error-btn danger" onClick={this.handleReset}>Clear Data &amp; Reload</button>
          </div>
        </div>
      </div>
    );
  }
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App/>
  </ErrorBoundary>
);
