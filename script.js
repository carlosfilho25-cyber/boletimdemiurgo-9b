/* ===== Boletim ===== */
const DISC = ['Português','Matemática','História','Geografia','Ciências','Inglês','Educação Física','Artes'];
const KEY = 'boletim-escolar-v1';

let D;
try { D = JSON.parse(localStorage.getItem(KEY)); } catch(e) {}
D = D || { freq: 95, notas: {} };
if (typeof D.freq !== 'number') D.freq = 95;
if (!D.notas || typeof D.notas !== 'object') D.notas = {};

const $ = id => document.getElementById(id);
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch(e) {} };
const fmt = n => n.toFixed(1).replace('.', ',');
const cls = m => m >= 7 ? ['Aprovado','bom'] : m >= 5 ? ['Recuperação','rec'] : ['Reprovado','ruim'];

/* Monta linhas da tabela */
DISC.forEach((d, i) => {
  const tr = document.createElement('tr');
  tr.innerHTML =
    `<td>${d}</td>` +
    [0,1,2,3].map(b =>
      `<td><input class="nota" type="number" min="0" max="10" step="0.1"
         data-d="${i}" data-b="${b}" aria-label="${d}, ${b+1}º bimestre"></td>`
    ).join('') +
    `<td class="m" id="m${i}">—</td><td id="s${i}">—</td>`;
  $('corpo').appendChild(tr);
});

/* Inputs de nota */
document.querySelectorAll('.nota').forEach(el => {
  const di = +el.dataset.d;
  const bi = +el.dataset.b;
  const v = (D.notas[di] || [])[bi];
  if (v != null) el.value = v;

  el.addEventListener('input', () => {
    const arr = D.notas[di] = D.notas[di] || [];
    if (el.value === '') {
      arr[bi] = null;
    } else {
      const n = +el.value;
      arr[bi] = Number.isFinite(n) ? Math.min(10, Math.max(0, n)) : null;
    }
    save();
    calc();
  });
});

/* Frequência */
$('freq').value = D.freq;
$('freq').addEventListener('input', e => {
  const n = +e.target.value;
  D.freq = Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
  save();
  calc();
});

/* Cálculo de médias */
function calc() {
  const ms = [];

  DISC.forEach((_, i) => {
    const ns = (D.notas[i] || []).filter(n => typeof n === 'number');
    const m = ns.length ? ns.reduce((a,b) => a+b, 0) / ns.length : null;
    const st = $('s' + i);

    if (m === null) {
      $('m' + i).textContent = '—';
      st.textContent = '—';
      st.className = '';
      return;
    }

    const [t, c] = cls(m);
    $('m' + i).textContent = fmt(m);
    st.textContent = t;
    st.className = c;
    ms.push(m);
  });

  const sg = $('sg');
  if (ms.length) {
    const mg = ms.reduce((a,b) => a+b, 0) / ms.length;
    let [t, c] = cls(mg);
    if (t === 'Aprovado' && ms.some(m => m < 5)) [t, c] = ['Recuperação','rec'];
    $('mg').textContent = fmt(mg);
    sg.textContent = t;
    sg.className = c;
  } else {
    $('mg').textContent = '—';
    sg.textContent = '—';
    sg.className = '';
  }

  const f = D.freq;
  $('sf').textContent = f >= 75 ? 'Frequência regular' : 'Abaixo do mínimo (75%)';
  $('sf').style.color = f >= 75 ? 'var(--ok)' : 'var(--ruim)';
}
calc();

/* ===== Fundo: lua e chuva ===== */
const bg = $('bg');
const cx = bg.getContext('2d');
const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;

let W = 0, H = 0, rain = [];

function fit() {
  W = bg.width = innerWidth;
  H = bg.height = innerHeight;
  rain = Array.from({ length: Math.min(260, W / 5 | 0) }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    l: 10 + Math.random() * 16,
    v: 12 + Math.random() * 10
  }));
}
addEventListener('resize', fit);
fit();

(function sky() {
  const g = cx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#0a0d14');
  g.addColorStop(1, '#030406');
  cx.fillStyle = g;
  cx.fillRect(0, 0, W, H);

  const mx = W * 0.82, my = H * 0.16, r = Math.min(W, H) * 0.07;
  const h = cx.createRadialGradient(mx, my, r * 0.8, mx, my, r * 5);
  h.addColorStop(0, 'rgba(190,205,230,.25)');
  h.addColorStop(1, 'rgba(190,205,230,0)');
  cx.fillStyle = h;
  cx.fillRect(0, 0, W, H);

  cx.fillStyle = '#c9d2e4';
  cx.beginPath();
  cx.arc(mx, my, r, 0, Math.PI * 2);
  cx.fill();

  cx.strokeStyle = 'rgba(170,190,225,.3)';
  cx.beginPath();
  rain.forEach(d => {
    cx.moveTo(d.x, d.y);
    cx.lineTo(d.x - d.l * 0.25, d.y + d.l);
    if (!reduz) {
      d.y += d.v;
      d.x -= d.v * 0.25;
      if (d.y > H) { d.y = -20; d.x = Math.random() * W + 40; }
    }
  });
  cx.stroke();

  if (!reduz) requestAnimationFrame(sky);
})();