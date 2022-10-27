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
var testesNQ = [
  "AT",
  "AT+LP",
  "AT+SI?",
  "AT+IMEI?",
  "AT+NCCID?",
  "AT+CSQ?",
  "AT+LSM?",
  "AT+CT?",
  "AT+PTEMP?",
  "AT+QUIT",
];

const testessh = document.querySelector("#aparecersh");
const SH = document.querySelector("#SH");

const testesnq = document.querySelector("#aparecernq");
const NQ = document.querySelector("#NQ");

testessh.addEventListener("click", function () {
  if (SH.style.visibility === "hidden") {
    NQ.style.visibility = "hidden";
    SH.style.visibility = "visible";
  } else {
    SH.style.visibility = "hidden";
  }
});

testesnq.addEventListener("click", function () {
  if (NQ.style.visibility === "hidden") {
    SH.style.visibility = "hidden";
    NQ.style.visibility = "visible";
  } else {
    NQ.style.visibility = "hidden";
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
  appendToTerminal("> " + dataToSend);
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
