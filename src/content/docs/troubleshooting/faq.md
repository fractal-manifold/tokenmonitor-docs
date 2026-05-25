---
title: Preguntas frecuentes
description: Las preguntas que aparecen siempre.
---

## ¿Necesito una cuenta de Anthropic / OpenAI / Google?

Sí — el dispositivo no consume API por sí mismo, sólo **muestra** el uso que
tú haces desde tu equipo con Claude Code, Codex y/o Gemini. El broker lee
los datos de uso de tu sesión local, no llama a las APIs.

## ¿Dónde se guarda mi passphrase?

En la NVS del dispositivo y en el broker, en ambos casos cifrada en reposo y
**nunca** transmitida en claro por la red. La PSK derivada de ella se usa
para HMAC + AES-CTR en el canal con el broker.

## ¿Funciona sin internet?

Necesita internet para:

- Sincronizar la hora vía SNTP.
- Consultar meteo y datos día/noche a Open-Meteo.

No necesita internet para hablar con el broker — ese tráfico es 100 % LAN.

## ¿Puedo usar varios dispositivos en la misma casa?

Sí. Cada dispositivo se registra con un `device_id` propio (8 hex
generados al primer arranque) y un hostname mDNS único `cwm-<device_id>`.
El broker mantiene una entrada por dispositivo bajo
`~/.config/claude-wall-monitor/devices/<device_id>.toml`.

## ¿Puedo poner un dispositivo en casa y otro en la oficina?

Sí, cada uno apunta a su propio broker. Si ambos brokers son tu mismo
equipo, basta con que cada dispositivo tenga la URL que toque (LAN local /
VPN / túnel).

## ¿La pantalla siempre encendida desgasta el panel?

El dispositivo entra en **standby** tras 20 minutos sin cambios — el
backlight pasa a 0 %, el panel queda en negro. Cualquier toque lo despierta.
Para una unidad montada en pared con poco tránsito, esto evita la mayor
parte del envejecimiento.

## ¿Puedo cambiar el firmware?

El firmware es **propietario** y vive en el repo privado del proyecto. El
manual que estás leyendo es lo único público.

## ¿Por qué no se pueden ver datos históricos?

Es un panel en vivo, no un dashboard de analítica. Si necesitas histórico
detallado, los logs del broker (`cwm-mcp`) sí lo guardan y puedes
consultarlos desde Claude Code.

## ¿Funciona con Wi-Fi de 5 GHz?

No. El ESP32-S3 sólo soporta **Wi-Fi 2,4 GHz**. Si tu router emite ambas
bandas con SSIDs separados, conéctate al de 2,4 GHz; si emite ambas con el
mismo SSID, el dispositivo se conectará a 2,4 GHz automáticamente.
