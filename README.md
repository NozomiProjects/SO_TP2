# 📚 Guía de Estudio y TP N° 2: Administración de Procesos, Hilos y Planificación de CPU
### Cátedra: Teoría de Sistemas Operativos (TSO) — Ciclo Lectivo 2026
**Universidad Nacional de Jujuy (UNJu) — Facultad de Ingeniería**  
**Docente Responsable:** Ing. María Fernanda Vázquez  
**Jefatura de Trabajos Prácticos:** Ing. Fabio D. Argañaraz  

---

## 🎯 Objetivos de Aprendizaje
1. Comprender la estructura y **organización de la memoria de un proceso** en sus cuatro segmentos fundamentales: Código (*Text*), Datos (*Data/BSS*), Memoria Dinámica (*Heap*) y Pila de Ejecución (*Stack*).
2. Distinguir rigurosamente entre un **Programa** (entidad pasiva en almacenamiento secundario) y un **Proceso** (entidad activa en ejecución con PID, contexto y recursos).
3. Analizar la evolución y limitaciones de los **Modelos de Estados**: desde el modelo elemental de 2 estados hasta los modelos de 3 y 5 estados.
4. Explorar de forma interactiva el **Modelo de 7 Estados**, comprendiendo el rol del almacenamiento secundario (*Swapping*) y las transiciones entre estados activos e inactivos (*Listo Suspendido* y *Bloqueado Suspendido*).
5. Describir la anatomía del **Bloque de Control de Procesos (BCP / PCB)**, su rol en el **Cambio de Contexto** (*Context Switch*) y su diferenciación con el Bloque de Control del Sistema (BCS).
6. Analizar las operaciones esenciales de procesos en sistemas POSIX: duplicación mediante `fork()`, mutación de imagen mediante `exec()`, y la gestión de fenómenos anómalos como procesos **Zombies** y procesos **Huérfanos** adoptados por `init`/`systemd`.
7. Comparar la arquitectura de **Hilos de Ejecución (*Threads / LWP*) vs. Procesos**, identificando recursos compartidos y recursos privados exclusivos de cada hilo.
8. Examinar los mecanismos de **Comunicación entre Procesos (IPC)**: Memoria Compartida (*Shared Memory*) vs. Paso de Mensajes (*Pipes*, *FIFOs*, *Sockets*), evaluando su rendimiento y requerimientos de sincronización.
9. Diferenciar los tres niveles de planificación: **Largo Plazo** (*Job Scheduler*), **Medio Plazo** (*Swapper*) y **Corto Plazo** (*CPU Scheduler / Dispatcher*), junto a los criterios de rendimiento (*Throughput, Turnaround, Waiting Time, Response Time*).
10. Simular de manera visual mediante **Diagramas de Gantt** dinámicos los algoritmos de planificación de CPU: **FCFS**, **SJF** y **Round Robin**, comprendiendo el Efecto Convoy y la técnica de Envejecimiento (*Aging*) contra la inanición.

---

## 📖 Mapa Bibliográfico por Capítulo y Tema

Para resolver este trabajo práctico disponen de la bibliografía oficial provista por la cátedra en el **Aula Virtual** y las diapositivas dictadas por la profesora titular ([Clase 3 - Unidad 4 y 5.pdf](file:///c:/Universidad/Teor%C3%ADa%20de%20los%20Sistemas%20Operativos/Clase%202/Clase%203%20-%20Unidad%204%20y%205.pdf)):

| Tema del TP | Diapositivas de Cátedra | Silberschatz (7ma Ed.) | Carretero et al. | Stallings | Tanenbaum |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Concepto de Proceso y Memoria (Text, Data, Heap, Stack)** | `U4` (Slides 2, 3, 4, 5) | **Capítulo 3:** Sec. 3.1 | **Capítulo 3:** Sec. 3.1 | **Capítulo 3:** Sec. 3.1 | **Capítulo 2:** Sec. 2.1 |
| **Programa vs. Proceso (Pasivo / Activo)** | `U4` (Slides 3, 6) | **Capítulo 3:** Sec. 3.1 | **Capítulo 3:** Sec. 3.1 | **Capítulo 3:** Sec. 3.1 | **Capítulo 2:** Sec. 2.1 |
| **Modelos de 2, 3 y 5 Estados** | `U4` (Slides 7, 8, 9) | **Capítulo 3:** Sec. 3.1 | **Capítulo 3:** Sec. 3.2 | **Capítulo 3:** Sec. 3.2 | **Capítulo 2:** Sec. 2.1 |
| **Modelo de 7 Estados & Swapping** | `U4` (Slides 10, 11) | **Capítulo 3:** Sec. 3.2 | **Capítulo 3:** Sec. 3.2 | **Capítulo 3:** Sec. 3.2 | **Capítulo 2:** Sec. 2.1 |
| **BCP / PCB, BCS y Cambio de Contexto** | `U4` (Slide 13) | **Capítulo 3:** Sec. 3.1 | **Capítulo 3:** Sec. 3.2 | **Capítulo 3:** Sec. 3.3 | **Capítulo 2:** Sec. 2.1 |
| **Operaciones POSIX: fork, exec, Zombies y Huérfanos** | `U4` (Slides 14, 15) | **Capítulo 3:** Sec. 3.3 | **Capítulo 3:** Sec. 3.3 | **Capítulo 3:** Sec. 3.4 | **Capítulo 2:** Sec. 2.1 |
| **Hilos (Threads) vs. Procesos** | `U4` (Slides 17, 18) | **Capítulo 4:** Sec. 4.1 - 4.2 | **Capítulo 3:** Sec. 3.5 | **Capítulo 4:** Sec. 4.1 - 4.2 | **Capítulo 2:** Sec. 2.2 |
| **Comunicación entre Procesos (IPC)** | `U4` (Slides 16, 19) | **Capítulo 3:** Sec. 3.4 - 3.6 | **Capítulo 3:** Sec. 3.4 | **Capítulo 3:** Sec. 3.5 | **Capítulo 2:** Sec. 2.3 |
| **Niveles y Criterios de Planificación** | `U5` (Slides 12, 21, 22, 23) | **Capítulo 5:** Sec. 5.1 - 5.2 | **Capítulo 4:** Sec. 4.1 - 4.2 | **Capítulo 9:** Sec. 9.1 | **Capítulo 2:** Sec. 2.4 |
| **Algoritmos de CPU (FCFS, SJF, RR) & Gantt** | `U5` (Slides 24, 25, 28) | **Capítulo 5:** Sec. 5.3 | **Capítulo 4:** Sec. 4.3 | **Capítulo 9:** Sec. 9.2 | **Capítulo 2:** Sec. 2.4 |

---

## 🚀 Flujo de Trabajo con Git y GitHub (Fork & Clone)

La modalidad de resolución y entrega es **estrictamente individual**:

```mermaid
graph TD
    A[1. Entrar a UNJU-Teoria-de-Sistemas-Operativos/TP2] --> B[2. Pulsar botón Fork para copiar a tu cuenta]
    B --> C[3. git clone de tu Fork personal]
    C --> D[4. Abrir index.html en navegador]
    D --> E[5. Experimentar con los simuladores y resolver los 10 ejercicios]
    E --> F[6. Exportar 'respuestas_tp2.json' al 100%]
    F --> G[7. Autoevaluar con autograder_tp2.py]
    G --> H[8. git add . && git commit && git push]
    H --> I[9. Entrega completada en tu repositorio Fork]
```

### Paso 1: Hacer Fork del Repositorio
1. Ingresa a: [**github.com/UNJU-Teoria-de-Sistemas-Operativos/TP2**](https://github.com/UNJU-Teoria-de-Sistemas-Operativos/TP2)
2. Haz clic en el botón superior derecho **"Fork"** y luego en **"Create fork"** para generar una copia en tu cuenta de GitHub.

### Paso 2: Clonar tu Repositorio Fork
Abre tu terminal (Git Bash, PowerShell o Linux Terminal) y descarga tu copia en tu computadora:

```bash
git clone https://github.com/TU_USUARIO/TP2.git
cd TP2
```

### Paso 3: Resolver los Ejercicios en la Web Interactiva
1. Abre el archivo `index.html` en tu navegador web preferido (Google Chrome, Edge, Firefox, Brave).
2. Completa tus datos en el encabezado: **Nombre, Apellido, DNI/Legajo, Carrera y Usuario de GitHub**.
3. Utiliza los simuladores embebidos:
   - **Simulador A (Máquina de 7 Estados)**: Dispara eventos para observar los cambios en el autómata SVG y el PCB.
   - **Simulador B (Planificador de CPU)**: Experimenta con FCFS, SJF y Round Robin para analizar el Diagrama de Gantt.
4. Resuelve los 10 ejercicios interactivos. Tu progreso se guardará automáticamente en el navegador (`localStorage`).

### Paso 4: Exportar el Archivo de Respuestas
Al completar el 100%, pulsa el botón **"💾 Exportar Respuestas (.json)"**. Se descargará el archivo `respuestas_tp2.json`.

> [!IMPORTANT]
> Guarda o copia el archivo `respuestas_tp2.json` en la raíz de la carpeta de tu repositorio clonado `TP2/`.

### Paso 5: Autoevaluación Local (Recomendado)
Antes de entregar, verifica tu calificación ejecutando el autoevaluador de consola:

```bash
python autograder_tp2.py respuestas_tp2.json
```

Si deseas la salida estructurada en JSON:
```bash
python autograder_tp2.py respuestas_tp2.json --json
```

### Paso 6: Guardar Cambios y Subir a GitHub
En tu terminal dentro de la carpeta `TP2/`, ejecuta:

```bash
git add respuestas_tp2.json
git commit -m "Entrega TP2 - [Tu Nombre y Apellido]"
git push origin main
```

---

## 👥 Equipo Docente
- **Profesora Titular:** Ing. María Fernanda Vázquez
- **Jefe de Trabajos Prácticos:** Ing. Fabio D. Argañaraz
- **Cátedra:** Teoría de Sistemas Operativos (TSO) — Facultad de Ingeniería, UNJu
