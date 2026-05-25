---
title: Problemas comunes
description: Diagnóstico rápido de los problemas más frecuentes.
---

## La pantalla no se enciende

1. Comprueba el cable USB-C. Pruébalo con otro dispositivo para verificar
   que entrega corriente.
2. Verifica que el adaptador entrega al menos **5 V / 1 A**.
3. Si el LED rojo de la PCB está encendido pero la pantalla está negra, el
   dispositivo arrancó pero el backlight está al 0 %. Toca la pantalla — si
   reaccionas en standby, era eso.

## "boot:0x1 (DOWNLOAD)" en el log

Significa que **GPIO 0 estaba a LOW al arrancar** — alguien tiene pulsado el
botón BOOT en la trasera (o lo está cortocircuitando algo). Suelta el botón
y resetea.

## No aparece la red `ClaudeWallMonitor-XXXX`

- El SoftAP sólo arranca si la NVS está vacía o si el SSID guardado es
  incorrecto.
- Si ya configuraste el dispositivo antes, ya no estará en modo SoftAP. Para
  forzarlo, entra en [Ajustes → Borrar configuración](/uso/ajustes/).
- Asegúrate de buscar redes Wi-Fi de **2,4 GHz** desde tu móvil/PC; en
  algunos equipos las redes 2,4 GHz quedan ocultas si están conectados a una
  red 5 GHz simultáneamente.

## Conecta a la Wi-Fi pero no aparece en `/wall-monitor:status`

- Comprueba que el ordenador con `cwm-mcp` y el dispositivo están en la
  **misma subred**.
- Verifica el firewall de tu equipo — el broker escucha en `:5734`.
- Comprueba la URL del broker en Ajustes: debe ser
  `http://<ip-de-tu-pc>:5734`, **no** `localhost` ni `127.0.0.1`.

## Los datos están desactualizados

Mira la marca "última sincronización" en el pie del dashboard:

- **< 60 s** — todo normal.
- **60 – 120 s** — un poll falló, se reintentará.
- **> 120 s (reloj naranja)** — varios polls seguidos han fallado. Revisa
  Wi-Fi, firewall y broker.

## El audio no se oye

- El **PA está gateado** por el TCA9554. Si el firmware crashea entre la
  activación del PA y la reproducción, queda silencioso. Reinicia.
- Verifica el volumen en [Ajustes](/uso/ajustes/) — si está a 0, las alertas
  sonoras están desactivadas por diseño.
- Los cuatro botones de prueba de volumen en Ajustes son el método más
  rápido para verificar que el audio funciona.

## La meteo dice algo absurdo

Probablemente la geocoding falló y se está usando una ciudad anterior.
Reescribe el nombre en [Ajustes → Ciudad](/uso/ajustes/) — al guardar, se
borran las coords cacheadas y se vuelve a geocodificar.

## El tema Auto se queda siempre en Noche

Lo más probable es que el RTC no se haya sincronizado vía SNTP. Pasa
después de un corte de luz si la Wi-Fi tarda en volver. Reinicia el
dispositivo cuando la red esté estable.
