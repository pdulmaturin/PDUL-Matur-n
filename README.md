# PDUL Maturín · Sitio web

Plan de Desarrollo Urbano Local de Maturín, Venezuela. **Maturín, una ciudad con propósito.**

Sitio estático (HTML + CSS + JS, sin dependencias ni compilación).

## Estructura

```
index.html
css/styles.css          estilos y variables de diseño (paleta, radios, anchos)
js/main.js              menú móvil y animaciones de aparición
js/silabas.js           silabeador español: inserta guiones suaves en textos .just
js/justificar.js        afinador de texto justificado (evita "ríos" blancos)
assets/                 logos, fondos, fichas y estatua (optimizados)
```

## Textos justificados sin "ríos"

Cualquier párrafo con la clase `just` se justifica automáticamente:

1. `silabas.js` divide las palabras largas por sílabas (guion suave).
2. `justificar.js` mide los huecos de cada línea y prueba ajustes mínimos de espaciado hasta dejar el hueco más pequeño.
3. Se recalcula al cambiar el tamaño de la ventana.

Para un párrafo nuevo basta con escribir `<p class="just">…</p>`.

## Publicar en GitHub Pages

1. Crear el repositorio y subir **el contenido de esta carpeta** (que `index.html` quede en la raíz).
2. En *Settings → Pages*, elegir la rama `main` y la carpeta `/ (root)`.

## Usar en Figma

- Con el plugin *html.to.design* (o similar), importar la URL publicada o `index.html`; usar un lienzo de **1440 px** de ancho.
- Las secciones son bloques con `flex`/`grid` simples, por lo que se convierten en capas con Auto Layout.
- Colores del logo: verde `#2A9840`, rojo `#B61918`, amarillo `#FBC51A`, azul `#254091`, teal `#0E8A9A`. Tipografía: Poppins.

## Contacto

- WhatsApp: https://wa.link/rbuk1q
- Correo: pdulmaturin2027@gmail.com
- Teléfono: 0414 741 78 74
