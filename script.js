// Array para armazenar os eventos carregados
let eventos = [];

// Variável para armazenar a data base (que vai mudar com os botões)
let dataBase = new Date();

// Variável para armazenar a data atual (que não vai mudar)
let dataAtual = new Date();

// Função para formatar uma data no formato "Mes, Dia, Dia da Semana".
function formatarDataCompleta(dia) {
  const diasDaSemana = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const diaSemana = diasDaSemana[dia.getDay()].toUpperCase();
  const mes = meses[dia.getMonth()];
  const data = dia.getDate();

  // Criando os elementos HTML
  const div = document.createElement('div');
  div.classList.add('data-completa');

  const divMes = document.createElement('div');
  divMes.classList.add('mes');
  divMes.innerText = mes;
  div.appendChild(divMes);

  const divDia = document.createElement('div');
  divDia.classList.add('dia');
  divDia.innerText = data;
  div.appendChild(divDia);

  const divDiaSemana = document.createElement('div');
  divDiaSemana.classList.add('dia-semana');
  divDiaSemana.innerText = diaSemana;
  div.appendChild(divDiaSemana);

  return div;
}

// Função para formatar a hora no formato de 12 horas com AM/PM.
function formatarHora12(hora) {
  let hora12 = hora % 12;
  if (hora12 === 0) hora12 = 12; // Ajusta a hora 0 para 12 (meia-noite)
  const periodo = hora < 12 ? "AM" : "PM"; // Determina AM ou PM

  return `${hora12} ${periodo}`;
}

// Função para carregar os eventos do arquivo JSON
async function carregarEventos() {
  const resposta = await fetch("eventos.json"); // Supondo que o arquivo eventos.json está no mesmo diretório
  const dados = await resposta.json();
  eventos = dados.eventos; // Atribui a lista de eventos à variável global
  console.log('Eventos carregados:', eventos);  // Log para verificar os eventos
  gerarCalendario(dataBase); // Regenera o calendário após o carregamento
}

// Função para gerar o calendário exibido na página.
function gerarCalendario(dataBase) {
  console.log("Gerando calendário para a data base:", dataBase); // Verifica o valor da data base
  const calendarioDiv = document.getElementById("calendar-table");
  calendarioDiv.innerHTML = ""; // Limpa o conteúdo existente no calendário

  // Cria a tabela (estrutural) do calendário
  const table = document.createElement("div");
  table.classList.add("table");

  // Cria a linha de cabeçalho com os dias da semana
  const cabeçalhoDias = document.createElement("div");
  cabeçalhoDias.classList.add("cabecalho-dias");

   // Cria a célula vazia para alinhar com a coluna de horários
   const colunaVazia = document.createElement("div");
   colunaVazia.classList.add("coluna-vazia"); // Estilo da coluna vazia
   cabeçalhoDias.appendChild(colunaVazia); // Adiciona ao cabeçalho de dias
 

  // Cria os dias (da semana) em torno da data base
  const dias = [];
  for (let i = -3; i <= 3; i++) {
    const dia = new Date(dataBase);
    dia.setDate(dia.getDate() + i); // Ajusta a data para exibir dias antes e depois
    dias.push(dia); // Armazena os objetos Date diretamente
  }

  console.log('Dias gerados para a semana:', dias);

  // Exibe cada dia na linha de cabeçalho
  dias.forEach((dia) => {
    const diaDiv = document.createElement("div");
    diaDiv.classList.add("dias");

    // Verifica se o dia é o dia atual (real)
    if (dia.toDateString() === dataAtual.toDateString()) {
      diaDiv.classList.add("dia-atual"); // Classe para destacar o dia atual
    }

    // Chama a função para obter os elementos HTML com mês, dia e dia da semana
    const dataCompleta = formatarDataCompleta(dia);
    
    // Adiciona a data completa à div
    diaDiv.appendChild(dataCompleta);
    
    cabeçalhoDias.appendChild(diaDiv);
  });

  table.appendChild(cabeçalhoDias);

  // Obtém a hora atual
  const horaAtual = new Date().getHours();
  console.log('Hora atual:', horaAtual);

  // Cria as linhas de eventos, uma para cada hora
  for (let i = 0; i < 24; i++) {
    const linhaEventos = document.createElement("div");
    linhaEventos.classList.add("linha-eventos");

    // Verifica se é a hora atual e adiciona uma classe de destaque
    if (i === horaAtual) {
      console.log('Destacando a linha para a hora atual:', i);
      linhaEventos.classList.add("hora-atual"); // Classe para destacar a linha da hora atual
    }

    // Cria a célula que combina a hora com o dia
    const horaDiaDiv = document.createElement("div");
    horaDiaDiv.classList.add("hora-dia");
    horaDiaDiv.innerText = `${formatarHora12(i)}`; // Exibe a hora na primeira coluna
    linhaEventos.appendChild(horaDiaDiv);

    // Organiza os eventos por dia e hora
    dias.forEach((dia) => {
      const eventoDiv = document.createElement("div");
      eventoDiv.classList.add("evento");

      // Array para armazenar eventos no mesmo horário
      const eventosNoHorario = eventos.filter((evento) => {
        const eventoInicio = new Date(evento.data_inicio);
        const eventoFim = new Date(evento.data_fim);
        console.log('Verificando evento:', evento.nome, 'Inicio:', eventoInicio, 'Fim:', eventoFim);

        // Verifica se o evento acontece no dia e hora
        return (
          eventoInicio.toDateString() === dia.toDateString() &&
          eventoInicio.getHours() <= i &&
          eventoFim.getHours() > i
        );
      });
      console.log('Eventos no horário', i, ':', eventosNoHorario); // Verificando quais eventos estão sendo filtrados

      if (eventosNoHorario.length > 0) {
        eventoDiv.style.display = "flex"; // Usando flexbox para distribuir os eventos

        // A lógica para garantir que o nome do evento apareça apenas uma vez
        eventosNoHorario.forEach((evento, index) => {
          const eventoElemento = document.createElement("div");
          eventoElemento.classList.add("evento-item");
          eventoElemento.style.backgroundColor = evento.cor;

          // Adiciona o nome do evento apenas na primeira hora (caso o evento dure mais de uma hora)
          if (i === new Date(evento.data_inicio).getHours()) {
            eventoElemento.innerText = evento.nome;
          }

          // Se o evento durar mais de uma hora, ele ocupará várias "horas"
          const duracaoHoras = Math.ceil(
            (new Date(evento.data_fim) - new Date(evento.data_inicio)) /
              (1000 * 60 * 60)
          );

          // Ajuste a altura do evento (ou largura, dependendo de como você deseja exibir)
          eventoElemento.style.height = `${duracaoHoras * 50}px`; // Exemplo: cada hora ocupa 50px de altura
          console.log('Evento:', evento.nome, 'Duração (horas):', duracaoHoras, 'Altura (px):', eventoElemento.style.height);

          eventoDiv.appendChild(eventoElemento);
        });
      }

      linhaEventos.appendChild(eventoDiv);
    });

    table.appendChild(linhaEventos);
  }

  // Adiciona a tabela ao calendário
  calendarioDiv.appendChild(table);
}


// Adiciona os ouvintes de evento para os botões de navegação de data
document.getElementById("today").addEventListener("click", () => {
  console.log('Botão "Hoje" clicado');
  dataBase = new Date(); // Atualiza a data base para hoje, mas não altera a data atual
  gerarCalendario(dataBase); // Regerar o calendário com o novo valor de dataBase
});

document.getElementById("yesterday").addEventListener("click", () => {
  console.log('Botão "Ontem" clicado');
  dataBase.setDate(dataBase.getDate() - 1); // Subtrai 1 dia da data base
  gerarCalendario(dataBase); // Regerar o calendário com o novo valor de dataBase
});

document.getElementById("tomorrow").addEventListener("click", () => {
  console.log('Botão "Amanhã" clicado');
  dataBase.setDate(dataBase.getDate() + 1); // Adiciona 1 dia à data base
  gerarCalendario(dataBase); // Regerar o calendário com o novo valor de dataBase
});

// Inicializa o carregamento dos eventos
carregarEventos();
