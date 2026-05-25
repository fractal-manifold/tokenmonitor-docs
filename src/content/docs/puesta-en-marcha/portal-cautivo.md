---
title: Portal cautivo
description: Qué pide el formulario inicial y por qué.
---

El portal cautivo es el formulario que aparece la primera vez que el
dispositivo se enciende sin configuración. Lo verás en `http://192.168.4.1`
tras conectarte a la red `ClaudeWallMonitor-XXXX`.

## Campos del formulario

| Campo | Para qué sirve |
|-------|----------------|
| **SSID** | Nombre de tu red Wi-Fi (2,4 GHz). |
| **Contraseña Wi-Fi** | La de esa red. Se almacena cifrada en la NVS interna. |
| **URL del broker** | Dirección del broker MCP que servirá los datos de uso. Habitualmente `http://<ip-de-tu-pc>:5734`. |
| **Passphrase** | Frase secreta — el dispositivo deriva una PSK de 32 bytes con SHA-256 a partir de ella. Mismo valor en el broker. |
| **Ciudad** | Para meteo y para saber día/noche. P. ej. `Madrid` o `Berlin`. |

:::tip
La **passphrase no se prerrellena** en el formulario aunque vuelvas a
abrirlo. Es una decisión deliberada — el SoftAP es abierto y prerellenar el
secreto sería filtrarlo.
:::

## ¿Qué pasa al pulsar "Guardar"?

1. El dispositivo guarda los valores en NVS (memoria no volátil).
2. Deriva la **PSK** a partir de la passphrase con `SHA-256(passphrase)`.
3. Cierra el SoftAP y reinicia.
4. Al rearrancar se conecta a tu Wi-Fi y empieza a hablar con el broker.

## Si no aparece el portal automáticamente

- Asegúrate de estar conectado a `ClaudeWallMonitor-XXXX` y NO a tu Wi-Fi
  habitual.
- Abre cualquier URL `http://` (no `https://`) — el portal cautivo intercepta
  HTTP, no HTTPS.
- Si nada funciona, escribe a mano `http://192.168.4.1` en el navegador.

## Cambiar la configuración más tarde

Una vez configurado, no hace falta volver al portal cautivo: todos los
campos son editables desde la [pantalla de Ajustes](/uso/ajustes/) del
propio dispositivo.
