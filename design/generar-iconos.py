"""Genera public/favicon.ico y public/apple-touch-icon.png a partir del logo de barras.

Uso, desde la raíz del repo: python design/generar-iconos.py  (requiere Pillow)
"""
from pathlib import Path

from PIL import Image, ImageDraw

# Las seis barras del logo sobre un lienzo de 512, igual que public/favicon.svg.
BARRAS = [(24, 100, 346), (384, 100, 103), (24, 231, 246), (283, 231, 204), (24, 362, 144), (181, 362, 306)]
ALTO, RADIO = 50, 25
SUPERMUESTREO = 8
PUBLIC = Path(__file__).resolve().parent.parent / 'public'


def icono(lado, fondo, color, escala, radio_fondo):
    """Dibuja el logo centrado en un cuadrado; `escala` es la fracción del lado que ocupa."""
    grande = lado * SUPERMUESTREO
    im = Image.new('RGBA', (grande, grande), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if fondo:
        d.rounded_rectangle((0, 0, grande - 1, grande - 1), radius=int(grande * radio_fondo), fill=fondo)
    # El logo ocupa x 24..487 e y 100..412 del lienzo de 512.
    ancho_logo, alto_logo = 463, 312
    f = grande * escala / ancho_logo
    ox = (grande - ancho_logo * f) / 2 - 24 * f
    oy = (grande - alto_logo * f) / 2 - 100 * f
    for x, y, w in BARRAS:
        d.rounded_rectangle((ox + x * f, oy + y * f, ox + (x + w) * f, oy + (y + ALTO) * f), radius=RADIO * f, fill=color)
    return im.resize((lado, lado), Image.LANCZOS)


# Safari no usa el SVG: el .ico lleva fondo blanco para verse en pestañas claras y oscuras.
icono(48, '#ffffff', '#141414', 0.74, 0.22).save(PUBLIC / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
# iOS rellena de negro la transparencia, así que el icono de inicio lleva fondo propio.
icono(180, '#121212', '#f2f2f2', 0.62, 0).convert('RGB').save(PUBLIC / 'apple-touch-icon.png')
