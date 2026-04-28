# Vertical Slice 1 — Core Execution Loop

**Fecha**: 2026-04-27
**Objetivo**: Producto end-to-end mínimo y usable. Login real → ver tareas → ejecutar con pomodoro → ganar XP. Probar la espina dorsal del producto con un usuario real (Gaby).

---

## Contexto

El proyecto tiene cimientos sólidos (SvelteKit, Drizzle, better-auth, schema completo, migración generada) pero **todas las páginas están vacías** y la app no hace nada. Llevamos ~10 días parados.

Este slice **NO** persigue el producto final. Persigue una versión funcional ESTRECHA que se pueda usar y testear. Sobre esa espina se construyen los siguientes slices.

---

## Alcance

### Incluido en el slice

- **Login UI** funcional (la action ya existe en `+page.server.ts`, falta el formulario)
- **Logout**: botón visible
- **Bootstrap del `userProfile`**: cada usuario debe tener su fila de `userProfile` con `xp=0, points=0` la primera vez que entra
- **`/dashboard`**:
  - Header chip con XP y Points actuales
  - Input simple para crear tarea (sólo título)
  - Lista de tareas pendientes en cards
  - Tap en una card → navega a `/focus/[taskId]`
- **`/focus/[taskId]`**:
  - Timer pomodoro **fijo 25 min** (countdown client-side)
  - Botón persistente "Completé la tarea"
  - Al terminar el pomodoro: registra `focusSession`, suma **5 XP + 25 Points**, vuelve a `/dashboard`
  - Al tocar "Completé la tarea": marca `task.status = 'completed'`, suma **25 XP + 100 Points**, vuelve a `/dashboard`
- **Stubs**: `/task-list` y `/habits` quedan con un texto "Próximamente"

### Fuera de scope

| Feature | Slice futuro |
|---|---|
| Swipe Tinder / planificación / `dailyPlan` | Slice 2 |
| Habits (CRUD + ejecución) | Slice 3 |
| Goals y subtasks | Slice 4 |
| Avatar tortuga + tienda de items | Slice 5 |
| Achievements / tarjetas coleccionables | Slice 6 |
| Streaks, niveles, multiplicadores | Slice 7 |
| Animación de "encendido" (oscuro→claro) | Slice 2 (junto al swipe) |
| Pomodoro configurable por usuario | Slice futuro |
| Edit / delete de tareas | Slice 2 |
| Notificaciones contextuales | Slice futuro |

---

## Decisiones arquitectónicas

### Pomodoro vive en su propia ruta `/focus/[taskId]`

- **Por qué**: el estado "estoy en foco" es importante y debe sobrevivir un refresh. Una ruta da URL explícita y un `load` que verifica que la task pertenece al usuario.
- **Trade-off**: más archivos que un modal, pero limpio y testeable.

### Una sola pantalla principal (`/dashboard`)

- Sin daily-plan, `/dashboard` y `/task-list` mostrarían lo mismo. Colapsamos en `/dashboard`. `/task-list` queda stub.
- Cuando entre el slice del swipe-Tinder, `/dashboard` se transforma en "ejecución del stack del día" y `/task-list` recupera su rol de gestión.

### XP y Points se otorgan server-side, no client-side

- Toda mutación de `userProfile` ocurre en el server action que también persiste el evento (`focusSession` o `task.status = completed`).
- Razón: client-side es manipulable. Y así una sola transacción cubre el efecto completo.

### Pomodoro corre client-side, completa server-side

- El countdown vive en el componente con `$state` + `setInterval`.
- Cuando llega a 0, dispara una `form action` que persiste el `focusSession` y actualiza el `userProfile`.
- Si el usuario refresca a mitad: el timer se reinicia (limitación aceptable para el slice; cuando le metamos persistencia real del timer es slice futuro).

### `userProfile` se crea on-demand

- Opción elegida: en el `+layout.server.ts` de `(app)`, después de validar `event.locals.user`, asegurar que existe la fila de `userProfile` para ese user. Si no, insertarla.
- Alternativa descartada: hook al registro. Razón: agregaría acoplamiento con better-auth y no aporta nada que no resuelva el patrón on-demand.

---

## Plan en fases

Cada fase es una sesión chica. Terminás una y la app camina más que antes. Después de cada fase, **probá end-to-end** lo que escribiste antes de pasar a la siguiente.

### Fase 1 — Auth termina de funcionar (1-1.5h)

- [ ] **1.1** Construir UI de login en `src/routes/(auth)/login/+page.svelte` (form: email, password; mostrar error de la action; link a `/register`)
- [ ] **1.2** Agregar bootstrap de `userProfile` en `src/routes/(app)/+layout.server.ts` (después del `redirect`, asegurar fila en `user_profile` para el `event.locals.user.id`; si no existe, insert con `xp=0, points=0`)
- [ ] **1.3** Botón "logout" en `src/routes/(app)/+layout.svelte` (form action que llame a `auth.api.signOut` y redirija a `/login`)
- [ ] **Test manual**: registro → login → dashboard (vacío) → logout → login otra vez

### Fase 2 — Dashboard con CRUD mínimo de tasks (1.5-2h)

- [ ] **2.1** Stubs en `/task-list/+page.svelte` y `/habits/+page.svelte` (texto "Próximamente, vuelvo en el siguiente slice")
- [ ] **2.2** `dashboard/+page.server.ts`: `load` que retorna `{ tasks, profile }`. Tasks = todas las del user con `status='pending'`. Profile = la fila de `user_profile` del user.
- [ ] **2.3** `dashboard/+page.server.ts`: `actions.createTask` — recibe `title`, valida no-vacío, inserta task con `userId` del session, `status='pending'`, `priority=1`
- [ ] **2.4** `dashboard/+page.svelte`: header chip mostrando `XP · Points`; form de crear task; lista de cards `<a href="/focus/{task.id}">`
- [ ] **Test manual**: crear 3 tasks, verlas listadas, refrescar y que sigan, tap en una y que vaya a `/focus/[id]` (404 todavía es OK)

### Fase 3 — Focus + XP (2-3h)

- [ ] **3.1** Crear `src/routes/focus/[taskId]/+page.server.ts`: `load` que valida que la task existe y pertenece al user (sino `error(404)`), retorna la task
- [ ] **3.2** Crear `src/routes/focus/[taskId]/+page.svelte`: muestra título de la task, timer countdown 25:00 con `$state` + `setInterval` (cleanup en `$effect.cleanup` o `onDestroy`)
- [ ] **3.3** En el server: `actions.completeFocusSession` — inserta fila en `focus_session` (status='completed', duration=1500, startedAt y completedAt apropiados, taskId y userId), actualiza `userProfile` (`xp += 5`, `points += 25`), redirect a `/dashboard`
- [ ] **3.4** En el server: `actions.completeTask` — actualiza `task.status='completed'`, actualiza `userProfile` (`xp += 25`, `points += 100`), redirect a `/dashboard`
- [ ] **3.5** En el componente: cuando el timer llega a 0, dispara `completeFocusSession` automáticamente. Botón "Completé la tarea" siempre visible que dispara `completeTask`.
- [ ] **Test manual completo**: login → crear task → tap → ver timer → esperar 25 min (o bajar el valor temporalmente para testear) → vuelve a dashboard con XP/Points actualizados → repetir tocando "Completé la tarea" en otra → ver task desaparecer de la lista pendiente

---

## Criterios de hecho

El slice está terminado cuando podés hacer esto sin tocar la base de datos manualmente:

1. Te registrás con un user nuevo
2. Iniciás sesión
3. Creás 3 tasks
4. Tocás una → te lleva al pomodoro
5. Esperás los 25 min (o cancelás con "Completé la tarea")
6. Volvés al dashboard y ves XP + Points incrementados
7. La task que completaste manualmente desapareció de la lista
8. Cerrás sesión y al volver a entrar todo persiste

Si los 8 puntos pasan, **slice 1 cerrado**. Es el momento de mostrarle a Gaby.

---

## Notas para el siguiente slice

Lo que va a doler de este slice (y que vamos a resolver después):

- Timer no persiste si refrescás (slice futuro: guardar `focusSession` con `status='working'` al arrancar y reanudar)
- No hay forma de cancelar un pomodoro sin completar la task (slice futuro: botón cancelar)
- No hay edit/delete de tasks (slice futuro)
- No hay descripción ni prioridad ni goal en la task (slice futuro: edit screen)
