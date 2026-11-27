import { Signal, effect } from '@angular/core';

/**
 * Bloquea el scroll del fondo mientras `visible` sea true. Solo el modal
 * visible toca la clase: si un modal oculto la quitara, desbloquearía el
 * scroll que otro modal abierto necesita, según el orden en que se crearon.
 * Debe llamarse en un contexto de inyección (constructor o inicializador).
 */
export function bloquearScrollMientras(visible: Signal<boolean>): void {
  effect(onCleanup => {
    if (visible()) {
      document.body.classList.add('modal-open');
      onCleanup(() => document.body.classList.remove('modal-open'));
    }
  });
}
