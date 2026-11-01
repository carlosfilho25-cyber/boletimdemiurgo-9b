/* ===== Boletim ===== */
const DISC=['Português','Matemática','História','Geografia','Ciências','Inglês','Educação Física','Artes'],KEY='boletim-batman-v2';
let D;try{D=JSON.parse(localStorage.getItem(KEY))}catch(e){}D=D||{freq:95,notas:{}};
const $=id=>document.getElementById(id),save=()=>{try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){}};
const fmt=n=>n.toFixed(1).replace('.',','),cls=m=>m>=7?['Aprovado','bom']:m>=5?['Recuperação','rec']:['Reprovado','ruim'];
DISC.forEach((d,i)=>{const tr=document.createElement('tr');
  tr.innerHTML=`<td>${d}</td>`+[0,1,2,3].map(b=>`<td><input class="nota" type="number" min="0" max="10" step="0.1" data-d="${i}" data-b="${b}" aria-label="${d}, ${b+1}º bimestre"></td>`).join('')+`<td class="m" id="m${i}">—</td><td id="s${i}">—</td>`;
  $('corpo').appendChild(tr)});
document.querySelectorAll('.nota').forEach(el=>{
  const v=(D.notas[el.dataset.d]||[])[el.dataset.b];if(v!=null)el.value=v;
  el.oninput=()=>{(D.notas[el.dataset.d]=D.notas[el.dataset.d]||[])[el.dataset.b]=el.value===''?null:Math.min(10,Math.max(0,+el.value));save();calc()}});
$('freq').value=D.freq;$('freq').oninput=e=>{D.freq=Math.min(100,Math.max(0,+e.target.value||0));save();calc()};
function calc(){const ms=[];
  DISC.forEach((_,i)=>{const ns=(D.notas[i]||[]).filter(n=>typeof n==='number'),m=ns.length?ns.reduce((a,b)=>a+b)/ns.length:null,st=$('s'+i);
    if(m===null){$('m'+i).textContent=st.textContent='—';st.className='';return}
    const [t,c]=cls(m);$('m'+i).textContent=fmt(m);st.textContent=t;st.className=c;ms.push(m)});
  const sg=$('sg');
  if(ms.length){const mg=ms.reduce((a,b)=>a+b)/ms.length;let [t,c]=cls(mg);if(t==='Aprovado'&&ms.some(m=>m<5))[t,c]=['Recuperação','rec'];
    $('mg').textContent=fmt(mg);sg.textContent=t;sg.className=c;sg.style.fontSize='1rem'}else{$('mg').textContent=sg.textContent='—';sg.className=''}
  const f=D.freq;$('sf').textContent=f>=75?'Frequência regular':'Abaixo do mínimo (75%)';$('sf').style.color=f>=75?'var(--ok)':'var(--ruim)'}
calc();

/* ===== Fundo: lua e chuva ===== */
const bg=$('bg'),cx=bg.getContext('2d'),reduz=matchMedia('(prefers-reduced-motion: reduce)').matches;let W,H,rain=[];
function fit(){W=bg.width=innerWidth;H=bg.height=innerHeight;rain=Array.from({length:Math.min(260,W/5|0)},()=>({x:Math.random()*W,y:Math.random()*H,l:10+Math.random()*16,v:12+Math.random()*10}))}
addEventListener('resize',fit);fit();
(function sky(){const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0d14');g.addColorStop(1,'#030406');cx.fillStyle=g;cx.fillRect(0,0,W,H);
  const mx=W*.35,my=H*.16,r=Math.min(W,H)*.07,h=cx.createRadialGradient(mx,my,r*.8,mx,my,r*5);
  h.addColorStop(0,'rgba(190,205,230,.25)');h.addColorStop(1,'rgba(190,205,230,0)');cx.fillStyle=h;cx.fillRect(0,0,W,H);
  cx.fillStyle='#c9d2e4';cx.beginPath();cx.arc(mx,my,r,0,7);cx.fill();
  cx.strokeStyle='rgba(170,190,225,.3)';cx.beginPath();
  rain.forEach(d=>{cx.moveTo(d.x,d.y);cx.lineTo(d.x-d.l*.25,d.y+d.l);if(!reduz){d.y+=d.v;d.x-=d.v*.25;if(d.y>H){d.y=-20;d.x=Math.random()*W+40}}});
  cx.stroke();if(!reduz)requestAnimationFrame(sky)})();

/* ===== Batman 3D segurando o boletim ===== */
const mk=el=>{const r=new THREE.WebGLRenderer({alpha:true,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));el.appendChild(r.domElement);return r};
const rA=mk($('back')),rB=mk($('front')),scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(30,1,.1,100);
cam.position.set(0,2.2,9.2);cam.lookAt(0,2.2,0);
[[new THREE.HemisphereLight(0x8fa0c4,0x150609,.8)],[new THREE.DirectionalLight(0xdbe3ff,1.2),[-3,5,5]],[new THREE.PointLight(0xc8102e,3,18),[3.5,2,-3]],[new THREE.PointLight(0xc8102e,1.6,14),[-3.5,1,-2]]]
 .forEach(([l,p])=>{if(p)l.position.set(...p);l.layers.enable(1);scene.add(l)});
const mt=(c,r,m,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m,...o});
const suit=mt(0x202228,.5,.5),plate=mt(0x2e3139,.38,.7),metal=mt(0x454954,.3,.85),dark=mt(0x0b0c0f,.8,.2),
 cloth=mt(0x101216,.9,.05,{side:THREE.DoubleSide}),skin=mt(0xcaa58f,.7,0),eye=new THREE.MeshBasicMaterial({color:0xffffff});
const P=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);return o};
function RB(w,h,d,m,b=.022){const x=(w-2*b)/2,y=(h-2*b)/2,r=Math.min(.05,x,y),s=new THREE.Shape();
 s.moveTo(-x+r,-y);s.lineTo(x-r,-y);s.quadraticCurveTo(x,-y,x,-y+r);s.lineTo(x,y-r);s.quadraticCurveTo(x,y,x-r,y);s.lineTo(-x+r,y);s.quadraticCurveTo(-x,y,-x,y-r);s.lineTo(-x,-y+r);s.quadraticCurveTo(-x,-y,-x+r,-y);
 const g=new THREE.ExtrudeGeometry(s,{depth:Math.max(.01,d-2*b),bevelEnabled:true,bevelSize:b,bevelThickness:b,bevelSegments:2,curveSegments:4});g.center();return new THREE.Mesh(g,m)}
const V=(x,y,z)=>new THREE.Vector3(x,y,z),UP=V(0,1,0);
function seg(a,b,r1,r2,m){const d=b.clone().sub(a),g=new THREE.CylinderGeometry(r2,r1,d.length(),18),o=new THREE.Mesh(g,m);
 o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(UP,d.normalize());return o}
const ball=(r,m,p)=>{const o=P(new THREE.SphereGeometry(r,16,12),m);o.position.copy(p);return o};

const rig=new THREE.Group(),hero=new THREE.Group();rig.add(hero);scene.add(rig);
const add=(...o)=>o.forEach(x=>hero.add(x));
// Pernas
[-1,1].forEach(s=>{const hip=V(.25*s,1.95,0),knee=V(.27*s,1.05,.08),ank=V(.28*s,.3,0);
 add(seg(hip,knee,.22,.17,suit),ball(.17,suit,knee),seg(knee,ank,.16,.12,suit));
 const th=RB(.3,.5,.12,plate);th.position.set(.27*s,1.55,.2);add(th);
 const kp=RB(.3,.22,.14,metal);kp.position.set(.27*s,1.05,.2);add(kp);
 const sh=RB(.26,.6,.1,plate);sh.position.set(.28*s,.7,.14);add(sh);
 const bt=RB(.36,.34,.62,plate);bt.position.set(.28*s,.17,.1);add(bt);
 const sl=RB(.38,.07,.66,dark);sl.position.set(.28*s,.02,.1);add(sl)});
// Quadril, cinto e bolsos
add(P(RB(1,.3,.52,suit).geometry,suit,0,1.9,0),P(RB(1.12,.17,.56,metal).geometry,metal,0,2.05,0));
[-.5,-.32,.32,.5].forEach(x=>{const p=RB(.15,.2,.13,plate);p.position.set(x,2.03,.3);add(p)});
const bk=RB(.18,.15,.08,mt(0x8a8f99,.25,.95));bk.position.set(0,2.05,.31);add(bk);
// Tronco em V
const ts=new THREE.Shape();ts.moveTo(-.8,3.3);ts.quadraticCurveTo(0,3.45,.8,3.3);ts.lineTo(.5,2);ts.lineTo(-.5,2);ts.closePath();
const tg=new THREE.ExtrudeGeometry(ts,{depth:.4,bevelEnabled:true,bevelSize:.1,bevelThickness:.1,bevelSegments:3});tg.translate(0,0,-.2);add(P(tg,suit));
[-1,1].forEach(s=>{const p=RB(.52,.46,.16,plate);p.position.set(.29*s,2.95,.3);p.rotation.z=-.14*s;add(p)});
[0,1,2].forEach(i=>{const p=RB(.62-i*.05,.14,.12,plate);p.position.set(0,2.5-i*.16,.28);add(p)});
const pts=[[0,.1],[.06,.15],[.1,.1],[.3,.15],[.4,.04],[.28,0],[.2,-.09],[.12,-.02],[.06,-.13],[0,-.07]],sh=new THREE.Shape();
pts.forEach((p,i)=>i?sh.lineTo(p[0],p[1]):sh.moveTo(p[0],p[1]));pts.slice(0,-1).reverse().forEach(p=>sh.lineTo(-p[0],p[1]));
const em=P(new THREE.ExtrudeGeometry(sh,{depth:.03,bevelEnabled:false}),metal,0,2.88,.42);em.scale.set(1.3,1.3,1);add(em);
// Ombreiras
[-1,1].forEach(s=>{const c=P(new THREE.SphereGeometry(.34,24,12,0,7,0,1.7),plate,.9*s,3.2,0);c.scale.set(1,.85,1.05);c.rotation.z=-.5*s;add(c);
 [0,1].forEach(i=>{const l=RB(.5,.1,.5,i?metal:plate);l.position.set((1.03+i*.08)*s,3.0-i*.14,0);l.rotation.z=-(.7+i*.12)*s;add(l)})});
// Pescoço e cabeça
add(seg(V(0,3.3,0),V(0,3.5,0),.2,.17,suit));
const head=new THREE.Group();head.position.set(0,3.72,0);hero.add(head);
const cowl=P(new THREE.SphereGeometry(.33,32,24),suit);cowl.scale.set(.93,1.12,1);head.add(cowl);
const jaw=RB(.3,.15,.18,skin);jaw.position.set(0,-.2,.2);head.add(jaw);
const mouth=RB(.12,.02,.03,dark);mouth.position.set(0,-.2,.3);head.add(mouth);
const nose=RB(.08,.18,.09,suit);nose.position.set(0,-.03,.33);head.add(nose);
[-1,1].forEach(s=>{const e=RB(.14,.04,.04,eye);e.position.set(.12*s,.02,.3);head.add(e);
 const br=RB(.22,.05,.1,suit);br.position.set(.13*s,.09,.3);br.rotation.z=.25*s;head.add(br);
 const ck=RB(.1,.2,.12,plate);ck.position.set(.25*s,-.12,.18);ck.rotation.y=.4*s;head.add(ck);
 const es=new THREE.Shape();es.moveTo(-.1,0);es.lineTo(.1,0);es.lineTo(.02*s,.55);es.closePath();
 const ear=P(new THREE.ExtrudeGeometry(es,{depth:.07,bevelEnabled:false}),suit,.17*s,.28,-.05);ear.geometry.translate(0,0,-.035);ear.rotation.z=-.12*s;head.add(ear)});
// Capa
const cg=new THREE.PlaneGeometry(2.6,3.4,24,30);cg.translate(0,-1.7,0);const cb=cg.attributes.position.array.slice();add(P(cg,cloth,0,3.3,-.32));
add(P(RB(.9,.25,.3,cloth).geometry,cloth,0,3.4,-.25));
// Braço esquerdo do personagem (cai ao lado do corpo, punho fechado)
{const S=V(.95,3.1,0),E=V(1.15,2.2,.1),W=V(1.1,1.45,.3);
 add(ball(.17,plate,S),seg(S,E,.16,.14,suit),ball(.14,suit,E),seg(E,W,.17,.13,plate),P(RB(.2,.18,.22,suit).geometry,suit,1.1,1.33,.3),ball(.13,suit,V(1.1,1.22,.3)));
 for(let i=0;i<3;i++){const f=RB(.04,.5-i*.08,.22,metal);f.position.set(1.3,2.0-i*0,.06+i*.1);add(f)}}
// Braço direito (lado esquerdo da tela): segura o boletim
const S=V(-.95,3.1,0),E=V(-1.35,2.3,.35),Wr=V(-1.6,2.75,.95);
add(ball(.17,plate,S),seg(S,E,.16,.14,suit),ball(.14,suit,E),seg(E,Wr,.17,.13,plate));
for(let i=0;i<3;i++){const f=RB(.04,.5-i*.08,.2,metal);f.position.set(-1.55-i*.01,2.5,.5+i*.1);f.rotation.x=-.5;add(f)}
add(P(RB(.2,.22,.12,suit).geometry,suit,Wr.x,Wr.y+.05,Wr.z));
for(let i=0;i<4;i++){const f=P(new THREE.CapsuleGeometry(.035,.2,4,8),suit,Wr.x-.18,Wr.y-.08+i*.06,Wr.z-.07);f.rotation.z=Math.PI/2;add(f)}   // dedos atrás do boletim
const th=P(new THREE.CapsuleGeometry(.045,.22,4,8),suit,Wr.x-.2,Wr.y+.02,Wr.z+.09);th.rotation.z=Math.PI/2;th.layers.set(1);add(th);        // polegar na frente
const anchor=new THREE.Object3D();anchor.position.set(Wr.x-.1,Wr.y,Wr.z);hero.add(anchor);

const mouse={x:0,y:0};addEventListener('pointermove',e=>{mouse.x=e.clientX/innerWidth*2-1;mouse.y=e.clientY/innerHeight*2-1});
const card=$('card'),held=()=>innerWidth>=1200;
function resize(){const w=innerWidth,h=innerHeight;[rA,rB].forEach(r=>r.setSize(w,h));cam.aspect=w/h;cam.updateProjectionMatrix();
 const hw=Math.tan(15*Math.PI/180)*9.2*cam.aspect;rig.position.x=held()?hw*.48:hw*.35;card.classList.toggle('held',held())}
addEventListener('resize',resize);resize();
const clk=new THREE.Clock(),v=V(0,0,0);
(function loop(){const t=clk.getElapsedTime(),a=reduz?0:1;
 rig.rotation.y=Math.sin(t*.5)*.07*a+mouse.x*.1;hero.position.y=Math.sin(t*1.3)*.025*a;
 head.rotation.y=(mouse.x-.45)*.35;head.rotation.x=mouse.y*.15;
 const p=cg.attributes.position;
 for(let i=0;i<p.count;i++){const x=cb[i*3],y=cb[i*3+1],k=-y/3.4;p.setX(i,x*(1+k*.5));p.setZ(i,(Math.sin(y*3+t*2+x*1.5)*.08*a)*k-k*k*.4)}
 p.needsUpdate=true;cg.computeVertexNormals();
 cam.layers.set(0);rA.render(scene,cam);
 if(held()){cam.layers.set(1);rB.render(scene,cam);
  rig.updateMatrixWorld(true);cam.updateMatrixWorld();anchor.getWorldPosition(v).project(cam);
  const px=(v.x+1)/2*innerWidth,py=(1-v.y)/2*innerHeight,cw=card.offsetWidth,ch=card.offsetHeight;
  card.style.transform=`translate(${px-cw}px,${Math.max(12,Math.min(innerHeight-ch-12,py-ch*.3))}px)`}
 requestAnimationFrame(loop)})();