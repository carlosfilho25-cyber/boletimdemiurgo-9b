document.addEventListener("DOMContentLoaded", () => {
    const inputsNotas = document.querySelectorAll(".nota");
    const linhasTabela = document.querySelectorAll("#tabela-notas tbody tr");

    function calcularBoletim() {
        let somaMedias = 0;
        let materiasValidas = 0;

        linhasTabela.forEach((linha) => {
            const notasDaMateria = linha.querySelectorAll(".nota");
            let somaNotas = 0;
            let notasContadas = 0;

            notasDaMateria.forEach((input) => {
                const valor = parseFloat(input.value);
                // Verifica se é um número válido
                if (!isNaN(valor)) {
                    somaNotas += valor;
                    notasContadas++;
                }
            });

            let mediaMateria = 0;
            if (notasContadas > 0) {
                mediaMateria = somaNotas / notasContadas;
                somaMedias += mediaMateria;
                materiasValidas++;
            }

            const celulaMedia = linha.querySelector(".media-materia");
            const celulaSituacao = linha.querySelector(".situacao");
            
            celulaMedia.textContent = mediaMateria.toFixed(1);

            // Define a situação (Aprovado >= 6, Atenção < 6)
            celulaSituacao.className = "situacao";
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

        const mediaGeralElemento = document.getElementById("media-geral");
        const statusFinalElemento = document.getElementById("status-final");
        const statusMediaElemento = document.getElementById("status-media");

        if (materiasValidas > 0) {
            const mediaGeral = somaMedias / materiasValidas;
            mediaGeralElemento.textContent = mediaGeral.toFixed(1);

            if (mediaGeral >= 6.0) {
                statusFinalElemento.textContent = "APROVADO";
                statusFinalElemento.style.color = "#00ff88"; 
                statusFinalElemento.style.textShadow = "0 0 10px #00ff88";
                statusMediaElemento.textContent = "ACIMA DA MÉDIA";
            } else {
                statusFinalElemento.textContent = "RECUPERAÇÃO";
                statusFinalElemento.style.color = "#ff0055"; 
                statusFinalElemento.style.textShadow = "0 0 10px #ff0055";
                statusMediaElemento.textContent = "ABAIXO DA MÉDIA";
            }
        } else {
            mediaGeralElemento.textContent = "0.0";
            statusFinalElemento.textContent = "PENDENTE";
            statusFinalElemento.style.color = "#ff00ff";
            statusMediaElemento.textContent = "CALCULANDO...";
        }
    }

    // Roda o cálculo sempre que o usuário digitar
    inputsNotas.forEach((input) => {
        input.addEventListener("input", calcularBoletim);
    });

    // Roda o cálculo uma vez ao abrir a página
    calcularBoletim();
});