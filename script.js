document.getElementById('calculadora-btn').addEventListener('click', function() {
    document.getElementById('calculadora-btn').style.display = 'none';
    document.querySelector('footer').style.display = 'none';

    var calculadoraNotas = document.getElementById('calculadora-notas');
    calculadoraNotas.style.display = 'block';
});

// Función para cambiar entre modo claro y oscuro
function toggleDarkMode() {
    const html = document.documentElement;
    const toggleBtn = document.getElementById('toggle-mode');
    const icon = toggleBtn.querySelector('.material-icons');
    
    if (html.classList.contains('dark-mode')) {
        html.classList.remove('dark-mode');
        icon.textContent = 'light_mode';
        localStorage.setItem('darkMode', 'false');
    } else {
        html.classList.add('dark-mode');
        icon.textContent = 'dark_mode';
        localStorage.setItem('darkMode', 'true');
    }
}

// Evento para el botón de cambio de modo
document.getElementById('toggle-mode').addEventListener('click', toggleDarkMode);

// Comprobar el modo guardado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const darkModeStored = localStorage.getItem('darkMode');
    const toggleBtn = document.getElementById('toggle-mode');
    const icon = toggleBtn.querySelector('.material-icons');
    
    if (darkModeStored === 'false') {
        document.documentElement.classList.remove('dark-mode');
        icon.textContent = 'light_mode';
    } else {
        icon.textContent = 'dark_mode';
    }
});

function calcularDefinitiva(notaFormativa, notaCognitiva, corte) {
    if (isNaN(notaFormativa)) notaFormativa = 0;
    if (isNaN(notaCognitiva)) notaCognitiva = 0;

    var porcentajeFormativa, porcentajeCognitiva;

    switch (corte) {
        case 1:
        case 2:
            porcentajeFormativa = 0.09;
            porcentajeCognitiva = 0.21;
            break;
        case 3:
            porcentajeFormativa = 0.12;
            porcentajeCognitiva = 0.28;
            break;
        default:
            porcentajeFormativa = 0.09;
            porcentajeCognitiva = 0.21;
            break;
    }

    var definitivaNota = (notaFormativa * porcentajeFormativa) + (notaCognitiva * porcentajeCognitiva);
    return definitivaNota.toFixed(2);
}

function calcularDefinitivaTotal() {
    var definitiva1 = parseFloat(document.getElementById('nota-definitiva-1').textContent);
    var definitiva2 = parseFloat(document.getElementById('nota-definitiva-2').textContent);
    var definitiva3 = parseFloat(document.getElementById('nota-definitiva-3').textContent);

    if (isNaN(definitiva1)) definitiva1 = 0;
    if (isNaN(definitiva2)) definitiva2 = 0;
    if (isNaN(definitiva3)) definitiva3 = 0;

    var definitivaTotal = definitiva1 + definitiva2 + definitiva3;

    var mensaje = document.getElementById('mensaje-aprobacion');
    if (definitivaTotal < 3) {
        mensaje.textContent = 'Lo siento, no has aprobado la asignatura :(';
        mensaje.style.color = 'red';
    } else {
        mensaje.textContent = '¡Felicidades! Has aprobado la asignatura :)';
        mensaje.style.color = 'green';
    }

    return definitivaTotal.toFixed(2);
}

function actualizarNotaDefinitiva(corte) {
    var notaFormativa = parseFloat(document.getElementById('nota-formativa-' + corte).value);
    var notaCognitiva = parseFloat(document.getElementById('nota-cognitiva-' + corte).value);

    var definitivaNota = calcularDefinitiva(notaFormativa, notaCognitiva, corte);
    document.getElementById('nota-definitiva-' + corte).textContent = definitivaNota;

    var definitivaTotal = calcularDefinitivaTotal();
    document.getElementById('nota-definitiva-total').textContent = definitivaTotal;
}

function handleKeyDown(event) {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'input' && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
        event.preventDefault(); // Evita el comportamiento por defecto del navegador
        let value = parseFloat(target.value) || 0;
        if (event.key === 'ArrowUp') {
            target.value = (value + 0.1).toFixed(1); // Incrementa el valor en 0.1
        } else if (event.key === 'ArrowDown') {
            target.value = (value - 0.1).toFixed(1); // Decrementa el valor en 0.1
        }
        const corte = target.id.match(/\d+/)[0]; // Obtén el número de corte del id
        actualizarNotaDefinitiva(corte);
    }
}

// Añadir el evento keydown a todos los inputs
document.querySelectorAll('.nota-container input').forEach(input => {
    input.addEventListener('keydown', handleKeyDown);
});

document.getElementById('nota-formativa-1').addEventListener('input', function() {
    actualizarNotaDefinitiva(1);
});

document.getElementById('nota-cognitiva-1').addEventListener('input', function() {
    actualizarNotaDefinitiva(1);
});

document.getElementById('nota-formativa-2').addEventListener('input', function() {
    actualizarNotaDefinitiva(2);
});

document.getElementById('nota-cognitiva-2').addEventListener('input', function() {
    actualizarNotaDefinitiva(2);
});

document.getElementById('nota-formativa-3').addEventListener('input', function() {
    actualizarNotaDefinitiva(3);
});

document.getElementById('nota-cognitiva-3').addEventListener('input', function() {
    actualizarNotaDefinitiva(3);
});

document.getElementById('restablecer-btn').addEventListener('click', function() {
    for (var i = 1; i <= 3; i++) {
        document.getElementById('nota-formativa-' + i).value = '';
        document.getElementById('nota-cognitiva-' + i).value = '';
        document.getElementById('nota-definitiva-' + i).textContent = '';
    }
    document.getElementById('nota-definitiva-total').textContent = '';

    var mensaje = document.getElementById('mensaje-aprobacion');
    mensaje.textContent = '';
    mensaje.style.color = '';
});

// Get the modal
var modal = document.getElementById('help-modal');

// Get the button that opens the modal
var btn = document.getElementById('ayuda-btn');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close-button')[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = 'block';
    btn.style.display = 'none';
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = 'none';
    btn.style.display = 'block';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        btn.style.display = 'block';
    }
}