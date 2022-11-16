let port, textEncoder, writableStreamClosed, writer, valor;
let check = false;
let testes = [];

const testessh = document.querySelector("#aparecersh");
const SH = document.querySelector("#SH");

const testesnq = document.querySelector("#aparecernq");
const NQ = document.querySelector("#NQ");

const nada = document.querySelector("#nada");

testessh.addEventListener("click", function () {
  if (SH.style.display === "none") {
    nada.style.display = "none";
    NQ.style.display = "none";
    SH.style.display = "block";
  } else {
    SH.style.display = "none";
  }

  if (SH.style.display == "none" && NQ.style.display == "none") {
    nada.style.display = "block";
  } else {
    nada.style.display = "none";
  }
});

testesnq.addEventListener("click", function () {
  if (NQ.style.display === "none") {
    nada.style.display = "none";
    SH.style.display = "none";
    NQ.style.display = "block";
  } else {
    NQ.style.display = "none";
  }

  if (SH.style.display == "none" && NQ.style.display == "none") {
    nada.style.display = "block";
  } else {
    nada.style.display = "none";
  }
});

const checkBoxes = document.querySelectorAll(".checkbox");
let selecionados;
document.querySelector(".todos").onclick = function (e) {
  var marcar = e.target.checked;
  for (var i = 0; i < checkBoxes.length; i++) {
    checkBoxes[i].checked = marcar;
  }
};

function verificarTestes() {
  checkBoxes.forEach(function (el) {
    if (el.checked) {
      selecionados = testes.push(el.value);
    }
  });
  console.log(testes);
  console.log(selecionados);
  sendSerialLine(0);
}

async function sendSerialLine(dado) {
  dataToSend = testes[dado] + "\r";
  console.log(testes[dado]);
  appendToTerminal(">" + dataToSend);
  await writer.write(dataToSend);
  valor = dado;
  check = true;
}

async function enviarTexto() {
  dataToSend = document.getElementById("linha-para-enviar").value + "\r";
  console.log(dataToSend);
  appendToTerminal(">" + dataToSend);
  await writer.write(dataToSend);
  check = false;
}

const serialResultsDiv = document.getElementById("serialResults");

function appendToTerminal(newStuff) {
  if (check == true) {
    if (newStuff == "OK" || newStuff == "ERRO") {
      serialResultsDiv.innerHTML += newStuff + "\n" + "\n";
    } else {
      serialResultsDiv.innerHTML += newStuff + "\n";
    }
    if (valor < selecionados - 1 && (newStuff == "OK" || newStuff == "ERRO")) {
      valor++;
      sendSerialLine(valor);
    } else if (
      valor == selecionados - 1 &&
      (newStuff == "OK" || newStuff == "ERRO")
    ) {
      testes = [];
      check == false;
    }
  }

  if (check == false) {
    if (newStuff == "OK") {
      serialResultsDiv.innerHTML += newStuff + "\n" + "\n";
    } else {
      serialResultsDiv.innerHTML += newStuff + "\n";
    }
  }
}
