var port, textEncoder, writableStreamClosed, writer;

async function connectSerial() {
  try {
    // Escolher e conectar na porta serial escolhida
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: document.getElementById("baud").value });
    let settings = {};

    textEncoder = new TextEncoderStream();
    writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
    writer = textEncoder.writable.getWriter();
    await listenToPort();
  } catch (e) {
    alert(e);
  }
}

async function sendSerialLine() {
  dataToSend = "olá" + "\n" + "\r";
  appendToTerminal("> " + dataToSend);
  await writer.write(dataToSend);
  if (dataToSend.trim().startsWith("\x03")) echo(false);
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

async function appendToTerminal(newStuff) {
  serialResultsDiv.innerHTML += newStuff;

  //scroll down to bottom of div
  serialResultsDiv.scrollTop = serialResultsDiv.scrollHeight;
}
