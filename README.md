# Sitio web · Dr. Ángel Gerardo González Valero

Landing page del Dr. Ángel Gerardo González Valero, otorrinolaringólogo y cirujano de cabeza y cuello en San Luis Potosí.

## Estructura
- `docs/index.html`: página principal
- `docs/privacidad.html`: aviso de privacidad (borrador, pendiente de revisión legal)
- `docs/styles.css` y `docs/main.js`: estilos y animaciones
- `docs/assets/`: fotos y pictogramas del logo

## Ver en local
```bash
npx http-server docs -p 5173
```
Después abre http://localhost:5173

## Pendiente
- Video del proceso: `docs/assets/video-proceso.mp4`
- Fotos de antes y después (con autorización firmada): atributos `data-before` y `data-after` en `index.html`
- Testimonios en video o texto
- Información de toxina botulínica y ácido hialurónico

## Publicación
El sitio se publica solo con GitHub Pages desde la carpeta `docs/` de la rama `main`:
https://ggr-138.github.io/sitio-dr-angel-valero/
Cada cambio que se sube a `main` se publica en uno o dos minutos.
