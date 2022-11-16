let testesNQ = [];
const checkbox = document.querySelectorAll(".checkbox-NQ");
let selecionado;

document.querySelector(".tudo").onclick = function (e) {
  var marcar = e.target.checked;
  for (var i = 0; i < checkbox.length; i++) {
    checkbox[i].checked = marcar;
  }
};

function verificarTestesNQ() {
  checkbox.forEach(function (el) {
    if (el.checked) {
      selecionados = testes.push(el.value);
    }
  });
  console.log(testes);
  console.log(selecionados);
  sendSerialLine(0);
}
