---
title: Ajustes
description: Cómo cambiar la configuración del dispositivo después de la primera puesta en marcha.
---

A la pantalla de ajustes se llega con un **toque largo (1 s) sobre la mascota
central** del dashboard.

## Qué se puede editar

| Campo | Aplica al... | Reinicia el dispositivo |
|-------|--------------|-------------------------|
| Ciudad | Próximo ciclo de meteo (~5 min) | No |
| SSID | Reinicio | Sí |
| Contraseña Wi-Fi | Reinicio | Sí |
| URL del broker | Reinicio | Sí |
| Passphrase (PSK) | Reinicio | Sí |
| Brillo de día | Instantáneo | No |
| Brillo de noche | Instantáneo | No |
| Volumen de alertas | Instantáneo | No |
| Tema (Día/Noche/Auto) | Próxima sincronización con el broker | Sí |
| Proveedores activos (Claude / Codex / Gemini) | Próxima sincronización | Sí |
| Rotación automática | Próxima sincronización | Sí |

## Brillo

Dos sliders separados — uno para día, otro para noche. El cambio se ve en
tiempo real mientras arrastras. El rango útil es:

- **Día**: 10 – 100 %.
- **Noche**: 5 – 100 %.

:::caution
El backlight del Smart 86 Box es **PNP invertido**: a nivel hardware, 100 %
de brillo es 0 % de duty cycle. El firmware ya hace la inversión, así que el
slider funciona como esperarías.
:::

## Volumen

Slider de 0 a 100 %. Cuatro botones de prueba — uno por tipo de alerta —
te dejan oír cada sonido al volumen actual sin esperar a que se dispare.

## Tema

Tres opciones:

- **Día** — paleta clara, contraste alto.
- **Noche** — paleta oscura.
- **Auto** — Día entre el alba y el ocaso de tu ciudad (datos de Open-Meteo);
  Noche el resto del tiempo. Con histéresis de ±90 s para evitar parpadeos.

Si el RTC del dispositivo no se ha sincronizado todavía (reloj < año 2020),
el modo Auto cae a Noche por seguridad.

## Borrar configuración

Botón al final de la lista. Confirma dos veces; al hacerlo, la NVS se borra
y el dispositivo vuelve al estado de primer arranque.
