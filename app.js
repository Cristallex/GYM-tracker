/* ===== Дневник тренировок ===== */
"use strict";

const LS_KEY = "gymtracker_v1";

/* --- Группы мышц: цвет и эмодзи --- */
const GROUPS = {
  "Грудь":  { emoji: "🛡️", color: "#fb7185" },
  "Спина":  { emoji: "🧗", color: "#38bdf8" },
  "Ноги":   { emoji: "🦵", color: "#a78bfa" },
  "Плечи":  { emoji: "🏋️", color: "#fbbf24" },
  "Руки":   { emoji: "💪", color: "#34d399" },
  "Корпус": { emoji: "🧘", color: "#f97316" },
  "Кардио": { emoji: "🏃", color: "#2dd4bf" },
  "Прочее": { emoji: "⭐", color: "#94a3b8" },
};
const gInfo = (g) => GROUPS[g] || GROUPS["Прочее"];

/* --- Темы оформления: [фон, акцент, второй цвет] --- */
const THEMES = [
  { id: "dark",        name: "Тёмный синий",    sw: ["#0b1120", "#38bdf8", "#6366f1"] },
  { id: "light",       name: "Белый",           sw: ["#eef1f7", "#0ea5e9", "#ffffff"] },
  { id: "purple",      name: "Фиолетовый",      sw: ["#17102a", "#a78bfa", "#e879f9"] },
  { id: "orange",      name: "Оранж + чёрный",  sw: ["#120d08", "#fb923c", "#f97316"] },
  { id: "orangelight", name: "Оранж + белый",   sw: ["#fff6ef", "#f97316", "#ffffff"] },
  { id: "orangenavy",  name: "Оранж + синий",   sw: ["#0b1626", "#fb923c", "#38bdf8"] },
  { id: "honey",       name: "Жёлтый + чёрный", sw: ["#0c0b06", "#facc15", "#f59e0b"] },
  { id: "red",         name: "Белый + красный", sw: ["#faf6f6", "#ef4444", "#ffffff"] },
  // дизайны, отличающиеся формой и шрифтом
  { id: "minimal",     name: "⬜ Минимал",      sw: ["#fbfbfd", "#18181b", "#ffffff"] },
  { id: "neon",        name: "🌃 Неон",         sw: ["#050507", "#4ade80", "#22d3ee"] },
  { id: "pastel",      name: "🌸 Пастель",      sw: ["#f6f0ff", "#a78bfa", "#f0abfc"] },
  { id: "retro",       name: "🖥️ Ретро",        sw: ["#0d0b00", "#fbbf24", "#f59e0b"] },
];

/* --- Встроенный список упражнений --- */
const DEFAULT_EXERCISES = [
  // Грудь
  ["Жим штанги лёжа", "Грудь"], ["Жим штанги на наклонной", "Грудь"],
  ["Жим гантелей лёжа", "Грудь"], ["Жим гантелей на наклонной", "Грудь"],
  ["Жим в тренажёре", "Грудь"], ["Жим в Смите", "Грудь"],
  ["Разводка гантелей", "Грудь"], ["Разводка в кроссовере", "Грудь"],
  ["Бабочка (пек-дек)", "Грудь"], ["Отжимания от пола", "Грудь"],
  ["Отжимания на брусьях", "Грудь"], ["Пуловер", "Грудь"],
  // Спина
  ["Подтягивания", "Спина"], ["Подтягивания широким хватом", "Спина"],
  ["Подтягивания обратным хватом", "Спина"], ["Тяга верхнего блока", "Спина"],
  ["Тяга горизонтального блока", "Спина"], ["Тяга штанги в наклоне", "Спина"],
  ["Тяга гантели в наклоне", "Спина"], ["Тяга Т-грифа", "Спина"],
  ["Становая тяга", "Спина"], ["Становая сумо", "Спина"],
  ["Гиперэкстензия", "Спина"], ["Пуловер на блоке", "Спина"],
  // Ноги
  ["Приседания со штангой", "Ноги"], ["Фронтальные приседания", "Ноги"],
  ["Гакк-присед", "Ноги"], ["Жим ногами", "Ноги"],
  ["Выпады", "Ноги"], ["Болгарские выпады", "Ноги"],
  ["Зашагивания на тумбу", "Ноги"], ["Румынская тяга", "Ноги"],
  ["Разгибания ног", "Ноги"], ["Сгибания ног лёжа", "Ноги"],
  ["Сгибания ног сидя", "Ноги"], ["Икры стоя", "Ноги"],
  ["Икры сидя", "Ноги"], ["Ягодичный мост", "Ноги"],
  ["Отведение ноги на блоке", "Ноги"],
  // Плечи
  ["Жим штанги стоя", "Плечи"], ["Жим гантелей сидя", "Плечи"],
  ["Жим гантелей стоя", "Плечи"], ["Жим Арнольда", "Плечи"],
  ["Махи гантелями в стороны", "Плечи"], ["Махи гантелями перед собой", "Плечи"],
  ["Махи в наклоне", "Плечи"], ["Разводка в тренажёре", "Плечи"],
  ["Тяга к лицу (face pull)", "Плечи"], ["Тяга к подбородку", "Плечи"],
  ["Шраги со штангой", "Плечи"], ["Шраги с гантелями", "Плечи"],
  // Руки
  ["Подъём штанги на бицепс", "Руки"], ["Подъём EZ-грифа на бицепс", "Руки"],
  ["Подъём гантелей на бицепс", "Руки"], ["Подъём на скамье Скотта", "Руки"],
  ["Молотки", "Руки"], ["Концентрированный подъём", "Руки"],
  ["Подъём на нижнем блоке", "Руки"], ["Французский жим лёжа", "Руки"],
  ["Французский жим сидя", "Руки"], ["Жим узким хватом", "Руки"],
  ["Разгибания на блоке", "Руки"], ["Разгибание из-за головы", "Руки"],
  ["Отжимания узким хватом", "Руки"], ["Обратные отжимания от скамьи", "Руки"],
  // Корпус
  ["Планка", "Корпус"], ["Боковая планка", "Корпус"],
  ["Скручивания", "Корпус"], ["Обратные скручивания", "Корпус"],
  ["Подъём ног в висе", "Корпус"], ["Подъём ног лёжа", "Корпус"],
  ["Велосипед", "Корпус"], ["Пресс на блоке", "Корпус"],
  ["Русские скручивания", "Корпус"], ["Берпи", "Корпус"],
  // Кардио
  ["Беговая дорожка", "Кардио"], ["Эллипс", "Кардио"],
  ["Велотренажёр", "Кардио"], ["Гребной тренажёр", "Кардио"],
  ["Скакалка", "Кардио"], ["Степпер", "Кардио"],
];

/* --- Состояние --- */
let state = load();
let pickerGroup = null;

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(LS_KEY));
    if (s && s.exercises) {
      // миграция старого формата draft/stretch
      if (s.draft && Array.isArray(s.draft.stretch)) s.draft = null;
      // подмешиваем новые встроенные упражнения
      const have = new Set(s.exercises.map((e) => e.name));
      DEFAULT_EXERCISES.forEach(([name, group], i) => {
        if (!have.has(name)) s.exercises.push({ id: "d" + i + "_" + s.exercises.length, name, group, custom: false });
      });
      s.templates = s.templates || [];
      return s;
    }
  } catch (e) { /* первая загрузка */ }
  return {
    exercises: DEFAULT_EXERCISES.map(([name, group], i) => ({ id: "d" + i, name, group, custom: false })),
    workouts: [],
    templates: [], // [{id,name,entries}]
    draft: null, // {entries:[{exerciseId,name,group,sets:[{kg,reps,bw}]}], durH, durM, startedAt, durTouched, editId}
  };
}

function save() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

/* --- Утилиты --- */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDate = (iso) => new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
const fmtDur = (min) => {
  const h = Math.floor(min / 60), m = min % 60;
  if (!min) return "—";
  return h ? (m ? `${h} ч ${m} мин` : `${h} ч`) : `${m} мин`;
};
const dateStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const todayStr = () => dateStr(new Date());

/* --- Навигация по вкладкам --- */
const TITLES = { workout: "🏋️ Зал", history: "📋 История", progress: "📈 Прогресс", exercises: "💪 Упражнения" };

const SCROLLS = {}; // позиция скролла каждой вкладки
let currentScreen = "workout";

window.addEventListener("scroll", () => { SCROLLS[currentScreen] = window.scrollY; }, { passive: true });

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    tab.classList.add("active");
    const name = tab.dataset.screen;
    currentScreen = name;
    $("screen-" + name).classList.add("active");
    $("screenTitle").textContent = TITLES[name];
    if (name === "history") renderHistory();
    if (name === "progress") renderProgress();
    if (name === "exercises") renderExercises();
    window.scrollTo(0, SCROLLS[name] || 0); // вернуться туда, где остановились
  });
});

// запоминаем скролл тренировки при сворачивании — переживёт перезапуск приложения
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && state.draft && currentScreen === "workout") {
    state.draft.scrollY = window.scrollY;
    save();
  }
});

/* ================= ТРЕНИРОВКА ================= */

let showActive = false; // показывать ли экран активной тренировки

$("btnStartWorkout").addEventListener("click", () => {
  if (!state.draft) {
    state.draft = { entries: [], durH: 1, durM: 0, startedAt: Date.now() };
    save();
  } else if (!state.draft.startedAt && !state.draft.editId) {
    state.draft.startedAt = Date.now(); // старый черновик без таймера — включаем сейчас
    save();
  }
  showActive = true;
  renderWorkout();
});

$("btnBackWorkout").addEventListener("click", () => {
  showActive = false; // черновик остаётся — можно продолжить позже
  renderWorkout();
});

$("btnDiscardWorkout").addEventListener("click", () => {
  if (!confirm("Удалить эту тренировку? Всё заполненное пропадёт.")) return;
  state.draft = null;
  showActive = false;
  save();
  renderWorkout();
});

$("btnFinishWorkout").addEventListener("click", () => {
  const d = state.draft;
  if (!d) return;
  if (!d.entries.length) {
    if (!confirm("Тренировка пустая. Завершить без записи?")) return;
    state.draft = null; save(); renderWorkout(); return;
  }
  if (!confirm(d.editId ? "Сохранить изменения?" : "Завершить и сохранить тренировку?")) return;
  // автодлительность из таймера; если пользователь правил поля руками — уважаем его ввод
  const durationMin = (d.startedAt && !d.editId && !d.durTouched)
    ? Math.max(1, Math.round((Date.now() - d.startedAt) / 60000))
    : (parseInt(d.durH) || 0) * 60 + (parseInt(d.durM) || 0);
  const data = {
    durationMin,
    entries: d.entries,
    dateISO: d.wDate ? new Date(d.wDate + "T12:00:00").toISOString() : new Date().toISOString(),
  };
  if (d.editId) {
    const w = state.workouts.find((x) => x.id === d.editId);
    if (w) Object.assign(w, data);
  } else {
    state.workouts.unshift({ id: "w" + Date.now(), dateISO: new Date().toISOString(), ...data });
  }
  state.draft = null;
  showActive = false;
  save();
  renderWorkout();
});

$("durH").addEventListener("input", (e) => { state.draft.durH = e.target.value; state.draft.durTouched = true; save(); });
$("durM").addEventListener("input", (e) => { state.draft.durM = e.target.value; state.draft.durTouched = true; save(); });
$("wDate").addEventListener("input", (e) => { state.draft.wDate = e.target.value; save(); });

/* --- Таймер тренировки --- */
let workoutTicker = null;

function tickWorkout() {
  const d = state.draft;
  if (!d || !d.startedAt || d.editId) return stopWorkoutTick();
  const sec = Math.max(0, Math.floor((Date.now() - d.startedAt) / 1000));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  $("workoutTimer").textContent = `⏱ ${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  // автозаполнение полей длительности — не трогаем, если пользователь печатает сам
  if (!d.durTouched) {
    const eh = Math.floor(sec / 3600), em = Math.floor((sec % 3600) / 60);
    d.durH = eh; d.durM = em;
    if (document.activeElement !== $("durH")) $("durH").value = eh;
    if (document.activeElement !== $("durM")) $("durM").value = em;
  }
}
function startWorkoutTick() { stopWorkoutTick(); tickWorkout(); workoutTicker = setInterval(tickWorkout, 1000); }
function stopWorkoutTick() { clearInterval(workoutTicker); workoutTicker = null; }

function renderWorkout() {
  const d = state.draft;
  const active = !!(d && showActive);
  $("workoutIdle").classList.toggle("hidden", active);
  $("workoutActive").classList.toggle("hidden", !active);
  $("btnStartWorkout").textContent = d ? "Продолжить тренировку" : "Добавить тренировку";
  $("btnDiscardWorkout").classList.toggle("hidden", !d);

  // чип таймера — только в новой тренировке (в редактировании не показываем)
  const hasTimer = !!(active && d.startedAt && !d.editId);
  $("workoutTimer").classList.toggle("hidden", !hasTimer);
  if (hasTimer) startWorkoutTick(); else stopWorkoutTick();

  // Шаблоны на стартовом экране
  $("templates").innerHTML = state.templates.length
    ? `<div class="pick-group">Шаблоны</div>` +
      state.templates.map((t) => `
        <div class="card hist-card" onclick="startFromTemplate('${t.id}')">
          <div class="top">
            <span class="hist-date">📄 ${esc(t.name)}</span>
            <button class="set-del" title="Удалить шаблон" onclick="event.stopPropagation();delTemplate('${t.id}')">✕</button>
          </div>
          <div class="hist-ex">${t.entries.length} упр.: ${esc(t.entries.slice(0, 3).map((e) => e.name).join(", "))}${t.entries.length > 3 ? "…" : ""}</div>
        </div>`).join("")
    : "";

  if (!active) return;

  $("btnFinishWorkout").textContent = d.editId ? "💾 Сохранить изменения" : "✔ Завершить тренировку";
  $("durH").value = d.durH;
  $("durM").value = d.durM;
  if (!d.wDate) d.wDate = todayStr();
  if (document.activeElement !== $("wDate")) $("wDate").value = d.wDate;

  $("entries").innerHTML = d.entries.map((e, ei) => `
    <div class="card">
      <div class="ex-head">
        <div>
          <span class="ex-name">${esc(e.name)}</span>
          <span class="ex-tag" style="background:${gInfo(e.group).color}22;color:${gInfo(e.group).color}">${esc(e.group || "")}</span>
        </div>
        <button class="btn-danger btn" onclick="removeEntry(${ei})">✕</button>
      </div>
      ${e.sets.map((s, si) => `
        <div class="set-row">
          <span class="set-num">${si + 1}</span>
          ${s.bw
            ? `<button class="bw-pill" onclick="setBw(${ei},${si},0)" title="Нажми, чтобы вернуть кг">🤸 свой вес</button>`
            : `<div class="stepper">
            <button class="bump" onpointerdown="startBump(event,${ei},${si},'kg',-1)" oncontextmenu="return false">−</button>
            <input class="set-in" type="number" value="${s.kg}" min="0" step="0.5" inputmode="decimal" onchange="setVal(${ei},${si},'kg',this.value)"><span class="unit">кг</span>
            <button class="bump" onpointerdown="startBump(event,${ei},${si},'kg',1)" oncontextmenu="return false">+</button>
          </div>
          <button class="bw-mini" title="Сделать свой вес" onclick="setBw(${ei},${si},1)">🤸</button>`}
          <div class="stepper">
            <button class="bump" onpointerdown="startBump(event,${ei},${si},'reps',-1)" oncontextmenu="return false">−</button>
            <input class="set-in" type="number" value="${s.reps}" min="0" step="1" inputmode="numeric" onchange="setVal(${ei},${si},'reps',this.value)"><span class="unit">раз</span>
            <button class="bump" onpointerdown="startBump(event,${ei},${si},'reps',1)" oncontextmenu="return false">+</button>
          </div>
          <button class="set-del" onclick="delSet(${ei},${si})">✕</button>
        </div>`).join("")}
      <button class="btn btn-outline btn-block" onclick="addSet(${ei})">+ Подход</button>
    </div>`).join("");
}

window.setVal = (ei, si, field, v) => {
  const s = state.draft.entries[ei].sets[si];
  s[field] = Math.max(0, parseFloat(v) || 0);
  save();
};
window.setBw = (ei, si, on) => {
  state.draft.entries[ei].sets[si].bw = !!on;
  save(); renderWorkout();
};

// Удержание +/−: цифра бежит сама
let bumpTimer = null, bumpDelay = null;
window.startBump = (ev, ei, si, field, delta) => {
  ev.preventDefault();
  const go = () => window.bump(ei, si, field, delta);
  go();
  bumpDelay = setTimeout(() => { bumpTimer = setInterval(go, 90); }, 400);
};
window.stopBump = () => { clearTimeout(bumpDelay); clearInterval(bumpTimer); };
document.addEventListener("pointerup", stopBump);
document.addEventListener("pointercancel", stopBump);

/* --- Шаблоны тренировок --- */
$("btnSaveTemplate").addEventListener("click", () => {
  const d = state.draft;
  if (!d || !d.entries.length) { alert("Сначала добавь упражнения — шаблон из пустой тренировки не сохранить."); return; }
  const name = prompt("Название шаблона:", "Моя тренировка");
  if (!name || !name.trim()) return;
  state.templates.push({
    id: "t" + Date.now(),
    name: name.trim(),
    entries: JSON.parse(JSON.stringify(d.entries)),
  });
  save(); renderWorkout();
});

window.startFromTemplate = (id) => {
  const t = state.templates.find((x) => x.id === id);
  if (!t) return;
  state.draft = {
    entries: JSON.parse(JSON.stringify(t.entries)),
    durH: 1, durM: 0,
    startedAt: Date.now(),
  };
  showActive = true;
  save(); renderWorkout();
};

window.delTemplate = (id) => {
  if (!confirm("Удалить шаблон?")) return;
  state.templates = state.templates.filter((t) => t.id !== id);
  save(); renderWorkout();
};

window.bump = (ei, si, field, delta) => {
  const s = state.draft.entries[ei].sets[si];
  s[field] = Math.max(0, s[field] + delta);
  save(); renderWorkout();
};
window.addSet = (ei) => {
  const sets = state.draft.entries[ei].sets;
  const last = sets[sets.length - 1];
  sets.push({ kg: last ? last.kg : 20, reps: last ? last.reps : 10, bw: last ? !!last.bw : false });
  save(); renderWorkout();
};
window.delSet = (ei, si) => {
  state.draft.entries[ei].sets.splice(si, 1);
  save(); renderWorkout();
};
window.removeEntry = (ei) => {
  if (!confirm("Убрать упражнение?")) return;
  state.draft.entries.splice(ei, 1);
  save(); renderWorkout();
};

/* --- Выбор упражнения: разделы -> упражнения --- */
$("btnAddExercise").addEventListener("click", () => {
  pickerGroup = null;
  $("pickerSearch").value = "";
  renderPicker();
  $("pickerModal").classList.remove("hidden");
});
$("btnClosePicker").addEventListener("click", () => $("pickerModal").classList.add("hidden"));
$("btnPickerBack").addEventListener("click", () => { pickerGroup = null; renderPicker(); });
$("pickerSearch").addEventListener("input", renderPicker);
$("pickerModal").addEventListener("click", (e) => { if (e.target.id === "pickerModal") $("pickerModal").classList.add("hidden"); });

function renderPicker() {
  const q = $("pickerSearch").value.trim();
  const ql = q.toLowerCase();
  $("btnPickerBack").classList.toggle("hidden", !pickerGroup);

  // Поиск по всем упражнениям + кнопка "добавить своё"
  if (q) {
    const found = state.exercises.filter((e) => e.name.toLowerCase().includes(ql));
    $("pickerList").innerHTML =
      found.map((e) => `
        <button class="pick-item" onclick="pickExercise('${e.id}')">
          ${gInfo(e.group).emoji} ${esc(e.name)}
        </button>`).join("") +
      `<button class="pick-add" onclick="addCustomExercise()">＋ Добавить «${esc(q)}»</button>`;
    return;
  }

  // Уровень 1: группы мышц
  if (!pickerGroup) {
    const groups = [...new Set(state.exercises.map((e) => e.group || "Прочее"))];
    $("pickerList").innerHTML = `<div class="group-grid">` + groups.map((g) => {
      const cnt = state.exercises.filter((e) => (e.group || "Прочее") === g).length;
      const gi = gInfo(g);
      return `<button class="group-tile" onclick="openGroup('${esc(g)}')" style="border-top:3px solid ${gi.color}">
        <span class="g-emoji">${gi.emoji}</span>${esc(g)}<small>${cnt} упр.</small>
      </button>`;
    }).join("") + `</div>`;
    return;
  }

  // Уровень 2: упражнения группы
  const list = state.exercises.filter((e) => (e.group || "Прочее") === pickerGroup);
  $("pickerList").innerHTML =
    `<div class="pick-group-title">${gInfo(pickerGroup).emoji} ${esc(pickerGroup)}</div>` +
    list.map((e) => `<button class="pick-item" onclick="pickExercise('${e.id}')">${esc(e.name)}</button>`).join("") +
    `<button class="pick-add" onclick="addCustomExercise('${esc(pickerGroup)}')">＋ Своё упражнение в «${esc(pickerGroup)}»</button>`;
}

window.openGroup = (g) => { pickerGroup = g; renderPicker(); };

window.pickExercise = (id) => {
  const ex = state.exercises.find((e) => e.id === id);
  if (!ex) return;
  addEntry(ex);
};

window.addCustomExercise = (group) => {
  const name = $("pickerSearch").value.trim() || prompt("Название упражнения:");
  if (!name) return;
  const ex = { id: "c" + Date.now(), name, group: group || "Прочее", custom: true };
  state.exercises.push(ex);
  addEntry(ex);
};

function addEntry(ex) {
  // подставляем вес и повторы из прошлой тренировки с этим упражнением
  let first = { kg: 20, reps: 10 };
  for (const w of state.workouts) {
    const prev = w.entries.find((e) => e.name === ex.name);
    if (prev && prev.sets.length) { first = { ...prev.sets[prev.sets.length - 1] }; break; }
  }
  state.draft.entries.push({ exerciseId: ex.id, name: ex.name, group: ex.group, sets: [first] });
  save();
  $("pickerModal").classList.add("hidden");
  renderWorkout();
}

/* ================= ИСТОРИЯ ================= */

function renderHistory() {
  const w = [...state.workouts].sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
  $("historyList").innerHTML = w.length ? w.map((x) => {
    const badges = [x.warmup && "🔥 разминка", x.stretch && "🧘 растяжка"].filter(Boolean);
    return `
      <div class="card hist-card" onclick="showDetail('${x.id}')">
        <div class="top">
          <span class="hist-date">${fmtDate(x.dateISO)}</span>
          <span class="top-right"><span class="hist-dur">⏱ ${fmtDur(x.durationMin)}</span><button class="set-del hist-del" title="Удалить" onclick="event.stopPropagation();delWorkout('${x.id}')">✕</button></span>
        </div>
        <div class="hist-ex">${x.entries.length} упр. · ${x.entries.reduce((n, e) => n + e.sets.length, 0)} подходов</div>
        ${badges.length ? `<div class="badges">${badges.map((b) => `<span class="badge">${b}</span>`).join("")}</div>` : ""}
      </div>`;
  }).join("") : '<p class="empty">Пока нет тренировок.<br>Начни первую на вкладке «Тренировка»!</p>';
}

window.delWorkout = (id) => {
  if (!confirm("Удалить тренировку из истории?")) return;
  state.workouts = state.workouts.filter((w) => w.id !== id);
  save(); renderHistory();
};

window.showDetail = (id) => {
  const w = state.workouts.find((x) => x.id === id);
  if (!w) return;
  $("detailTitle").textContent = new Date(w.dateISO).toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "short" });
  $("detailBody").innerHTML =
    `<p class="card-sub">Длительность: ${fmtDur(w.durationMin)}</p>` +
    w.entries.map((e) => `
      <div class="det-ex">
        <div class="n">${esc(e.name)}</div>
        <div class="det-sets">${e.sets.map((s, i) => `${i + 1}) ${isBw(e, s) ? "свой вес" : s.kg + " кг"} × ${s.reps}`).join(" · ")}</div>
      </div>`).join("") +
    `<button class="btn btn-primary btn-block" onclick="editWorkout('${w.id}')">✏️ Редактировать</button>`;
  $("detailModal").classList.remove("hidden");
};

// Загрузить сохранённую тренировку обратно в редактор
window.editWorkout = (id) => {
  const w = state.workouts.find((x) => x.id === id);
  if (!w) return;
  state.draft = {
    entries: JSON.parse(JSON.stringify(w.entries)),
    durH: Math.floor((w.durationMin || 0) / 60),
    durM: (w.durationMin || 0) % 60,
    wDate: dateStr(new Date(w.dateISO)),
    editId: id,
  };
  $("detailModal").classList.add("hidden");
  showActive = true;
  save();
  // переключаемся на вкладку тренировки и перерисовываем её в режиме редактора
  document.querySelector('.tab[data-screen="workout"]').click();
  renderWorkout();
};
$("btnCloseDetail").addEventListener("click", () => $("detailModal").classList.add("hidden"));
$("detailModal").addEventListener("click", (e) => { if (e.target.id === "detailModal") $("detailModal").classList.add("hidden"); });

// флаг "свой вес" может быть у подхода (s.bw) или у всего упражнения из старых записей (e.bw)
const isBw = (e, s) => (s.bw !== undefined ? !!s.bw : !!e.bw);

/* ================= ПРОГРЕСС ================= */

function renderProgress() {
  const seen = new Map();
  state.workouts.forEach((w) => w.entries.forEach((e) => { if (!seen.has(e.name)) seen.set(e.name, e); }));
  const names = [...seen.keys()];

  if (!names.length) {
    $("progressSelect").innerHTML = "";
    $("progressBody").innerHTML = '<p class="empty">После первых тренировок здесь появится прогресс по каждому упражнению.</p>';
    return;
  }

  const sel = $("progressSelect");
  const prev = sel.value;
  sel.innerHTML = names.map((n) => `<option>${esc(n)}</option>`).join("");
  if (names.includes(prev)) sel.value = prev;
  sel.onchange = renderProgressBody;
  renderProgressBody();
}

// короткая запись подходов: "60 кг × 12/11/11" или "свой вес × 5/7/8"
const fmtSets = (sets) => {
  const allBw = sets.every((s) => s.bw);
  const kgs = new Set(sets.filter((s) => !s.bw).map((s) => s.kg));
  if (allBw) return `свой вес × ${sets.map((s) => s.reps).join("/")}`;
  if (kgs.size === 1 && !allBw) return `${[...kgs][0]} кг × ${sets.map((s) => s.reps).join("/")}`;
  return sets.map((s) => `${s.bw ? "свой вес" : s.kg + " кг"}×${s.reps}`).join(" · ");
};

// попарное сравнение подходов: 1-й с 1-м, 2-й со 2-м и т.д.
const setsDiff = (prev, cur) => {
  const n = Math.min(prev.length, cur.length);
  const kgD = [], repD = [];
  for (let i = 0; i < n; i++) {
    const a = prev[i], b = cur[i];
    if (!a.bw && !b.bw && a.kg !== b.kg) kgD.push(b.kg - a.kg); // вес изменился — повторы не сравниваем
    else repD.push(b.reps - a.reps);
  }
  const parts = [];
  if (kgD.length) {
    const same = kgD.every((x) => x === kgD[0]);
    const sum = kgD.reduce((a, b) => a + b, 0);
    parts.push({
      txt: same
        ? `${kgD[0] > 0 ? "+" : ""}${kgD[0]} кг`
        : kgD.map((x) => (x > 0 ? "+" : "") + x).join("·") + " кг",
      cls: sum > 0 ? "up" : sum < 0 ? "down" : "same",
    });
  }
  // повторы по подходам с раскраской: каждое число — свой цвет
  if (repD.length && (!kgD.length || repD.some((d) => d !== 0))) {
    repD.forEach((d) => parts.push({
      txt: d === 0 ? "=" : (d > 0 ? "+" : "") + d,
      cls: d > 0 ? "up" : d < 0 ? "down" : "same",
    }));
  }
  const extra = cur.length - prev.length;
  if (extra !== 0) parts.push({ txt: (extra > 0 ? "+" : "") + extra + " подх.", cls: extra > 0 ? "up" : "down" });
  if (!parts.length) parts.push({ txt: "=", cls: "same" });
  return { parts };
};

function renderProgressBody() {
  const name = $("progressSelect").value;
  const rows = [];
  [...state.workouts].sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO)).forEach((w) => {
    w.entries.forEach((e) => {
      if (e.name !== name) return;
      const dd = new Date(w.dateISO);
      const sets = e.sets.map((s) => ({ kg: s.kg, reps: s.reps, bw: isBw(e, s) }));
      rows.push({ date: fmtDate(w.dateISO), short: `${dd.getDate()}.${dd.getMonth() + 1}`, sets });
    });
  });

  if (!rows.length) { $("progressBody").innerHTML = '<p class="empty">Нет данных</p>'; return; }

  const hasKg = (r) => r.sets.some((s) => !s.bw);
  // значение столбика: с весом — макс. кг, со своим весом — сумма повторов (чувствительнее к росту)
  const chartVal = (r) => hasKg(r)
    ? Math.max(...r.sets.filter((s) => !s.bw).map((s) => s.kg))
    : r.sets.reduce((a, s) => a + s.reps, 0);
  const unit = hasKg(rows[0]) ? "кг" : "раз";

  let chart = "";
  if (rows.length >= 2) {
    const max = Math.max(...rows.map(chartVal));
    chart = `<div class="chart">` + rows.map((r) => {
      const v = chartVal(r);
      return `<div class="col"><span class="cv">${v}${hasKg(r) ? "" : "×"}</span><div class="bar" style="height:${Math.max(5, (v / max) * 78)}%"></div><span class="cd">${r.short}</span></div>`;
    }).join("") + `</div>
    <p class="card-sub">${unit === "кг" ? "Макс. вес, кг" : "Всего повторов"} — слева старые, справа новые</p>`;
  } else {
    chart = `<p class="card-sub">Сделай ещё одну тренировку с этим упражнением — здесь появится сравнение и график.</p>`;
  }

  const list = rows.map((r, i) => {
    let txt = "—";
    if (i) {
      txt = setsDiff(rows[i - 1].sets, r.sets).parts.map((p) => `<span class="d-${p.cls}">${p.txt}</span>`).join("·");
    }
    return `<div class="prog-row"><span class="prog-date">${r.date}</span><span class="prog-val">${fmtSets(r.sets)}</span><span class="diff">${txt}</span></div>`;
  }).join("");

  $("progressBody").innerHTML = chart + list;
}

/* ================= УПРАЖНЕНИЯ ================= */

function renderExercises() {
  const groups = [...new Set(state.exercises.map((e) => e.group || "Прочее"))];
  $("newExGroup").innerHTML = groups.map((g) => `<option>${esc(g)}</option>`).join("");
  $("exerciseList").innerHTML = groups.map((g) => `
    <div class="pick-group" style="color:${gInfo(g).color}">${gInfo(g).emoji} ${esc(g)}</div>
    ${state.exercises.filter((e) => (e.group || "Прочее") === g).map((e) => `
      <div class="lib-item">
        <span>${esc(e.name)}</span>
        ${e.custom ? `<button class="set-del" onclick="delExercise('${e.id}')">✕</button>` : ""}
      </div>`).join("")}
  `).join("");
}

$("btnAddEx").addEventListener("click", () => {
  const name = $("newExName").value.trim();
  if (!name) return;
  state.exercises.push({ id: "c" + Date.now(), name, group: $("newExGroup").value, custom: true });
  $("newExName").value = "";
  save(); renderExercises();
});

window.delExercise = (id) => {
  if (!confirm("Удалить упражнение из списка?")) return;
  state.exercises = state.exercises.filter((e) => e.id !== id);
  save(); renderExercises();
};

/* ================= ТЕМЫ ================= */

function applyTheme() {
  const t = THEMES.find((x) => x.id === state.theme) || THEMES[0];
  document.body.dataset.theme = t.id;
  document.querySelector('meta[name="theme-color"]').setAttribute("content", t.sw[0]);
}

$("btnSettings").addEventListener("click", () => {
  renderThemes();
  $("settingsModal").classList.remove("hidden");
});
$("btnCloseSettings").addEventListener("click", () => $("settingsModal").classList.add("hidden"));
$("settingsModal").addEventListener("click", (e) => { if (e.target.id === "settingsModal") $("settingsModal").classList.add("hidden"); });

function renderThemes() {
  $("themeGrid").innerHTML = THEMES.map((t) => `
    <button class="theme-tile ${state.theme === t.id || (!state.theme && t.id === "dark") ? "on" : ""}" onclick="setTheme('${t.id}')">
      <span class="theme-sw" style="background:linear-gradient(135deg,${t.sw[0]} 45%,${t.sw[1]} 55%,${t.sw[2]})"></span>
      ${t.name}
    </button>`).join("");
}
window.setTheme = (id) => {
  state.theme = id;
  save(); applyTheme(); renderThemes();
};

/* --- Экспорт / импорт данных --- */
$("btnExport").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "zal-backup.json";
  a.click();
  URL.revokeObjectURL(a.href);
});
$("btnImport").addEventListener("click", () => $("importFile").click());
$("importFile").addEventListener("change", (e) => {
  const f = e.target.files[0];
  e.target.value = "";
  if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const data = JSON.parse(rd.result);
      if (!data || !Array.isArray(data.exercises) || !Array.isArray(data.workouts)) throw 0;
      if (!confirm("Импорт заменит все текущие данные. Продолжить?")) return;
      state = data;
      save();
      location.reload();
    } catch {
      alert("Не получилось прочитать файл — нужен JSON из «Экспорт данных».");
    }
  };
  rd.readAsText(f);
});

/* ================= АДМИН-ПАНЕЛЬ (секретная) ================= */

$("btnAdmin").addEventListener("click", () => {
  $("settingsModal").classList.add("hidden");
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  currentScreen = "admin";
  $("screen-admin").classList.add("active");
  $("screenTitle").textContent = "🛠 Админ-панель";
  renderAdmin();
  window.scrollTo(0, 0);
});

function renderAdmin() {
  // NoSQL View: весь объект состояния как JSON
  $("adminJson").textContent = JSON.stringify(state, null, 2);

  // SQL View, таблица 1: тренировки
  const wRows = state.workouts.map((w) =>
    `<tr><td>${esc(w.id)}</td><td>${esc(fmtDate(w.dateISO))}</td><td>${esc(fmtDur(w.durationMin))}</td><td>${w.sauna && w.sauna.length ? w.sauna.length + " заход(а)" : "—"}</td></tr>`
  ).join("");
  $("adminTableWorkouts").innerHTML =
    `<table class="tbl"><thead><tr><th>ID</th><th>Дата</th><th>Длит.</th><th>Сауна</th></tr></thead>` +
    `<tbody>${wRows || '<tr><td colspan="4">пусто</td></tr>'}</tbody></table>`;

  // SQL View, таблица 2: подходы (каждый подход — отдельная строка)
  const sRows = [];
  state.workouts.forEach((w) => w.entries.forEach((e) => e.sets.forEach((s) => {
    sRows.push(`<tr><td>${esc(w.id)}</td><td>${esc(e.name)}</td><td>${isBw(e, s) ? "свой вес" : s.kg + " кг"}</td><td>${s.reps}</td></tr>`);
  })));
  $("adminTableSets").innerHTML =
    `<table class="tbl"><thead><tr><th>ID трен.</th><th>Упражнение</th><th>Вес</th><th>Повт.</th></tr></thead>` +
    `<tbody>${sRows.join("") || '<tr><td colspan="4">пусто</td></tr>'}</tbody></table>`;
}

/* --- PWA --- */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

applyTheme();
showActive = !!state.draft; // незавершённая тренировка открывается сразу
renderWorkout();
if (state.draft && state.draft.scrollY) window.scrollTo(0, state.draft.scrollY);
