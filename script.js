function mostrarCalculadora() {
    const botonContainer = document.getElementById('botonContainer');
    const calculatorContainer = document.getElementById('calculatorContainer');
    const marca = document.getElementById('marca');

    marca.style.display = 'none'; // Oculta la marca al mostrar la calculadora

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

    // Verificar si el resultado es NaN y establecerlo como 0.00 en ese caso
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
        passFailMessage.innerText = '¡Felicidades! Has aprobado la asignatura :).';
        passFailMessage.style.color = 'green';
    } else {
        passFailMessage.innerText = 'Lo siento, no has aprobado la asignatura :(.';
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

function toggleAyuda() {
    const helpOverlay = document.getElementById('helpOverlay');
    const helpButton = document.querySelector('.help-button');

    // Si la ventana de ayuda está visible, cámbiala a "none" para ocultarla
    if (helpOverlay.style.display === 'block') {
        helpOverlay.style.display = 'none';
        helpButton.innerText = '?';
        helpButton.classList.remove('active');
    } else {
        // Si la ventana de ayuda está cerrada, ábrela y cambia el botón a "X"
        helpOverlay.style.display = 'block';
        helpButton.innerText = 'X';
        helpButton.classList.add('active');
    }
}

// Agrega un evento al botón de ayuda para abrir/cerrar la ventana flotante
const helpButton = document.querySelector('.help-button');
helpButton.addEventListener('click', toggleAyuda);

// Agrega un evento al overlay (fuera de la ventana) para cerrarla al hacer clic
const helpOverlay = document.getElementById('helpOverlay');
helpOverlay.addEventListener('click', function (event) {
    if (event.target === helpOverlay) {
        // Si el clic ocurre fuera de cualquier elemento hijo de la ventana, ciérrala
        toggleAyuda();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const marca = document.getElementById('marca');
    marca.style.display = 'block'; // Muestra la marca al inicio
});

