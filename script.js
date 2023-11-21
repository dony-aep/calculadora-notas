function mostrarCalculadora() {
    const botonContainer = document.getElementById('botonContainer');
    const calculatorContainer = document.getElementById('calculatorContainer');
    const marca = document.getElementById('marca');

    marca.style.display = 'none';

    botonContainer.style.display = 'none';
    calculatorContainer.style.display = 'block';
}

function validarEntrada(valor) {

    const esNumeroPositivo = !isNaN(parseFloat(valor)) && isFinite(valor) && parseFloat(valor) >= 0;
    return esNumeroPositivo;
}

function calcularPromedio(notaNumero, valor) {

    if (valor !== '' && !validarEntrada(valor)) {
            return;
    }

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

    // Reemplazar NaN por 0.00 
    if (isNaN(promedio)) {
        promedio = 0.00;
    }

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
        passFailMessage.innerText = '¡Felicidades! Has aprobado la asignatura :)';
        passFailMessage.style.color = 'green';
    } else {
        passFailMessage.innerText = 'Lo siento, no has aprobado la asignatura :(';
        passFailMessage.style.color = 'red';
    }
}

const inputFields = document.querySelectorAll('input[type="text"]');
inputFields.forEach(input => {
    input.addEventListener('input', function () {
        if (this.value !== '' && !validarEntrada(this.value)) {
            this.value = '';
            alert('Por favor, ingrese un número positivo válido en el campo de nota.');
        }
    });
});

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

function toggleAyuda() {
    const helpOverlay = document.getElementById('helpOverlay');
    const helpButton = document.querySelector('.help-button');

    if (helpOverlay.style.display === 'block') {

        helpOverlay.style.display = 'none';
        helpButton.innerText = '?';
        helpButton.classList.remove('active');

    } else {

        helpOverlay.style.display = 'block';
        helpButton.innerText = 'X';
        helpButton.classList.add('active');
    }
}


const helpButton = document.querySelector('.help-button');
helpButton.addEventListener('click', toggleAyuda);

const helpOverlay = document.getElementById('helpOverlay');
helpOverlay.addEventListener('click', function (event) {
    if (event.target === helpOverlay) {
        toggleAyuda();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const marca = document.getElementById('marca');
    marca.style.display = 'block';
});
