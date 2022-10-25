var port, textEncoder, writableStreamClosed, writer;

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

var checkBoxes = document.querySelectorAll(".SH");

var btn = document.querySelector("#send");

btn.addEventListener("click", function (e) {
  e.preventDefault();

  checkBoxes.forEach(function (el) {
    if (el.checked) {
      sendSerialLine(el.value);
    }
  });
});

async function sendSerialLine(dado) {
  dataToSend = dado + "\n" + "\r";
  await writer.write(dataToSend);
  if (dataToSend.trim().startsWith("\x03")) echo(false);
  sleep(1000 * 3);
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
    sleep(1000 * 3);
  }
}

const serialResultsDiv = document.getElementById("serialResults");

function appendToTerminal(newStuff) {
  serialResultsDiv.innerHTML += newStuff;
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
