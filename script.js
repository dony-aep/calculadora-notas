function mostrarCalculadora() {
    const botonContainer = document.getElementById('botonContainer');
    const calculatorContainer = document.getElementById('calculatorContainer');
    botonContainer.style.display = 'none';
    calculatorContainer.style.display = 'block';
}

function calcularPromedio(notaNumero, valor) {
    let percentage;
    switch (notaNumero) {
        case 1:
            percentage = 0.09;
            break;
        case 2:
            percentage = 0.21;
            break;
        case 3:
            percentage = 0.09;
            break;
        case 4:
            percentage = 0.21;
            break;
        case 5:
            percentage = 0.12;
            break;
        case 6:
            percentage = 0.28;
            break;
        default:
            percentage = 0;
    }
    let promedio = parseFloat(valor) * percentage;
    let resultElement = document.getElementById(`result${notaNumero}`);
    resultElement.innerHTML = promedio.toFixed(2);

    let notaDefinitiva1 = (parseFloat(document.getElementById('nota1').value) || 0) * 0.09 + (parseFloat(
        document.getElementById('nota2').value) || 0) * 0.21;
    let notaDefinitiva2 = (parseFloat(document.getElementById('nota3').value) || 0) * 0.09 + (parseFloat(
        document.getElementById('nota4').value) || 0) * 0.21;
    let notaDefinitiva3 = (parseFloat(document.getElementById('nota5').value) || 0) * 0.12 + (parseFloat(
        document.getElementById('nota6').value) || 0) * 0.28;

    document.getElementById('notaDefinitiva1').value = notaDefinitiva1.toFixed(2);
    document.getElementById('notaDefinitiva2').value = notaDefinitiva2.toFixed(2);
    document.getElementById('notaDefinitiva3').value = notaDefinitiva3.toFixed(2);

    let notaDefinitivaTotal = (notaDefinitiva1 + notaDefinitiva2 + notaDefinitiva3).toFixed(2);
    document.getElementById('notaDefinitivaTotal').value = notaDefinitivaTotal;

    const passFailMessage = document.getElementById('passFailMessage');
    if (parseFloat(notaDefinitivaTotal) >= 3.0) {
        passFailMessage.innerText = '¡Felicidades! Has aprobado la asignatura.';
        passFailMessage.style.color = 'green';
    } else {
        passFailMessage.innerText = 'Lo siento, no has aprobado la asignatura.';
        passFailMessage.style.color = 'red';
    }
}

function reiniciarCampos() {
    const inputFields = document.querySelectorAll('input[type="text"]');
    inputFields.forEach(input => {
        input.value = '';
    });

    const resultFields = document.querySelectorAll('.result');
    resultFields.forEach(result => {
        result.innerHTML = '';
    });

    const definitivaFields = document.querySelectorAll('input[id^="notaDefinitiva"]');
    definitivaFields.forEach(definitiva => {
        definitiva.value = '';
    });

    const definitivaTotalField = document.getElementById('notaDefinitivaTotal');
    definitivaTotalField.value = '';

    const passFailMessage = document.getElementById('passFailMessage');
    passFailMessage.innerText = '';
}
