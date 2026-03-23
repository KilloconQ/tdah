# TDAH App — Agent Instructions

## Project

App enfocada en personas con TDAH para facilitar el cumplimiento de tareas. El objetivo es reducir la fricción cognitiva, ayudar a priorizar, y mantener el foco sin abrumar al usuario.

## Stack

- **Language**: TypeScript
- **Framework**: SvelteKit
- **Package Manager**: bun
- **Add-ons**: prettier, eslint, vitest, tailwindcss, drizzle, mcp, better-auth

## Modo de Trabajo — CRÍTICO

**El agente NO escribe código.** Actúa exclusivamente como profesor, guía y arquitecto senior.

### Reglas de comportamiento

1. **Nunca generar código fuente** — ni componentes, ni funciones, ni schemas, ni configs. Cero.
2. **Explicar conceptos ANTES** que el usuario toque el teclado. El usuario debe entender QUÉ va a hacer y POR QUÉ.
3. **Guiar con preguntas** — si el usuario pide hacer algo sin entender el porqué, preguntar primero.
4. **Revisar el código del usuario** — leerlo, señalar problemas, explicar por qué están mal y cómo pensar la solución. No reescribirlo.
5. **Validar decisiones** — cuando el usuario proponga una arquitectura o enfoque, analizar los trade-offs antes de aprobar.
6. **Enseñar patrones** — nombrar los patrones cuando aparecen (Container/Presenter, Store pattern, etc.) para que el usuario los internalice.

### Flujo de trabajo esperado

```
Usuario pregunta / propone → Agente explica concepto + guía → Usuario escribe código → Agente revisa → Usuario corrige → repeat

El agente puede poner ejemplos de código pero no escribirlo
```

---

## Producto

### Nombre

**Turtle Driven Action Habits (TDAH)** — las siglas son un guiño directo a TDAH. "Driven by the turtle" — impulsado por la tortuga, a tu ritmo pero siempre en acción.

### Visión

"Te ayuda a empezar una tarea que llevas posponiendo." No es Habitica, no es un RPG. Es tu vida.

**Foco**: ejecución, no organización. Las personas con TDAH pueden ser buenas organizando pero tienen parálisis de inicio.

### Principios de diseño

- La app NO puede ser otra fuente de presión (sin rachas agresivas, sin listas intimidantes)
- Logros pequeños = dopamina = motivación para continuar
- Ritual de inicio es parte del flujo
- Sesiones cortas de foco (pomodoro, duración configurable por usuario)

### Modelo de dominio

```
Goal (meta grande - "aprender inglés")
└── Task (tarea con fin definido)
    ├── Subtask (para tareas largas)
    │   └── FocusSession (pomodoro)
    └── FocusSession (pomodoro)

Habit (recurrente - se ejecuta hoy, vuelve mañana)
Reward (premio definido por el usuario, cuesta Points)
AvatarItem (item cosmético para el muñeco, cuesta Points)
Achievement (logro desbloqueado por condiciones, como en un juego real)
```

### Flujo principal del usuario

**Momento 1 — Planificación** (al arrancar el día)

- El usuario ve sus tareas/hábitos pendientes una por una (estilo Tinder/swipe)
- Swipe ✓ → va al stack del día
- Swipe → → descartada para hoy
- Las tareas incompletas del día anterior aparecen marcadas en rojo como recordatorio
- Si no las seleccionás para el nuevo día → desaparecen sin culpa

**Momento 2 — Ejecución** (el resto del día)

- Pantalla principal muestra la primera tarea del stack
- Al seleccionarla: animación de "encendido" (pantalla que prende, transición oscuro→claro)
- Arranca el pomodoro (duración configurable por el usuario)
- Al terminar el pomodoro: opción de seguir si está en flow
- Si sigue sin parar: aviso no invasivo ("llevas 90 min sin parar, cuando quieras tomá un descanso")
- Las otras tareas del stack quedan en cola visible

**Notificaciones contextuales**

- Durante el día, recordatorios inteligentes para el stack: "¿Tenés un momento para [tarea]?"
- No son recordatorios genéricos de horario fijo

**Bonus de día completo**

- Si completa todo el stack del día → XP extra como bonus

### Sistema de XP y Points

```
XP      → sube al completar acciones, define el nivel del usuario, NUNCA se gasta
Points  → se ganan junto con el XP, se gastan en la tienda
```

**Fuentes de XP + Points:**

- Completar FocusSession → XP pequeño + Points pequeños
- Completar Subtask → XP medio + Points medios
- Ejecutar Habit hoy → XP medio + Points medios
- Completar Task → XP grande + Points grandes
- Completar todo el día → bonus XP + bonus Points

**Gasto de Points — dos destinos:**

- Rewards personales (definidos por el usuario: "ver Netflix 30 min", "comer algo rico")
- Items para el muñeco (cosméticos: ropa, accesorios, skins)

**Comprar cualquier cosa:** Points bajan, XP no se toca.

### Muñeco / Avatar

- **Es una tortuga** — personaje fijo prediseñado, siempre el mismo
- Presente en todas las pantallas de la app como mascota/compañero
- La personalización viene de **items equipables** (ropa, accesorios, sombreros) comprados con Points
- Técnicamente: capas de imágenes (SVG o PNG) apiladas sobre el personaje base
- No hay configurador de creación — la tortuga ya existe, solo la decorás
- Protagoniza las tarjetas de logros en distintas situaciones/poses

### Sistema de XP y Points — detalle

```
Completar tarea/hábito  → XP + Points (fuente principal)
Rachas                  → boost/multiplicador de XP
Subir de nivel          → Points como bonus (menor que completar tareas)
```

Los niveles son **puramente narrativos** — no desbloquean funciones ni items. Solo representan el historial acumulado del usuario. Satisfacción pura.

### Logros / Tarjetas coleccionables

- Organizados en **series temáticas** (ej: "Semana de Foco", "Racha de Hábitos", "Madrugadora")
- Cada tarjeta tiene un **contador de progreso** (ej: 1/4, 0/3)
- Las no desbloqueadas aparecen apagadas/desaturadas
- El **muñeco del usuario protagoniza cada tarjeta** en distintas situaciones
- Son **puramente coleccionables** — no dan Points ni XP al desbloquearlas
- Referencia visual: app Fito (tarjetas coleccionables con oso protagonista)

### Escalas de XP y Points

```
XP      → unidades y decenas   (ej: 1, 5, 10, 25)
Points  → decenas y centenas   (ej: 10, 50, 100, 250)
```

No son 1:1. Son monedas con escalas distintas.

**Referencia de precios:**

- Item simple (gorro para la tortuga) → ~200 Points

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
