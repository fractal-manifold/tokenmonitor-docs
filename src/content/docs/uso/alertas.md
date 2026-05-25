---
title: Alertas
description: Cuándo te avisa el dispositivo y cómo.
---

El dispositivo dispara **cuatro tipos de alerta**, cada una con una señal
visual y una señal sonora distintas. Todas tienen **histéresis** — una vez
disparadas no se vuelven a lanzar hasta que la condición se ha resuelto.

## 1. Batería baja (< 20 %)

- **Visual** — la etiqueta de batería en rojo.
- **Sonora** — un chirp breve.
- Sólo aplica a unidades con módulo de batería.

## 2. Batería crítica (< 10 %)

- **Visual** — icono y etiqueta parpadeando.
- **Sonora** — doble pitido descendente.
- **Es la única alerta que también suena en modo standby** — para que no
  se quede sin batería sin avisar.

## 3. Predicción de límite

Si, al ritmo actual, alguno de los límites (5 h, semanal, mensual) va a
superar el 100 % antes de cerrar su ventana:

- **Visual** — la barra correspondiente se vuelve roja y parpadea.
- **Sonora** — triple chirp.

## 4. Cierre de la ventana de 5 h

Cuando arranca una nueva ventana rodante de 5 horas (es decir, una sesión
anterior expira):

- **Visual** — destello breve en la columna del proveedor.
- **Sonora** — arpegio ascendente en Do mayor.

## Hardware

El audio sale por el códec **ES8311** sobre I²S0 (MCLK=5, BCLK=16, LRCK=7,
DOUT=6). El amplificador clase D se activa por el pin 3 del expansor TCA9554
sólo durante la reproducción — así no se oye ruido de fondo cuando no hay
nada que sonar.

## Silenciar todo

Pon el **volumen a 0** desde [Ajustes](/uso/ajustes/). Las alertas visuales
se mantienen, las sonoras quedan deshabilitadas — incluida la de batería
crítica en standby.
