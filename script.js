/* ===== Boletim ===== */
const DISC=['Português','Matemática','História','Geografia','Ciências','Inglês','Educação Física','Artes'],KEY='boletim-batman-v3';
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
  const mx=W*.82,my=H*.16,r=Math.min(W,H)*.07,h=cx.createRadialGradient(mx,my,r*.8,mx,my,r*5);
  h.addColorStop(0,'rgba(190,205,230,.25)');h.addColorStop(1,'rgba(190,205,230,0)');cx.fillStyle=h;cx.fillRect(0,0,W,H);
  cx.fillStyle='#c9d2e4';cx.beginPath();cx.arc(mx,my,r,0,7);cx.fill();
  cx.strokeStyle='rgba(170,190,225,.3)';cx.beginPath();
  rain.forEach(d=>{cx.moveTo(d.x,d.y);cx.lineTo(d.x-d.l*.25,d.y+d.l);if(!reduz){d.y+=d.v;d.x-=d.v*.25;if(d.y>H){d.y=-20;d.x=Math.random()*W+40}}});
  cx.stroke();if(!reduz)requestAnimationFrame(sky)})();

/* ===== Batman 3D: formas orgânicas e suaves ===== */
const mk=el=>{const r=new THREE.WebGLRenderer({alpha:true,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));el.appendChild(r.domElement);return r};
const rA=mk($('back')),rB=mk($('front')),scene=new THREE.Scene(),cam=new THREE.OrthographicCamera(-1,1,1,-1,.1,60);
[[new THREE.HemisphereLight(0x8fa0c4,0x150609,.9)],[new THREE.DirectionalLight(0xdbe3ff,1.3),[-3,5,8]],[new THREE.PointLight(0xc8102e,3.2,22),[4,2,-3]],[new THREE.PointLight(0xc8102e,2,18),[-4,1,-2]]]
 .forEach(([l,p])=>{if(p)l.position.set(...p);l.layers.enable(1);scene.add(l)});
const mt=(c,r,m,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m,...o});
const pm=(c,r,m)=>new THREE.MeshPhysicalMaterial({color:c,roughness:r,metalness:m,clearcoat:.7,clearcoatRoughness:.35});
const suit=mt(0x1d1f25,.55,.35),glove=mt(0x14161a,.5,.2),plate=pm(0x2b2e36,.4,.6),metal=pm(0x4a4f5b,.3,.85),dark=mt(0x0b0c0f,.8,.2),
 cloth=mt(0x101216,.92,.05,{side:THREE.DoubleSide}),headM=mt(0xffffff,.55,.12,{vertexColors:true}),eyeM=new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide});
const V=(x,y,z)=>new THREE.Vector3(x,y,z),V2=(x,y)=>new THREE.Vector2(x,y),UP=V(0,1,0);
const P=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);return o};
const E=(rx,ry,rz,m,x=0,y=0,z=0)=>{const o=P(new THREE.SphereGeometry(1,32,22),m,x,y,z);o.scale.set(rx,ry,rz);return o};   // elipsoide
const lat=(pts,m,sx=1,sz=1)=>{const sp=new THREE.SplineCurve(pts.map(p=>V2(p[0],p[1]))).getPoints(48);
 const o=new THREE.Mesh(new THREE.LatheGeometry([V2(0,pts[0][1]),...sp,V2(0,pts[pts.length-1][1])],44),m);o.scale.set(sx,1,sz);return o};  // sólido de revolução suave
const limb=(a,b,rs,m)=>{const d=b.clone().sub(a),L=d.length(),o=lat(rs.map((r,i)=>[r,i/(rs.length-1)*L]),m);
 o.position.copy(a);o.quaternion.setFromUnitVectors(UP,d.normalize());return o};
function RB(w,h,d,m,b=.03){const x=(w-2*b)/2,y=(h-2*b)/2,r=Math.min(.06,x,y),s=new THREE.Shape();
 s.moveTo(-x+r,-y);s.lineTo(x-r,-y);s.quadraticCurveTo(x,-y,x,-y+r);s.lineTo(x,y-r);s.quadraticCurveTo(x,y,x-r,y);s.lineTo(-x+r,y);s.quadraticCurveTo(-x,y,-x,y-r);s.lineTo(-x,-y+r);s.quadraticCurveTo(-x,-y,-x+r,-y);
 const g=new THREE.ExtrudeGeometry(s,{depth:Math.max(.01,d-2*b),bevelEnabled:true,bevelSize:b,bevelThickness:b,bevelSegments:4,curveSegments:8});g.center();return new THREE.Mesh(g,m)}

const hero=new THREE.Group();scene.add(hero);const add=(...o)=>o.forEach(x=>hero.add(x));
// Pernas: coxa e canela com músculo, joelheira, caneleira e bota arredondada
[-1,1].forEach(s=>{const hip=V(.25*s,2.0,0),kn=V(.27*s,1.08,.08),ak=V(.28*s,.3,0);
 add(limb(hip,kn,[.2,.23,.2,.17],suit),limb(kn,ak,[.17,.18,.15,.12],suit),
  E(.17,.14,.1,metal,.27*s,1.08,.16),E(.15,.3,.07,plate,.27*s,1.55,.17),E(.13,.3,.07,plate,.28*s,.7,.12),
  E(.2,.17,.37,plate,.28*s,.17,.1),E(.22,.05,.4,dark,.28*s,.04,.1))});
// Quadril e cinto
add(lat([[.4,1.75],[.47,1.95],[.43,2.15]],suit,1.15,.62));
const belt=new THREE.Group();belt.add(P(new THREE.TorusGeometry(.47,.08,16,48),metal));belt.children[0].rotation.x=Math.PI/2;belt.scale.set(1.2,1,.64);belt.position.y=2.1;add(belt);
[-.55,-.36,.36,.55].forEach(x=>{const p=RB(.15,.2,.13,plate,.04);p.position.set(x,2.08,.3);add(p)});
add(E(.09,.07,.04,mt(0x8a8f99,.25,.95),0,2.1,.34));
// Tronco em V (sólido de revolução achatado)
add(lat([[.4,2.0],[.46,2.3],[.56,2.65],[.69,3.0],[.76,3.22],[.5,3.42]],suit,1.2,.62));
[-1,1].forEach(s=>{const p=E(.3,.24,.12,plate,.3*s,2.98,.36);p.rotation.z=-.12*s;add(p)});
[0,1,2].forEach(i=>add(E(.28-i*.02,.075,.11,plate,0,2.55-i*.15,.33)));
const pts=[[0,.1],[.06,.15],[.1,.1],[.3,.15],[.4,.04],[.28,0],[.2,-.09],[.12,-.02],[.06,-.13],[0,-.07]],bs=new THREE.Shape();
pts.forEach((p,i)=>i?bs.lineTo(p[0],p[1]):bs.moveTo(p[0],p[1]));pts.slice(0,-1).reverse().forEach(p=>bs.lineTo(-p[0],p[1]));
const em=P(new THREE.ExtrudeGeometry(bs,{depth:.02,bevelEnabled:true,bevelSize:.012,bevelThickness:.012,bevelSegments:2}),metal,0,2.9,.45);em.scale.set(1.3,1.3,1);add(em);
// Trapézios e ombreiras em camadas arredondadas
add(E(.62,.17,.3,suit,0,3.32,-.03));
[-1,1].forEach(s=>{const a=E(.36,.26,.34,plate,.92*s,3.22,0);a.rotation.z=-.35*s;
 const b=E(.38,.1,.36,metal,1.0*s,3.0,0);b.rotation.z=-.45*s;const c=E(.36,.09,.34,plate,1.04*s,2.86,0);c.rotation.z=-.5*s;add(a,b,c)});
// Pescoço
add(limb(V(0,3.2,0),V(0,3.62,0),[.21,.19,.17],suit));
// Cabeça: esfera deformada (testa, nariz, maxilar) com cor de pele no queixo
const head=new THREE.Group();head.position.set(0,3.72,0);hero.add(head);
{const g=new THREE.SphereGeometry(.34,56,40),p=g.attributes.position,col=[],sk=new THREE.Color(0xcaa58f),dk=new THREE.Color(0x24262d),ss=THREE.MathUtils.smoothstep;
 for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i)*1.12,z=p.getZ(i);
  const low=ss(-y,.0,.22),fr=z>0?1:0;
  x*=1-.3*low;z=z*(1-.08*low)+.035*low*fr;
  z+=.035*Math.exp(-Math.pow((y-.07)/.05,2))*fr;                                  // arcada
  z+=.045*Math.exp(-(x*x)/.0025-Math.pow((y+.02)/.1,2))*(z>.15?1:0);              // nariz
  p.setXYZ(i,x,y,z);
  const w=ss(-y,.11,.15)*ss(z,.04,.12)*(1-ss(Math.abs(x),.14,.19)),c=dk.clone().lerp(sk,w);col.push(c.r,c.g,c.b)}
 g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.computeVertexNormals();head.add(new THREE.Mesh(g,headM))}
[-1,1].forEach(s=>{
 const ey=new THREE.Shape();[[-.075,.02],[.075,-.002],[.07,-.026],[-.07,-.008]].forEach((q,i)=>i?ey.lineTo(q[0]*s,q[1]):ey.moveTo(q[0]*s,q[1]));
 const e=P(new THREE.ShapeGeometry(ey),eyeM,.125*s,.03,.338);e.rotation.y=.36*s;head.add(e);          // olhos brancos
 const br=E(.13,.03,.07,suit,.14*s,.105,.3);br.rotation.z=.3*s;br.rotation.y=.3*s;head.add(br);       // sobrancelha franzida
 const es=new THREE.Shape();es.moveTo(-.11*s,0);es.quadraticCurveTo(-.1*s,.34,.015*s,.62);es.quadraticCurveTo(.1*s,.3,.11*s,0);es.lineTo(-.11*s,0);
 const eg=new THREE.ExtrudeGeometry(es,{depth:.05,bevelEnabled:true,bevelSize:.014,bevelThickness:.014,bevelSegments:3});eg.translate(0,0,-.025);
 const ear=P(eg,suit,.19*s,.3,-.05);ear.rotation.z=-.14*s;ear.rotation.x=-.1;head.add(ear)});          // orelhas
// Capa: forma de trapézio com dobras
const cg=new THREE.PlaneGeometry(2.8,3.5,30,36);cg.translate(0,-1.75,0);const cb=cg.attributes.position.array.slice();add(P(cg,cloth,0,3.3,-.32));
add(E(.6,.2,.3,cloth,0,3.42,-.2));

// Braços: recalculados para as mãos ficarem nas bordas do boletim
const armG=new THREE.Group();hero.add(armG);
function buildArms(hx,hy){armG.clear();
 [-1,1].forEach(s=>{
  const S=V(.95*s,3.1,0),Wp=V(s*(hx+.1),hy,.15),El=V(s*(hx+.32),(3.1+hy)/2+.1,.25);
  armG.add(limb(S,El,[.17,.16,.15,.14],suit),E(.15,.15,.15,suit,El.x,El.y,El.z),
   limb(El,Wp,[.14,.17,.2,.19,.15,.11],plate),E(.125,.16,.09,glove,Wp.x,Wp.y,Wp.z));
  for(let i=0;i<4;i++){const f=P(new THREE.CapsuleGeometry(.042,.2,6,12),glove,s*hx-s*.08,hy-.1+i*.07,.2);f.rotation.z=Math.PI/2;f.layers.set(1);armG.add(f)}})}   // dedos por cima da borda

const mouse={x:0,y:0};addEventListener('pointermove',e=>{mouse.x=e.clientX/innerWidth*2-1;mouse.y=e.clientY/innerHeight*2-1});
const card=$('card');
function layout(){
 const Wd=innerWidth,Ht=innerHeight,cw=560,ch=card.offsetHeight,topo=Math.max(150,Math.min(Ht*.27,270));
 const sc=Math.min(1,(Wd-24)/cw,(Ht-topo-16)/ch),T=topo+Math.max(0,(Ht-topo-16-ch*sc)/2),L=(Wd-cw*sc)/2;
 card.style.transform=`translate(${L}px,${T}px) scale(${sc})`;
 const u=(T-14)/1.25,hx=(cw*sc/2)/u,hy=3.3-(.3*ch*sc-12)/u,yc=3.3-(Ht/2-T-12)/u;   // u = pixels por unidade 3D
 cam.left=-Wd/2/u;cam.right=Wd/2/u;cam.top=Ht/2/u;cam.bottom=-Ht/2/u;cam.position.set(0,yc,20);cam.updateProjectionMatrix();
 [rA,rB].forEach(r=>r.setSize(Wd,Ht));buildArms(hx,hy)}
addEventListener('resize',layout);addEventListener('load',layout);new ResizeObserver(layout).observe(card);layout();

const clk=new THREE.Clock();
(function loop(){const t=clk.getElapsedTime(),a=reduz?0:1;
 head.rotation.y=mouse.x*.45;head.rotation.x=mouse.y*.2+Math.sin(t*1.3)*.02*a;
 const p=cg.attributes.position;
 for(let i=0;i<p.count;i++){const x=cb[i*3],y=cb[i*3+1],k=-y/3.5;
  p.setX(i,x*(.62+k*.9));p.setZ(i,Math.sin(x*4+y*1.5+t*1.6)*.07*k*a+Math.sin(x*7)*.05*k-k*k*.45)}
 p.needsUpdate=true;cg.computeVertexNormals();
 cam.layers.set(0);rA.render(scene,cam);cam.layers.set(1);rB.render(scene,cam);
 requestAnimationFrame(loop)})();