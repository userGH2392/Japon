# Ryukyu — app del viaje

Web app instalable (PWA) para iOS. Sin backend: todo vive en el móvil de cada uno.

## Archivos
```
index.html              La app entera (diseño, datos y lógica)
manifest.webmanifest    Nombre, icono y arranque en pantalla completa
sw.js                   Guarda todo en caché para el modo avión
iconos/                 Iconos de la pantalla de inicio
```

## Cómo probarla
Súbelo tal cual a GitHub Pages (o cualquier hosting con https). Hace falta https
para que funcionen la instalación y el modo sin conexión.

En el iPhone: abrir la dirección en **Safari** → Compartir → **Añadir a pantalla
de inicio**. Desde ese momento se abre sin barra de navegador y funciona en
modo avión.

## Dónde se editan los datos
Todo está en `index.html`, dentro del bloque marcado
`▓▓▓ DATOS DEL VIAJE — EDITA SOLO DENTRO DE ESTE BLOQUE ▓▓▓`.

Reglas para no romper nada:

- **Los `id` no se cambian nunca** una vez publicados. De ellos cuelga lo que
  cada uno ha marcado en su móvil: maleta, respuestas del quiz, opciones elegidas.
- Todo campo es opcional salvo `id`, `fecha` y `diaNum`. Si falta algo, la app
  oculta esa parte en vez de fallar.
- Las horas van en ISO con huso explícito: `+09:00` Japón, `+08:00` Shanghái,
  `+01:00` Madrid.
- Al cambiar algo, sube `VERSION` una unidad.

### Añadir un día
Copia un objeto de `DIAS`, cambia `id`, `fecha`, `diaNum` y `titular`, y quita
`porPlanificar:true`. Si el día pertenece a un tramo nuevo, añádelo a `TRAMOS`.

### Añadir un sitio de comer
Añade un objeto a `SITIOS`. `cierra` son los días que NO abre, con 0 = domingo.
La app cruza ese dato con la fecha del día y avisa en rojo si cae en cierre.

### Estados de un bloque
| valor | significado | color |
|---|---|---|
| `confirmado` | reservado y pagado | verde jade |
| `pendiente` | falta reservarlo | ámbar |
| `sinDecidir` | hay opciones sin elegir | coral |

## Sincronización
`SYNC_URL` está vacío. Cuando cuelgues un `datos.json` en una dirección fija,
ponla ahí y el botón «Sincronizar» de Preparativos se activa. Sin dirección,
la app usa siempre la copia empaquetada.

## El icono en el iPhone
Si al añadir a pantalla de inicio sale una letra en vez de la bandera, es que
el archivo `iconos/icono-180.png` no está accesible: **hay que subir la carpeta
`iconos/` entera junto al index.html**, con la misma estructura. iOS lee el
icono de la etiqueta `apple-touch-icon` en el momento de añadirlo; si ya lo
añadiste con la letra, bórralo de la pantalla de inicio y vuélvelo a añadir.

## Seguridad
- La página lleva una Content-Security-Policy que solo permite conectar con
  Open-Meteo (el tiempo). **Si activas `SYNC_URL`, añade su dominio a la línea
  `connect-src` de la CSP en el `<head>`**, o el navegador bloqueará la bajada.
- Solo se abren enlaces `https`. El motor corre en modo estricto y no expone
  nada global.

## Cosas que hay que saber
- El calendario `.ics` es el canal de avisos, no las notificaciones push: las
  alarmas del calendario saltan en modo avión y las push no.
- Los enlaces de mapas apuntan a **Apple Maps** por coordenadas, para que abran
  la app nativa y funcionen con mapas descargados sin datos.
- El FamilyMart de Eef Beach **no es 24 h**: abre de 07:00 a 23:00. El itinerario
  original decía otra cosa.
