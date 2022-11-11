let port, textEncoder, writableStreamClosed, writer, valor;
let check = false;
const testesSH = [];
const testesNQ = [];

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
