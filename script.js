const container = document.getElementById('canvas-container');

// Cena Dark (Cinza Escuro e Preto)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050507);
scene.fog = new THREE.FogExp2(0x050507, 0.02);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Iluminação da Cena
const ambientLight = new THREE.AmbientLight(0x444444, 1.5);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0xffffff, 2.5);
moonLight.position.set(10, 15, 10);
scene.add(moonLight);

// --- LUA PRATA ILUMINADA ---
const moonGeo = new THREE.SphereGeometry(4, 32, 32);
const moonMat = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
const moon = new THREE.Mesh(moonGeo, moonMat);
moon.position.set(8, 6, -12);
scene.add(moon);

// --- ANIMAÇÃO DE CHUVA FORTE ---
const rainCount = 1800;
const rainGeo = new THREE.BufferGeometry();
const rainPositions = new Float32Array(rainCount * 3);

for(let i = 0; i < rainCount * 3; i += 3) {
    rainPositions[i] = (Math.random() - 0.5) * 30;
    rainPositions[i+1] = Math.random() * 20 - 5;
    rainPositions[i+2] = (Math.random() - 0.5) * 15;
}

rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));

const rainMat = new THREE.PointsMaterial({
    color: 0xbbbbbb,
    size: 0.05,
    transparent: true,
    opacity: 0.7
});

const rain = new THREE.Points(rainGeo, rainMat);
scene.add(rain);

// Loop de Animação
function animate() {
    requestAnimationFrame(animate);

    // Movimento da chuva a cair
    const positions = rainGeo.attributes.position.array;
    for(let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.55;
        if(positions[i] < -5) {
            positions[i] = 15;
        }
    }
    rainGeo.attributes.position.needsUpdate = true;

    // Relâmpagos ocasionais
    if(Math.random() < 0.005) {
        moonLight.intensity = 6.0;
        setTimeout(() => { moonLight.intensity = 2.5; }, 70);
    }

    renderer.render(scene, camera);
}

animate();

// Redimensionamento de Janela
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Cálculo dinâmico das notas
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