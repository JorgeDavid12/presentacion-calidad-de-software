---
name: cinematic-web-presentation
description: Diseña y construye presentaciones web inmersivas, cinematográficas e interactivas con React, GSAP, Three.js/React Three Fiber, Motion y CSS moderno. Úsala cuando el usuario quiera convertir una exposición, tema académico, storytelling o presentación tradicional en una experiencia web visualmente impactante con animaciones, partículas, transiciones, figuras, imágenes, profundidad y efectos interactivos.
---

# Cinematic Web Presentation

## Objetivo

Construir presentaciones en formato web que se sientan como una experiencia visual interactiva, no como una página corporativa tradicional ni como un PowerPoint trasladado a HTML.

La prioridad es crear impacto visual, mantener la atención del público y apoyar la explicación oral mediante movimiento, composición, interacción, imágenes, figuras, profundidad y storytelling.

La presentación debe sentirse moderna, coherente, fluida y deliberadamente diseñada. Cada efecto debe reforzar el contenido o dirigir la atención, no existir solo como decoración.

## Cuándo usar esta skill

Usa esta skill cuando el usuario pida cualquiera de los siguientes tipos de trabajo:

- Presentación académica en formato web.
- Exposición interactiva.
- Storytelling visual mediante scroll.
- Presentación creativa con libertad de diseño.
- Micrositio utilizado como presentación.
- Experiencia full-screen para explicar un tema.
- Presentación con partículas, animaciones, figuras 3D o escenas interactivas.
- Conversión de diapositivas tradicionales a una experiencia web moderna.

No uses esta skill para sitios empresariales convencionales, dashboards, CRUD, sistemas administrativos o landing pages cuyo objetivo principal sea conversión comercial, salvo que el usuario indique explícitamente que desea el mismo lenguaje visual de una presentación inmersiva.

## Principio de diseño principal

NO construir una web genérica basada en:

- navbar permanente,
- hero estándar,
- tres cards,
- sección de características,
- testimonios,
- footer.

En su lugar, tratar cada sección como una escena o diapositiva visual de pantalla completa.

La experiencia debe tener ritmo:

1. impacto,
2. respiración,
3. explicación,
4. interacción,
5. nuevo impacto,
6. cierre.

No todas las escenas deben tener efectos fuertes. Reservar los momentos más complejos para puntos importantes del contenido.

## Stack tecnológico por defecto

### Base

Priorizar:

- React
- Vite
- JavaScript o TypeScript según el proyecto existente
- Tailwind CSS si ya está presente o si acelera la composición sin limitar el diseño
- CSS moderno personalizado para efectos visuales específicos

No reemplazar la arquitectura existente si el proyecto ya tiene una base funcional equivalente.

### Animación principal

Usar:

- GSAP
- ScrollTrigger
- @gsap/react cuando corresponda

GSAP debe controlar las animaciones narrativas importantes:

- entradas y salidas de escenas,
- timelines,
- texto cinético,
- animaciones ligadas al scroll,
- pinning,
- parallax,
- scrub,
- secuencias coordinadas,
- zooms,
- máscaras,
- desplazamientos horizontales,
- transformaciones cinematográficas.

Evitar repartir una misma secuencia compleja entre varias librerías de animación.

### 3D, profundidad y partículas

Priorizar:

- three
- @react-three/fiber
- @react-three/drei

Usar Three.js mediante React Three Fiber cuando el proyecto sea React.

Aplicarlo para:

- partículas,
- estrellas,
- líneas o redes,
- geometrías abstractas,
- modelos 3D,
- cámaras,
- iluminación,
- objetos flotantes,
- profundidad,
- fondos interactivos,
- shaders cuando aporten valor,
- elementos que reaccionan al cursor,
- escenas 3D controladas por scroll.

No hacer toda la presentación en 3D salvo que el concepto lo justifique.

Preferir uno o dos momentos 3D memorables sobre una escena 3D permanente que distraiga del contenido.

No programar WebGPU directamente salvo necesidad técnica real. Dejar que Three.js gestione el renderer apropiado cuando sea viable.

### Microinteracciones

Usar Motion cuando sea útil para:

- hover,
- tap,
- tarjetas,
- pequeños paneles,
- entradas o salidas sencillas de componentes,
- reordenamiento visual,
- escalado,
- gestos,
- microinteracciones.

GSAP controla las grandes secuencias.
Motion controla interacciones pequeñas y locales.

No duplicar una misma animación con GSAP y Motion.

### Transiciones de escena

Usar View Transition API cuando aporte continuidad visual entre estados, rutas o escenas.

Ejemplos:

- una miniatura se convierte en imagen protagonista,
- una tarjeta se expande a pantalla completa,
- un título cambia de posición entre escenas,
- un elemento persiste visualmente durante la navegación.

Implementar fallback razonable cuando la API no esté disponible.

### Ilustraciones interactivas

Rive es opcional.

Usarlo solamente cuando exista una necesidad clara como:

- personaje animado,
- mascota,
- diagrama interactivo,
- icono complejo con estados,
- animación vectorial controlada por interacción.

No añadir Rive si GSAP, CSS o Three.js ya resuelven el efecto adecuadamente.

### Iconos

Preferir Lucide React para iconografía de interfaz cuando se necesite.

No abusar de iconos decorativos si una composición tipográfica o una figura visual comunica mejor la idea.

## CSS moderno que debe aprovecharse

Usar CSS nativo activamente. Considerar, cuando resulte apropiado:

- `mask-image`
- CSS masks
- `clip-path`
- `backdrop-filter`
- `filter`
- `mix-blend-mode`
- `background-clip`
- gradientes
- OKLCH
- `color-mix()`
- `perspective`
- transformaciones 3D
- pseudo-elementos
- variable fonts
- scroll snapping cuando mejore la experiencia
- scroll-driven animations para efectos simples cuando eviten JavaScript innecesario

Usar progressive enhancement para características nuevas del navegador.

## Lenguaje visual

La presentación debe sentirse diseñada, no ensamblada.

Priorizar:

- composiciones full-screen,
- títulos grandes,
- contraste fuerte,
- espacio negativo,
- jerarquía tipográfica clara,
- imágenes de gran escala,
- capas visuales,
- profundidad,
- geometría,
- movimiento controlado,
- fondos atmosféricos,
- números o palabras clave como elementos gráficos,
- cambios de escala,
- revelados,
- máscaras,
- transiciones entre escenas.

Evitar llenar cada pantalla con párrafos largos.

El contenido proyectado debe servir como apoyo a la exposición oral. Mostrar frases, conceptos, cifras, diagramas, imágenes y palabras clave antes que bloques extensos de texto.

## Arquitectura recomendada de la presentación

Tratar la experiencia como una secuencia de escenas.

Ejemplo conceptual:

- `OpeningScene`
- `ContextScene`
- `ConceptScene`
- `VisualExplanationScene`
- `DataScene`
- `InteractiveScene`
- `DeepDiveScene`
- `ClosingScene`

Cada escena debe tener una intención visual propia, pero compartir sistema tipográfico, color, espaciado y comportamiento general.

No es obligatorio usar estos nombres. Adaptar la arquitectura al contenido real.

## Portada

La primera pantalla debe generar impacto inmediatamente.

Considerar:

- título grande,
- composición minimalista,
- partículas sutiles,
- geometría o modelo 3D,
- fondo con profundidad,
- reacción ligera al cursor,
- entrada tipográfica mediante GSAP,
- indicador visual discreto para continuar.

Evitar mostrar demasiada información en la portada.

## Storytelling mediante scroll

Cuando la presentación use scroll como mecanismo principal:

- convertir el desplazamiento en parte de la narrativa,
- usar ScrollTrigger para sincronizar cambios,
- fijar escenas cuando sea útil,
- animar solamente propiedades relevantes,
- introducir contenido progresivamente,
- cambiar escala, posición, profundidad o enfoque para dirigir la atención,
- permitir pausas visuales entre secuencias intensas.

No hacer que todos los elementos entren desde abajo con el mismo efecto.

Variar el lenguaje de movimiento manteniendo coherencia.

## Animación tipográfica

Los títulos pueden ser protagonistas visuales.

Considerar:

- aparición por palabras,
- aparición por caracteres,
- clipping,
- máscaras,
- cambios de peso en variable fonts,
- tracking animado,
- escalado,
- desplazamiento,
- texto que atraviesa la pantalla,
- texto que se integra con imágenes o figuras.

No sacrificar legibilidad por el efecto.

## Imágenes y multimedia

Usar imágenes como parte de la composición, no solamente dentro de tarjetas rectangulares.

Considerar:

- full bleed,
- recortes mediante máscaras,
- parallax,
- zoom cinematográfico,
- capas,
- superposición con tipografía,
- revelados,
- desplazamiento relativo,
- integración con fondos y geometrías.

Optimizar recursos pesados.

Si faltan imágenes definitivas, construir la composición para que los placeholders puedan reemplazarse fácilmente sin rehacer el layout.

## Figuras y elementos decorativos

Se pueden crear:

- círculos,
- líneas,
- retículas,
- halos,
- ondas,
- blobs,
- mallas,
- gradientes,
- figuras geométricas,
- partículas,
- campos de puntos,
- elementos orbitales,
- líneas conectadas,
- formas abstractas.

Estos elementos deben reforzar la estética del tema y no competir con la información.

## Interacción con cursor

Puede utilizarse para aumentar sensación de profundidad y respuesta.

Ejemplos:

- parallax leve,
- inclinación de elementos,
- spotlight,
- partículas que reaccionan,
- campos magnéticos,
- desplazamiento de capas,
- cursor contextual.

Mantener los movimientos sutiles.

No convertir cada elemento en un objeto que persigue el mouse.

## Presentación en vivo

Diseñar pensando en proyección y exposición oral.

La experiencia debe:

- funcionar correctamente a pantalla completa,
- ser legible a distancia,
- tener contraste suficiente,
- permitir avanzar con scroll o controles claros,
- evitar interacciones que requieran precisión excesiva,
- mantener estable el layout durante la exposición,
- cargar los recursos importantes antes de necesitarlos cuando sea razonable.

Si conviene para el formato, implementar navegación con:

- flechas,
- teclado,
- scroll,
- indicadores de progreso,
- puntos o numeración discreta.

No mostrar controles que rompan la estética si no son necesarios.

## Ritmo visual

No usar intensidad máxima en todas las escenas.

Alternar entre:

- escena de impacto,
- escena limpia,
- explicación,
- dato,
- interacción,
- escena de impacto.

Una animación fuerte funciona mejor cuando el usuario viene de una sección más tranquila.

## Rendimiento

La estética no debe destruir la fluidez.

Priorizar:

- `transform` y `opacity` para animaciones frecuentes,
- lazy loading cuando corresponda,
- imágenes optimizadas,
- modelos 3D razonables,
- texturas comprimidas cuando sea necesario,
- reducción de partículas en dispositivos débiles,
- cleanup correcto de timelines y listeners,
- limitar efectos de blur excesivos,
- evitar múltiples canvases WebGL innecesarios.

Revisar especialmente que el scroll permanezca fluido.

## Accesibilidad y movimiento reducido

Respetar `prefers-reduced-motion`.

Cuando el usuario solicite movimiento reducido:

- eliminar movimientos intensos,
- evitar grandes desplazamientos y zooms,
- mantener la información accesible,
- conservar transiciones simples cuando sea apropiado.

Las animaciones nunca deben ser necesarias para poder leer o comprender el contenido.

## Responsividad

La prioridad puede ser escritorio/proyector si la presentación se utilizará principalmente en exposición, pero no romper completamente en otras resoluciones.

Diseñar primero para la resolución objetivo de presentación y luego crear adaptaciones razonables para pantallas más pequeñas.

En móvil:

- reducir partículas,
- reducir profundidad,
- simplificar animaciones,
- reorganizar composiciones complejas,
- mantener contenido legible.

## Flujo de implementación

Antes de programar:

1. Inspeccionar el proyecto existente.
2. Identificar framework, package manager, estructura y estilos existentes.
3. Entender el tema y dividirlo en escenas narrativas.
4. Definir una dirección visual coherente.
5. Identificar 2 o 3 momentos principales de impacto.
6. Decidir qué tecnología resuelve cada efecto antes de añadir dependencias.

Durante la construcción:

1. Crear primero la estructura completa y navegación.
2. Resolver composición, tipografía y contenido estático.
3. Añadir las animaciones principales con GSAP.
4. Añadir 3D solamente donde mejore la escena.
5. Incorporar microinteracciones.
6. Optimizar rendimiento.
7. Revisar la experiencia completa como una sola narrativa.

No comenzar instalando todas las librerías disponibles.

## Selección de tecnología por efecto

Usar esta guía mental:

- Storytelling, timelines, pinning o scroll complejo → GSAP + ScrollTrigger
- Partículas, modelos, profundidad, shaders o escena 3D → React Three Fiber / Three.js
- Hover, tap o transición local de componente → Motion
- Máscaras, formas, gradientes o efectos visuales simples → CSS
- Continuidad visual entre escenas o rutas → View Transition API
- Ilustración vectorial interactiva compleja → Rive

Elegir la solución más simple que produzca el resultado visual deseado.

## Dirección creativa

Antes de implementar una presentación desde cero, definir internamente:

- concepto visual,
- paleta,
- tipografía,
- escala,
- tipo de movimiento,
- profundidad,
- tratamiento de imágenes,
- geometría recurrente,
- ritmo de escenas.

Ejemplos de posibles direcciones:

- tecnológico futurista,
- editorial premium,
- científico,
- minimalismo cinematográfico,
- cyberpunk controlado,
- espacial,
- glass + depth,
- brutalismo digital,
- interfaz holográfica,
- documental interactivo.

No mezclar estilos incompatibles sin una razón conceptual.

## Comportamientos que deben evitarse

Evitar por defecto:

- apariencia de plantilla genérica,
- exceso de cards,
- navbar empresarial innecesaria,
- footer tradicional,
- emojis como recurso visual principal,
- gradientes aleatorios sin sistema,
- animar absolutamente todo,
- movimientos idénticos en todas las escenas,
- usar partículas solo porque existen,
- efectos 3D que dificulten leer,
- párrafos enormes proyectados,
- uso excesivo de blur,
- scroll hijacking agresivo,
- transiciones lentas que obliguen al expositor a esperar,
- librerías adicionales que duplican capacidades ya disponibles.

## Calidad esperada

Antes de considerar terminada la presentación, comprobar:

- La primera escena genera interés visual.
- La jerarquía tipográfica se entiende inmediatamente.
- Cada escena tiene una función narrativa clara.
- Existe variedad sin perder coherencia.
- Hay al menos uno o dos momentos memorables.
- Las animaciones dirigen la atención correctamente.
- El texto puede leerse desde una pantalla proyectada.
- El scroll o navegación se siente controlado.
- Las partículas y elementos 3D mantienen buen rendimiento.
- La experiencia funciona aunque una animación falle.
- No parece una landing page empresarial genérica.
- No parece un PowerPoint simplemente convertido a HTML.
- El cierre visual conecta con la identidad de la apertura cuando sea posible.

## Criterio final

El objetivo no es demostrar cuántas librerías pueden utilizarse.

El objetivo es que la audiencia recuerde la presentación y que los efectos visuales ayuden al expositor a contar el tema.

Siempre priorizar:

**concepto → composición → narrativa → movimiento → interacción → tecnología.**

Nunca invertir ese orden.
