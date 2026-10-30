// =========================================
// DADOS FICTÍCIOS PADRONIZADOS - 9º ANO
// =========================================
// Isso é um ARRAY (lista) de OBJETOS (caixinhas com informações).
// Cada objeto representa uma disciplina.
const dadosDisciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

// =========================================
// FUNÇÃO: normalizarNota(valor)
// =========================================
// Uma FUNÇÃO é um bloco de código que faz uma tarefa e pode ser chamado várias vezes.
function normalizarNota(valor) {
  // Se for vazio, null ou undefined, retorna null (nota ainda não lançada)
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Converte para texto e troca vírgula por ponto (ex: "8,5" vira "8.5")
  let texto = String(valor).replace(",", ".");
  
  // Converte o texto para número decimal
  let numero = parseFloat(texto);

  // Se não for um número válido, retorna null
  if (isNaN(numero)) {
    return null;
  }

  // Valores entre 0 e 10 permanecem iguais
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Valores maiores que 10 e até 100 são divididos por 10
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Qualquer outro valor é inválido
  return null;
}

// =========================================
// FUNÇÃO: calcularMedia(notas)
// =========================================
// Recebe um array de notas já normalizadas e calcula a média só com as que existem.
function calcularMedia(notas) {
  // Filtra só as notas válidas (diferentes de null)
  const notasValidas = notas.filter(nota => nota !== null);

  // Se não há nenhuma nota válida, retorna null
  if (notasValidas.length === 0) {
    return null;
  }

  // Soma todas as notas válidas
  let soma = 0;
  // forEach percorre cada item do array. É como um "para cada".
  notasValidas.forEach(nota => {
    soma += nota;
  });

  // Retorna a média (soma dividida pela quantidade)
  return soma / notasValidas.length;
}

// =========================================
// FUNÇÃO: definirSituacao(media)
// =========================================
// Um IF (se) toma decisões. Aqui decidimos a situação da disciplina.
function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= 6.0) {
    return "Bom desempenho";
  }
  return "Atenção";
}

// =========================================
// FUNÇÃO: formatarNota(nota)
// =========================================
// Formata o número para exibir com uma casa decimal (ex: 7.5 vira "7.5")
function formatarNota(nota) {
  if (nota === null) {
    return "—";
  }
  return nota.toFixed(1).replace(".", ",");
}

// =========================================
// FUNÇÃO: somarFaltas(faltas)
// =========================================
function somarFaltas(faltas) {
  let total = 0;
  faltas.forEach(f => total += f);
  return total;
}

// =========================================
// FUNÇÃO: obterClasseSituacao(situacao)
// =========================================
// Retorna a classe CSS certa para colorir a situação
function obterClasseSituacao(situacao) {
  if (situacao === "Bom desempenho") return "situacao-bom";
  if (situacao === "Atenção") return "situacao-atencao";
  return "situacao-sem-nota";
}

// =========================================
// PREENCHIMENTO DA TABELA
// =========================================
// DOM é a representação do HTML no JavaScript. Podemos pegar elementos e alterar.
const corpoTabela = document.getElementById("corpo-tabela");

let somaMedias = 0;        // Para o card de média geral
let quantidadeMedias = 0;  // Quantas disciplinas têm média válida
let totalFaltas = 0;       // Para o card de total de faltas
let contBom = 0;           // Disciplinas com bom desempenho
let contAtencao = 0;       // Disciplinas com atenção

// forEach percorre cada disciplina do array
dadosDisciplinas.forEach(item => {
  // 1. Normaliza as notas dos três trimestres
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  // 2. Calcula a média só com as notas disponíveis
  const media = calcularMedia([n1, n2, n3]);

  // 3. Soma as faltas dos três trimestres
  const faltasTotal = somarFaltas(item.faltas);

  // 4. Define a situação
  const situacao = definirSituacao(media);

  // 5. Atualiza os contadores dos cards
  if (media !== null) {
    somaMedias += media;
    quantidadeMedias++;
  }
  totalFaltas += faltasTotal;

  if (situacao === "Bom desempenho") contBom++;
  if (situacao === "Atenção") contAtencao++;

  // 6. Cria uma nova linha na tabela
  const linha = document.createElement("tr");
  linha.innerHTML = `
    <td>${item.disciplina}</td>
    <td class="${n1 === null ? 'nota-ausente' : ''}">${formatarNota(n1)}</td>
    <td class="${n2 === null ? 'nota-ausente' : ''}">${formatarNota(n2)}</td>
    <td class="${n3 === null ? 'nota-ausente' : ''}">${formatarNota(n3)}</td>
    <td><strong>${formatarNota(media)}</strong></td>
    <td>${faltasTotal}</td>
    <td class="${obterClasseSituacao(situacao)}">${situacao}</td>
  `;

  // Adiciona a linha ao corpo da tabela
  corpoTabela.appendChild(linha);
});

// =========================================
// PREENCHIMENTO DOS CARDS DE RESUMO
// =========================================

// Card: Média Geral
const mediaGeral = quantidadeMedias > 0 ? somaMedias / quantidadeMedias : null;
document.getElementById("card-media-geral").textContent = formatarNota(mediaGeral);

// Card: Total de Faltas
document.getElementById("card-total-faltas").textContent = totalFaltas;

// Card: Disciplinas com bom desempenho
document.getElementById("card-bom-desempenho").textContent = contBom;

// Card: Disciplinas que precisam de atenção
document.getElementById("card-atencao").textContent = contAtencao;

// Card: Frequência
// IMPORTANTE: Este percentual é APENAS DEMONSTRATIVO nesta primeira versão.
// Ele NÃO é calculado a partir das faltas. No futuro, será tratado de outra forma.
document.getElementById("card-frequencia").textContent = "92%";