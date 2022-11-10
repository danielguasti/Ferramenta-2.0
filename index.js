var port, textEncoder, writableStreamClosed, writer, valor, check;
var testesSH = [];
var testesNQ = [];

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

var checkBoxes = document.querySelectorAll(".checkbox");
var selecionados;
document.querySelector(".todos").onclick = function (e) {
  var marcar = e.target.checked;
  for (var i = 0; i < checkBoxes.length; i++) {
    checkBoxes[i].checked = marcar;
  }
};

function verificarTestes() {
  checkBoxes.forEach(function (el) {
    if (el.checked) {
      selecionados = testesSH.push(el.value);
    }
  });
  console.log(testesSH);
  console.log(selecionados);
  sendSerialLine(0);
}

async function sendSerialLine(dado) {
  dataToSend = testesSH[dado] + "\r";
  console.log(testesSH[dado]);
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
    if (newStuff == "OK") {
      serialResultsDiv.innerHTML += newStuff + "\n" + "\n";
    } else {
      serialResultsDiv.innerHTML += newStuff + "\n";
    }
    if (valor < selecionados - 1 && newStuff == "OK") {
      valor++;
      sendSerialLine(valor);
    } else if (valor == selecionados - 1 && newStuff == "OK") {
      testesSH = [];
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
