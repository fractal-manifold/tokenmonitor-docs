---
title: Temas y modo día/noche
description: Cómo cambia la paleta del dispositivo según la hora.
---

El Claude Wall Monitor tiene **tres temas**:

- **Día** — fondo claro, contrastes altos, cómodo de leer con luz natural.
- **Noche** — fondo oscuro, luminancia reducida, ideal para dormitorio o
  pasillo de noche.
- **Auto** — cambia automáticamente según el alba y el ocaso de tu ciudad.

Cada proveedor (Claude / Codex / Gemini) mantiene su tono distintivo en
ambos temas — no se sustituye el logo, sólo se ajustan el fondo y los
contrastes.

## Cómo funciona el modo Auto

- El dispositivo consulta a Open-Meteo el `sunrise_unix` y `sunset_unix` de
  tu ciudad una vez al día.
- Entre `sunrise` y `sunset` aplica el tema **Día**, fuera de ese rango
  aplica **Noche**.
- Se aplica una **histéresis de ±90 s** para evitar parpadeos en el filo del
  ocaso/alba.

:::caution
Si el reloj interno del dispositivo no se ha sincronizado todavía vía SNTP
(es decir, marca una fecha anterior a 2020), el modo Auto **cae a Noche**
por defecto. Es una salvaguarda — preferimos pantalla oscura que claro a
medianoche por un reloj mal puesto.
:::

## Cambiar el tema desde Claude Code

Desde Claude Code puedes cambiarlo en remoto sin tocar el dispositivo:

```text
/wall-monitor:theme night
/wall-monitor:theme day
/wall-monitor:theme auto
```

El cambio se encola en el control plane del broker, el dispositivo lo
descubre en su próximo poll de 60 s y aplica el cambio reiniciando.

## Cambiar el tema desde el dispositivo

[Ajustes](/uso/ajustes/) → **Tema** → elige Día / Noche / Auto → Guardar.
El dispositivo reinicia tras confirmar.
