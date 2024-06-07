function mostrarCalculadora() {
    const marcaAgua = document.getElementById('marcaAgua');
    marcaAgua.style.display = 'none';

    document.getElementById('botonContainer').style.display = 'none';
    document.getElementById('calculatorContainer').style.display = 'block';
}

function validarEntrada(valor) {
    return !isNaN(parseFloat(valor)) && isFinite(valor) && parseFloat(valor) >= 0;
}

function calcularPromedio() {
    const notas = [];
    let promedioTotal = 0;

    for (let i = 1; i <= 6; i++) {
        const inputNota = document.getElementById('nota' + i).value;
        const nota = parseFloat(inputNota) || 0;

        let percentage;
        switch (i) {
            case 1:
            case 3:
                percentage = 0.09;
                break;
            case 2:
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

        const promedio = nota * percentage;
        notas.push(promedio.toFixed(2));

        promedioTotal += promedio;
    }

    const notaDefinitiva1 = parseFloat(notas[0]) + parseFloat(notas[1]);
    const notaDefinitiva2 = parseFloat(notas[2]) + parseFloat(notas[3]);
    const notaDefinitiva3 = parseFloat(notas[4]) + parseFloat(notas[5]);

    document.getElementById('notaDefinitiva1').value = notaDefinitiva1.toFixed(2);
    document.getElementById('notaDefinitiva2').value = notaDefinitiva2.toFixed(2);
    document.getElementById('notaDefinitiva3').value = notaDefinitiva3.toFixed(2);

    const notaDefinitivaTotal = (notaDefinitiva1 + notaDefinitiva2 + notaDefinitiva3).toFixed(2);
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


function reiniciarCampos() {
    document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
    document.querySelectorAll('.result').forEach(result => result.innerHTML = '');
    document.querySelectorAll('input[id^="notaDefinitiva"]').forEach(definitiva => definitiva.value = '');
    document.getElementById('notaDefinitivaTotal').value = '';
    document.getElementById('passFailMessage').innerText = '';
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
})

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('marca-agua').style.display = 'block';
});
