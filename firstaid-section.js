/* =========================================================================
   First Aid + National Helplines renderer for Pringle Info
   -------------------------------------------------------------------------
   This snippet is a REFERENCE so you can adjust index.html's frontend to
   render the new data that was added to data.js:

     APP.firstAid.groups[].guides[]   — medical emergency quick guides
     APP.helplines.entries[]          — national SA toll-free numbers

   HOW TO USE
   Paste the code block below INSIDE the main IIFE in index.html — the
   recommended spot is right AFTER the checklist render block (after the
   `results.insertAdjacentHTML("beforeend", ...)` that builds #cat-checklist)
   and BEFORE the search wiring, so that:

     • the new cards get `data-q` attributes => the existing search bar
       filters them automatically, and
     • `applySearch()` (which hides any `.cat` with no visible articles)
       treats them like every other category.

   The snippet reuses the existing helpers ($, $$, esc, digits, ICONS,
   cardHTML) that are already defined inside the IIFE — so place it inside
   that same IIFE scope. No new dependencies.
   ========================================================================= */

// =========================================================================
// 1) FIRST AID — one big accordion, one expandable card per emergency
// =========================================================================
results.insertAdjacentHTML("beforeend", `
  <details id="cat-firstaid" class="cat rounded-lg border border-red-300 bg-white shadow-sm overflow-hidden dark:border-red-500/40 dark:bg-stone-900" open>
    <summary class="flex cursor-pointer select-none items-center gap-3 px-4 py-3.5 hover:bg-red-50 dark:hover:bg-stone-800/60">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-600 text-white text-base">🩺</span>
      <span class="flex-1 min-w-0">
        <span class="block text-[15px] font-bold leading-tight">First Aid Quick Guides</span>
        <span class="block text-xs text-stone-500 dark:text-stone-400">${esc(APP.firstAid.intro)}</span>
      </span>
      <span class="chevron shrink-0 text-stone-400">${ICONS.chev}</span>
    </summary>
    <div class="px-4 pb-4 pt-1 border-t border-red-100 space-y-3 dark:border-red-500/20">
      ${APP.firstAid.groups.map(g => `
        <div>
          <h4 class="text-[13px] font-bold uppercase tracking-wide text-stone-500 mt-2 dark:text-stone-400">${esc(g.t)}</h4>
          <div class="space-y-2 mt-1">
            ${g.guides.map(gd => {
              const q = norm([gd.t, gd.e || "", ...(gd.signs||[]), ...(gd.do||[]), ...(gd.dont||[])].join(" "));
              const call = (gd.call||[]).map(c => `
                <a class="dial inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-extrabold text-stone-900 hover:border-brand hover:bg-brand hover:text-white dark:border-stone-600 dark:bg-stone-700/40 dark:text-stone-100"
                   href="tel:${digits(c.d)}">${ICONS.phone}${esc(c.d)} <span class="font-semibold text-xs opacity-80">${esc(c.l||"")}</span></a>`).join("");
              const block = (label, items, cls) => (items && items.length) ? `
                <div class="mt-2">
                  <div class="text-[11px] font-bold uppercase tracking-wide ${cls}">${label}</div>
                  <ul class="text-[13px] leading-snug space-y-0.5 mt-0.5">${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
                </div>` : "";
              return `
                <details class="cat rounded-lg border border-stone-200 bg-stone-50 overflow-hidden dark:border-stone-700 dark:bg-stone-800">
                  <summary class="flex cursor-pointer select-none items-center gap-2 px-3 py-2.5 hover:bg-stone-100 dark:hover:bg-stone-700/50">
                    <span class="flex-1 min-w-0 text-[14px] font-bold leading-tight">${gd.e ? esc(gd.e) + " " : ""}${esc(gd.t)}</span>
                    <span class="chevron shrink-0 text-stone-400">${ICONS.chev}</span>
                  </summary>
                  <article class="border-t border-stone-200 p-3 dark:border-stone-700" data-q="${esc(q)}">
                    ${block("Signs", gd.signs, "text-red-600 dark:text-red-400")}
                    ${block("What to do", gd.do, "text-green-700 dark:text-green-400")}
                    ${block("Avoid", gd.dont, "text-orange-600 dark:text-orange-400")}
                    ${call ? `<div class="mt-2 flex flex-wrap gap-2">${call}</div>` : ""}
                  </article>
                </details>`;
            }).join("")}
          </div>
        </div>`).join("")}
    </div>
  </details>`);

// =========================================================================
// 2) NATIONAL HELPLINES — reuses cardHTML (same {t, n[]} shape as categories)
// =========================================================================
results.insertAdjacentHTML("beforeend", `
  <details id="cat-helplines" class="cat rounded-lg border border-stone-200 bg-white shadow-sm overflow-hidden dark:border-stone-700 dark:bg-stone-900">
    <summary class="flex cursor-pointer select-none items-center gap-3 px-4 py-3.5 hover:bg-stone-50 dark:hover:bg-stone-800/60">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-stone-700 text-white text-sm font-extrabold">☎</span>
      <span class="flex-1 min-w-0">
        <span class="block text-[15px] font-bold leading-tight">National Helplines (SA)</span>
        <span class="block text-xs text-stone-500 dark:text-stone-400">${esc(APP.helplines.intro)}</span>
      </span>
      <span class="text-xs font-semibold text-stone-400 tabular-nums">${APP.helplines.entries.length}</span>
      <span class="chevron shrink-0 text-stone-400">${ICONS.chev}</span>
    </summary>
    <div class="px-4 pb-4 pt-1 border-t border-stone-100 space-y-2">
      ${APP.helplines.entries.map(e => cardHTML(e, "helplines")).join("")}
    </div>
  </details>`);