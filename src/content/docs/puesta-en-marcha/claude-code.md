---
title: Emparejar con Claude Code
description: Cómo enlazar el dispositivo con tu instancia de Claude Code vía MCP.
---

El Claude Wall Monitor no habla con la API de Claude directamente. Habla con
un **broker MCP** local — un proceso que corre en tu ordenador, ve tu uso de
Claude Code / Codex / Gemini y se lo publica al dispositivo.

## Requisitos

- [Claude Code](https://claude.com/claude-code) instalado.
- El plugin **claude-wall-monitor** activo (incluye el broker `cwm-mcp`).
- El dispositivo en estado `BOOT_NEEDS_CONFIG` (pantalla con IP + código de 6 dígitos).

## Pasos

### 1. Abre Claude Code

Cualquier proyecto. El broker corre por usuario, no por proyecto.

### 2. Ejecuta el skill de configuración

```text
/wall-monitor:configure
```

Claude descubrirá el dispositivo en tu red local (mDNS `_cwm._tcp.local.`)
y te preguntará por el **código de 6 dígitos** que aparece en su pantalla.

### 3. Introduce el código

Es el número que ves en la pantalla del dispositivo en ese momento. Cambia
en cada arranque y nunca se publica por mDNS — la única forma de leerlo es
físicamente, desde la pantalla.

:::tip
Si no ves el código, comprueba que el dispositivo está en
`BOOT_NEEDS_CONFIG`. Si ya estaba configurado y ha entrado en el dashboard,
vuelve a [Primer arranque > "¿Y si quiero empezar de cero?"](/puesta-en-marcha/primer-arranque/).
:::

### 4. Claude empuja la configuración

Tras validar el código, Claude le envía la URL del broker (`http://<tu-ip>:5734`)
y una PSK auto-generada. El dispositivo reinicia y, en menos de 30 s,
empieza a mostrar tu uso real.

## Verificar que todo va bien

Desde Claude Code:

```text
/wall-monitor:status
```

Deberías ver tu dispositivo listado como **online**, con la hora del último
poll < 60 s.

## Cambiar el dispositivo de broker / equipo

Lanza `/wall-monitor:configure` de nuevo desde el ordenador nuevo. El
dispositivo aceptará la nueva configuración como **candidata** y la promoverá
sólo si pasa tres pruebas de conexión en 5 minutos. Si falla, vuelve
automáticamente al broker anterior — no te quedas sin servicio.
