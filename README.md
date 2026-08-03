# 📋 Portapapeles

**Simulacro interactivo sobre el uso seguro de la inteligencia artificial en el trabajo.**

No es un curso sobre lo que no se puede hacer. Es un ejercicio práctico donde el participante trabaja con documentos reales y decide, tocando el propio texto, qué sale de la empresa y qué se queda. Después revisa lo que la IA le ha devuelto y marca lo que hay que comprobar antes de firmarlo.

Un único archivo HTML. Sin instalación, sin servidor y **sin recoger ningún dato**.

[![Validar contenido](https://github.com/mr7security/portapapeles/actions/workflows/validate.yml/badge.svg)](https://github.com/mr7security/portapapeles/actions/workflows/validate.yml)
![HTML5](https://img.shields.io/badge/HTML5-un%20solo%20archivo-e34f26)
![Sin dependencias](https://img.shields.io/badge/dependencias-0-1d6b5f)
![Licencia](https://img.shields.io/badge/licencia-MIT-15803d)

> **▶ Pruébalo aquí: [mr7security.github.io/portapapeles](https://mr7security.github.io/portapapeles/)**
> Se abre y se juega. Nada que instalar.

---

## Por qué existe

Las organizaciones han reaccionado al uso de la IA de dos maneras, y las dos fallan. Unas la prohíben, con lo que la gente la usa igual desde el móvil y sin contarlo. Otras no dicen nada, con lo que acaba habiendo currículums de candidatos, contratos de clientes y listados de nóminas pegados en herramientas gratuitas cuyas condiciones dicen, en el apartado octavo, que usarán lo que subas.

Este simulacro parte de otra premisa: **el objetivo no es que la plantilla deje de usar la IA, sino que la use sin regalar información ni firmar como propio algo que se ha inventado**. Por eso el ejercicio penaliza las dos cosas: dejar salir un dato personal y taparlo todo por precaución. Quien tapa el documento entero no ha aprendido nada, solo ha inutilizado la herramienta.

---

## Encaje normativo

El **artículo 4 del Reglamento europeo de IA** obliga desde el 2 de febrero de 2025 a que las organizaciones garanticen un nivel suficiente de alfabetización en IA de su personal. No prescribe formato ni certificación: es una obligación de resultado, proporcional al puesto y al riesgo. La supervisión de esta obligación comenzó el **2 de agosto de 2026**.

Conviene decirlo con precisión, porque circula bastante exageración: **el artículo 4 no lleva sanciones económicas directas asociadas**. Su valor real es otro. Ante una inspección, un incidente o un cliente que pregunta, poder demostrar que la plantilla ha recibido formación práctica y documentada sobre el uso de la IA vale bastante más que una política que nadie ha leído.

Este simulacro cubre la parte de uso cotidiano: qué se entrega a un sistema de IA, cómo se valora lo que devuelve y qué herramienta es aceptable. No cubre las obligaciones de proveedor ni la clasificación de sistemas de alto riesgo.

---

## Qué contiene

**6 documentos**, **4 respuestas de IA** y **4 situaciones**. Cada sesión sortea 4 documentos y 3 respuestas, de forma que el simulacro se puede repetir sin que nadie memorice las soluciones.

### Módulo 1 · Antes de pegar

Un laboratorio de redacción. Recibes un documento de trabajo y una tarea concreta —resumir una queja, traducir un aviso, explicar una cláusula— y decides **tocando el texto** qué tapas antes de enviarlo.

Lo que hace distinto a este módulo:

- **Pasarse tapando también puntúa mal.** Si ocultas el problema del cliente, la IA no puede redactar la respuesta. El ejercicio mide la precisión en las dos direcciones: lo que se escapa y lo que sobra.
- **A veces la respuesta correcta es no usar la IA.** Uno de los documentos es un listado de nóminas: no hay forma de taparlo bien, porque la pregunta previa a «¿qué oculto?» es «¿esta tarea necesita una IA?». Hay un botón para decirlo.
- **Uno de los documentos no tiene nada que tapar.** Enviarlo entero es lo correcto, y reconocerlo forma parte del aprendizaje.
- Al resolver, el texto se pinta: verde lo acertado, rojo lo que se escapó, ámbar lo que sobraba, cada fragmento con su explicación.

Vectores cubiertos: datos de clientes, currículums de candidatos, información retributiva de compañeros, credenciales y direcciones internas, condiciones económicas de contratos.

### Módulo 2 · Antes de usar

La IA ya ha respondido y el texto está bien escrito, que es exactamente el problema: suena tan profesional que invita a enviarlo tal cual. El participante marca las afirmaciones que hay que comprobar antes de dar la respuesta por buena.

Los errores son de tipos distintos a propósito: una norma citada con número de artículo, un plazo legal comprometido por escrito, una promesa absoluta, una cláusula que el contrato no contiene y una cifra atribuida a un informe que no existe. **Una de las respuestas es correcta entera**, y reconocerlo puntúa igual que detectar un error.

### Módulo 3 · La herramienta correcta

Cuatro decisiones cotidianas: la extensión de navegador que pide leer todos los sitios web que visites, la web gratuita cuyas condiciones ceden el uso de lo que subas, la cuenta personal a las ocho de la tarde porque la corporativa va lenta, y quién responde de un informe redactado con IA.

### Informe final

Resultado global, desglose por cinco competencias, siete logros, cobertura de categorías de riesgo y un plan de mejora redactado a partir de los errores concretos. Se guarda en PDF desde el navegador; no se envía a ninguna parte.

---

## El detalle técnico del que estoy contento

Los módulos 1 y 2 **comparten el mismo motor**. El componente descompone un texto en segmentos tocables y puntúa aciertos, escapes y excesos; lo único que cambia entre módulos es la etiqueta de la acción y el color. Tapar información sensible y marcar afirmaciones dudosas son, estructuralmente, el mismo ejercicio: separar lo que importa de lo que no dentro de un texto.

El sorteo tampoco es aleatorio del todo. Garantiza que en cada partida entre el documento que no debe ir a la IA y el que no tiene nada que tapar, porque sin ese contraste el simulacro enseñaría solo la mitad de la lección. El validador comprueba que el banco siempre tenga material para cumplir esa garantía.

---

## Personalización

Todo lo adaptable está en un único bloque, al principio del `<script>`:

```js
const CONFIG = {
  empresa:  "Tu empresa",
  logoUrl:  "",                 // ruta a un PNG/SVG; vacío = logotipo generado
  color:    "#1d6b5f",          // color corporativo principal
  colorOsc: "#14524a",
  contacto: "la extensión 300", // buzón o extensión para consultas sobre IA
  asunto:   "Consulta sobre uso de IA",
  herramienta: "el asistente corporativo"
};
```

Si `contacto` es una dirección de correo se convierte en un enlace `mailto:` con el asunto puesto. El color se propaga a la interfaz y a la ilustración de portada, que usa `currentColor`.

Las empresas, personas y documentos del simulacro son ficticios **a propósito**: así ningún participante confunde un ejercicio con un documento real y el material se puede compartir sin revisar nada.

---

## Uso

Abre `index.html` con cualquier navegador. Funciona sin conexión y desde una carpeta compartida.

| Parámetro | Efecto |
|---|---|
| `?seed=loquesea` | Sorteo reproducible: todos los participantes reciben la misma tanda. |
| `?all=1` | Recorre el banco completo: los 6 documentos y las 4 respuestas. |

Para una sesión conjunta, reparte `index.html?seed=septiembre2026` y los resultados son comparables. Proyectado funciona muy bien: se lee el documento en voz alta y se vota qué tapar antes de revelarlo.

Duración orientativa: 22–30 minutos los tres módulos.

---

## Privacidad

- **No hay backend.** El archivo no realiza ninguna petición de red, y la CI lo comprueba en cada cambio.
- **No se almacena nada.** Ni cookies, ni `localStorage`, ni `sessionStorage`.
- **Nadie ve los resultados.** No existe consola de administración: el único informe es el que ve el participante en su pantalla.

La portada se lo dice al participante de forma explícita, porque quien sospecha que le están puntuando responde lo que cree que debe responder, y entonces el ejercicio deja de medir nada.

---

## Accesibilidad

- Los segmentos del texto son controles reales: alcanzables con el tabulador, activables con `Intro` o espacio y con `aria-pressed` para comunicar si están tapados.
- Regiones `aria-live` para veredictos y avisos, enlace de salto al contenido, foco visible y soporte de `forced-colors`.
- `prefers-reduced-motion` desactiva las animaciones.
- Contraste alto sobre fondo claro, sin texto por debajo de 11 px.

---

## Validación y CI

`tools/validate.mjs` extrae el bloque de datos del HTML y comprueba en cada push:

- **Segmentos:** que cada fragmento sensible lleve una explicación con sustancia, y que ningún ejercicio se pueda resolver tapándolo todo.
- **Contraste pedagógico:** que el banco tenga siempre un documento que no debe ir a la IA, otro sin nada que tapar y una respuesta de IA correcta entera. Sin ellos, el sorteo produciría partidas que enseñan a medias.
- **Situaciones:** opciones suficientes, al menos un camino correcto y coherencia entre la puntuación y la etiqueta.
- **Riesgos:** que las categorías existan, que todo contenido sensible esté mapeado y que no sobren entradas.
- **Logros:** que cada uno se conceda realmente en el código.
- **Promesas del proyecto:** ausencia de `fetch`, almacenamiento, cookies y recursos externos, más las comprobaciones de accesibilidad y del bloque `CONFIG`.

```bash
node tools/validate.mjs
```

Si editas el contenido, no borres los marcadores `@DATA:START` / `@DATA:END`.

---

## Aviso ético

Material exclusivamente educativo y defensivo. Los documentos, empresas, clientes y candidatos son ficticios. No contiene datos reales de ninguna organización ni técnicas ofensivas.

---

## Proyectos relacionados

- **[Phantom Desk](https://github.com/mr7security/phantom-desk)** — simulador de phishing, ingeniería social y fraude del CEO, con el mismo enfoque de decidir y ver la consecuencia.

---

## Licencia

MIT. Úsalo, modifícalo y despliégalo en tu organización libremente.
