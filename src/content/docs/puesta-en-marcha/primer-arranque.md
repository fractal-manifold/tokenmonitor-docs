---
title: Primer arranque
description: Qué ocurre la primera vez que enchufas el Claude Wall Monitor.
---

La primera vez que enchufas el dispositivo no tiene Wi-Fi ni broker
configurado. Sigue esta secuencia:

## 1. Conéctalo a la corriente

Usa el cable USB-C incluido. En unos 4–5 segundos verás el logo de bienvenida
seguido de la pantalla **"Esperando configuración"**.

## 2. El dispositivo crea su propia red Wi-Fi

Aparecerá una red Wi-Fi llamada `ClaudeWallMonitor-XXXX` (las cuatro letras
son únicas para tu unidad). Conéctate a ella desde el móvil o el ordenador.

:::caution
Esta red es **abierta** (sin contraseña). Es normal — la ventana de
configuración es corta y la passphrase la introduces tú dentro del
formulario, no se transmite en claro por el SSID.
:::

## 3. Se abre el portal cautivo

En cuanto te conectes, el móvil/ordenador abrirá automáticamente el
**portal cautivo** en `http://192.168.4.1`. Si no se abre solo, escribe
esa URL en el navegador.

A partir de aquí, sigue las instrucciones en [Portal cautivo](/puesta-en-marcha/portal-cautivo/).

## 4. Tras enviar el formulario

El dispositivo reinicia, se conecta a tu red Wi-Fi de casa y, si todavía no
le has asignado un broker, mostrará la pantalla **BOOT_NEEDS_CONFIG** con su
**IP** y un **código de 6 dígitos** en grande.

Continúa en [Emparejar con Claude Code](/puesta-en-marcha/claude-code/).

## ¿Y si quiero empezar de cero?

Mantén pulsado el ratón / la cara de Claude durante 10 s en la pantalla de
ajustes y elige **"Borrar configuración"**. El dispositivo volverá al estado
de primer arranque.
