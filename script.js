const container = document.getElementById('canvas-container');

// Cena, Câmara e Renderizador
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030508, 0.015);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 9);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Luzes do ambiente
const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0x93c5fd, 2.5);
moonLight.position.set(15, 25, 10);
scene.add(moonLight);

const blueRimLight = new THREE.PointLight(0x0284c7, 3, 20);
blueRimLight.position.set(-5, 3, 2);
scene.add(blueRimLight);

// --- LUA GIGANTE ILUMINADA NO CÉU ---
const moonGeo = new THREE.SphereGeometry(18, 32, 32);
const moonMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
const moon = new THREE.Mesh(moonGeo, moonMat);
moon.position.set(40, 30, -60);
scene.add(moon);

// --- CRIAÇÃO DO MODELO 3D DO BATMAN (ESTILO TACTICAL DARK) ---
const batmanGroup = new THREE.Group();

const armorMaterial = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.4,
    metalness: 0.8
});

const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.9,
    roughness: 0.2
});

// Cabeça / Cowl
const headGeo = new THREE.BoxGeometry(0.7, 0.8, 0.7);
const head = new THREE.Mesh(headGeo, armorMaterial);
head.position.set(0, 2.1, 0);
batmanGroup.add(head);

// Orelhas do Batman
const earGeo = new THREE.ConeGeometry(0.12, 0.5, 4);
const leftEar = new THREE.Mesh(earGeo, armorMaterial);
leftEar.position.set(0.25, 2.6, 0);
leftEar.rotation.z = -0.1;
batmanGroup.add(leftEar);

const rightEar = leftEar.clone();
rightEar.position.set(-0.25, 2.6, 0);
rightEar.rotation.z = 0.1;
batmanGroup.add(rightEar);

// Torso / Armadura Tática
const torsoGeo = new THREE.BoxGeometry(1.4, 1.8, 0.8);
const torso = new THREE.Mesh(torsoGeo, armorMaterial);
torso.position.set(0, 0.8, 0);
batmanGroup.add(torso);

// Emblema do Morcego no Peito
const emblemGeo = new THREE.BoxGeometry(0.5, 0.25, 0.1);
const emblem = new THREE.Mesh(emblemGeo, goldMaterial);
emblem.position.set(0, 1.1, 0.42);
batmanGroup.add(emblem);

// Capa escura
const capeGeo = new THREE.PlaneGeometry(2.6, 3.5);
const capeMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 1.0, side: THREE.DoubleSide });
const cape = new THREE.Mesh(capeGeo, capeMat);
cape.position.set(0, 0.8, -0.45);
batmanGroup.add(cape);

// Braço esquerdo segurando o boletim
const armGeo = new THREE.BoxGeometry(0.4, 1.4, 0.4);
const leftArm = new THREE.Mesh(armGeo, armorMaterial);
leftArm.position.set(0.9, 0.9, 0.2);
leftArm.rotation.z = -0.3;
leftArm.rotation.x = -0.3;
batmanGroup.add(leftArm);

// Braço direito
const rightArm = new THREE.Mesh(armGeo, armorMaterial);
rightArm.position.set(-0.9, 0.9, 0);
rightArm.rotation.z = 0.2;
batmanGroup.add(rightArm);

// O Boletim Escolar Holográfico Segurado na Mão
const boardGeo = new THREE.BoxGeometry(1.2, 1.6, 0.05);
const boardMat = new THREE.MeshStandardMaterial({ 
    color: 0x0f172a, 
    roughness: 0.2,
    emissive: 0x0284c7,
    emissiveIntensity: 0.15
});
const holdingBoard = new THREE.Mesh(boardGeo, boardMat);
holdingBoard.position.set(0.5, 0.3, 0.8);
holdingBoard.rotation.y = -0.3;
holdingBoard.rotation.z = -0.1;
batmanGroup.add(holdingBoard);

batmanGroup.position.set(2.2, -1.8, -1);
batmanGroup.scale.set(1.2, 1.2, 1.2);
scene.add(batmanGroup);

// --- SISTEMA DE CHUVA FORTE ANIMADA ---
const rainCount = 1200;
const rainGeo = new THREE.BufferGeometry();
const rainPositions = new Float32Array(rainCount * 3);

for(let i = 0; i < rainCount * 3; i += 3) {
    rainPositions[i] = (Math.random() - 0.5) * 25;     
    rainPositions[i+1] = Math.random() * 20 - 5;       
    rainPositions[i+2] = (Math.random() - 0.5) * 15;   
}

rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));

const rainMat = new THREE.PointsMaterial({
    color: 0x94a3b8,
    size: 0.06,
    transparent: true,
    opacity: 0.6
});

const rain = new THREE.Points(rainGeo, rainMat);
scene.add(rain);

// --- ANIMAÇÃO E LOOP DE RENDERIZAÇÃO ---
let clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    let elapsedTime = clock.getElapsedTime();

    const positions = rainGeo.attributes.position.array;
    for(let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.6; 
        if(positions[i] < -5) {
            positions[i] = 15;
        }
    }
    rainGeo.attributes.position.needsUpdate = true;

    batmanGroup.position.y = -1.8 + Math.sin(elapsedTime * 2) * 0.04;
    cape.rotation.z = Math.sin(elapsedTime * 4) * 0.03;

    if(Math.random() < 0.008) {
        moonLight.intensity = 6.0;
        setTimeout(() => { moonLight.intensity = 2.5; }, 80);
    }

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- INTERATIVIDADE DO BOLETIM (Cálculo dinâmico de notas) ---
const inputsNotas = document.querySelectorAll('.nota');
inputsNotas.forEach(input => {
    input.addEventListener('input', calcularMedias);
});

function calcularMedias() {
    let total = 0;
    const linhas = document.querySelectorAll('tbody tr');
    
    linhas.forEach(linha => {
        const inputs = linha.querySelectorAll('.nota');
        const n1 = parseFloat(inputs[0].value) || 0;
        const n2 = parseFloat(inputs[1].value) || 0;
        const mediaDisc = (n1 + n2) / 2;
        
        linha.querySelector('.media-disc').textContent = mediaDisc.toFixed(1);
        total += mediaDisc;
    });

    const mediaGeral = total / linhas.length;
    document.getElementById('media-geral').textContent = mediaGeral.toFixed(1);
}