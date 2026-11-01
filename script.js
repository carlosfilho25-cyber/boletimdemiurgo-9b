const container = document.getElementById('canvas-container');

// Cena, Câmera e Renderizador (Fundo Cinza Escuro e Preto)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0c); // Fundo cinza escuro/preto puro
scene.fog = new THREE.FogExp2(0x0a0a0c, 0.02);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Luzes Cinza/Prata (Sem roxo)
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0xffffff, 2.0);
moonLight.position.set(10, 20, 10);
scene.add(moonLight);

const frontLight = new THREE.DirectionalLight(0xaaaaaa, 1.0);
frontLight.position.set(-5, 5, 5);
scene.add(frontLight);

// --- LUA PRATA ILUMINADA ---
const moonGeo = new THREE.SphereGeometry(6, 32, 32);
const moonMat = new THREE.MeshBasicMaterial({ color: 0xe5e7eb });
const moon = new THREE.Mesh(moonGeo, moonMat);
moon.position.set(12, 8, -20);
scene.add(moon);

// --- MODELO 3D DO BATMAN (PRETO E CINZA TÁTICO) ---
const batmanGroup = new THREE.Group();

const blackArmorMat = new THREE.MeshStandardMaterial({
    color: 0x111113,
    roughness: 0.3,
    metalness: 0.8
});

const darkGreyMat = new THREE.MeshStandardMaterial({
    color: 0x222226,
    roughness: 0.5,
    metalness: 0.5
});

const silverMat = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.9,
    roughness: 0.2
});

// Cabeça / Máscara
const headGeo = new THREE.BoxGeometry(0.7, 0.8, 0.7);
const head = new THREE.Mesh(headGeo, blackArmorMat);
head.position.set(0, 2.1, 0);
batmanGroup.add(head);

// Orelhas
const earGeo = new THREE.ConeGeometry(0.12, 0.6, 4);
const leftEar = new THREE.Mesh(earGeo, blackArmorMat);
leftEar.position.set(0.25, 2.7, 0);
leftEar.rotation.z = -0.1;
batmanGroup.add(leftEar);

const rightEar = leftEar.clone();
rightEar.position.set(-0.25, 2.7, 0);
rightEar.rotation.z = 0.1;
batmanGroup.add(rightEar);

// Peito / Torso
const torsoGeo = new THREE.BoxGeometry(1.4, 1.8, 0.8);
const torso = new THREE.Mesh(torsoGeo, darkGreyMat);
torso.position.set(0, 0.8, 0);
batmanGroup.add(torso);

// Emblema no Peito (Cinza Prata)
const emblemGeo = new THREE.BoxGeometry(0.6, 0.25, 0.1);
const emblem = new THREE.Mesh(emblemGeo, silverMat);
emblem.position.set(0, 1.1, 0.42);
batmanGroup.add(emblem);

// Capa Preta
const capeGeo = new THREE.PlaneGeometry(3.0, 4.0);
const capeMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 1.0, side: THREE.DoubleSide });
const cape = new THREE.Mesh(capeGeo, capeMat);
cape.position.set(0, 0.6, -0.45);
batmanGroup.add(cape);

// Braços
const armGeo = new THREE.BoxGeometry(0.45, 1.4, 0.45);
const leftArm = new THREE.Mesh(armGeo, blackArmorMat);
leftArm.position.set(0.95, 0.8, 0.2);
leftArm.rotation.z = -0.2;
batmanGroup.add(leftArm);

const rightArm = new THREE.Mesh(armGeo, blackArmorMat);
rightArm.position.set(-0.95, 0.8, 0);
rightArm.rotation.z = 0.2;
batmanGroup.add(rightArm);

// Posicionamento do Batman (À direita na tela, bem visível)
batmanGroup.position.set(2.5, -1.2, 0);
batmanGroup.scale.set(1.3, 1.3, 1.3);
scene.add(batmanGroup);

// --- ANIMAÇÃO DE CHUVA FORTE ---
const rainCount = 1500;
const rainGeo = new THREE.BufferGeometry();
const rainPositions = new Float32Array(rainCount * 3);

for(let i = 0; i < rainCount * 3; i += 3) {
    rainPositions[i] = (Math.random() - 0.5) * 30;
    rainPositions[i+1] = Math.random() * 20 - 5;
    rainPositions[i+2] = (Math.random() - 0.5) * 20;
}

rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));

const rainMat = new THREE.PointsMaterial({
    color: 0xcccccc,
    size: 0.05,
    transparent: true,
    opacity: 0.7
});

const rain = new THREE.Points(rainGeo, rainMat);
scene.add(rain);

// Loop de Animação
let clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    let elapsedTime = clock.getElapsedTime();

    // Chuva caindo
    const positions = rainGeo.attributes.position.array;
    for(let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.5;
        if(positions[i] < -5) {
            positions[i] = 15;
        }
    }
    rainGeo.attributes.position.needsUpdate = true;

    // Animação do Batman (Movimento suave de respiração)
    batmanGroup.position.y = -1.2 + Math.sin(elapsedTime * 1.5) * 0.03;
    cape.rotation.z = Math.sin(elapsedTime * 3) * 0.02;

    renderer.render(scene, camera);
}

animate();

// Ajuste ao redimensionar
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Cálculo dinâmico de notas
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