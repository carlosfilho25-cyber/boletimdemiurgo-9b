// Aguarda o HTML carregar completamente
document.addEventListener("DOMContentLoaded", () => {
    
    // Seleciona todos os inputs de notas e a tabela
    const inputsNotas = document.querySelectorAll(".nota");
    const linhasTabela = document.querySelectorAll("#tabela-notas tbody tr");

    // Função principal que calcula tudo
    function calcularBoletim() {
        let somaMedias = 0;
        let materiasValidas = 0;

        linhasTabela.forEach((linha) => {
            const notasDaMateria = linha.querySelectorAll(".nota");
            let somaNotas = 0;
            let notasContadas = 0;

            // Lê as duas notas da linha
            notasDaMateria.forEach((input) => {
                const valor = parseFloat(input.value);
                if (!isNaN(valor)) {
                    somaNotas += valor;
                    notasContadas++;
                }
            });

            // Calcula a média da matéria (se houver notas)
            let mediaMateria = 0;
            if (notasContadas > 0) {
                mediaMateria = somaNotas / notasContadas;
                somaMedias += mediaMateria;
                materiasValidas++;
            }

            // Atualiza a célula da média da matéria
            const celulaMedia = linha.querySelector(".media-materia");
            const celulaSituacao = linha.querySelector(".situacao");
            
            celulaMedia.textContent = mediaMateria.toFixed(1);

            // Define a situação (Aprovado >= 6, Atenção < 6)
            celulaSituacao.className = "situacao"; // Limpa classes anteriores
            if (notasContadas === 0) {
                celulaSituacao.textContent = "--";
                celulaSituacao.classList.add("situacao-sem-nota");
            } else if (mediaMateria >= 6.0) {
                celulaSituacao.textContent = "Aprovado";
                celulaSituacao.classList.add("situacao-bom");
            } else {
                celulaSituacao.textContent = "Atenção";
                celulaSituacao.classList.add("situacao-atencao");
            }
        });

        // Calcula a Média Geral (Média das médias)
        const mediaGeralElemento = document.getElementById("media-geral");
        const statusFinalElemento = document.getElementById("status-final");

        if (materiasValidas > 0) {
            const mediaGeral = somaMedias / materiasValidas;
            mediaGeralElemento.textContent = mediaGeral.toFixed(1);

            // Define o status final
            if (mediaGeral >= 6.0) {
                statusFinalElemento.textContent = "APROVADO";
                statusFinalElemento.style.color = "#00ff88"; // Verde neon
                statusFinalElemento.style.textShadow = "0 0 10px #00ff88";
            } else {
                statusFinalElemento.textContent = "RECUPERAÇÃO";
                statusFinalElemento.style.color = "#ff0055"; // Vermelho neon
                statusFinalElemento.style.textShadow = "0 0 10px #ff0055";
            }
        } else {
            mediaGeralElemento.textContent = "0.0";
            statusFinalElemento.textContent = "PENDENTE";
            statusFinalElemento.style.color = "#ff00ff";
        }
    }

    // Adiciona um evento de "escuta" em cada input. 
    // Sempre que o usuário digitar ou mudar o valor, a função roda.
    inputsNotas.forEach((input) => {
        input.addEventListener("input", calcularBoletim);
    });

    // Roda o cálculo uma vez ao abrir a página, caso já existam valores pré-definidos
    calcularBoletim();
});