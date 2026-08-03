#!/usr/bin/env node
/**
 * Validador de contenido de Portapapeles.
 *
 * El simulacro es un único index.html, así que este script extrae el bloque
 * de datos delimitado por los marcadores DATA:START / DATA:END, lo evalúa en
 * aislamiento y comprueba las invariantes que un error humano rompe con
 * facilidad: segmentos sensibles sin explicación, documentos sin contraste
 * pedagógico, categorías de riesgo inventadas o promesas del README que el
 * código ya no cumple.
 *
 * Uso:  node tools/validate.mjs [ruta/al/index.html]
 * Sale con código 1 si hay algún error.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(process.argv[2] || resolve(HERE, "..", "index.html"));

const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

/* ------------------------------------------------------------------ */
/* 1. Extracción del bloque de datos                                   */
/* ------------------------------------------------------------------ */
const html = readFileSync(FILE, "utf8");

const iStart = html.indexOf("/* @DATA:START");
const iEnd = html.indexOf("/* @DATA:END */");
if (iStart === -1 || iEnd === -1 || iEnd < iStart) {
  console.error("✖ No se encuentran los marcadores DATA:START / DATA:END en " + FILE);
  process.exit(1);
}
const dataSrc = html.slice(html.indexOf("*/", iStart) + 2, iEnd);

let DATA;
try {
  DATA = new Function(
    dataSrc + "\nreturn {DOCS, CHECKS, TOOLS, RIESGOS, RIESGO_MAP, BADGES};"
  )();
} catch (e) {
  console.error("✖ El bloque de datos no evalúa: " + e.message);
  process.exit(1);
}
const { DOCS, CHECKS, TOOLS, RIESGOS, RIESGO_MAP, BADGES } = DATA;

const PICK_DOCS = 4, PICK_CHECKS = 3;

/* ------------------------------------------------------------------ */
/* 2. Segmentos: el corazón de los módulos 1 y 2                       */
/* ------------------------------------------------------------------ */
function checkSegs(at, segs) {
  if (!Array.isArray(segs) || segs.length < 3) {
    err(`${at}: "segs" debe tener al menos 3 segmentos`);
    return;
  }
  let sensibles = 0, seguros = 0;
  segs.forEach((sg, i) => {
    const sat = `${at}, segmento ${i}`;
    if (typeof sg.t !== "string" || !sg.t.length) err(`${sat}: sin texto "t"`);
    if (sg.t === "¶") return;
    if (sg.s === true) {
      sensibles++;
      // Sin explicación, el participante ve que ha fallado pero no aprende por qué
      if (!sg.w || sg.w.length < 25)
        err(`${sat}: un segmento sensible necesita una explicación "w" con sustancia`);
    } else {
      seguros++;
      if (sg.w) warn(`${sat}: segmento no sensible con "w"; no se llegará a mostrar`);
    }
  });
  if (!seguros) err(`${at}: no hay ningún segmento seguro; el ejercicio se resuelve tapándolo todo`);
  return { sensibles, seguros };
}

/* ------------------------------------------------------------------ */
/* 3. Documentos del módulo 1                                          */
/* ------------------------------------------------------------------ */
const idsDoc = new Set();
let conNoIA = 0, sinSensibles = 0, conSensibles = 0;

for (const d of DOCS) {
  const at = "documento " + (d.id || "SIN ID");
  for (const f of ["id", "titulo", "origen", "tarea", "segs", "why"])
    if (!d[f]) err(`${at}: falta el campo "${f}"`);
  if (idsDoc.has(d.id)) err(`${at}: id duplicado`);
  idsDoc.add(d.id);
  if (typeof d.noIA !== "boolean") err(`${at}: "noIA" debe ser booleano`);
  if (d.why && d.why.length < 80) warn(`${at}: la explicación final es muy corta`);

  const r = checkSegs(at, d.segs) || {};
  if (d.noIA) conNoIA++;
  else if (!r.sensibles) sinSensibles++;
  else conSensibles++;
}

// El sorteo garantiza un documento que no debe ir a la IA y otro sin nada que
// tapar. Sin ellos, una partida enseñaría solo la mitad de la lección.
if (conNoIA < 1) err('debe existir al menos un documento con noIA:true ("esta tarea no va a la IA")');
if (sinSensibles < 1) err("debe existir al menos un documento sin nada sensible, para penalizar el exceso de celo");
if (conNoIA + sinSensibles + conSensibles < PICK_DOCS)
  err(`el banco tiene ${DOCS.length} documentos y el sorteo necesita ${PICK_DOCS}`);
if (conSensibles < PICK_DOCS - 2)
  err(`hacen falta al menos ${PICK_DOCS - 2} documentos con datos sensibles para completar el sorteo`);

/* ------------------------------------------------------------------ */
/* 4. Respuestas del módulo 2                                          */
/* ------------------------------------------------------------------ */
const idsChk = new Set();
let checksLimpias = 0;

for (const c of CHECKS) {
  const at = "respuesta " + (c.id || "SIN ID");
  for (const f of ["id", "titulo", "pedido", "segs", "why"])
    if (!c[f]) err(`${at}: falta el campo "${f}"`);
  if (idsChk.has(c.id)) err(`${at}: id duplicado`);
  idsChk.add(c.id);
  const r = checkSegs(at, c.segs) || {};
  if (!r.sensibles) checksLimpias++;
}
if (checksLimpias < 1)
  err("debe existir al menos una respuesta correcta entera, para enseñar a no marcar de más");
if (CHECKS.length < PICK_CHECKS)
  err(`hay ${CHECKS.length} respuestas y el sorteo necesita ${PICK_CHECKS}`);

/* ------------------------------------------------------------------ */
/* 5. Situaciones del módulo 3                                         */
/* ------------------------------------------------------------------ */
const idsTool = new Set();
for (const t of TOOLS) {
  const at = "situación " + (t.id || "SIN ID");
  for (const f of ["id", "titulo", "situacion", "opts", "why"])
    if (!t[f]) err(`${at}: falta el campo "${f}"`);
  if (idsTool.has(t.id)) err(`${at}: id duplicado`);
  idsTool.add(t.id);

  if (!Array.isArray(t.opts) || t.opts.length < 2) err(`${at}: necesita al menos 2 opciones`);
  let positiva = false;
  (t.opts || []).forEach((o, i) => {
    const oat = `${at}, opción ${i + 1}`;
    if (!o.t) err(`${oat}: sin texto`);
    if (typeof o.v !== "number") err(`${oat}: "v" debe ser numérico`);
    if (!["good", "mid", "bad"].includes(o.k)) err(`${oat}: "k" debe ser good | mid | bad`);
    if (!o.fb) err(`${oat}: sin retroalimentación "fb"`);
    if (o.v > 0) positiva = true;
    if (o.v > 0 && o.k === "bad") err(`${oat}: puntúa positivo pero está marcada como "bad"`);
    if (o.v < 0 && o.k === "good") err(`${oat}: puntúa negativo pero está marcada como "good"`);
  });
  if (!positiva) err(`${at}: ninguna opción correcta; el participante no puede acertar`);
}

/* ------------------------------------------------------------------ */
/* 6. Categorías de riesgo                                             */
/* ------------------------------------------------------------------ */
for (const [id, r] of Object.entries(RIESGOS)) {
  if (!r.n) err(`riesgo "${id}": sin nombre`);
  if (!r.d || r.d.length < 30) err(`riesgo "${id}": sin descripción con sustancia`);
}
const usados = new Set();
const entidades = new Set([...idsDoc, ...idsChk, ...idsTool]);
for (const [ent, list] of Object.entries(RIESGO_MAP)) {
  if (!entidades.has(ent)) err(`el mapeo de riesgos incluye "${ent}", que no corresponde a ningún contenido`);
  if (!Array.isArray(list) || !list.length) err(`"${ent}" no declara ninguna categoría de riesgo`);
  for (const r of list || []) {
    if (!(r in RIESGOS)) err(`"${ent}" usa la categoría "${r}", que no está definida`);
    usados.add(r);
  }
}
for (const r of Object.keys(RIESGOS))
  if (!usados.has(r)) warn(`la categoría "${r}" está definida pero no la usa ningún contenido`);
for (const d of DOCS)
  if (d.segs.some((s) => s.s) && !RIESGO_MAP[d.id])
    err(`el documento ${d.id} tiene datos sensibles pero no está mapeado a ninguna categoría de riesgo`);
for (const t of TOOLS)
  if (!RIESGO_MAP[t.id]) err(`la situación ${t.id} no está mapeada a ninguna categoría de riesgo`);

/* ------------------------------------------------------------------ */
/* 7. Logros                                                           */
/* ------------------------------------------------------------------ */
const idsBadge = new Set();
for (const b of BADGES) {
  for (const f of ["id", "ic", "n", "d"]) if (!b[f]) err(`logro ${b.id || "?"}: falta "${f}"`);
  if (idsBadge.has(b.id)) err(`logro ${b.id}: id duplicado`);
  idsBadge.add(b.id);
  if (!html.includes(`grant("${b.id}")`)) err(`logro "${b.id}": nunca se concede en el código`);
}

/* ------------------------------------------------------------------ */
/* 8. Promesas del proyecto                                            */
/* ------------------------------------------------------------------ */
const banned = [
  [/<script[^>]+src=/i, "script externo: el simulacro debe ser un único archivo autocontenido"],
  [/\blocalStorage\b/, "localStorage: el proyecto declara no almacenar nada en el navegador"],
  [/\bsessionStorage\b/, "sessionStorage: el proyecto declara no almacenar nada"],
  [/document\.cookie/, "cookies: el proyecto declara no usarlas"],
  [/\bfetch\s*\(/, "fetch(): el simulacro no debe hacer peticiones de red"],
  [/XMLHttpRequest/, "XMLHttpRequest: el simulacro no debe hacer peticiones de red"],
  [/<link[^>]+href="https?:/i, "hoja de estilos remota: rompe el funcionamiento sin conexión"],
  [/@import\s+url\(/i, "@import remoto: rompe el funcionamiento sin conexión"]
];
for (const [re, msg] of banned) if (re.test(html)) err("integridad — " + msg);

const cfg = html.match(/const CONFIG = \{[\s\S]*?\};/);
if (!cfg) err("personalización: no se encuentra el bloque CONFIG");
else for (const k of ["empresa", "logoUrl", "color", "colorOsc", "contacto"])
  if (!new RegExp("\\b" + k + "\\s*:").test(cfg[0])) err(`personalización: CONFIG no define "${k}"`);
if (!/applyConfig\(\)/.test(html)) err("personalización: CONFIG se define pero no se aplica");

if (!/<html[^>]+lang="es"/.test(html)) err('accesibilidad: falta lang="es" en <html>');
if (!/prefers-reduced-motion/.test(html)) err("accesibilidad: no se respeta prefers-reduced-motion");
if (!/aria-live/.test(html)) err("accesibilidad: no hay ninguna región aria-live");
if (!/class="skip"/.test(html)) err("accesibilidad: falta el enlace de salto al contenido");
// Los segmentos son el control principal: tienen que ser accesibles por teclado
if (!/class="seg"[^>]*tabindex="0"/.test(html) && !/tabindex="0"[^>]*class="seg"/.test(html))
  err("accesibilidad: los segmentos no son alcanzables con el teclado");
if (!/aria-pressed/.test(html)) err("accesibilidad: los segmentos no comunican su estado con aria-pressed");

/* ------------------------------------------------------------------ */
/* 9. Informe                                                          */
/* ------------------------------------------------------------------ */
const totalSegs = [...DOCS, ...CHECKS].reduce((a, x) => a + x.segs.filter((s) => s.t !== "¶").length, 0);
const totalSens = [...DOCS, ...CHECKS].reduce((a, x) => a + x.segs.filter((s) => s.s).length, 0);

console.log("Portapapeles · validación de contenido");
console.log("─".repeat(54));
[
  ["documentos", `${DOCS.length} (${conNoIA} sin IA / ${sinSensibles} sin nada que tapar)`],
  ["respuestas de IA", `${CHECKS.length} (${checksLimpias} sin nada que marcar)`],
  ["situaciones", TOOLS.length],
  ["segmentos", `${totalSegs} (${totalSens} sensibles)`],
  ["categorías de riesgo", usados.size],
  ["logros", BADGES.length]
].forEach(([k, v]) => console.log("  " + k.padEnd(24) + v));
console.log("─".repeat(54));

for (const w of warns) console.log("⚠ aviso  " + w);
for (const e of errors) console.log("✖ error  " + e);

if (errors.length) {
  console.log(`\n${errors.length} error(es). El contenido no es consistente.`);
  process.exit(1);
}
console.log(`\n✔ Sin errores${warns.length ? ` (${warns.length} aviso(s))` : ""}.`);
