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
      testesSH = [];
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
