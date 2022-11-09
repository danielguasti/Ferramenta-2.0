var port, textEncoder, writableStreamClosed, writer;
var testesSH = [
  "AT???",
  "ATSI?",
  "ATSP?",
  "ATCT?",
  "ATIT?",
  "ATPT?",
  "ATLM?",
  "ATSR?",
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
var valor;

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
    alert(e);
  }
  await listenToPort();
}

async function sendSerialLine(dado) {
  dataToSend = testesSH[dado] + "\r";
  console.log(testesSH[dado]);
  appendToTerminal(">" + dataToSend);
  await writer.write(dataToSend);
  valor = dado;
}

async function listenToPort() {
  const lineReader = port.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TransformStream(new LineBreakTransformer()))
    .getReader();

  // ouvir os dados vindos da Serial.
  while (true) {
    const { value, done } = await lineReader.read();
    if (done) {
      // Permite fechar a serial depois.
      console.log("[readLoop] DONE", done);
      reader.releaseLock();
      break;
    }
    // Valor
    console.log(value);
    appendToTerminal(value);
  }
}

const serialResultsDiv = document.getElementById("serialResults");

function appendToTerminal(newStuff) {
  if (newStuff == "OK") {
    serialResultsDiv.innerHTML += "\n" + newStuff + "\n" + "\n";
  } else if (newStuff[0] == "H" || newStuff[0] == "S" || newStuff[0] == "P") {
    serialResultsDiv.innerHTML += "\n" + newStuff;
  } else {
    serialResultsDiv.innerHTML += newStuff;
  }
  if (valor != 8 && newStuff == "OK") {
    valor++;
    sendSerialLine(valor);
  }
}

function sleep(milliseconds) {
  let timeStart = new Date().getTime();
  while (true) {
    let elapsedTime = new Date().getTime() - timeStart;
    if (elapsedTime > milliseconds) {
      break;
    }
  }
}

class LineBreakTransformer {
  constructor() {
    this.container = "";
  }

  transform(chunk, controller) {
    this.container += chunk;
    const lines = this.container.split("\r\n");
    this.container = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    controller.enqueue(this.container);
  }
}
