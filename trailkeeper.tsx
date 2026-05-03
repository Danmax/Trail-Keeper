import { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from "recharts";

const C = {
  dg:'#1B4332',mg:'#2D6A4F',lg:'#52B788',pg:'#D8F3DC',
  br:'#6B4226',lb:'#A1887F',bg:'#F0EDE6',cr:'#FAF7F2',
  sky:'#0096C7',am:'#F59E0B',wh:'#FFFFFF',gr:'#6B7280',sb:'#3ECF8E',
};
const ENV = import.meta.env || {};
const SUPABASE_CONFIG = {
  url:ENV.VITE_SUPABASE_URL||'https://uadwtvfiptyhuctkuity.supabase.co',
  anonKey:ENV.VITE_SUPABASE_ANON_KEY||'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhZHd0dmZpcHR5aHVjdGt1aXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NTkzNTcsImV4cCI6MjA5MzMzNTM1N30.L_VFMAkGTUKpALZV-g2ZCqmh4qrWiHEAWQ6rdoMlkWI',
};
const GOOGLE_HEALTH_CONFIG = {
  clientId:ENV.VITE_GOOGLE_HEALTH_CLIENT_ID||'306479197017-bljgon7bc4qrmfmqgs3hpnc2b5omft79.apps.googleusercontent.com',
};
const ADMIN_CONFIG = {
  masterPassword:ENV.VITE_ADMIN_MASTER_PASSWORD||'',
};
const TYPES = [
  {id:'all',label:'All',icon:'🌍',color:C.mg},
  {id:'tree',label:'Trees',icon:'🌳',color:'#166534'},
  {id:'plant',label:'Plants',icon:'🌿',color:C.mg},
  {id:'fungi',label:'Fungi',icon:'🍄',color:C.br},
  {id:'bird',label:'Birds',icon:'🐦',color:C.sky},
  {id:'animal',label:'Animals',icon:'🦊',color:C.am},
  {id:'landmark',label:'Landmarks',icon:'🗿',color:'#9F1239'},
];
const PARKS = [
  {id:1,name:'Everglades NP',lat:25.3855,lng:-80.4459,icon:'🌿',color:'#166534',facilities:['🚿','🅿️','♿','🍽️']},
  {id:2,name:'Biscayne Bay',lat:25.4686,lng:-80.3328,icon:'🌊',color:C.sky,facilities:['⛵','🤿','🅿️']},
  {id:3,name:'Big Cypress',lat:26.000,lng:-81.000,icon:'🌲',color:C.mg,facilities:['🏕️','🚿','🅿️']},
  {id:4,name:'Dry Tortugas',lat:24.628,lng:-82.873,icon:'🏝️',color:'#0369a1',facilities:['🤿','⛵','🏕️']},
];
const COMMUNITY = [
  {id:'c1',name:'Shark Valley Loop',explorer:'Maria G.',avatar:'🌺',dist:15.0,diff:'Moderate',likes:47,saved:false,description:'Incredible gator sightings along the canal.',tags:['wetlands','birds','alligators']},
  {id:'c2',name:'Key Biscayne Coastal',explorer:'James R.',avatar:'🦅',dist:4.2,diff:'Easy',likes:83,saved:false,description:'Stunning sunset views from the lighthouse.',tags:['coastal','sunset','birds']},
  {id:'c3',name:'Pine Island Ridge',explorer:'Sofia M.',avatar:'🌴',dist:2.8,diff:'Easy',likes:31,saved:false,description:'Old growth pines and scrub.',tags:['forest','wildlife','fungi']},
  {id:'c4',name:'Anhinga Trail',explorer:'Carlos V.',avatar:'🐦',dist:0.8,diff:'Easy',likes:124,saved:false,description:'Best wildlife trail in the Everglades.',tags:['birds','wetlands','photography']},
];
const E0 = [
  {id:'demo-1',type:'tree',name:'Live Oak',species:'Quercus virginiana',lat:25.762,lng:-80.196,date:'2026-04-28',notes:'Large canopy, Spanish moss hanging from branches',photo:null},
  {id:'demo-2',type:'bird',name:'Roseate Spoonbill',species:'Platalea ajaja',lat:25.776,lng:-80.174,date:'2026-04-27',notes:'Feeding in shallow tidal water at dusk',photo:null},
  {id:'demo-3',type:'plant',name:'Saw Palmetto',species:'Serenoa repens',lat:25.751,lng:-80.201,date:'2026-04-25',notes:'Native Florida scrub, dense thicket',photo:null},
  {id:'demo-4',type:'fungi',name:'Turkey Tail',species:'Trametes versicolor',lat:25.769,lng:-80.183,date:'2026-04-22',notes:'Beautiful concentric rings on fallen log',photo:null},
  {id:'demo-5',type:'animal',name:'Gopher Tortoise',species:'Gopherus polyphemus',lat:25.757,lng:-80.191,date:'2026-04-20',notes:'Burrow entrance visible nearby',photo:null},
  {id:'demo-6',type:'landmark',name:'Old Banyan Tree',species:null,lat:25.780,lng:-80.172,date:'2026-04-18',notes:'Historic landmark, estimated 120 years old',photo:null},
];
const TR0 = [
  {id:'trail-1',name:'Everglades Edge Loop',dist:3.2,eids:['demo-1','demo-3','demo-5'],diff:'Easy',description:'Scenic loop through native Florida scrub and wetlands',pub:true},
  {id:'trail-2',name:'Biscayne Bay Birding',dist:1.8,eids:['demo-2','demo-6'],diff:'Easy',description:'Coastal trail with incredible shore bird sightings',pub:true},
];
const CA0 = [
  {id:'cache-1',name:'Banyan Secrets',lat:25.780,lng:-80.172,clue:'Beneath the roots that arch like bridges, look for what the last explorer left behind.',found:false},
  {id:'cache-2',name:'Mangrove Mystery',lat:25.757,lng:-80.191,clue:'Where salt meets fresh water, beneath the tangled prop knees.',found:true},
];
const JN0 = [{id:'journal-1',date:'2026-04-28',title:'Morning at the Everglades',body:'Golden hour filtering through the mangroves. Spotted the spoonbill again near marker 3.'}];

function genId(){return typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:r&0x3|0x8).toString(16);});}
function haversine(a,b,c,d){const R=3958.8,dLat=(c-a)*Math.PI/180,dLng=(d-b)*Math.PI/180;const x=Math.sin(dLat/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dLng/2)**2;return +(R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))).toFixed(5);}
function trailDist(eids,entries){const pts=eids.map(id=>entries.find(e=>e.id===id)).filter(Boolean);return pts.length<2?0:+pts.slice(1).reduce((s,p,i)=>s+haversine(pts[i].lat,pts[i].lng,p.lat,p.lng),0).toFixed(2);}
function fmtDist(mi){if(mi<0.05)return Math.round(mi*5280)+' ft';if(mi<10)return mi.toFixed(2)+' mi';return mi.toFixed(1)+' mi';}
function fmtTime(s){return Math.floor(s/60)+':'+(s%60).toString().padStart(2,'0');}
function calcPace(t,d){return t>0&&d>0.01?(t/60/d).toFixed(1)+'/mi':'--';}

function getActivityBounds(pts){
  if(!pts||pts.length===0)return{latMin:25.745,latMax:25.785,lngMin:-80.208,lngMax:-80.167};
  const lats=pts.map(p=>p.lat),lngs=pts.map(p=>p.lng);
  const latSpan=Math.max(Math.max(...lats)-Math.min(...lats),0.004);
  const lngSpan=Math.max(Math.max(...lngs)-Math.min(...lngs),0.006);
  const latCen=(Math.min(...lats)+Math.max(...lats))/2,lngCen=(Math.min(...lngs)+Math.max(...lngs))/2;
  return{latMin:latCen-latSpan*0.65,latMax:latCen+latSpan*0.65,lngMin:lngCen-lngSpan*0.65,lngMax:lngCen+lngSpan*0.65};
}
function getCatalogBounds(entries,userLoc){
  const pts=[...entries.map(e=>({lat:e.lat,lng:e.lng}))];
  if(userLoc)pts.push({lat:userLoc.lat,lng:userLoc.lng});
  if(pts.length===0)return{latMin:25.745,latMax:25.785,lngMin:-80.208,lngMax:-80.167};
  const lats=pts.map(p=>p.lat),lngs=pts.map(p=>p.lng);
  const latSpan=Math.max(Math.max(...lats)-Math.min(...lats),0.012);
  const lngSpan=Math.max(Math.max(...lngs)-Math.min(...lngs),0.018);
  const latPad=latSpan*0.3,lngPad=lngSpan*0.3;
  return{latMin:Math.min(...lats)-latPad,latMax:Math.max(...lats)+latPad,lngMin:Math.min(...lngs)-lngPad,lngMax:Math.max(...lngs)+lngPad};
}
function project(lat,lng,b,W=370,H=260){return{x:Math.round((lng-b.lngMin)/(b.lngMax-b.lngMin)*W),y:Math.round(H-(lat-b.latMin)/(b.latMax-b.latMin)*H)};}
function clamp(n,min,max){return Math.min(max,Math.max(min,n));}
function lngToTileX(lng,z){return((lng+180)/360)*2**z;}
function latToTileY(lat,z){const r=lat*Math.PI/180;return(1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*2**z;}
function tileUrl(x,y,z){return 'https://tile.openstreetmap.org/'+z+'/'+x+'/'+y+'.png';}

function RealMap({points=[],userLoc=null,height=320,zoom=16,showRoute=true}){
  const W=390,H=height;
  const center=points.length?points[points.length-1]:userLoc||{lat:25.7617,lng:-80.1918};
  const z=clamp(zoom,3,19);
  const centerTile={x:lngToTileX(center.lng,z),y:latToTileY(center.lat,z)};
  const centerPx={x:centerTile.x*256,y:centerTile.y*256};
  const tiles=[];
  const x0=Math.floor(centerTile.x)-2,x1=Math.floor(centerTile.x)+2;
  const y0=Math.floor(centerTile.y)-2,y1=Math.floor(centerTile.y)+2;
  const max=2**z;
  for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++){
    if(y<0||y>=max)continue;
    const wrapped=((x%max)+max)%max;
    tiles.push({key:x+'-'+y,x:W/2+(x*256-centerPx.x),y:H/2+(y*256-centerPx.y),src:tileUrl(wrapped,y,z)});
  }
  const toPx=p=>({x:W/2+(lngToTileX(p.lng,z)*256-centerPx.x),y:H/2+(latToTileY(p.lat,z)*256-centerPx.y)});
  const routePts=points.map(toPx).map(p=>p.x+','+p.y).join(' ');
  const start=points.length?toPx(points[0]):null;
  const cur=points.length?toPx(points[points.length-1]):userLoc?toPx(userLoc):null;
  return(
    <div style={{position:'relative',height:H,overflow:'hidden',background:'#dbeafe'}}>
      {tiles.map(t=><img key={t.key} src={t.src} alt="" draggable="false" style={{position:'absolute',left:t.x,top:t.y,width:256,height:256,userSelect:'none',WebkitUserDrag:'none'}}/>)}
      <svg width="100%" height="100%" viewBox={'0 0 '+W+' '+H} preserveAspectRatio="none" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        {showRoute&&points.length>1&&<polyline points={routePts} fill="none" stroke="rgba(0,150,199,0.28)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>}
        {showRoute&&points.length>1&&<polyline points={routePts} fill="none" stroke={C.sky} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>}
        {start&&<g><circle cx={start.x} cy={start.y} r="10" fill={C.lg} stroke="white" strokeWidth="3"/><text x={start.x} y={start.y+4} textAnchor="middle" fontSize="9" fontWeight="800" fill="white">S</text></g>}
        {cur&&<g><circle cx={cur.x} cy={cur.y} r="12" fill={C.sky} opacity="0.2"><animate attributeName="r" values="12;28;12" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.35;0;0.35" dur="2s" repeatCount="indefinite"/></circle><circle cx={cur.x} cy={cur.y} r="10" fill={C.sky} stroke="white" strokeWidth="3"/><circle cx={cur.x} cy={cur.y} r="4" fill="white"/></g>}
      </svg>
      <div style={{position:'absolute',right:12,bottom:10,background:'rgba(255,255,255,0.9)',borderRadius:8,padding:'3px 7px',fontSize:10,color:C.gr,fontWeight:700}}>© OpenStreetMap</div>
      <div style={{position:'absolute',right:12,top:12,width:30,height:30,borderRadius:15,background:'rgba(255,255,255,0.92)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:C.dg}}>N</div>
    </div>
  );
}

async function reverseGeocode(lat,lng){
  try{const r=await fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat='+lat+'&lon='+lng,{headers:{'User-Agent':'TrailKeeper/1.0'}});const d=await r.json();const city=d.address?.city||d.address?.town||d.address?.village||'Your Location';const state=d.address?.state_code||'';return city+(state?', '+state:'');}
  catch{return 'Your Location';}
}
async function aiIdentify(desc,type){
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:'Expert field naturalist. Identify this '+type+': "'+desc+'". Return ONLY raw JSON array:\n[{"name":"Common Name","species":"Scientific name","confidence":"High|Medium|Low","tip":"One field ID tip"}]'}]})});
  const d=await r.json();
  return JSON.parse(d.content.map(c=>c.text||'').join('').replace(/```json|```/g,'').trim());
}
function makeQR(seed){
  let h=0;for(let i=0;i<seed.length;i++)h=Math.imul(31,h)+seed.charCodeAt(i)|0;
  const rng=()=>{h=Math.imul(h^h>>>16,0x45d9f3b)|0;h=Math.imul(h^h>>>16,0x45d9f3b)|0;return(h>>>0)/2**32;};
  const N=21,g=Array.from({length:N},()=>Array(N).fill(0));
  const fp=(r,c)=>{for(let i=0;i<7;i++)for(let j=0;j<7;j++)g[r+i][c+j]=(i===0||i===6||j===0||j===6||(i>=2&&i<=4&&j>=2&&j<=4))?1:0;};
  fp(0,0);fp(0,14);fp(14,0);
  for(let i=0;i<N;i++)for(let j=0;j<N;j++){const inFP=(i<8&&j<8)||(i<8&&j>12)||(i>12&&j<8);if(!inFP)g[i][j]=rng()>0.45?1:0;}
  return g;
}

// ── SUPABASE CLIENT ──────────────────────────────────────────────────────────
const SCHEMA_SQL = `-- Run in Supabase Dashboard → SQL Editor
create extension if not exists "uuid-ossp";

create table if not exists entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null, name text not null, species text,
  lat double precision not null, lng double precision not null,
  date text not null, notes text, photo text,
  created_at timestamptz default now()
);
create table if not exists trails (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null, dist real default 0, diff text default 'Easy',
  description text, eids text[] default '{}', pub boolean default false,
  created_at timestamptz default now()
);
create table if not exists caches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null, lat double precision not null,
  lng double precision not null, clue text,
  found boolean default false, created_at timestamptz default now()
);
create table if not exists journal (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null, title text not null, body text not null,
  created_at timestamptz default now()
);
alter table entries enable row level security;
alter table trails enable row level security;
alter table caches enable row level security;
alter table journal enable row level security;
create policy "own" on entries for all using (auth.uid() = user_id);
create policy "own" on trails for all using (auth.uid() = user_id);
create policy "own" on caches for all using (auth.uid() = user_id);
create policy "own" on journal for all using (auth.uid() = user_id);`;

function makeSB(url,key){
  const h=tok=>({'apikey':key,'Authorization':'Bearer '+(tok||key),'Content-Type':'application/json'});
  const req=async(path,opts,tok)=>{
    const headers={...h(tok),...(opts.headers||{})};
    const r=await fetch(url+path,{...opts,headers});
    const txt=await r.text();
    if(!r.ok){const e=JSON.parse(txt||'{}');throw new Error(e.error_description||e.msg||e.message||'Request failed');}
    return txt?JSON.parse(txt):null;
  };
  return{
    signUp:(email,pw)=>req('/auth/v1/signup',{method:'POST',body:JSON.stringify({email,password:pw})}),
    signIn:(email,pw)=>req('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password:pw})}),
    signOut:tok=>req('/auth/v1/logout',{method:'POST'},tok),
    get:(table,tok,q)=>req('/rest/v1/'+table+'?select=*'+(q?'&'+q:''),{},tok),
    upsert:(table,data,tok)=>req('/rest/v1/'+table,{method:'POST',body:JSON.stringify(data),headers:{'Prefer':'resolution=merge-duplicates,return=representation'}},tok),
    del:(table,id,tok)=>req('/rest/v1/'+table+'?id=eq.'+id,{method:'DELETE'},tok),
  };
}

// ── CONFIG SCREEN ────────────────────────────────────────────────────────────
function ConfigScreen({onConnect,onSkip}){
  const [url,setUrl]=useState(SUPABASE_CONFIG.url);
  const [key,setKey]=useState(SUPABASE_CONFIG.anonKey);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [showSQL,setShowSQL]=useState(false);
  const [copied,setCopied]=useState(false);

  const connect=async()=>{
    if(!url.trim()||!key.trim()){setError('Both fields are required');return;}
    setLoading(true);setError('');
    try{
      const clean=url.trim().replace(/\/$/,'');
      const r=await fetch(clean+'/auth/v1/settings',{headers:{apikey:key.trim()}});
      if(!r.ok)throw new Error();
      onConnect(clean,key.trim());
    }catch{setError('Could not connect. Check your Project URL and anon key.');}
    setLoading(false);
  };
  const copy=()=>{
    navigator.clipboard?.writeText(SCHEMA_SQL).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});
  };

  return(
    <div style={{maxWidth:430,margin:'0 auto',minHeight:'100vh',background:C.bg,fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif',boxShadow:'0 0 40px rgba(0,0,0,0.12)'}}>
      <div style={{background:'linear-gradient(155deg,'+C.dg+','+C.mg+')',padding:'60px 24px 32px',textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:10}}>🌿</div>
        <div style={{fontSize:11,fontWeight:700,color:C.pg,letterSpacing:'2px',marginBottom:6}}>TRAILKEEPER</div>
        <div style={{fontSize:22,fontWeight:800,color:C.wh}}>Connect to Supabase</div>
        <div style={{fontSize:13,color:'#a7f3d0',marginTop:6}}>Project configured and ready to verify</div>
      </div>
      <div style={{padding:'20px 16px'}}>
        {[
          {n:1,title:'Supabase project configured',body:<span>Connected to <b style={{color:C.sb}}>uadwtvfiptyhuctkuity</b>. Use this screen if you need to verify or change projects.</span>},
          {n:2,title:'Run the SQL schema',body:null},
        ].map(s=>(
          <div key={s.n} style={{background:C.wh,borderRadius:20,padding:16,marginBottom:12,boxShadow:'0 1px 8px rgba(0,0,0,0.06)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:s.body?8:0}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:28,height:28,borderRadius:10,background:C.mg,display:'flex',alignItems:'center',justifyContent:'center',color:C.wh,fontWeight:800,fontSize:13}}>{s.n}</div>
                <div style={{fontWeight:700,color:C.dg,fontSize:14}}>{s.title}</div>
              </div>
              {s.n===2&&<button onClick={()=>setShowSQL(x=>!x)} style={{fontSize:11,fontWeight:700,color:C.mg,background:C.pg,border:'none',borderRadius:8,padding:'4px 10px',cursor:'pointer'}}>{showSQL?'Hide':'Show SQL'}</button>}
            </div>
            {s.body&&<div style={{fontSize:12,color:C.gr,lineHeight:1.6}}>{s.body}</div>}
            {s.n===2&&<div style={{fontSize:12,color:C.gr}}>Dashboard → SQL Editor → New query → paste and run</div>}
            {s.n===2&&showSQL&&(
              <div style={{marginTop:12}}>
                <pre style={{background:'#1E293B',color:'#E2E8F0',borderRadius:12,padding:12,fontSize:10,overflow:'auto',maxHeight:180,margin:0,lineHeight:1.5,whiteSpace:'pre-wrap'}}>{SCHEMA_SQL}</pre>
                <button onClick={copy} style={{marginTop:8,width:'100%',padding:'9px',borderRadius:10,border:'none',background:copied?C.lg:C.pg,color:copied?C.wh:C.dg,fontWeight:700,fontSize:12,cursor:'pointer'}}>
                  {copied?'✓ Copied!':'📋 Copy SQL'}
                </button>
              </div>
            )}
          </div>
        ))}
        <div style={{background:C.wh,borderRadius:20,padding:16,marginBottom:14,boxShadow:'0 1px 8px rgba(0,0,0,0.06)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <div style={{width:28,height:28,borderRadius:10,background:C.mg,display:'flex',alignItems:'center',justifyContent:'center',color:C.wh,fontWeight:800,fontSize:13}}>3</div>
            <div style={{fontWeight:700,color:C.dg,fontSize:14}}>Enter credentials</div>
          </div>
          <div style={{fontSize:11,color:C.gr,fontWeight:600,marginBottom:5}}>PROJECT URL (Settings → API)</div>
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://yourproject.supabase.co" style={{width:'100%',padding:'11px 13px',borderRadius:12,border:'1.5px solid '+C.pg,fontSize:12,marginBottom:12,boxSizing:'border-box',outline:'none',fontFamily:'monospace'}}/>
          <div style={{fontSize:11,color:C.gr,fontWeight:600,marginBottom:5}}>ANON KEY (Settings → API)</div>
          <input value={key} onChange={e=>setKey(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..." style={{width:'100%',padding:'11px 13px',borderRadius:12,border:'1.5px solid '+C.pg,fontSize:12,marginBottom:14,boxSizing:'border-box',outline:'none',fontFamily:'monospace'}}/>
          {error&&<div style={{background:'#FEE2E2',color:'#991B1B',borderRadius:10,padding:'8px 12px',fontSize:12,marginBottom:12}}>{error}</div>}
          <button onClick={connect} disabled={loading} style={{width:'100%',padding:'14px',borderRadius:16,border:'none',background:C.mg,color:C.wh,fontWeight:700,fontSize:15,cursor:'pointer',opacity:loading?0.75:1}}>
            {loading?'⟳ Connecting…':'🔗 Verify Supabase Connection'}
          </button>
        </div>
        <button onClick={onSkip} style={{width:'100%',padding:'13px',borderRadius:16,border:'1.5px solid '+C.pg,background:C.wh,color:C.gr,fontWeight:600,fontSize:13,cursor:'pointer'}}>
          Skip → Try Demo Mode
        </button>
      </div>
    </div>
  );
}

// ── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({sb,onAuth,onBack}){
  const [view,setView]=useState('login');
  const [email,setEmail]=useState('');
  const [pw,setPw]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [success,setSuccess]=useState('');

  const submit=async()=>{
    if(!email||!pw){setError('Email and password required');return;}
    if(pw.length<6){setError('Password must be at least 6 characters');return;}
    setLoading(true);setError('');setSuccess('');
    try{
      const data=view==='login'?await sb.signIn(email,pw):await sb.signUp(email,pw);
      if(view==='signup'&&!data.access_token){
        setSuccess('Check your email to confirm, then sign in.');
        setView('login');
      } else {
        onAuth(data);
      }
    }catch(e){setError(e.message);}
    setLoading(false);
  };

  return(
    <div style={{maxWidth:430,margin:'0 auto',minHeight:'100vh',background:C.bg,fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif',boxShadow:'0 0 40px rgba(0,0,0,0.12)'}}>
      <div style={{background:'linear-gradient(155deg,'+C.dg+','+C.mg+')',padding:'60px 24px 32px',textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:10}}>🧭</div>
        <div style={{fontSize:11,fontWeight:700,color:C.pg,letterSpacing:'2px',marginBottom:6}}>TRAILKEEPER</div>
        <div style={{fontSize:22,fontWeight:800,color:C.wh}}>{view==='login'?'Welcome back':'Create account'}</div>
        <div style={{fontSize:13,color:'#a7f3d0',marginTop:6}}>Sign in to sync your discoveries</div>
        <div style={{display:'flex',background:'rgba(255,255,255,0.15)',borderRadius:14,padding:4,marginTop:18}}>
          {[['login','Sign In'],['signup','Sign Up']].map(([v,l])=>(
            <div key={v} onClick={()=>{setView(v);setError('');setSuccess('');}} style={{flex:1,padding:'8px',borderRadius:10,textAlign:'center',fontSize:14,fontWeight:700,cursor:'pointer',background:view===v?C.wh:'transparent',color:view===v?C.dg:C.wh}}>{l}</div>
          ))}
        </div>
      </div>
      <div style={{padding:'24px 16px'}}>
        {success&&<div style={{background:'#D1FAE5',color:'#065F46',borderRadius:12,padding:'10px 14px',fontSize:13,marginBottom:14}}>✓ {success}</div>}
        {error&&<div style={{background:'#FEE2E2',color:'#991B1B',borderRadius:12,padding:'10px 14px',fontSize:13,marginBottom:14}}>{error}</div>}
        <div style={{background:C.wh,borderRadius:20,padding:20,marginBottom:14,boxShadow:'0 1px 8px rgba(0,0,0,0.06)'}}>
          <div style={{fontSize:11,color:C.gr,fontWeight:700,letterSpacing:'0.5px',marginBottom:6}}>EMAIL</div>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="explorer@example.com" style={{width:'100%',padding:'12px 14px',borderRadius:12,border:'1.5px solid '+C.pg,fontSize:14,marginBottom:16,boxSizing:'border-box',outline:'none',fontFamily:'inherit'}}/>
          <div style={{fontSize:11,color:C.gr,fontWeight:700,letterSpacing:'0.5px',marginBottom:6}}>PASSWORD</div>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="••••••••" style={{width:'100%',padding:'12px 14px',borderRadius:12,border:'1.5px solid '+C.pg,fontSize:14,boxSizing:'border-box',outline:'none',fontFamily:'inherit'}}/>
        </div>
        <button onClick={submit} disabled={loading} style={{width:'100%',padding:'15px',borderRadius:16,border:'none',background:'linear-gradient(135deg,'+C.mg+','+C.dg+')',color:C.wh,fontWeight:800,fontSize:16,cursor:'pointer',marginBottom:10,opacity:loading?0.75:1}}>
          {loading?'⟳ Please wait…':view==='login'?'→ Sign In':'→ Create Account'}
        </button>
        <button onClick={onBack} style={{width:'100%',padding:'12px',borderRadius:16,border:'1.5px solid '+C.pg,background:C.wh,color:C.gr,fontWeight:600,fontSize:13,cursor:'pointer'}}>
          ← Change Supabase project
        </button>
      </div>
    </div>
  );
}

// ── UI COMPONENTS ────────────────────────────────────────────────────────────
function Card({children,style={},onClick}){return <div onClick={onClick} style={{background:C.wh,borderRadius:20,padding:16,boxShadow:'0 1px 8px rgba(0,0,0,0.06)',cursor:onClick?'pointer':'default',...style}}>{children}</div>;}
function EntryCard({entry,onClick}){
  const t=TYPES.find(x=>x.id===entry.type)||TYPES[1];
  return(
    <Card onClick={onClick} style={{display:'flex',gap:12,alignItems:'center',marginBottom:10}}>
      <div style={{width:50,height:50,borderRadius:14,background:t.color+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>{t.icon}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:700,fontSize:15,color:C.dg,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{entry.name}</div>
        {entry.species&&<div style={{fontSize:11,color:C.gr,fontStyle:'italic'}}>{entry.species}</div>}
        <div style={{fontSize:11,color:C.lb,marginTop:2}}>📍 {entry.lat.toFixed(4)}, {entry.lng.toFixed(4)} · {entry.date}</div>
      </div>
      <div style={{fontSize:18,color:t.color,opacity:0.5}}>›</div>
    </Card>
  );
}

function CatalogMapView({entries,trails,userLoc,onSelect}){
  const W=370,H=240;
  const b=getCatalogBounds(entries,userLoc);
  const proj=(lat,lng)=>project(lat,lng,b,W,H);
  const midLat=(b.latMin+b.latMax)/2;
  const scaleLabel=fmtDist(haversine(midLat,b.lngMin,midLat,b.lngMin+(b.lngMax-b.lngMin)*0.16));
  const uXY=userLoc?proj(userLoc.lat,userLoc.lng):null;
  return(
    <div style={{borderRadius:18,overflow:'hidden',border:'1px solid '+C.pg,boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
      <svg width="100%" viewBox={'0 0 '+W+' '+H} style={{display:'block',background:'#EFF6EE'}}>
        {[0.25,0.5,0.75].map(f=><g key={f}><line x1={W*f} y1="0" x2={W*f} y2={H} stroke="#DCE9D8" strokeWidth="1"/><line x1="0" y1={H*f} x2={W} y2={H*f} stroke="#DCE9D8" strokeWidth="1"/></g>)}
        {trails.map(t=>{const pts=t.eids.map(id=>{const e=entries.find(x=>x.id===id);return e?proj(e.lat,e.lng):null;}).filter(Boolean);return pts.length>1&&<polyline key={t.id} points={pts.map(p=>p.x+','+p.y).join(' ')} fill="none" stroke={C.sky} strokeWidth="2.5" strokeDasharray="6,4" opacity="0.7"/>;})}
        {entries.map(e=>{const{x,y}=proj(e.lat,e.lng);const t=TYPES.find(x=>x.id===e.type)||TYPES[1];return(<g key={e.id} onClick={()=>onSelect(e)} style={{cursor:'pointer'}}><circle cx={x} cy={y} r="15" fill={t.color} opacity="0.9"/><circle cx={x} cy={y} r="15" fill="white" opacity="0.15"/><text x={x} y={y+5} textAnchor="middle" fontSize="13" style={{userSelect:'none'}}>{t.icon}</text></g>);})}
        {uXY&&<g><circle cx={uXY.x} cy={uXY.y} r="8" fill={C.sky} opacity="0.2"><animate attributeName="r" values="8;22;8" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.35;0;0.35" dur="2.5s" repeatCount="indefinite"/></circle><circle cx={uXY.x} cy={uXY.y} r="7" fill={C.sky} opacity="0.95"/><circle cx={uXY.x} cy={uXY.y} r="3.5" fill="white"/></g>}
        <circle cx={W-20} cy={20} r="13" fill="white" opacity="0.88"/>
        <text x={W-20} y="25" fontSize="11" textAnchor="middle" fill={C.dg} fontWeight="700" style={{userSelect:'none'}}>N</text>
        <rect x="12" y={H-16} width="60" height="3" rx="1.5" fill={C.dg} opacity="0.3"/>
        <text x="12" y={H-4} fontSize="9" fill={C.dg} opacity="0.45" style={{userSelect:'none'}}>{scaleLabel}</text>
      </svg>
    </div>
  );
}

function ActivityOverlay({path,tTime,tDist,onStop,gpsMode}){
  const cur=path.length>0?path[path.length-1]:null;
  return(
    <div style={{position:'fixed',inset:0,zIndex:250,display:'flex',flexDirection:'column',maxWidth:430,margin:'0 auto',background:C.dg}}>
      <div style={{background:'linear-gradient(155deg,'+C.dg+',#2D6A4F)',padding:'52px 20px 20px',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:C.pg,letterSpacing:'1.5px',marginBottom:4}}>{gpsMode==='real'?'🛰️ GPS ACTIVE':'📡 GPS SIMULATED'}</div>
            <div style={{fontSize:44,fontWeight:900,color:C.wh,lineHeight:1,letterSpacing:'-1px'}}>{fmtTime(tTime)}</div>
            <div style={{fontSize:12,color:'#a7f3d0',marginTop:2}}>elapsed time</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:10,fontWeight:700,color:C.pg,letterSpacing:'1.5px',marginBottom:4}}>DISTANCE</div>
            <div style={{fontSize:32,fontWeight:900,color:C.wh,lineHeight:1}}>{fmtDist(tDist)}</div>
            <div style={{fontSize:12,color:'#a7f3d0',marginTop:2}}>pace {calcPace(tTime,tDist)}</div>
          </div>
        </div>
        <div style={{display:'flex',gap:10,marginTop:14}}>
          {[{l:'GPS PTS',v:path.length},{l:'PACE',v:calcPace(tTime,tDist)},{l:'AVG SPD',v:tDist>0&&tTime>0?(tDist/(tTime/3600)).toFixed(1)+' mph':'--'}].map(m=>(
            <div key={m.l} style={{flex:1,background:'rgba(255,255,255,0.1)',borderRadius:10,padding:'8px 6px',textAlign:'center'}}>
              <div style={{color:C.wh,fontWeight:700,fontSize:14}}>{m.v}</div>
              <div style={{color:'#6ee7b7',fontSize:8,fontWeight:700,letterSpacing:'0.5px'}}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{flex:1,position:'relative',overflow:'hidden',background:'#EFF6EE'}}>
        <RealMap points={path} userLoc={cur} height={520} zoom={16}/>
        {cur&&<div style={{position:'absolute',top:12,left:12,background:'rgba(255,255,255,0.92)',borderRadius:10,padding:'5px 10px'}}><div style={{fontSize:10,color:C.dg,fontWeight:700,fontFamily:'monospace'}}>{cur.lat.toFixed(5)}, {cur.lng.toFixed(5)}</div></div>}
        {path.length<=1&&<div style={{position:'absolute',left:0,right:0,top:'50%',textAlign:'center',fontSize:13,color:C.gr,fontWeight:700}}>Waiting for movement...</div>}
      </div>
      <div style={{padding:'16px 16px 28px',background:C.dg,flexShrink:0}}>
        <button onClick={onStop} style={{width:'100%',padding:'18px',borderRadius:20,border:'none',background:'#ef4444',color:C.wh,fontWeight:900,fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,boxShadow:'0 4px 20px rgba(239,68,68,0.4)'}}>
          <span style={{fontSize:22}}>⏹</span> Stop Activity
        </button>
      </div>
    </div>
  );
}

function ActivitySummary({path,tTime,tDist,onDismiss,onSaveJournal}){
  const W=340,H=200;
  const b=getActivityBounds(path);
  const proj=(lat,lng)=>project(lat,lng,b,W,H);
  const pts=path.map(p=>{const{x,y}=proj(p.lat,p.lng);return x+','+y;}).join(' ');
  const startXY=path.length>0?proj(path[0].lat,path[0].lng):null;
  const endXY=path.length>0?proj(path[path.length-1].lat,path[path.length-1].lng):null;
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 20px'}}>
      <div style={{background:C.wh,borderRadius:28,width:'100%',maxWidth:400,overflow:'hidden',boxShadow:'0 24px 60px rgba(0,0,0,0.3)'}}>
        <div style={{background:'linear-gradient(135deg,'+C.dg+','+C.mg+')',padding:'20px',textAlign:'center'}}>
          <div style={{fontSize:36,marginBottom:6}}>🎉</div>
          <div style={{color:C.wh,fontWeight:800,fontSize:20}}>Activity Complete!</div>
        </div>
        <div style={{display:'flex',borderBottom:'1px solid '+C.pg}}>
          {[{l:'Time',v:fmtTime(tTime)},{l:'Distance',v:fmtDist(tDist)},{l:'Pace',v:calcPace(tTime,tDist)}].map(s=>(
            <div key={s.l} style={{flex:1,padding:'14px 8px',textAlign:'center',borderRight:'1px solid '+C.pg}}>
              <div style={{fontWeight:900,fontSize:20,color:C.dg}}>{s.v}</div>
              <div style={{fontSize:11,color:C.gr,fontWeight:600}}>{s.l}</div>
            </div>
          ))}
        </div>
        {path.length>1&&(
          <div style={{padding:'14px 14px 0'}}>
            <div style={{fontSize:11,fontWeight:700,color:C.gr,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8}}>Route</div>
            <div style={{borderRadius:14,overflow:'hidden',border:'1px solid '+C.pg}}>
              <svg width="100%" viewBox={'0 0 '+W+' '+H} style={{display:'block',background:'#EFF6EE'}}>
                {[0.25,0.5,0.75].map(f=><g key={f}><line x1={W*f} y1="0" x2={W*f} y2={H} stroke="#DCE9D8" strokeWidth="1"/><line x1="0" y1={H*f} x2={W} y2={H*f} stroke="#DCE9D8" strokeWidth="1"/></g>)}
                <polyline points={pts} fill="none" stroke={C.mg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
                {startXY&&<circle cx={startXY.x} cy={startXY.y} r="7" fill={C.lg} stroke="white" strokeWidth="2"/>}
                {endXY&&<circle cx={endXY.x} cy={endXY.y} r="7" fill="#ef4444" stroke="white" strokeWidth="2"/>}
              </svg>
            </div>
          </div>
        )}
        <div style={{display:'flex',gap:10,padding:'14px'}}>
          <button onClick={onSaveJournal} style={{flex:1,padding:'13px',borderRadius:14,border:'none',background:C.mg,color:C.wh,fontWeight:700,fontSize:13,cursor:'pointer'}}>📔 Save to Journal</button>
          <button onClick={onDismiss} style={{flex:1,padding:'13px',borderRadius:14,border:'1.5px solid '+C.pg,background:C.pg,color:C.dg,fontWeight:700,fontSize:13,cursor:'pointer'}}>Done</button>
        </div>
      </div>
    </div>
  );
}

// ── APP SCREENS ──────────────────────────────────────────────────────────────
function HomeScreen({entries,stats,setTab,openAdd,openEntry,onStartActivity,userLoc,locStatus,profileName}){
  const hr=new Date().getHours();
  const greet=hr<12?'🌅 Good Morning':hr<17?'☀️ Good Afternoon':'🌙 Good Evening';
  const locDot=locStatus==='granted'?'#22c55e':locStatus==='loading'?C.am:'#9CA3AF';
  const cityName=userLoc?userLoc.city:locStatus==='loading'?'Locating…':'Location unknown';
  return(
    <div>
      <div style={{background:'linear-gradient(155deg,'+C.dg+' 0%,'+C.mg+' 55%,'+C.lg+' 100%)',padding:'52px 20px 26px',borderRadius:'0 0 32px 32px'}}>
        <div style={{fontSize:11,fontWeight:700,color:C.pg,letterSpacing:'1.5px',marginBottom:4}}>TRAILKEEPER</div>
        <div style={{fontSize:22,fontWeight:800,color:C.wh}}>{greet}, {profileName||'Explorer'}</div>
        <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:locDot,flexShrink:0}}/>
          <div style={{fontSize:12,color:'#a7f3d0'}}>{cityName} · {new Date().toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'})}</div>
        </div>
        <div style={{display:'flex',gap:10,marginTop:16}}>
          {[{lbl:'Cataloged',v:stats.total,ic:'📖'},{lbl:'Trees',v:stats.trees,ic:'🌳'},{lbl:'Trails',v:stats.trails,ic:'🗺️'}].map(s=>(
            <div key={s.lbl} style={{flex:1,background:'rgba(255,255,255,0.14)',borderRadius:16,padding:'10px 6px',textAlign:'center'}}>
              <div style={{fontSize:20}}>{s.ic}</div>
              <div style={{color:C.wh,fontWeight:900,fontSize:20,lineHeight:1.1}}>{s.v}</div>
              <div style={{color:'#a7f3d0',fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px'}}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:'18px 16px'}}>
        <Card style={{marginBottom:16,background:'linear-gradient(135deg,'+C.dg+',#2D5A3D)',cursor:'pointer'}} onClick={onStartActivity}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontWeight:800,fontSize:18,color:C.wh}}>🏃 Start Activity</div>
              <div style={{fontSize:12,color:'#a7f3d0',marginTop:3}}>Track your route live on a map</div>
              <div style={{fontSize:11,color:'#6ee7b7',marginTop:5,display:'flex',gap:6,flexWrap:'wrap'}}>
                {['📏 Distance','⏱ Pace','🗺️ Live Map'].map(x=><span key={x} style={{background:'rgba(255,255,255,0.1)',padding:'2px 8px',borderRadius:6}}>{x}</span>)}
              </div>
            </div>
            <div style={{width:54,height:54,borderRadius:18,background:C.lg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 16px rgba(82,183,136,0.5)'}}>
              <span style={{fontSize:28}}>▶</span>
            </div>
          </div>
        </Card>
        <div style={{fontWeight:700,fontSize:16,color:C.dg,marginBottom:12}}>Quick Actions</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
          {[{icon:'🔬',lbl:'Identify Species',color:C.mg,action:openAdd},{icon:'🗺️',lbl:'My Trails',color:C.sky,action:()=>setTab('trails')},{icon:'📦',lbl:'Find Cache',color:C.am,action:()=>setTab('cache')},{icon:'📖',lbl:'Catalog',color:C.br,action:()=>setTab('catalog')}].map(a=>(
            <Card key={a.lbl} onClick={a.action} style={{textAlign:'center',padding:'22px 12px',border:'2px solid '+a.color+'18'}}>
              <div style={{fontSize:36,marginBottom:8}}>{a.icon}</div>
              <div style={{fontWeight:700,fontSize:13,color:a.color}}>{a.lbl}</div>
            </Card>
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:16,color:C.dg}}>Nearby Parks</div>
        </div>
        <div style={{display:'flex',gap:12,overflowX:'auto',paddingBottom:4,marginBottom:20}}>
          {PARKS.map(p=>{
            const dist=userLoc?fmtDist(haversine(userLoc.lat,userLoc.lng,p.lat,p.lng)):null;
            return(
              <div key={p.id} style={{flexShrink:0,width:148,background:C.wh,borderRadius:18,padding:'14px 12px',boxShadow:'0 1px 8px rgba(0,0,0,0.06)',border:'1.5px solid '+p.color+'22',cursor:'pointer'}}>
                <div style={{fontSize:30,marginBottom:6}}>{p.icon}</div>
                <div style={{fontWeight:700,fontSize:13,color:C.dg,marginBottom:2}}>{p.name}</div>
                <div style={{fontSize:11,color:C.gr,marginBottom:8}}>{dist?'📍 '+dist+' away':'📍 —'}</div>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{p.facilities.map((f,i)=><span key={i} style={{fontSize:14}}>{f}</span>)}</div>
              </div>
            );
          })}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:16,color:C.dg}}>Recent Finds</div>
          <span onClick={()=>setTab('catalog')} style={{fontSize:12,color:C.mg,fontWeight:700,cursor:'pointer'}}>See all →</span>
        </div>
        {entries.slice(0,3).map(e=><EntryCard key={e.id} entry={e} onClick={()=>openEntry(e)}/>)}
      </div>
    </div>
  );
}

function CatalogScreen({entries,trails,filter,setFilter,openAdd,openEntry,userLoc}){
  const [viewMode,setViewMode]=useState('list');
  const [search,setSearch]=useState('');
  const filtered=entries.filter(e=>{
    const mT=filter==='all'||e.type===filter;
    const q=search.toLowerCase();
    return mT&&(!q||e.name.toLowerCase().includes(q)||(e.species&&e.species.toLowerCase().includes(q))||(e.notes&&e.notes.toLowerCase().includes(q)));
  });
  return(
    <div>
      <div style={{background:'linear-gradient(155deg,'+C.dg+','+C.mg+')',padding:'52px 20px 20px',borderRadius:'0 0 32px 32px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
          <div><div style={{color:C.wh,fontWeight:800,fontSize:22}}>🔭 Catalog</div><div style={{color:C.pg,fontSize:13}}>{entries.length} discoveries</div></div>
          <div style={{display:'flex',background:'rgba(255,255,255,0.2)',borderRadius:12,padding:3}}>
            {[['list','☰'],['map','🗺']].map(([m,ic])=>(
              <div key={m} onClick={()=>setViewMode(m)} style={{padding:'6px 13px',borderRadius:9,fontSize:15,cursor:'pointer',background:viewMode===m?C.wh:'transparent',color:viewMode===m?C.dg:C.wh,fontWeight:700}}>{ic}</div>
            ))}
          </div>
        </div>
        <div style={{position:'relative',marginBottom:12}}>
          <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',fontSize:14,pointerEvents:'none'}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search species, notes…" style={{width:'100%',padding:'10px 12px 10px 36px',borderRadius:12,border:'none',fontSize:13,background:'rgba(255,255,255,0.95)',color:C.dg,outline:'none',boxSizing:'border-box',fontFamily:'inherit'}}/>
        </div>
        <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:4}}>
          {TYPES.map(t=><div key={t.id} onClick={()=>setFilter(t.id)} style={{flexShrink:0,padding:'6px 13px',borderRadius:20,fontSize:12,fontWeight:700,cursor:'pointer',background:filter===t.id?C.wh:'rgba(255,255,255,0.18)',color:filter===t.id?C.dg:C.wh}}>{t.icon} {t.label}</div>)}
        </div>
      </div>
      <div style={{padding:'16px 16px 80px'}}>
        {viewMode==='map'?(
          <div>
            <CatalogMapView entries={filtered} trails={trails} userLoc={userLoc} onSelect={openEntry}/>
            <div style={{marginTop:10,padding:'10px 14px',background:C.pg,borderRadius:12,fontSize:12,color:C.dg,fontWeight:600,display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16}}>🔵</span> Your location · Tap any pin to view details</div>
          </div>
        ):(
          <>
            {filtered.length===0&&<div style={{textAlign:'center',padding:'40px 0',color:C.gr}}><div style={{fontSize:48}}>🔭</div><div style={{fontWeight:600,marginTop:8}}>{search?'No results found':'No entries yet'}</div></div>}
            {filtered.map(e=><EntryCard key={e.id} entry={e} onClick={()=>openEntry(e)}/>)}
          </>
        )}
      </div>
      {viewMode==='list'&&<div onClick={openAdd} style={{position:'fixed',bottom:90,right:20,width:58,height:58,borderRadius:18,background:C.mg,boxShadow:'0 4px 20px rgba(45,106,79,0.5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,color:C.wh,cursor:'pointer',zIndex:50}}>+</div>}
    </div>
  );
}

function TrailsScreen({trails,setTrails,entries,openEntry,onShare}){
  const [sub,setSub]=useState('mine');
  const [sel,setSel]=useState(null);
  const [showB,setShowB]=useState(false);
  const [b,setB]=useState({name:'',diff:'Easy',description:'',eids:[],pub:false});
  const [community,setCommunity]=useState(COMMUNITY);
  const toggleEid=id=>setB(x=>({...x,eids:x.eids.includes(id)?x.eids.filter(e=>e!==id):[...x.eids,id]}));
  const save=()=>{if(!b.name||b.eids.length<2)return;setTrails(ts=>[...ts,{id:genId(),...b,dist:trailDist(b.eids,entries)}]);setB({name:'',diff:'Easy',description:'',eids:[],pub:false});setShowB(false);};
  const dc=d=>d==='Easy'?C.lg:d==='Moderate'?C.am:'#E11D48';
  const toggleLike=id=>setCommunity(cs=>cs.map(c=>c.id===id?{...c,likes:c.likes+(c.liked?-1:1),liked:!c.liked}:c));
  const toggleSave=id=>setCommunity(cs=>cs.map(c=>c.id===id?{...c,saved:!c.saved}:c));
  return(
    <div>
      <div style={{background:'linear-gradient(155deg,#0369a1,'+C.sky+')',padding:'52px 20px 20px',borderRadius:'0 0 32px 32px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <div><div style={{color:C.wh,fontWeight:800,fontSize:22}}>🗺️ Trails</div><div style={{color:'#bae6fd',fontSize:13}}>{trails.length} created</div></div>
          {sub==='mine'&&<button onClick={()=>setShowB(!showB)} style={{padding:'8px 16px',borderRadius:12,border:'none',cursor:'pointer',fontWeight:700,fontSize:13,background:'rgba(255,255,255,0.2)',color:C.wh}}>{showB?'✕ Cancel':'+ Build'}</button>}
        </div>
        <div style={{display:'flex',background:'rgba(255,255,255,0.18)',borderRadius:14,padding:4}}>
          {[['mine','🗺️ My Trails'],['discover','🌍 Discover']].map(([id,lbl])=>(
            <div key={id} onClick={()=>setSub(id)} style={{flex:1,padding:'8px',borderRadius:10,textAlign:'center',fontSize:13,fontWeight:700,cursor:'pointer',background:sub===id?C.wh:'transparent',color:sub===id?'#0369a1':C.wh}}>{lbl}</div>
          ))}
        </div>
      </div>
      <div style={{padding:'16px 16px 80px'}}>
        {sub==='mine'&&(
          <>
            {showB&&(
              <Card style={{marginBottom:16,border:'2px solid '+C.sky}}>
                <div style={{fontWeight:800,fontSize:16,color:C.dg,marginBottom:14}}>🏗️ Trail Builder</div>
                <input value={b.name} onChange={e=>setB({...b,name:e.target.value})} placeholder="Trail name…" style={{width:'100%',padding:'11px 13px',borderRadius:12,border:'1.5px solid '+C.pg,fontSize:13,marginBottom:10,boxSizing:'border-box',outline:'none',fontFamily:'inherit'}}/>
                <input value={b.description} onChange={e=>setB({...b,description:e.target.value})} placeholder="Short description…" style={{width:'100%',padding:'11px 13px',borderRadius:12,border:'1.5px solid '+C.pg,fontSize:13,marginBottom:12,boxSizing:'border-box',outline:'none',fontFamily:'inherit'}}/>
                <div style={{display:'flex',gap:8,marginBottom:14}}>{['Easy','Moderate','Hard'].map(d=><div key={d} onClick={()=>setB({...b,diff:d})} style={{flex:1,padding:'8px',borderRadius:10,textAlign:'center',fontSize:12,fontWeight:700,cursor:'pointer',background:b.diff===d?dc(d):dc(d)+'18',color:b.diff===d?C.wh:dc(d)}}>{d}</div>)}</div>
                <div style={{fontSize:11,fontWeight:700,color:C.gr,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8}}>Waypoints ({b.eids.length})</div>
                <div style={{maxHeight:180,overflowY:'auto',display:'flex',flexDirection:'column',gap:6,marginBottom:14}}>
                  {entries.map(e=>{const t=TYPES.find(x=>x.id===e.type)||TYPES[1];const on=b.eids.includes(e.id);const ord=b.eids.indexOf(e.id)+1;return(
                    <div key={e.id} onClick={()=>toggleEid(e.id)} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',borderRadius:12,cursor:'pointer',background:on?C.pg:C.bg,border:'1.5px solid '+(on?C.mg:'transparent')}}>
                      <div style={{width:28,height:28,borderRadius:8,background:on?C.mg:t.color+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:on?13:16,color:on?C.wh:t.color,fontWeight:700,flexShrink:0}}>{on?ord:t.icon}</div>
                      <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:13,color:C.dg,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.name}</div><div style={{fontSize:11,color:C.gr}}>{t.label}</div></div>
                      {on&&<div style={{color:C.mg,fontSize:14,fontWeight:700}}>✓</div>}
                    </div>
                  );})}
                </div>
                {b.eids.length>=2&&<div style={{background:C.pg,borderRadius:10,padding:'9px 13px',marginBottom:12,fontSize:13,color:C.dg,fontWeight:600,display:'flex',justifyContent:'space-between'}}><span>📏 Estimated distance</span><span style={{fontWeight:800,color:C.mg}}>{trailDist(b.eids,entries)} mi</span></div>}
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}><div onClick={()=>setB({...b,pub:!b.pub})} style={{width:44,height:24,borderRadius:12,background:b.pub?C.mg:'#D1D5DB',position:'relative',cursor:'pointer',flexShrink:0}}><div style={{position:'absolute',top:2,left:b.pub?22:2,width:20,height:20,borderRadius:10,background:C.wh,transition:'left 0.15s'}}/></div><span style={{fontSize:13,color:C.dg,fontWeight:600}}>Make trail public</span></div>
                <button onClick={save} disabled={!b.name||b.eids.length<2} style={{width:'100%',padding:'13px',borderRadius:14,border:'none',background:(!b.name||b.eids.length<2)?'#E5E7EB':C.sky,color:(!b.name||b.eids.length<2)?C.gr:C.wh,fontWeight:700,fontSize:14,cursor:'pointer'}}>🗺️ Save Trail</button>
              </Card>
            )}
            {trails.map(t=>(
              <Card key={t.id} style={{marginBottom:12,border:'2px solid '+(sel===t.id?C.sky:'transparent')}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div style={{flex:1}} onClick={()=>setSel(sel===t.id?null:t.id)}>
                    <div style={{fontWeight:800,fontSize:16,color:C.dg}}>{t.name}</div>
                    <div style={{fontSize:12,color:C.gr,marginTop:2}}>{t.description}</div>
                    <div style={{display:'flex',gap:8,marginTop:10,flexWrap:'wrap'}}>
                      <span style={{fontSize:11,fontWeight:700,color:C.sky,background:'#e0f2fe',padding:'3px 10px',borderRadius:8}}>📏 {t.dist} mi</span>
                      <span style={{fontSize:11,fontWeight:700,color:dc(t.diff),background:dc(t.diff)+'22',padding:'3px 10px',borderRadius:8}}>{t.diff}</span>
                      <span style={{fontSize:11,fontWeight:700,color:C.mg,background:C.pg,padding:'3px 10px',borderRadius:8}}>🔍 {t.eids.length} finds</span>
                    </div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'flex-end',marginLeft:8}}>
                    {t.pub&&<span style={{fontSize:9,fontWeight:700,color:C.wh,background:C.mg,padding:'3px 8px',borderRadius:8}}>PUBLIC</span>}
                    <button onClick={()=>onShare(t)} style={{padding:'6px 10px',borderRadius:10,border:'1.5px solid '+C.pg,background:C.pg,color:C.mg,fontWeight:700,fontSize:12,cursor:'pointer'}}>📤 Share</button>
                  </div>
                </div>
                {sel===t.id&&<div style={{marginTop:14,borderTop:'1px solid '+C.pg,paddingTop:12}}><div style={{fontWeight:700,fontSize:13,color:C.dg,marginBottom:8}}>Trail Waypoints</div>{entries.filter(e=>t.eids.includes(e.id)).map(e=><EntryCard key={e.id} entry={e} onClick={()=>openEntry(e)}/>)}</div>}
              </Card>
            ))}
          </>
        )}
        {sub==='discover'&&(
          <div>
            <div style={{background:C.pg,borderRadius:14,padding:'10px 14px',marginBottom:14,fontSize:12,color:C.dg,fontWeight:600}}>🌍 Public trails from the TrailKeeper community</div>
            {community.map(t=>(
              <Card key={t.id} style={{marginBottom:12}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:10}}>
                  <div style={{width:42,height:42,borderRadius:14,background:C.mg+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{t.avatar}</div>
                  <div style={{flex:1}}><div style={{fontWeight:800,fontSize:15,color:C.dg}}>{t.name}</div><div style={{fontSize:11,color:C.gr}}>by {t.explorer}</div></div>
                  <button onClick={()=>toggleSave(t.id)} style={{padding:'6px 10px',borderRadius:10,border:'1.5px solid '+C.pg,background:t.saved?C.mg:C.pg,color:t.saved?C.wh:C.gr,fontWeight:700,fontSize:11,cursor:'pointer',flexShrink:0}}>{t.saved?'✓ Saved':'+ Save'}</button>
                </div>
                <div style={{fontSize:13,color:'#374151',marginBottom:10,lineHeight:1.5}}>{t.description}</div>
                <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap'}}>
                  <span style={{fontSize:11,fontWeight:700,color:C.sky,background:'#e0f2fe',padding:'3px 10px',borderRadius:8}}>📏 {t.dist} mi</span>
                  <span style={{fontSize:11,fontWeight:700,color:dc(t.diff),background:dc(t.diff)+'22',padding:'3px 10px',borderRadius:8}}>{t.diff}</span>
                </div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>{t.tags.map(tag=><span key={tag} style={{fontSize:11,color:C.mg,background:C.pg,padding:'3px 10px',borderRadius:20,fontWeight:600}}>{'#'+tag}</span>)}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid '+C.pg,paddingTop:10}}>
                  <button onClick={()=>toggleLike(t.id)} style={{display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:10,border:'1.5px solid '+(t.liked?'#FDA4AF':'#E5E7EB'),background:t.liked?'#FFF1F2':C.wh,color:t.liked?'#E11D48':C.gr,fontWeight:700,fontSize:12,cursor:'pointer'}}>{t.liked?'❤️':'🤍'} {t.likes}</button>
                  <button style={{padding:'7px 14px',borderRadius:10,border:'1.5px solid '+C.pg,background:C.pg,color:C.mg,fontWeight:700,fontSize:12,cursor:'pointer'}}>🗺️ View Trail</button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CacheScreen({caches,setCaches,sb,session}){
  const [reveal,setReveal]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({name:'',clue:''});
  const markFound=id=>{
    setCaches(cs=>cs.map(c=>c.id===id?{...c,found:true}:c));
    if(sb&&session)sb.upsert('caches',{id,found:true,user_id:session.user.id},session.access_token).catch(()=>{});
  };
  const hideCache=()=>{
    if(!form.name||!form.clue)return;
    const newCache={id:genId(),...form,lat:25.76+(Math.random()-.5)*.02,lng:-80.19+(Math.random()-.5)*.02,found:false};
    setCaches(cs=>[...cs,newCache]);
    if(sb&&session)sb.upsert('caches',{...newCache,user_id:session.user.id},session.access_token).catch(()=>{});
    setForm({name:'',clue:''});setShowForm(false);
  };
  return(
    <div>
      <div style={{background:'linear-gradient(155deg,#92400e,'+C.am+')',padding:'52px 20px 24px',borderRadius:'0 0 32px 32px'}}>
        <div style={{color:C.wh,fontWeight:800,fontSize:22}}>📦 Geocache</div>
        <div style={{color:'#fef3c7',fontSize:13}}>{caches.filter(c=>c.found).length} found · {caches.filter(c=>!c.found).length} to discover</div>
      </div>
      <div style={{padding:'16px 16px 80px'}}>
        {caches.map(c=>(
          <Card key={c.id} style={{marginBottom:12,opacity:c.found?.88:1}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div><div style={{fontWeight:800,fontSize:16,color:C.dg}}>{c.found?'✅ ':'📦 '}{c.name}</div><div style={{fontSize:11,color:C.gr,marginTop:2}}>📍 {c.lat.toFixed(5)}, {c.lng.toFixed(5)}</div></div>
              {c.found&&<span style={{fontSize:9,fontWeight:700,background:C.pg,color:C.dg,padding:'3px 8px',borderRadius:8}}>FOUND</span>}
            </div>
            {!c.found&&<div style={{display:'flex',gap:8,marginTop:12}}><button onClick={()=>setReveal(reveal===c.id?null:c.id)} style={{flex:1,padding:'10px',borderRadius:12,border:'1.5px solid '+C.pg,background:C.pg,color:C.dg,fontWeight:700,fontSize:12,cursor:'pointer'}}>{reveal===c.id?'🙈 Hide':'🔍 View Clue'}</button><button onClick={()=>markFound(c.id)} style={{flex:1,padding:'10px',borderRadius:12,border:'none',background:C.am,color:C.wh,fontWeight:700,fontSize:12,cursor:'pointer'}}>✓ Found It!</button></div>}
            {reveal===c.id&&!c.found&&<div style={{marginTop:12,background:'#fffbeb',borderRadius:12,padding:12,border:'1px dashed '+C.am}}><div style={{fontSize:10,fontWeight:700,color:C.am,marginBottom:4}}>🗝️ CLUE</div><div style={{fontSize:13,color:C.dg,lineHeight:1.6,fontStyle:'italic'}}>{c.clue}</div></div>}
            {c.found&&<div style={{fontSize:12,color:C.gr,marginTop:8,fontStyle:'italic'}}>"{c.clue}"</div>}
          </Card>
        ))}
        {showForm?(
          <Card>
            <div style={{fontWeight:800,fontSize:16,color:C.dg,marginBottom:12}}>🎯 Hide a Cache</div>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Cache name…" style={{width:'100%',padding:'11px 13px',borderRadius:12,border:'1.5px solid '+C.pg,fontSize:13,marginBottom:10,boxSizing:'border-box',outline:'none',fontFamily:'inherit'}}/>
            <textarea value={form.clue} onChange={e=>setForm({...form,clue:e.target.value})} placeholder="Write a mystery clue…" style={{width:'100%',padding:'11px 13px',borderRadius:12,border:'1.5px solid '+C.pg,fontSize:13,height:80,resize:'none',boxSizing:'border-box',outline:'none',fontFamily:'inherit'}}/>
            <div style={{display:'flex',gap:8,marginTop:10}}>
              <button onClick={()=>setShowForm(false)} style={{flex:1,padding:'11px',borderRadius:12,border:'1.5px solid '+C.pg,background:C.pg,color:C.dg,fontWeight:700,fontSize:12,cursor:'pointer'}}>Cancel</button>
              <button onClick={hideCache} style={{flex:1,padding:'11px',borderRadius:12,border:'none',background:C.am,color:C.wh,fontWeight:700,fontSize:12,cursor:'pointer'}}>📍 Hide Cache</button>
            </div>
          </Card>
        ):(
          <div onClick={()=>setShowForm(true)} style={{background:'#fffbeb',borderRadius:16,padding:'14px 16px',textAlign:'center',cursor:'pointer',border:'2px dashed '+C.am}}>
            <span style={{fontWeight:700,color:C.am,fontSize:14}}>+ Hide a New Cache</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileScreen({entries,stats,journal,setJournal,sb,session,onSignOut,profileName,setProfileName,onOpenSetup}){
  const [ptab,setPtab]=useState('stats');
  const [form,setForm]=useState({title:'',body:''});
  const [showForm,setShowForm]=useState(false);
  const [nameDraft,setNameDraft]=useState(profileName);
  const [adminPw,setAdminPw]=useState('');
  const [adminUnlocked,setAdminUnlocked]=useState(false);
  const [adminError,setAdminError]=useState('');
  const [ghStatus,setGhStatus]=useState('disconnected');
  const [ghClientId,setGhClientId]=useState(GOOGLE_HEALTH_CONFIG.clientId);
  const [ghData,setGhData]=useState(null);
  const [showSetup,setShowSetup]=useState(false);
  const pkceRef=useRef(null);
  useEffect(()=>setNameDraft(profileName),[profileName]);

  const genVerifier=()=>{const a=new Uint8Array(32);crypto.getRandomValues(a);return btoa(String.fromCharCode(...a)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');};
  const genChallenge=async v=>{const d=new TextEncoder().encode(v);const h=await crypto.subtle.digest('SHA-256',d);return btoa(String.fromCharCode(...new Uint8Array(h))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');};
  const connectGH=async()=>{
    if(!ghClientId.trim())return;
    const v=genVerifier();const c=await genChallenge(v);pkceRef.current=v;
    const params=new URLSearchParams({client_id:ghClientId.trim(),redirect_uri:window.location.href.split('?')[0],response_type:'code',scope:'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.heart_rate.read',code_challenge:c,code_challenge_method:'S256',access_type:'offline',prompt:'consent'});
    window.open('https://accounts.google.com/o/oauth2/v2/auth?'+params,'_blank');
  };
  const demoMode=()=>{setGhStatus('connected');setGhData({steps:8432,dist:3.24,hr:72,cal:2140,active:47,sync:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})});};
  const disconnect=()=>{setGhStatus('disconnected');setGhData(null);pkceRef.current=null;};
  const displayName=profileName||(session?session.user.email.split('@')[0]:'Explorer');
  const saveName=()=>setProfileName(nameDraft.trim());
  const unlockAdmin=()=>{
    if(!ADMIN_CONFIG.masterPassword){setAdminError('Set VITE_ADMIN_MASTER_PASSWORD in your env, then restart dev.');return;}
    if(adminPw===ADMIN_CONFIG.masterPassword){setAdminUnlocked(true);setAdminError('');setAdminPw('');}
    else setAdminError('Incorrect master password.');
  };

  const typeData=TYPES.filter(t=>t.id!=='all').map(t=>({name:t.label,icon:t.icon,count:entries.filter(e=>e.type===t.id).length,color:t.color})).filter(d=>d.count>0);
  const total=entries.length||1;
  const goals=[
    {label:'Discoveries this week',cur:Math.min(entries.length,3),target:5,icon:'🔍',color:C.mg},
    {label:'Miles walked',cur:1.8,target:5.0,icon:'👟',color:C.sky},
    {label:"New species ID'd",cur:entries.filter(e=>e.species).length,target:10,icon:'🌱',color:C.am},
    {label:'Caches found',cur:1,target:5,icon:'📦',color:C.br},
  ];
  const badges=[
    {ic:'🌳',lbl:'Tree Hugger',desc:stats.trees+' trees',ok:stats.trees>0},
    {ic:'🐦',lbl:'Bird Watcher',desc:'First bird',ok:true},
    {ic:'🗺️',lbl:'Trailblazer',desc:'Trail created',ok:stats.trails>0},
    {ic:'📦',lbl:'Cache Hunter',desc:'Find 3 caches',ok:false},
    {ic:'🍄',lbl:'Forager',desc:'Log 5 fungi',ok:false},
    {ic:'⭐',lbl:'Explorer Pro',desc:stats.total+' finds',ok:stats.total>=5},
  ];

  const saveJ=()=>{
    if(!form.title||!form.body)return;
    const j={id:genId(),date:new Date().toISOString().split('T')[0],...form};
    setJournal(js=>[j,...js]);
    if(sb&&session)sb.upsert('journal',{...j,user_id:session.user.id},session.access_token).catch(()=>{});
    setForm({title:'',body:''});setShowForm(false);
  };

  return(
    <div>
      <div style={{background:'linear-gradient(155deg,#4c1d95,#7C3AED)',padding:'52px 20px 20px',borderRadius:'0 0 32px 32px'}}>
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:4}}>
          <div style={{width:64,height:64,borderRadius:22,background:'rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,border:'2.5px solid rgba(255,255,255,0.3)',flexShrink:0}}>🧭</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{color:C.wh,fontWeight:800,fontSize:18}}>{displayName}</div>
            <div style={{color:'#e9d5ff',fontSize:11,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{session?session.user.email:'Demo Mode'}</div>
            <div style={{fontSize:10,color:'#c4b5fd',marginTop:2}}>🏅 Level 3 Naturalist</div>
          </div>
          {session&&(
            <button onClick={onSignOut} style={{padding:'7px 12px',borderRadius:10,border:'1.5px solid rgba(255,255,255,0.3)',background:'rgba(255,255,255,0.1)',color:C.wh,fontWeight:700,fontSize:11,cursor:'pointer',flexShrink:0}}>Sign Out</button>
          )}
        </div>
        {!session&&<div style={{marginTop:10,background:'rgba(255,255,255,0.12)',borderRadius:10,padding:'8px 12px',fontSize:11,color:'#e9d5ff'}}>💡 Connect Supabase to sync across devices</div>}
        <div style={{display:'flex',gap:6,overflowX:'auto',marginTop:16}}>
          {[['stats','📊 Stats'],['badges','🏅 Badges'],['journal','📔 Journal'],['gear','⌚ Gear'],['admin','🔒 Admin']].map(([id,lbl])=>(
            <div key={id} onClick={()=>setPtab(id)} style={{flexShrink:0,padding:'6px 12px',borderRadius:10,fontSize:12,fontWeight:700,cursor:'pointer',background:ptab===id?C.wh:'rgba(255,255,255,0.18)',color:ptab===id?'#7C3AED':C.wh}}>{lbl}</div>
          ))}
        </div>
      </div>
      <div style={{padding:'16px 16px 80px'}}>
        {ptab==='stats'&&(
          <div>
            <Card style={{marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:14,color:C.dg,marginBottom:10}}>Profile Name</div>
              <div style={{display:'flex',gap:8}}>
                <input value={nameDraft} onChange={e=>setNameDraft(e.target.value)} placeholder="Explorer name" style={{flex:1,minWidth:0,padding:'11px 13px',borderRadius:12,border:'1.5px solid '+C.pg,fontSize:13,boxSizing:'border-box',outline:'none',fontFamily:'inherit'}}/>
                <button onClick={saveName} style={{padding:'0 14px',borderRadius:12,border:'none',background:C.mg,color:C.wh,fontWeight:700,fontSize:13,cursor:'pointer'}}>Save</button>
              </div>
            </Card>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:14}}>
              {[{ic:'📖',lbl:'Total',v:stats.total,c:C.mg},{ic:'🗺️',lbl:'Trails',v:stats.trails,c:C.sky},{ic:'⭐',lbl:'Level',v:'3',c:'#7C3AED'}].map(s=>(
                <Card key={s.lbl} style={{textAlign:'center',padding:'14px 8px'}}>
                  <div style={{fontSize:26,marginBottom:4}}>{s.ic}</div>
                  <div style={{fontSize:24,fontWeight:900,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:10,color:C.gr,fontWeight:600}}>{s.lbl}</div>
                </Card>
              ))}
            </div>
            <Card style={{padding:'16px 14px',marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:14,color:C.dg,marginBottom:14}}>Discoveries by Type</div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={typeData} margin={{top:0,right:4,left:-28,bottom:0}}>
                  <XAxis dataKey="icon" tick={{fontSize:16}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip formatter={(val,name,item)=>[val+' found',item.payload.name]} contentStyle={{borderRadius:10,fontSize:12,border:'none'}}/>
                  <Bar dataKey="count" radius={[6,6,0,0]}>{typeData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card style={{padding:'14px 16px',marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:14,color:C.dg,marginBottom:12}}>Breakdown</div>
              {typeData.map(d=>(
                <div key={d.name} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                  <span style={{fontSize:18,flexShrink:0}}>{d.icon}</span>
                  <span style={{flex:1,fontWeight:600,fontSize:13,color:C.dg}}>{d.name}</span>
                  <div style={{width:90,height:7,borderRadius:4,background:'#F0EDE6',overflow:'hidden'}}><div style={{width:Math.max(d.count/total*100,8)+'%',height:'100%',borderRadius:4,background:d.color}}/></div>
                  <span style={{fontWeight:800,fontSize:13,color:d.color,minWidth:18,textAlign:'right'}}>{d.count}</span>
                </div>
              ))}
            </Card>
            <Card style={{padding:'14px 16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div style={{fontWeight:700,fontSize:14,color:C.dg}}>Weekly Goals</div>
                <span style={{fontSize:11,color:C.gr,fontWeight:600}}>Resets Monday</span>
              </div>
              {goals.map(g=>{
                const pct=Math.min(g.cur/g.target*100,100);
                const done=pct>=100;
                return(
                  <div key={g.label} style={{marginBottom:14}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <span style={{fontSize:18}}>{g.icon}</span>
                        <span style={{fontWeight:600,fontSize:13,color:C.dg}}>{g.label}</span>
                        {done&&<span style={{fontSize:10,fontWeight:700,color:C.mg,background:C.pg,padding:'1px 6px',borderRadius:6}}>DONE ✓</span>}
                      </div>
                      <span style={{fontSize:12,fontWeight:700,color:done?C.mg:C.gr}}>{g.cur}/{g.target}</span>
                    </div>
                    <div style={{height:8,borderRadius:4,background:'#F0EDE6',overflow:'hidden'}}>
                      <div style={{width:pct+'%',height:'100%',borderRadius:4,background:done?C.mg:g.color}}/>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        )}
        {ptab==='badges'&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {badges.map(b=>(
              <Card key={b.lbl} style={{textAlign:'center',padding:'20px 12px',opacity:b.ok?1:.4}}>
                <div style={{fontSize:34,marginBottom:6,filter:b.ok?'none':'grayscale(1)'}}>{b.ic}</div>
                <div style={{fontWeight:700,fontSize:13,color:C.dg}}>{b.lbl}</div>
                <div style={{fontSize:11,color:C.gr,marginTop:3}}>{b.desc}</div>
                {b.ok&&<div style={{fontSize:9,color:C.mg,fontWeight:700,marginTop:6,background:C.pg,padding:'2px 8px',borderRadius:8,display:'inline-block'}}>✓ EARNED</div>}
              </Card>
            ))}
          </div>
        )}
        {ptab==='journal'&&(
          <div>
            {showForm?(
              <Card style={{marginBottom:12}}>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title your adventure…" style={{width:'100%',padding:'11px 13px',borderRadius:12,border:'1.5px solid '+C.pg,fontSize:13,marginBottom:10,boxSizing:'border-box',outline:'none',fontFamily:'inherit'}}/>
                <textarea value={form.body} onChange={e=>setForm({...form,body:e.target.value})} placeholder="Write about your adventure…" style={{width:'100%',padding:'11px 13px',borderRadius:12,border:'1.5px solid '+C.pg,fontSize:13,height:110,resize:'none',boxSizing:'border-box',outline:'none',fontFamily:'inherit'}}/>
                <div style={{display:'flex',gap:8,marginTop:10}}>
                  <button onClick={()=>setShowForm(false)} style={{flex:1,padding:'11px',borderRadius:12,border:'1.5px solid '+C.pg,background:C.pg,color:C.dg,fontWeight:700,fontSize:12,cursor:'pointer'}}>Cancel</button>
                  <button onClick={saveJ} style={{flex:1,padding:'11px',borderRadius:12,border:'none',background:'#7C3AED',color:C.wh,fontWeight:700,fontSize:12,cursor:'pointer'}}>Save Entry 📔</button>
                </div>
              </Card>
            ):(
              <div onClick={()=>setShowForm(true)} style={{background:'#f5f3ff',borderRadius:16,padding:'14px 16px',textAlign:'center',cursor:'pointer',border:'2px dashed #a78bfa',marginBottom:12}}>
                <span style={{fontWeight:700,color:'#7C3AED',fontSize:14}}>+ New Journal Entry</span>
              </div>
            )}
            {journal.map(j=>(
              <Card key={j.id} style={{marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:15,color:C.dg}}>{j.title}</div>
                <div style={{fontSize:11,color:C.gr,marginTop:2}}>📅 {j.date}</div>
                <div style={{fontSize:13,color:'#374151',marginTop:8,lineHeight:1.65}}>{j.body}</div>
              </Card>
            ))}
          </div>
        )}
        {ptab==='gear'&&(
          <div>
            <Card style={{marginBottom:14,border:'2px solid '+(ghStatus==='connected'?C.lg:'#E5E7EB')}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:ghStatus==='connected'?14:0}}>
                <div style={{width:48,height:48,borderRadius:14,background:'#1a73e8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,flexShrink:0}}>🟢</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:15,color:C.dg}}>Google Health API</div>
                  <div style={{fontSize:11,color:C.gr}}>Fitbit · Pixel Watch · OAuth 2.0</div>
                </div>
                {ghStatus==='connected'?<button onClick={disconnect} style={{padding:'7px 13px',borderRadius:10,border:'1.5px solid #FCA5A5',background:'#FEF2F2',color:'#DC2626',fontWeight:700,fontSize:12,cursor:'pointer'}}>Disconnect</button>:<span style={{fontSize:10,fontWeight:700,background:'#D1FAE5',color:'#065F46',padding:'3px 9px',borderRadius:8}}>AVAILABLE</span>}
              </div>
              {ghStatus==='connected'&&ghData&&(
                <div>
                  <div style={{fontSize:11,color:C.gr,marginBottom:10}}>Last synced at {ghData.sync}</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                    {[{ic:'👟',lbl:'Steps',v:ghData.steps.toLocaleString()},{ic:'📏',lbl:'Distance',v:ghData.dist+' mi'},{ic:'❤️',lbl:'Heart Rate',v:ghData.hr+' bpm'},{ic:'🔥',lbl:'Calories',v:ghData.cal.toLocaleString()+' kcal'},{ic:'⚡',lbl:'Active Min',v:ghData.active+' min'}].map(d=>(
                      <div key={d.lbl} style={{background:C.pg,borderRadius:12,padding:'10px 12px',display:'flex',alignItems:'center',gap:8}}>
                        <span style={{fontSize:20}}>{d.ic}</span>
                        <div><div style={{fontWeight:800,fontSize:15,color:C.dg}}>{d.v}</div><div style={{fontSize:10,color:C.gr,fontWeight:600}}>{d.lbl}</div></div>
                      </div>
                    ))}
                    <div style={{background:'#EFF6FF',borderRadius:12,padding:'10px 12px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}} onClick={demoMode}>
                      <span style={{fontSize:11,fontWeight:700,color:'#1D4ED8'}}>🔄 Refresh</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
            {ghStatus==='disconnected'&&(
              <div>
                <button onClick={demoMode} style={{width:'100%',padding:'14px',borderRadius:16,border:'none',background:'linear-gradient(135deg,#1a73e8,#0d47a1)',color:C.wh,fontWeight:700,fontSize:15,cursor:'pointer',marginBottom:10,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                  <span style={{fontSize:20}}>🟢</span> Try Demo Mode
                </button>
                <button onClick={()=>setShowSetup(s=>!s)} style={{width:'100%',padding:'13px',borderRadius:16,border:'1.5px solid '+C.pg,background:C.pg,color:C.dg,fontWeight:700,fontSize:14,cursor:'pointer',marginBottom:12}}>
                  {showSetup?'▲ Hide Setup':'⚙️ Connect Real Device'}
                </button>
                {showSetup&&(
                  <Card style={{border:'1.5px solid #BFDBFE'}}>
                    <div style={{fontWeight:700,color:'#1D4ED8',fontSize:13,marginBottom:10}}>Real Device Setup</div>
                    <div style={{fontSize:12,color:'#374151',lineHeight:1.7,marginBottom:14}}>
                      1. console.cloud.google.com → Enable Health API<br/>
                      2. Create OAuth credentials (Web app)<br/>
                      3. Add this page as redirect URI<br/>
                      4. Confirm the Client ID below
                    </div>
                    <input value={ghClientId} onChange={e=>setGhClientId(e.target.value)} placeholder="Paste Client ID…" style={{width:'100%',padding:'11px 13px',borderRadius:12,border:'1.5px solid '+(ghClientId?'#1a73e8':C.pg),fontSize:12,marginBottom:10,boxSizing:'border-box',outline:'none',fontFamily:'monospace'}}/>
                    <button onClick={connectGH} disabled={!ghClientId.trim()} style={{width:'100%',padding:'12px',borderRadius:14,border:'none',background:ghClientId.trim()?'#1a73e8':'#E5E7EB',color:ghClientId.trim()?C.wh:C.gr,fontWeight:700,fontSize:14,cursor:ghClientId.trim()?'pointer':'not-allowed'}}>
                      🔐 Authorize with Google
                    </button>
                    <div style={{fontSize:11,color:C.gr,marginTop:8,textAlign:'center'}}>Opens Google sign-in · Uses PKCE, no browser secret</div>
                  </Card>
                )}
              </div>
            )}
            <Card style={{marginTop:4}}>
              <div style={{fontWeight:700,color:C.dg,marginBottom:4}}>Share Profile</div>
              <div style={{fontSize:12,color:C.gr,marginBottom:12}}>Let others follow your trail discoveries</div>
              <button style={{width:'100%',padding:'12px',borderRadius:14,border:'none',background:C.mg,color:C.wh,fontWeight:700,fontSize:14,cursor:'pointer'}}>📤 Share My Profile</button>
            </Card>
          </div>
        )}
        {ptab==='admin'&&(
          <div>
            {!adminUnlocked?(
              <Card>
                <div style={{fontWeight:800,fontSize:16,color:C.dg,marginBottom:6}}>Admin Settings</div>
                <div style={{fontSize:12,color:C.gr,lineHeight:1.5,marginBottom:12}}>Enter the master password from your environment to unlock local admin controls.</div>
                <input type="password" value={adminPw} onChange={e=>setAdminPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&unlockAdmin()} placeholder="Master password" style={{width:'100%',padding:'12px 14px',borderRadius:12,border:'1.5px solid '+C.pg,fontSize:14,boxSizing:'border-box',outline:'none',fontFamily:'inherit',marginBottom:10}}/>
                {adminError&&<div style={{background:'#FEE2E2',color:'#991B1B',borderRadius:10,padding:'8px 12px',fontSize:12,marginBottom:10}}>{adminError}</div>}
                <button onClick={unlockAdmin} style={{width:'100%',padding:'13px',borderRadius:14,border:'none',background:C.dg,color:C.wh,fontWeight:800,fontSize:14,cursor:'pointer'}}>Unlock Admin</button>
              </Card>
            ):(
              <div>
                <Card style={{marginBottom:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                    <div style={{fontWeight:800,fontSize:16,color:C.dg}}>Admin Settings</div>
                    <button onClick={()=>setAdminUnlocked(false)} style={{padding:'6px 10px',borderRadius:10,border:'1.5px solid '+C.pg,background:C.pg,color:C.dg,fontWeight:700,fontSize:12,cursor:'pointer'}}>Lock</button>
                  </div>
                  {[
                    ['Supabase URL',SUPABASE_CONFIG.url],
                    ['Supabase anon key',SUPABASE_CONFIG.anonKey?'Configured':'Missing'],
                    ['Google Health Client ID',GOOGLE_HEALTH_CONFIG.clientId||'Missing'],
                    ['Admin password',ADMIN_CONFIG.masterPassword?'Configured':'Missing'],
                    ['Signed in user',session?session.user.email:'None'],
                  ].map(([label,value])=>(
                    <div key={label} style={{display:'flex',justifyContent:'space-between',gap:10,borderTop:'1px solid '+C.pg,padding:'9px 0'}}>
                      <span style={{fontSize:12,color:C.gr,fontWeight:700}}>{label}</span>
                      <span style={{fontSize:12,color:C.dg,fontWeight:700,textAlign:'right',wordBreak:'break-all'}}>{value}</span>
                    </div>
                  ))}
                </Card>
                <Card>
                  <div style={{fontWeight:700,color:C.dg,marginBottom:10}}>Controls</div>
                  <button onClick={onOpenSetup} style={{width:'100%',padding:'12px',borderRadius:14,border:'none',background:C.mg,color:C.wh,fontWeight:700,fontSize:14,cursor:'pointer',marginBottom:10}}>Open Supabase Setup</button>
                  <button onClick={()=>{setProfileName('');setNameDraft('');}} style={{width:'100%',padding:'12px',borderRadius:14,border:'1.5px solid '+C.pg,background:C.pg,color:C.dg,fontWeight:700,fontSize:14,cursor:'pointer'}}>Reset Profile Name</button>
                  <div style={{fontSize:11,color:C.gr,lineHeight:1.5,marginTop:10}}>Vite browser env variables are public in the built app. Use this only for local/admin gating, not for protecting server-side secrets.</div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BottomNav({tab,setTab}){
  const items=[{id:'home',ic:'🏠',lbl:'Home'},{id:'catalog',ic:'🔭',lbl:'Catalog'},{id:'trails',ic:'🗺️',lbl:'Trails'},{id:'cache',ic:'📦',lbl:'Cache'},{id:'profile',ic:'👤',lbl:'Me'}];
  return(
    <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:430,background:C.wh,borderTop:'1px solid #E5E7EB',display:'flex',boxShadow:'0 -2px 16px rgba(0,0,0,0.07)'}}>
      {items.map(i=>(
        <div key={i.id} onClick={()=>setTab(i.id)} style={{flex:1,padding:'8px 0 6px',textAlign:'center',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:1}}>
          <div style={{fontSize:22,lineHeight:1,filter:tab===i.id?'none':'grayscale(80%) opacity(0.45)'}}>{i.ic}</div>
          <div style={{fontSize:9,fontWeight:tab===i.id?800:500,color:tab===i.id?C.mg:C.gr,textTransform:'uppercase',letterSpacing:'0.5px'}}>{i.lbl}</div>
          {tab===i.id&&<div style={{width:4,height:4,borderRadius:2,background:C.mg}}/>}
        </div>
      ))}
    </div>
  );
}

function AddEntryModal({entry,setEntry,photo,onPhoto,loading,suggestions,onAI,onSave,onClose,entryLoc}){
  const fileRef=useRef();
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
      <div style={{width:'100%',maxWidth:430,background:C.cr,borderRadius:'28px 28px 0 0',maxHeight:'92vh',overflowY:'auto',paddingBottom:24}}>
        <div style={{display:'flex',justifyContent:'center',padding:'12px 0'}}><div style={{width:36,height:4,borderRadius:2,background:'#D1D5DB'}}/></div>
        <div style={{padding:'0 16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <div style={{fontWeight:800,fontSize:20,color:C.dg}}>🔍 New Discovery</div>
            <div onClick={onClose} style={{fontSize:22,color:C.gr,cursor:'pointer',padding:'4px 8px'}}>✕</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,background:entryLoc?C.pg:'#FEF3C7',borderRadius:12,padding:'8px 12px',marginBottom:14}}>
            <span style={{fontSize:16}}>{entryLoc?'📍':'⏳'}</span>
            <span style={{fontSize:12,fontWeight:600,color:entryLoc?C.dg:'#92400E',flex:1}}>{entryLoc?entryLoc.lat.toFixed(5)+', '+entryLoc.lng.toFixed(5)+(entryLoc.accuracy?' ± '+Math.round(entryLoc.accuracy)+'m':''):'Acquiring GPS coordinates…'}</span>
          </div>
          <div style={{display:'flex',gap:8,overflowX:'auto',marginBottom:16,paddingBottom:4}}>
            {TYPES.filter(t=>t.id!=='all').map(t=>(
              <div key={t.id} onClick={()=>setEntry({...entry,type:t.id})} style={{flexShrink:0,padding:'7px 14px',borderRadius:14,fontSize:12,fontWeight:700,cursor:'pointer',background:entry.type===t.id?t.color:t.color+'18',color:entry.type===t.id?C.wh:t.color}}>{t.icon} {t.label}</div>
            ))}
          </div>
          <div onClick={()=>fileRef.current.click()} style={{width:'100%',height:150,borderRadius:20,cursor:'pointer',marginBottom:14,background:photo?'url('+photo+') center/cover':C.pg,border:'2px dashed '+C.lg,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:6,boxSizing:'border-box'}}>
            {!photo&&<><div style={{fontSize:36}}>📷</div><div style={{fontSize:13,color:C.mg,fontWeight:700}}>Tap to add photo</div></>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} style={{display:'none'}}/>
          <textarea value={entry.description||''} onChange={e=>setEntry({...entry,description:e.target.value})} placeholder="Describe what you see… AI will suggest species" style={{width:'100%',padding:'12px 14px',borderRadius:14,fontSize:13,border:'1.5px solid '+C.pg,resize:'none',height:72,fontFamily:'inherit',background:C.wh,color:C.dg,outline:'none',boxSizing:'border-box',marginBottom:12}}/>
          <button onClick={onAI} disabled={loading} style={{width:'100%',padding:'14px',borderRadius:16,border:'none',cursor:'pointer',background:'linear-gradient(135deg,'+C.mg+','+C.dg+')',color:C.wh,fontWeight:700,fontSize:15,marginBottom:14,display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:loading?.75:1}}>
            <span style={{fontSize:20}}>🤖</span>{loading?'Identifying…':'AI Identify Species'}
          </button>
          {suggestions&&(
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:C.gr,letterSpacing:'0.8px',textTransform:'uppercase',marginBottom:8}}>AI Suggestions — tap to select</div>
              {suggestions.map((s,i)=>(
                <div key={i} onClick={()=>setEntry({...entry,name:s.name,species:s.species})} style={{padding:'11px 14px',borderRadius:14,marginBottom:8,cursor:'pointer',background:entry.name===s.name?C.pg:C.wh,border:'1.5px solid '+(entry.name===s.name?C.mg:'#E5E7EB')}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <div style={{fontWeight:700,fontSize:14,color:C.dg}}>{s.name}</div>
                    <span style={{fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:8,flexShrink:0,background:s.confidence==='High'?'#D1FAE5':s.confidence==='Medium'?'#FEF3C7':'#FEE2E2',color:s.confidence==='High'?'#065F46':s.confidence==='Medium'?'#92400E':'#991B1B'}}>{s.confidence}</span>
                  </div>
                  <div style={{fontSize:11,color:C.gr,fontStyle:'italic',marginTop:2}}>{s.species}</div>
                  <div style={{fontSize:12,color:'#374151',marginTop:3}}>{s.tip}</div>
                </div>
              ))}
            </div>
          )}
          <input value={entry.name||''} onChange={e=>setEntry({...entry,name:e.target.value})} placeholder="Common name…" style={{width:'100%',padding:'12px 14px',borderRadius:14,fontSize:13,border:'1.5px solid '+C.pg,marginBottom:10,boxSizing:'border-box',background:C.wh,outline:'none',fontFamily:'inherit'}}/>
          <input value={entry.notes||''} onChange={e=>setEntry({...entry,notes:e.target.value})} placeholder="Field notes (optional)…" style={{width:'100%',padding:'12px 14px',borderRadius:14,fontSize:13,border:'1.5px solid '+C.pg,marginBottom:16,boxSizing:'border-box',background:C.wh,outline:'none',fontFamily:'inherit'}}/>
          <button onClick={onSave} style={{width:'100%',padding:'16px',borderRadius:18,border:'none',cursor:'pointer',background:C.mg,color:C.wh,fontWeight:800,fontSize:16}}>📍 Save Discovery</button>
        </div>
      </div>
    </div>
  );
}

function QRModal({trail,onClose}){
  if(!trail)return null;
  const grid=makeQR(trail.name+trail.id),N=21,cs=10;
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:400,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 20px'}}>
      <div style={{background:C.wh,borderRadius:28,padding:24,width:'100%',maxWidth:340}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
          <div style={{fontWeight:800,fontSize:18,color:C.dg}}>📤 Share Trail</div>
          <div onClick={onClose} style={{fontSize:22,color:C.gr,cursor:'pointer',padding:'4px 8px'}}>✕</div>
        </div>
        <div style={{textAlign:'center',marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:16,color:C.dg}}>{trail.name}</div>
          <div style={{fontSize:12,color:C.gr,marginTop:3}}>📏 {trail.dist} mi · {trail.diff} · {trail.eids.length} waypoints</div>
        </div>
        <div style={{display:'flex',justifyContent:'center',marginBottom:18}}>
          <div style={{padding:14,background:C.wh,borderRadius:16,border:'2px solid '+C.pg}}>
            <svg width={N*cs} height={N*cs}>{grid.map((row,i)=>row.map((v,j)=>v?<rect key={i+'-'+j} x={j*cs} y={i*cs} width={cs} height={cs} fill={C.dg} rx="1"/>:null))}</svg>
          </div>
        </div>
        <div style={{background:C.pg,borderRadius:12,padding:'10px 14px',marginBottom:16,fontSize:12,color:C.dg,textAlign:'center',fontFamily:'monospace',wordBreak:'break-all'}}>{'trailkeeper.app/trail/'+trail.id}</div>
        <div style={{display:'flex',gap:10}}>
          <button style={{flex:1,padding:'12px',borderRadius:14,border:'1.5px solid '+C.pg,background:C.pg,color:C.dg,fontWeight:700,fontSize:13,cursor:'pointer'}}>📋 Copy Link</button>
          <button style={{flex:1,padding:'12px',borderRadius:14,border:'none',background:C.mg,color:C.wh,fontWeight:700,fontSize:13,cursor:'pointer'}}>📤 Share</button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function TrailKeeper(){
  const [appMode,setAppMode]=useState(SUPABASE_CONFIG.url&&SUPABASE_CONFIG.anonKey?'auth':'setup'); // 'setup'|'auth'|'app'
  const [sb,setSb]=useState(()=>SUPABASE_CONFIG.url&&SUPABASE_CONFIG.anonKey?makeSB(SUPABASE_CONFIG.url,SUPABASE_CONFIG.anonKey):null);
  const [session,setSession]=useState(null);
  const [dbLoading,setDbLoading]=useState(false);
  const [profileName,setProfileName]=useState(()=>localStorage.getItem('trailkeeper_profile_name')||'');

  const [tab,setTab]=useState('home');
  const [showAdd,setShowAdd]=useState(false);
  const [entries,setEntries]=useState(E0);
  const [trails,setTrails]=useState(TR0);
  const [caches,setCaches]=useState(CA0);
  const [journal,setJournal]=useState(JN0);
  const [filter,setFilter]=useState('all');
  const [aiLoading,setAiLoading]=useState(false);
  const [aiSuggestions,setAiSuggestions]=useState(null);
  const [newEntry,setNewEntry]=useState({type:'tree',name:'',notes:'',description:''});
  const [photo,setPhoto]=useState(null);
  const [entryLoc,setEntryLoc]=useState(null);
  const [selectedEntry,setSelectedEntry]=useState(null);
  const [shareTrail,setShareTrail]=useState(null);
  const [userLoc,setUserLoc]=useState(null);
  const [locStatus,setLocStatus]=useState('idle');
  const [tracking,setTracking]=useState(false);
  const [showActivity,setShowActivity]=useState(false);
  const [showSummary,setShowSummary]=useState(false);
  const [tTime,setTTime]=useState(0);
  const [tDist,setTDist]=useState(0);
  const [trackPath,setTrackPath]=useState([]);
  const [gpsMode,setGpsMode]=useState('sim');

  const timerRef=useRef(null);
  const watchRef=useRef(null);
  const simRef=useRef(null);
  const prevPosRef=useRef(null);
  const simDirRef=useRef(0);
  const userLocRef=useRef(null);

  useEffect(()=>{userLocRef.current=userLoc;},[userLoc]);
  useEffect(()=>{localStorage.setItem('trailkeeper_profile_name',profileName);},[profileName]);

  useEffect(()=>{
    if(!navigator.geolocation){setLocStatus('denied');return;}
    setLocStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async pos=>{const{latitude:lat,longitude:lng}=pos.coords;setLocStatus('granted');const city=await reverseGeocode(lat,lng);setUserLoc({lat,lng,city});},
      ()=>{setLocStatus('denied');setUserLoc({lat:25.7617,lng:-80.1918,city:'Miami, FL (demo)'});},
      {enableHighAccuracy:true,timeout:12000,maximumAge:60000}
    );
  },[]);

  useEffect(()=>{
    if(!tracking)return;
    const base=userLocRef.current||{lat:25.762,lng:-80.196};
    prevPosRef.current={lat:base.lat,lng:base.lng};
    simDirRef.current=Math.random()*Math.PI*2;
    setTrackPath([{lat:base.lat,lng:base.lng}]);
    timerRef.current=setInterval(()=>setTTime(t=>t+1),1000);
    let gpsActive=false;
    if(navigator.geolocation){
      watchRef.current=navigator.geolocation.watchPosition(
        pos=>{
          if(!gpsActive){gpsActive=true;setGpsMode('real');clearInterval(simRef.current);}
          const{latitude,longitude}=pos.coords;
          const prev=prevPosRef.current;
          const d=haversine(prev.lat,prev.lng,latitude,longitude);
          if(d>=0.0005&&d<0.5){setTDist(x=>parseFloat((x+d).toFixed(4)));setTrackPath(pts=>[...pts,{lat:latitude,lng:longitude}]);prevPosRef.current={lat:latitude,lng:longitude};}
        },
        ()=>{},
        {enableHighAccuracy:true,maximumAge:2000}
      );
    }
    simRef.current=setInterval(()=>{
      if(gpsActive)return;
      simDirRef.current+=(Math.random()-0.47)*0.28;
      const prev=prevPosRef.current;
      const spd=0.000044;
      const pt={lat:prev.lat+Math.cos(simDirRef.current)*spd,lng:prev.lng+Math.sin(simDirRef.current)*spd*1.3};
      const d=haversine(prev.lat,prev.lng,pt.lat,pt.lng);
      setTDist(x=>parseFloat((x+d).toFixed(4)));
      setTrackPath(pts=>[...pts,pt]);
      prevPosRef.current=pt;
    },1000);
    return()=>{clearInterval(timerRef.current);clearInterval(simRef.current);navigator.geolocation?.clearWatch(watchRef.current);watchRef.current=null;};
  },[tracking]);

  // ── Supabase handlers ──
  const handleConnect=(url,key)=>{setSb(makeSB(url,key));setAppMode('auth');};
  const handleSkip=()=>setAppMode('app');

  const handleAuth=async data=>{
    setSession(data);
    setDbLoading(true);
    try{
      const t=data.access_token;
      const [e,tr,ca,jn]=await Promise.all([
        sb.get('entries',t,'order=created_at.desc'),
        sb.get('trails',t,'order=created_at.desc'),
        sb.get('caches',t,'order=created_at.desc'),
        sb.get('journal',t,'order=created_at.desc'),
      ]);
      if(e&&e.length)setEntries(e);
      if(tr&&tr.length)setTrails(tr);
      if(ca&&ca.length)setCaches(ca);
      if(jn&&jn.length)setJournal(jn);
    }catch(err){console.warn('Load error:',err);}
    setDbLoading(false);
    setAppMode('app');
  };

  const handleSignOut=async()=>{
    if(sb&&session)await sb.signOut(session.access_token).catch(()=>{});
    setSession(null);setEntries(E0);setTrails(TR0);setCaches(CA0);setJournal(JN0);
    setAppMode('auth');
  };

  const sync=(table,data)=>{
    if(!sb||!session)return;
    sb.upsert(table,{...data,user_id:session.user.id},session.access_token).catch(e=>console.warn('Sync:',e));
  };

  // ── Data handlers ──
  const handleOpenAdd=()=>{
    setShowAdd(true);setEntryLoc(null);
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        pos=>setEntryLoc({lat:pos.coords.latitude,lng:pos.coords.longitude,accuracy:pos.coords.accuracy}),
        ()=>setEntryLoc(userLoc?{lat:userLoc.lat,lng:userLoc.lng}:null),
        {enableHighAccuracy:true,timeout:10000}
      );
    } else setEntryLoc(userLoc?{lat:userLoc.lat,lng:userLoc.lng}:null);
  };
  const handlePhoto=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setPhoto(ev.target.result);r.readAsDataURL(f);};
  const handleAI=async()=>{
    if(!newEntry.description)return;
    setAiLoading(true);setAiSuggestions(null);
    try{setAiSuggestions(await aiIdentify(newEntry.description,newEntry.type));}
    catch{setAiSuggestions([{name:'Could not identify',species:'Try a more detailed description',confidence:'Low',tip:'Describe color, size, shape, and habitat'}]);}
    setAiLoading(false);
  };
  const handleSave=()=>{
    if(!newEntry.name)return;
    const id=genId();
    const lat=entryLoc?entryLoc.lat:(userLoc?userLoc.lat:25.76)+(Math.random()-.5)*0.002;
    const lng=entryLoc?entryLoc.lng:(userLoc?userLoc.lng:-80.19)+(Math.random()-.5)*0.002;
    const entry={id,...newEntry,photo,lat,lng,date:new Date().toISOString().split('T')[0]};
    setEntries(es=>[entry,...es]);
    sync('entries',entry);
    setShowAdd(false);setPhoto(null);setAiSuggestions(null);setEntryLoc(null);setNewEntry({type:'tree',name:'',notes:'',description:''});
  };

  const handleStartActivity=()=>{setTTime(0);setTDist(0);setTrackPath([]);setGpsMode('sim');setTracking(true);setShowActivity(true);};
  const handleStopActivity=()=>{setTracking(false);setShowActivity(false);setShowSummary(true);};
  const handleSaveJournal=()=>{
    const j={id:genId(),date:new Date().toISOString().split('T')[0],title:'Activity — '+fmtDist(tDist),body:'Completed '+fmtDist(tDist)+' in '+fmtTime(tTime)+'. Pace: '+calcPace(tTime,tDist)+'. '+trackPath.length+' GPS points recorded.'};
    setJournal(js=>[j,...js]);
    sync('journal',j);
    setShowSummary(false);
  };

  const stats={trees:entries.filter(e=>e.type==='tree').length,birds:entries.filter(e=>e.type==='bird').length,trails:trails.length,total:entries.length};

  // ── Routing ──
  if(appMode==='setup')return <ConfigScreen onConnect={handleConnect} onSkip={handleSkip}/>;
  if(appMode==='auth'&&sb)return <AuthScreen sb={sb} onAuth={handleAuth} onBack={()=>setAppMode('setup')}/>;
  if(dbLoading)return(
    <div style={{maxWidth:430,margin:'0 auto',minHeight:'100vh',background:'linear-gradient(155deg,'+C.dg+','+C.mg+')',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif'}}>
      <div style={{fontSize:48,marginBottom:16}}>🌿</div>
      <div style={{color:C.wh,fontWeight:800,fontSize:20,marginBottom:8}}>Loading your data…</div>
      <div style={{color:'#a7f3d0',fontSize:14}}>Fetching from Supabase</div>
    </div>
  );

  return(
    <div style={{maxWidth:430,margin:'0 auto',minHeight:'100vh',background:C.bg,fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif',position:'relative',boxShadow:'0 0 40px rgba(0,0,0,0.12)'}}>
      <div style={{paddingBottom:80,minHeight:'100vh'}}>
        {tab==='home'&&<HomeScreen entries={entries} stats={stats} setTab={setTab} openAdd={handleOpenAdd} openEntry={setSelectedEntry} onStartActivity={handleStartActivity} userLoc={userLoc} locStatus={locStatus} profileName={profileName}/>}
        {tab==='catalog'&&<CatalogScreen entries={entries} trails={trails} filter={filter} setFilter={setFilter} openAdd={handleOpenAdd} openEntry={setSelectedEntry} userLoc={userLoc}/>}
        {tab==='trails'&&<TrailsScreen trails={trails} setTrails={setTrails} entries={entries} openEntry={setSelectedEntry} onShare={setShareTrail}/>}
        {tab==='cache'&&<CacheScreen caches={caches} setCaches={setCaches} sb={sb} session={session}/>}
        {tab==='profile'&&<ProfileScreen entries={entries} stats={stats} journal={journal} setJournal={setJournal} sb={sb} session={session} onSignOut={handleSignOut} profileName={profileName} setProfileName={setProfileName} onOpenSetup={()=>setAppMode('setup')}/>}
      </div>
      <BottomNav tab={tab} setTab={setTab}/>
      {showActivity&&<ActivityOverlay path={trackPath} tTime={tTime} tDist={tDist} onStop={handleStopActivity} gpsMode={gpsMode}/>}
      {showSummary&&<ActivitySummary path={trackPath} tTime={tTime} tDist={tDist} onDismiss={()=>setShowSummary(false)} onSaveJournal={handleSaveJournal}/>}
      {showAdd&&<AddEntryModal entry={newEntry} setEntry={setNewEntry} photo={photo} onPhoto={handlePhoto} loading={aiLoading} suggestions={aiSuggestions} onAI={handleAI} onSave={handleSave} onClose={()=>{setShowAdd(false);setPhoto(null);setAiSuggestions(null);setEntryLoc(null);setNewEntry({type:'tree',name:'',notes:'',description:''}); }} entryLoc={entryLoc}/>}
      {selectedEntry&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',zIndex:300,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
          <div style={{width:'100%',maxWidth:430,background:C.cr,borderRadius:'28px 28px 0 0',maxHeight:'82vh',overflowY:'auto',paddingBottom:24}}>
            <div style={{display:'flex',justifyContent:'center',padding:'12px 0'}}><div style={{width:36,height:4,borderRadius:2,background:'#D1D5DB'}}/></div>
            {selectedEntry.photo&&<div style={{width:'100%',height:200,background:'url('+selectedEntry.photo+') center/cover'}}/>}
            <div style={{padding:'16px 20px'}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                <div style={{width:54,height:54,borderRadius:16,background:(TYPES.find(x=>x.id===selectedEntry.type)||TYPES[1]).color+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,flexShrink:0}}>{(TYPES.find(x=>x.id===selectedEntry.type)||TYPES[1]).icon}</div>
                <div><div style={{fontWeight:800,fontSize:21,color:C.dg}}>{selectedEntry.name}</div>{selectedEntry.species&&<div style={{fontSize:13,color:C.gr,fontStyle:'italic'}}>{selectedEntry.species}</div>}</div>
              </div>
              <div style={{background:C.pg,borderRadius:14,padding:12,marginBottom:14,display:'flex',gap:8,flexWrap:'wrap'}}>
                <span style={{fontSize:11,fontWeight:700,color:C.mg,background:C.wh,padding:'4px 10px',borderRadius:8}}>📅 {selectedEntry.date}</span>
                <span style={{fontSize:11,fontWeight:700,color:C.sky,background:C.wh,padding:'4px 10px',borderRadius:8}}>📍 {selectedEntry.lat.toFixed(5)}, {selectedEntry.lng.toFixed(5)}</span>
              </div>
              {selectedEntry.notes&&<div style={{fontSize:14,color:C.dg,lineHeight:1.65,background:C.pg,borderRadius:12,padding:'10px 14px',marginBottom:16}}>{selectedEntry.notes}</div>}
              <button onClick={()=>setSelectedEntry(null)} style={{width:'100%',padding:'14px',borderRadius:16,border:'1.5px solid '+C.pg,background:C.pg,color:C.dg,fontWeight:700,fontSize:14,cursor:'pointer'}}>Close</button>
            </div>
          </div>
        </div>
      )}
      {shareTrail&&<QRModal trail={shareTrail} onClose={()=>setShareTrail(null)}/>}
    </div>
  );
}
