/**
 * ==========================================================================
 * APLICACIÓN INTERACTIVA TP N° 2 - TEORÍA DE SISTEMAS OPERATIVOS (UNJu FI)
 * Cátedra: Ing. María Fernanda Vázquez | JTP: Ing. Fabio D. Argañaraz
 * Ciclo Lectivo 2026
 * ==========================================================================
 */

// ==================== CONSTANTES Y ESTADO GLOBAL ====================
const STORAGE_KEY = 'TSO_2026_TP2_STATE';
const TOTAL_EXERCISES = 10;

const state = {
  theme: 'dark',
  student: {
    name: '',
    dni: '',
    career: '',
    github: ''
  },
  answers: {
    ej1_segmentos_memoria: {},
    ej2_programa_vs_proceso: {},
    ej3_modelos_estados_evolucion: {},
    ej4_simulador_7_estados: {},
    ej5_pcb_vs_bcs_context_switch: {},
    ej6_operaciones_procesos: {},
    ej7_hilos_vs_procesos: {},
    ej8_mecanismos_ipc: {},
    ej9_niveles_y_criterios_planificacion: {},
    ej10_simulador_planificacion_cpu: {}
  },
  simA: {
    state: 'NUEVO',
    pc: 0x00400020,
    regRax: 0x00000000,
    location: 'RAM (Memoria Principal)'
  },
  confettiFired: false
};

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  initTheme();
  initStudentInputs();
  initExercise1();
  initExercise2();
  initExercise3();
  initExercise4SimulatorA();
  initExercise5();
  initExercise6();
  initExercise7();
  initExercise8();
  initExercise9();
  initExercise10SimulatorB();
  initToolbarActions();
  updateProgress();
});

// ==================== TEMA Y UI ====================
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  document.documentElement.setAttribute('data-theme', state.theme);

  toggleBtn.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    saveToStorage();
  });
}

function toggleBiblio(el) {
  const content = el.nextElementSibling;
  const arrow = el.querySelector('span:last-child');
  if (content.style.display === 'none' || !content.style.display) {
    content.style.display = 'block';
    arrow.textContent = '▲';
  } else {
    content.style.display = 'none';
    arrow.textContent = '▼';
  }
}

function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('active');
}

// ==================== DATOS DEL ESTUDIANTE ====================
function initStudentInputs() {
  const fields = ['name', 'dni', 'career', 'github'];
  fields.forEach(f => {
    const el = document.getElementById(`student-${f}`);
    if (el) {
      if (state.student[f]) el.value = state.student[f];
      el.addEventListener('input', e => {
        state.student[f] = e.target.value.trim();
        saveToStorage();
        updateProgress();
      });
    }
  });
}

// ==================== EJERCICIO 1: MEMORIA DE PROCESO ====================
function initExercise1() {
  const selects = document.querySelectorAll('.ej1-select');
  selects.forEach(sel => {
    const itemKey = sel.dataset.item;
    if (state.answers.ej1_segmentos_memoria[itemKey]) {
      sel.value = state.answers.ej1_segmentos_memoria[itemKey];
    }
    sel.addEventListener('change', e => {
      state.answers.ej1_segmentos_memoria[itemKey] = e.target.value;
      saveToStorage();
      updateProgress();
    });
  });
}

// ==================== EJERCICIO 2: PROGRAMA VS PROCESO ====================
function initExercise2() {
  const toggleGroups = document.querySelectorAll('#card-ej2 .toggle-group');
  toggleGroups.forEach(group => {
    const itemKey = group.dataset.item;
    const currentVal = state.answers.ej2_programa_vs_proceso[itemKey];
    const buttons = group.querySelectorAll('.toggle-btn');

    buttons.forEach(btn => {
      if (currentVal && btn.dataset.val === currentVal) {
        btn.classList.add(currentVal === 'PROGRAMA' ? 'active-left' : 'active-right');
      }

      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active-left', 'active-right'));
        const val = btn.dataset.val;
        btn.classList.add(val === 'PROGRAMA' ? 'active-left' : 'active-right');
        state.answers.ej2_programa_vs_proceso[itemKey] = val;
        saveToStorage();
        updateProgress();
      });
    });
  });
}

// ==================== EJERCICIO 3: MODELOS DE ESTADOS ====================
function initExercise3() {
  const selects = document.querySelectorAll('.ej3-select');
  selects.forEach(sel => {
    const itemKey = sel.dataset.item;
    if (state.answers.ej3_modelos_estados_evolucion[itemKey]) {
      sel.value = state.answers.ej3_modelos_estados_evolucion[itemKey];
    }
    sel.addEventListener('change', e => {
      state.answers.ej3_modelos_estados_evolucion[itemKey] = e.target.value;
      saveToStorage();
      updateProgress();
    });
  });
}

// ==================== EJERCICIO 4: SIMULADOR A (7 ESTADOS) ====================
function initExercise4SimulatorA() {
  // Inicializar preguntas
  const selects = document.querySelectorAll('.ej4-select');
  selects.forEach(sel => {
    const itemKey = sel.dataset.item;
    if (state.answers.ej4_simulador_7_estados[itemKey]) {
      sel.value = state.answers.ej4_simulador_7_estados[itemKey];
    }
    sel.addEventListener('change', e => {
      state.answers.ej4_simulador_7_estados[itemKey] = e.target.value;
      saveToStorage();
      updateProgress();
    });
  });

  // Eventos de la botonera del simulador
  const actions = {
    'btn-ev-admit': {
      from: ['NUEVO'],
      to: 'LISTO',
      loc: 'RAM (Memoria Principal)',
      log: '[KERNEL] Proceso admitido por el planificador a largo plazo. Estado: LISTO (en cola de memoria principal).'
    },
    'btn-ev-dispatch': {
      from: ['LISTO'],
      to: 'EJECUCION',
      loc: 'RAM (Memoria Principal)',
      log: '[DISPATCHER] Context switch ejecutado. Proceso PID 1042 asignado a la CPU. Estado: EJECUCION.'
    },
    'btn-ev-timeout': {
      from: ['EJECUCION'],
      to: 'LISTO',
      loc: 'RAM (Memoria Principal)',
      log: '[TIMER INTERRUPT] Expiró el quantum asignado. Proceso desalojado y retornado a la cola de LISTOS.'
    },
    'btn-ev-iowait': {
      from: ['EJECUCION'],
      to: 'BLOQUEADO',
      loc: 'RAM (Memoria Principal)',
      log: '[SYSCALL] sys_read() invocada. Proceso bloqueado a la espera de datos del dispositivo de E/S.'
    },
    'btn-ev-iodone': {
      from: ['BLOQUEADO', 'BLOQUEADO_SUSPENDIDO'],
      toCondition: (curr) => curr === 'BLOQUEADO_SUSPENDIDO' ? 'LISTO_SUSPENDIDO' : 'LISTO',
      locCondition: (curr) => curr === 'BLOQUEADO_SUSPENDIDO' ? 'DISCO (Partición Swap)' : 'RAM (Memoria Principal)',
      logCondition: (curr) => curr === 'BLOQUEADO_SUSPENDIDO' 
        ? '[HARDWARE INTERRUPT] E/S finalizada en disco. Proceso pasa a LISTO SUSPENDIDO.' 
        : '[HARDWARE INTERRUPT] E/S completada. Proceso transferido de BLOQUEADO a LISTO.'
    },
    'btn-ev-swapout': {
      from: ['BLOQUEADO', 'LISTO'],
      toCondition: (curr) => curr === 'BLOQUEADO' ? 'BLOQUEADO_SUSPENDIDO' : 'LISTO_SUSPENDIDO',
      loc: 'DISCO (Partición Swap)',
      log: '[SWAPPER] Memoria RAM saturada. Proceso expulsado a almacenamiento secundario (Swapping Out).'
    },
    'btn-ev-swapin': {
      from: ['LISTO_SUSPENDIDO', 'BLOQUEADO_SUSPENDIDO'],
      toCondition: (curr) => curr === 'LISTO_SUSPENDIDO' ? 'LISTO' : 'BLOQUEADO',
      loc: 'RAM (Memoria Principal)',
      log: '[SWAPPER] Memoria física liberada. Proceso recuperado desde swap a memoria principal (Swapping In).'
    },
    'btn-ev-exit': {
      from: ['EJECUCION'],
      to: 'TERMINADO',
      loc: 'Tabla de Procesos (Zombie)',
      log: '[EXIT] Proceso completó su ejecución con status=0. En estado TERMINADO esperando wait() del padre.'
    }
  };

  Object.entries(actions).forEach(([btnId, config]) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', () => {
      const curr = state.simA.state;
      if (config.from.includes(curr)) {
        const nextState = config.toCondition ? config.toCondition(curr) : config.to;
        const nextLoc = config.locCondition ? config.locCondition(curr) : config.loc;
        const logMsg = config.logCondition ? config.logCondition(curr) : config.log;

        state.simA.state = nextState;
        state.simA.location = nextLoc;
        state.simA.pc += 0x08;
        state.simA.regRax += 0x01;

        updateSimulatorAView(logMsg);
        saveToStorage();
      } else {
        updateLogText(`⚠️ Transición no permitida: No se puede aplicar esta acción desde el estado actual '${curr}'.`);
      }
    });
  });

  const resetBtn = document.getElementById('btn-ev-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.simA.state = 'NUEVO';
      state.simA.location = 'RAM (Memoria Principal)';
      state.simA.pc = 0x00400020;
      state.simA.regRax = 0x00000000;
      updateSimulatorAView('[KERNEL] Proceso reiniciado a estado NUEVO (PID 1042).');
      saveToStorage();
    });
  }

  updateSimulatorAView('[KERNEL] Simulador listo. Proceso PID 1042 en estado ' + state.simA.state);
}

function updateSimulatorAView(logMsg) {
  // Resaltar nodos SVG
  const nodeMap = {
    'NUEVO': 'node-nuevo',
    'LISTO': 'node-listo',
    'EJECUCION': 'node-ejecucion',
    'BLOQUEADO': 'node-bloqueado',
    'TERMINADO': 'node-terminado',
    'LISTO_SUSPENDIDO': 'node-listo-suspendido',
    'BLOQUEADO_SUSPENDIDO': 'node-bloqueado-suspendido'
  };

  document.querySelectorAll('.state-node').forEach(n => n.classList.remove('active'));
  const activeNodeId = nodeMap[state.simA.state];
  if (activeNodeId) {
    const nodeEl = document.getElementById(activeNodeId);
    if (nodeEl) nodeEl.classList.add('active');
  }

  // Actualizar PCB Inspector
  const pcbState = document.getElementById('pcb-state');
  const pcbLoc = document.getElementById('pcb-location');
  const pcbPc = document.getElementById('pcb-pc');
  const pcbReg = document.getElementById('pcb-reg');

  if (pcbState) pcbState.textContent = state.simA.state;
  if (pcbLoc) pcbLoc.textContent = state.simA.location;
  if (pcbPc) pcbPc.textContent = '0x' + state.simA.pc.toString(16).toUpperCase();
  if (pcbReg) pcbReg.textContent = '0x' + state.simA.regRax.toString(16).padStart(8, '0').toUpperCase();

  if (logMsg) updateLogText(logMsg);
}

function updateLogText(txt) {
  const logEl = document.getElementById('pcb-log-text');
  if (logEl) logEl.textContent = txt;
}

// ==================== EJERCICIO 5: PCB VS BCS & CONTEXT SWITCH ====================
function initExercise5() {
  const toggleGroups = document.querySelectorAll('#card-ej5 .toggle-group');
  toggleGroups.forEach(group => {
    const itemKey = group.dataset.item;
    const currentVal = state.answers.ej5_pcb_vs_bcs_context_switch[itemKey];
    const buttons = group.querySelectorAll('.toggle-btn');

    buttons.forEach(btn => {
      if (currentVal && btn.dataset.val === currentVal) {
        btn.classList.add(currentVal === 'PCB' ? 'active-left' : 'active-right');
      }

      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active-left', 'active-right'));
        const val = btn.dataset.val;
        btn.classList.add(val === 'PCB' ? 'active-left' : 'active-right');
        state.answers.ej5_pcb_vs_bcs_context_switch[itemKey] = val;
        saveToStorage();
        updateProgress();
      });
    });
  });

  const selects = document.querySelectorAll('.ej5-select');
  selects.forEach(sel => {
    const itemKey = sel.dataset.item;
    if (state.answers.ej5_pcb_vs_bcs_context_switch[itemKey]) {
      sel.value = state.answers.ej5_pcb_vs_bcs_context_switch[itemKey];
    }
    sel.addEventListener('change', e => {
      state.answers.ej5_pcb_vs_bcs_context_switch[itemKey] = e.target.value;
      saveToStorage();
      updateProgress();
    });
  });
}

// ==================== EJERCICIO 6: OPERACIONES POSIX (RADIO CARDS) ====================
function initExercise6() {
  const groups = document.querySelectorAll('#card-ej6 .radio-cards-grid');
  groups.forEach(grid => {
    const groupKey = grid.dataset.group;
    const currentVal = state.answers.ej6_operaciones_procesos[groupKey];
    const cards = grid.querySelectorAll('.radio-card');

    cards.forEach(card => {
      if (currentVal && card.dataset.val === currentVal) {
        card.classList.add('selected');
      }

      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.answers.ej6_operaciones_procesos[groupKey] = card.dataset.val;
        saveToStorage();
        updateProgress();
      });
    });
  });
}

// ==================== EJERCICIO 7: HILOS VS PROCESOS ====================
function initExercise7() {
  const toggleGroups = document.querySelectorAll('#card-ej7 .toggle-group');
  toggleGroups.forEach(group => {
    const itemKey = group.dataset.item;
    const currentVal = state.answers.ej7_hilos_vs_procesos[itemKey];
    const buttons = group.querySelectorAll('.toggle-btn');

    buttons.forEach(btn => {
      if (currentVal && btn.dataset.val === currentVal) {
        btn.classList.add(currentVal === 'COMPARTIDO' ? 'active-left' : 'active-right');
      }

      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active-left', 'active-right'));
        const val = btn.dataset.val;
        btn.classList.add(val === 'COMPARTIDO' ? 'active-left' : 'active-right');
        state.answers.ej7_hilos_vs_procesos[itemKey] = val;
        saveToStorage();
        updateProgress();
      });
    });
  });
}

// ==================== EJERCICIO 8: IPC ====================
function initExercise8() {
  const selects = document.querySelectorAll('.ej8-select');
  selects.forEach(sel => {
    const itemKey = sel.dataset.item;
    if (state.answers.ej8_mecanismos_ipc[itemKey]) {
      sel.value = state.answers.ej8_mecanismos_ipc[itemKey];
    }
    sel.addEventListener('change', e => {
      state.answers.ej8_mecanismos_ipc[itemKey] = e.target.value;
      saveToStorage();
      updateProgress();
    });
  });
}

// ==================== EJERCICIO 9: NIVELES Y CRITERIOS ====================
function initExercise9() {
  const selects = document.querySelectorAll('.ej9-select');
  selects.forEach(sel => {
    const itemKey = sel.dataset.item;
    if (state.answers.ej9_niveles_y_criterios_planificacion[itemKey]) {
      sel.value = state.answers.ej9_niveles_y_criterios_planificacion[itemKey];
    }
    sel.addEventListener('change', e => {
      state.answers.ej9_niveles_y_criterios_planificacion[itemKey] = e.target.value;
      saveToStorage();
      updateProgress();
    });
  });
}

// ==================== EJERCICIO 10: SIMULADOR B (PLANIFICADOR GANTT) ====================
function initExercise10SimulatorB() {
  // Preguntas conceptuales
  const selects = document.querySelectorAll('.ej10-select');
  selects.forEach(sel => {
    const itemKey = sel.dataset.item;
    if (state.answers.ej10_simulador_planificacion_cpu[itemKey]) {
      sel.value = state.answers.ej10_simulador_planificacion_cpu[itemKey];
    }
    sel.addEventListener('change', e => {
      state.answers.ej10_simulador_planificacion_cpu[itemKey] = e.target.value;
      saveToStorage();
      updateProgress();
    });
  });

  // Botón simular Gantt
  const runBtn = document.getElementById('btn-run-gantt');
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      const algo = document.getElementById('sim-algo-select').value;
      renderGanttSimulation(algo);
    });
  }

  // Render inicial
  renderGanttSimulation('FCFS');
}

function renderGanttSimulation(algo) {
  const track = document.getElementById('gantt-track');
  const ticks = document.getElementById('gantt-ticks-labels');
  const waitVal = document.getElementById('metric-waiting-val');
  const turnVal = document.getElementById('metric-turnaround-val');
  if (!track || !ticks) return;

  track.innerHTML = '';
  ticks.innerHTML = '';

  let blocks = [];
  let avgW = 0;
  let avgT = 0;

  if (algo === 'FCFS') {
    // P1 (8ms), P2 (4ms), P3 (2ms)
    // Tiempos: P1 [0..8], P2 [8..12], P3 [12..14]
    blocks = [
      { proc: 'P1', class: 'p1', duration: 8, start: 0, end: 8 },
      { proc: 'P2', class: 'p2', duration: 4, start: 8, end: 12 },
      { proc: 'P3', class: 'p3', duration: 2, start: 12, end: 14 }
    ];
    // W: P1=0, P2=8, P3=12 -> sum=20 -> avg = 6.67 ms
    // T: P1=8, P2=12, P3=14 -> sum=34 -> avg = 11.33 ms
    avgW = (20 / 3).toFixed(2);
    avgT = (34 / 3).toFixed(2);
  } else if (algo === 'SJF') {
    // SJF: P3 (2ms), P2 (4ms), P1 (8ms)
    blocks = [
      { proc: 'P3', class: 'p3', duration: 2, start: 0, end: 2 },
      { proc: 'P2', class: 'p2', duration: 4, start: 2, end: 6 },
      { proc: 'P1', class: 'p1', duration: 8, start: 6, end: 14 }
    ];
    // W: P3=0, P2=2, P1=6 -> sum=8 -> avg = 2.67 ms
    // T: P3=2, P2=6, P1=14 -> sum=22 -> avg = 7.33 ms
    avgW = (8 / 3).toFixed(2);
    avgT = (22 / 3).toFixed(2);
  } else if (algo === 'RR2') {
    // Round Robin Q=2
    // P1:8, P2:4, P3:2
    // P1(2) [0..2], P2(2) [2..4], P3(2) [4..6 fin], P1(2) [6..8], P2(2) [8..10 fin], P1(2) [10..12], P1(2) [12..14 fin]
    blocks = [
      { proc: 'P1', class: 'p1', duration: 2, start: 0, end: 2 },
      { proc: 'P2', class: 'p2', duration: 2, start: 2, end: 4 },
      { proc: 'P3', class: 'p3', duration: 2, start: 4, end: 6 },
      { proc: 'P1', class: 'p1', duration: 2, start: 6, end: 8 },
      { proc: 'P2', class: 'p2', duration: 2, start: 8, end: 10 },
      { proc: 'P1', class: 'p1', duration: 2, start: 10, end: 12 },
      { proc: 'P1', class: 'p1', duration: 2, start: 12, end: 14 }
    ];
    // T: P3=6, P2=10, P1=14 -> avg = 30/3 = 10.00 ms
    // W: P3=4, P2=6, P1=6 -> avg = 16/3 = 5.33 ms
    avgW = (16 / 3).toFixed(2);
    avgT = (30 / 3).toFixed(2);
  } else if (algo === 'RR4') {
    // Round Robin Q=4
    // P1(4) [0..4], P2(4) [4..8 fin], P3(2) [8..10 fin], P1(4) [10..14 fin]
    blocks = [
      { proc: 'P1', class: 'p1', duration: 4, start: 0, end: 4 },
      { proc: 'P2', class: 'p2', duration: 4, start: 4, end: 8 },
      { proc: 'P3', class: 'p3', duration: 2, start: 8, end: 10 },
      { proc: 'P1', class: 'p1', duration: 4, start: 10, end: 14 }
    ];
    // T: P2=8, P3=10, P1=14 -> avg = 32/3 = 10.67 ms
    // W: P2=4, P3=8, P1=6 -> avg = 18/3 = 6.00 ms
    avgW = (18 / 3).toFixed(2);
    avgT = (32 / 3).toFixed(2);
  }

  const totalTime = 14;
  blocks.forEach(b => {
    const el = document.createElement('div');
    el.className = `gantt-block ${b.class}`;
    el.style.width = `${(b.duration / totalTime) * 100}%`;
    el.textContent = `${b.proc} (${b.duration}ms)`;
    track.appendChild(el);
  });

  // Ticks de tiempo
  let currentMark = 0;
  const tickElStart = document.createElement('span');
  tickElStart.textContent = '0 ms';
  ticks.appendChild(tickElStart);

  blocks.forEach(b => {
    currentMark = b.end;
    const span = document.createElement('span');
    span.textContent = `${currentMark} ms`;
    ticks.appendChild(span);
  });

  if (waitVal) waitVal.textContent = `${avgW} ms`;
  if (turnVal) turnVal.textContent = `${avgT} ms`;
}

// ==================== BARRA DE PROGRESO Y STATUS ====================
function updateProgress() {
  let completedCount = 0;

  // Ej 1: 5 selects
  const ej1Keys = ['seg_instrucciones', 'seg_globales_inicializadas', 'seg_variables_dinamicas', 'seg_marcos_pila', 'seg_bss'];
  const ej1Done = ej1Keys.every(k => state.answers.ej1_segmentos_memoria[k]);
  updateBadge('badge-ej1', ej1Done);
  if (ej1Done) completedCount++;

  // Ej 2: 6 toggles
  const ej2Keys = ['prop_almacenamiento', 'prop_contador_programa', 'prop_identificador_pid', 'prop_instancias_multiples', 'prop_estado_cambiante', 'prop_pasividad'];
  const ej2Done = ej2Keys.every(k => state.answers.ej2_programa_vs_proceso[k]);
  updateBadge('badge-ej2', ej2Done);
  if (ej2Done) completedCount++;

  // Ej 3: 4 selects
  const ej3Keys = ['limitacion_2_estados', 'solucion_3_estados', 'proposito_nuevo', 'proposito_terminado'];
  const ej3Done = ej3Keys.every(k => state.answers.ej3_modelos_estados_evolucion[k]);
  updateBadge('badge-ej3', ej3Done);
  if (ej3Done) completedCount++;

  // Ej 4: 6 selects
  const ej4Keys = ['trans_quantum_expira', 'trans_espera_io', 'trans_falta_memoria', 'trans_io_termina_swap', 'trans_swap_in', 'trans_directa_prohibida'];
  const ej4Done = ej4Keys.every(k => state.answers.ej4_simulador_7_estados[k]);
  updateBadge('badge-ej4', ej4Done);
  if (ej4Done) completedCount++;

  // Ej 5: 6 toggles + 2 selects
  const ej5Keys = ['card_pid', 'card_program_counter', 'card_tabla_dispositivos', 'card_limites_memoria', 'card_cola_global_planif', 'card_archivos_abiertos_proceso', 'concepto_context_switch', 'cantidad_pcb'];
  const ej5Done = ej5Keys.every(k => state.answers.ej5_pcb_vs_bcs_context_switch[k]);
  updateBadge('badge-ej5', ej5Done);
  if (ej5Done) completedCount++;

  // Ej 6: 4 radio cards
  const ej6Keys = ['op_fork_retorno', 'op_exec_espacio', 'fenomeno_zombie', 'fenomeno_huerfano'];
  const ej6Done = ej6Keys.every(k => state.answers.ej6_operaciones_procesos[k]);
  updateBadge('badge-ej6', ej6Done);
  if (ej6Done) completedCount++;

  // Ej 7: 6 toggles
  const ej7Keys = ['res_espacio_direcciones', 'res_variables_globales', 'res_program_counter', 'res_registros_cpu', 'res_pila_stack', 'res_descriptores_archivos'];
  const ej7Done = ej7Keys.every(k => state.answers.ej7_hilos_vs_procesos[k]);
  updateBadge('badge-ej7', ej7Done);
  if (ej7Done) completedCount++;

  // Ej 8: 4 selects
  const ej8Keys = ['ipc_velocidad_maxima', 'ipc_pipes_comunicacion', 'ipc_pipes_nombrados', 'ipc_sincronizacion'];
  const ej8Done = ej8Keys.every(k => state.answers.ej8_mecanismos_ipc[k]);
  updateBadge('badge-ej8', ej8Done);
  if (ej8Done) completedCount++;

  // Ej 9: 5 selects
  const ej9Keys = ['sched_largo_plazo', 'sched_medio_plazo', 'sched_corto_plazo', 'metrica_turnaround', 'metrica_waiting'];
  const ej9Done = ej9Keys.every(k => state.answers.ej9_niveles_y_criterios_planificacion[k]);
  updateBadge('badge-ej9', ej9Done);
  if (ej9Done) completedCount++;

  // Ej 10: 4 selects
  const ej10Keys = ['planif_fcfs_problema', 'planif_sjf_optimo', 'planif_rr_quantum', 'planif_inanicion_solucion'];
  const ej10Done = ej10Keys.every(k => state.answers.ej10_simulador_planificacion_cpu[k]);
  updateBadge('badge-ej10', ej10Done);
  if (ej10Done) completedCount++;

  const pct = Math.round((completedCount / TOTAL_EXERCISES) * 100);
  const bar = document.getElementById('progress-bar');
  const label = document.getElementById('progress-percentage');
  const exportBtn = document.getElementById('btn-export-json');

  if (bar) bar.style.width = `${pct}%`;
  if (label) label.textContent = `${pct}% (${completedCount}/${TOTAL_EXERCISES} completados)`;

  if (exportBtn) {
    exportBtn.disabled = completedCount < TOTAL_EXERCISES;
  }

  // Disparar Confetti al 100%
  if (pct === 100 && !state.confettiFired) {
    state.confettiFired = true;
    triggerConfetti();
  }
}

function updateBadge(badgeId, isDone) {
  const badge = document.getElementById(badgeId);
  if (!badge) return;
  if (isDone) {
    badge.className = 'badge-tag green';
    badge.textContent = '✓ Completado';
  } else {
    badge.className = 'badge-tag blue';
    badge.textContent = 'Pendiente';
  }
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// ==================== EXPORTAR / IMPORTAR ====================
function initToolbarActions() {
  // Botones de Modales
  document.getElementById('btn-open-biblio-all')?.addEventListener('click', () => openModal('modal-biblio'));
  document.getElementById('btn-git-guide')?.addEventListener('click', () => openModal('modal-git'));

  // Exportar JSON
  const exportBtn = document.getElementById('btn-export-json');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportSubmissionJSON();
    });
  }

  // Importar JSON
  const importBtn = document.getElementById('btn-import-json');
  const fileInput = document.getElementById('file-import-input');
  if (importBtn && fileInput) {
    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleImportFile);
  }
}

function exportSubmissionJSON() {
  const payload = {
    tp_metadata: {
      tp_id: 'TSO-2026-TP2',
      title: 'TP N° 2: Administración de Procesos, Hilos y Planificación de CPU',
      catedra: 'Teoría de Sistemas Operativos - UNJu Facultad de Ingeniería',
      submitted_at: new Date().toISOString()
    },
    student: {
      name: state.student.name || 'Estudiante Sin Nombre',
      dni: state.student.dni || 'Sin DNI',
      career: state.student.career || 'Ingeniería Informática',
      github: state.student.github || 'sin-usuario'
    },
    answers: state.answers
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'respuestas_tp2.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const data = JSON.parse(event.target.result);
      if (data.answers) {
        state.answers = Object.assign(state.answers, data.answers);
      }
      if (data.student) {
        state.student = Object.assign(state.student, data.student);
      }
      saveToStorage();
      location.reload(); // Recargar para repoblar todos los campos
    } catch (err) {
      alert('Error al leer el archivo JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// ==================== LOCALSTORAGE ====================
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('No se pudo guardar en localStorage', e);
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.student) state.student = Object.assign(state.student, parsed.student);
      if (parsed.answers) state.answers = Object.assign(state.answers, parsed.answers);
      if (parsed.theme) state.theme = parsed.theme;
      if (parsed.simA) state.simA = Object.assign(state.simA, parsed.simA);
    }
  } catch (e) {
    console.warn('Error cargando de localStorage', e);
  }
}
