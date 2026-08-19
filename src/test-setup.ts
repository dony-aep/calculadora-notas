// jsdom no implementa matchMedia, y ThemeService lo consulta en su constructor
// para detectar el tema del sistema. Sin este stub no arranca ningún spec que
// instancie el árbol de la app.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  })
});
