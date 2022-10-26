var port, textEncoder, writableStreamClosed, writer;
var testesSH = [
  "AT???",
  "ATSI?",
  "ATSP?",
  "ATCT?",
  "ATIT?",
  "ATPT?",
  "ATLM?",
  "ATSR",
  "ATSR?",
  "ATLP!",
];
var testesNQ = ["AT", "AT+LP"];

const testessh = document.querySelector("#aparecersh");
const SH = document.querySelector("#SH");

const testesNQ = document.querySelector("#aparecernq");
const NQ = document.querySelector("#NQ");

testessh.addEventListener("click", function () {
  if (SH.style.display === "none") {
    NQ.style.display = "none";
    SH.style.display = "block";
  } else {
    SH.style.display = "none";
  }
});

testesNQ.addEventListener("click", function () {
  if (NQ.style.display === "none") {
    SH.style.display = "none";
    NQ.style.display = "block";
  } else {
    NQ.style.display = "none";
  }
});

async function connectSerial() {
  try {
    // Escolher e conectar na porta serial escolhida
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: document.getElementById("baud").value });

    textEncoder = new TextEncoderStream();
    writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
    writer = textEncoder.writable.getWriter();
    console.log("Serial conectada!");
  } catch (e) {
    console.log(e);
  }
  await listenToPort();
}

async function sendSerialLine(dado) {
  dataToSend = dado + "\r" + "\n";
  await writer.write(dataToSend);
}

async function listenToPort() {
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();

  // ouvir os dados vindos da Serial.
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      // Permite fechar a serial depois.
      console.log("[readLoop] DONE", done);
      reader.releaseLock();
      break;
    }
    // Valor
    appendToTerminal(value);
  }
}

const serialResultsDiv = document.getElementById("serialResults");

function appendToTerminal(newStuff) {
  serialResultsDiv.innerHTML += newStuff;
}
