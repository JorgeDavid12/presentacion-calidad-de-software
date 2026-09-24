# Proceso fundamental del testing

Presentación web cinematográfica en formato 16:9. Contiene 35 escenas: portada, integrantes, 32 slides del guion (8 por expositor) y cierre.

## Ejecutar para la exposición

```bash
pnpm install
pnpm dev
```

Abre la dirección local que muestra Vite y activa pantalla completa con `F11`.

Para presentar exactamente la compilación de producción:

```bash
pnpm build
pnpm preview
```

La dirección de preview es `http://127.0.0.1:4173/`. El proyecto está preparado para Netlify con `pnpm build` y publicación de la carpeta `dist`.

## Controles

- `→`, `Page Down` o `Espacio`: siguiente slide.
- `←` o `Page Up`: slide anterior.
- `Home` / `End`: primera / última slide.
- `R`: repetir la animación de entrada.
- `F`: solicitar pantalla completa desde la aplicación.
- Deslizar horizontalmente también cambia de slide.

Para abrir una escena concreta durante el ensayo, agrega `?slide=17` a la URL y cambia el número entre 1 y 35.

## Verificación

```bash
pnpm verify
pnpm build
```

`pnpm verify` comprueba las 35 escenas, IDs únicos, reparto 8/8/8/8 y que cada composición visual pueda renderizarse. `pnpm build` valida la compilación completa de Vite.

Las fuentes, la imagen ambiental, los iconos, el canvas de partículas y el resto de recursos esenciales quedan empaquetados o servidos localmente. La presentación no usa APIs ni recursos externos en tiempo real durante la exposición.
