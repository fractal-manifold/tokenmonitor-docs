---
title: Pantalla principal
description: Qué significa cada widget del dashboard.
---

El dashboard es la pantalla que verás el 99 % del tiempo. Está dividida en
**tres columnas**, una por proveedor: Claude, Codex y Gemini.

## Anatomía de una columna

Cada columna muestra, de arriba a abajo:

1. **Logo del proveedor** — paleta y tono adaptados al tema actual.
2. **Sesión activa (5 h)** — porcentaje y barra circular. Es la ventana
   rodante de 5 horas que usan los planes Pro/Max.
3. **Límite semanal** — barra horizontal con el % consumido.
4. **Cuota mensual** — barra horizontal con el % consumido.
5. **Predicción** — un pequeño icono que indica si, al ritmo actual, vas a
   superar el 100 % del límite antes de que cierre la ventana.

## Códigos de color

| Color | Significado |
|-------|-------------|
| Dorado pálido | Uso normal (< 70 %). |
| Dorado saturado | Atención (70 – 90 %). |
| Naranja | Aviso (90 – 100 %). |
| Rojo | Superado (≥ 100 %) o predicción de superarlo. |

El rojo nunca aparece por sorpresa: a partir del 90 % verás también la
barra parpadeando suavemente.

## Cabecera

- **Hora local** — arriba a la izquierda.
- **Temperatura y condición meteorológica** — arriba en el centro. Datos de
  Open-Meteo para tu ciudad.
- **Iconito de batería** — sólo si tu unidad lleva el módulo de batería
  AXP2101. En unidades sin batería aparece `--`.

## Pie

- **Wi-Fi RSSI** — barras de calidad de señal.
- **Última sincronización con el broker** — segundos desde el último poll
  válido. Si supera 120 s, el reloj se vuelve naranja.

## Toques útiles

- **Toque corto** sobre cualquier columna → la amplía a pantalla completa
  con histórico de las últimas 24 h (próxima versión).
- **Toque largo sobre la mascota / logo central** → abre [Ajustes](/uso/ajustes/).
- **Cualquier toque tras 20 min sin actividad** → saca al dispositivo del
  modo standby.
