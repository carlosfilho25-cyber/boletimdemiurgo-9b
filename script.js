(()=>{
const box=document.getElementById('batman3d');
const scene=new THREE.Scene();
const cam=new THREE.PerspectiveCamera(32,1,.1,100);
cam.position.set(0,2.05,9.5);cam.lookAt(0,2.05,0);
const ren=new THREE.WebGLRenderer({alpha:true,antialias:true});
ren.setPixelRatio(Math.min(devicePixelRatio,2));
box.appendChild(ren.domElement);

scene.add(new THREE.HemisphereLight(0x8899bb,0x120508,.75));
const key=new THREE.DirectionalLight(0xcfd8ff,1.1);key.position.set(-3,5,4);scene.add(key);
const rim=new THREE.PointLight(0xc8102e,2.4,16);rim.position.set(3,2,-3);scene.add(rim);
const rim2=new THREE.PointLight(0xc8102e,1.2,12);rim2.position.set(-3,1,-2);scene.add(rim2);

const mat=(c,r,m,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m,...o});
const suit=mat(0x1b1d22,.45,.55), plate=mat(0x2c2f37,.35,.7), metal=mat(0x3b3f48,.3,.8),
      cloth=mat(0x0d0e11,.9,.05,{side:THREE.DoubleSide}), skin=mat(0xc9a58f,.7,0),
      eye=new THREE.MeshBasicMaterial({color:0xffffff});
const M=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);return o};
const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
const C=(a,b,h,s=14)=>new THREE.CylinderGeometry(a,b,h,s);

const hero=new THREE.Group();scene.add(hero);

// Pernas e botas
[-1,1].forEach(s=>{
  hero.add(M(C(.2,.16,1,12),suit,.27*s,1.4));
  hero.add(M(B(.3,.14,.12),plate,.27*s,1.0,.17));          // joelheira
  hero.add(M(C(.16,.14,.9,12),suit,.27*s,.55));
  hero.add(M(B(.34,.3,.55),plate,.27*s,.15,.1));            // bota
});
// Cinto e bolsos
hero.add(M(B(1.05,.2,.52),metal,0,1.95));
[-.38,-.2,.2,.38].forEach(x=>hero.add(M(B(.14,.18,.1),plate,x,1.93,.3)));
hero.add(M(B(.14,.14,.06),mat(0x6b6f78,.3,.9),0,1.95,.28));
// Tronco: afunila do ombro à cintura
const torso=M(C(.62,.44,1.25,8),suit,0,2.6);torso.scale.z=.62;hero.add(torso);
[0,1,2].forEach(i=>hero.add(M(B(.6-i*.05,.13,.1),plate,0,2.22+i*.17,.3)));   // placas do abdômen
[-1,1].forEach(s=>{const p=M(B(.45,.42,.12),plate,.27*s,2.98,.32);p.rotation.z=-.18*s;hero.add(p)});
// Símbolo do morcego
const pts=[[0,.1],[.06,.14],[.1,.1],[.3,.14],[.38,.04],[.28,0],[.2,-.08],[.12,-.02],[.06,-.12],[0,-.06]];
const sh=new THREE.Shape();
pts.forEach((p,i)=>i?sh.lineTo(p[0],p[1]):sh.moveTo(p[0],p[1]));
pts.slice(0,-1).reverse().forEach(p=>sh.lineTo(-p[0],p[1]));
const em=M(new THREE.ExtrudeGeometry(sh,{depth:.04,bevelEnabled:false}),metal,0,2.95,.4);hero.add(em);
// Ombros e braços
[-1,1].forEach(s=>{
  const sp=M(new THREE.SphereGeometry(.3,16,12),plate,.82*s,3.18);sp.scale.set(1,.8,1);hero.add(sp);
  const ua=M(C(.15,.13,.85,12),suit,.9*s,2.7);ua.rotation.z=.06*s;hero.add(ua);
  hero.add(M(C(.14,.17,.8,12),plate,.95*s,1.95));
  [0,1,2].forEach(i=>hero.add(M(B(.03,.55-i*.08,.2),metal,1.12*s,1.95,-.12+i*.12)));   // lâminas da manopla
  hero.add(M(new THREE.SphereGeometry(.15,12,10),suit,.95*s,1.45));
});
// Pescoço e capuz
hero.add(M(C(.17,.2,.2,12),suit,0,3.38));
const head=new THREE.Group();head.position.set(0,3.6,0);hero.add(head);
const cowl=M(new THREE.SphereGeometry(.33,24,18),suit);cowl.scale.set(1,1.1,1.05);head.add(cowl);
head.add(M(B(.34,.17,.2),skin,0,-.2,.18));                                  // queixo à mostra
[-1,1].forEach(s=>{
  head.add(M(B(.14,.035,.05),eye,.12*s,.0,.3));                              // olhos
  const br=M(B(.2,.04,.08),suit,.12*s,.06,.3);br.rotation.z=.22*s;head.add(br);
  const ear=M(new THREE.ConeGeometry(.1,.48,4),suit,.18*s,.42,-.02);ear.rotation.z=-.12*s;head.add(ear);
});
// Capa ondulada
const cg=new THREE.PlaneGeometry(2.1,2.7,18,22);cg.translate(0,-1.35,0);
const base=cg.attributes.position.array.slice();
const cape=M(cg,cloth,0,3.3,-.4);hero.add(cape);

// Arrastar para girar
let rotY=0,vel=0,drag=false,lx=0,idle=0;
box.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;box.setPointerCapture(e.pointerId)});
box.addEventListener('pointermove',e=>{if(drag){vel=(e.clientX-lx)*.01;rotY+=vel;lx=e.clientX}});
['pointerup','pointercancel'].forEach(t=>box.addEventListener(t,()=>drag=false));

function ajustar(){const w=box.clientWidth,h=box.clientHeight;ren.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}
addEventListener('resize',ajustar);ajustar();
const reduz=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clock=new THREE.Clock();
(function loop(){
  const t=clock.getElapsedTime();
  if(!drag){rotY+=(0-rotY)*.02;idle=reduz?0:Math.sin(t*.5)*.22}   // volta suavemente de frente
  hero.rotation.y=rotY+idle;
  hero.position.y=reduz?0:Math.sin(t*1.2)*.03;
  if(!reduz){
    const p=cg.attributes.position;
    for(let i=0;i<p.count;i++){
      const x=base[i*3],y=base[i*3+1],k=-y/2.7;                         // 0 no ombro, 1 na barra
      p.setX(i,x*(1+k*.45));
      p.setZ(i,Math.sin(y*3+t*2+x)*.07*k-k*k*.35);
    }
    p.needsUpdate=true;cg.computeVertexNormals();
  }
  ren.render(scene,cam);requestAnimationFrame(loop);
})();
})();