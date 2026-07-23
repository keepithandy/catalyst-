"use strict";

const STORAGE_KEY = "catalyst-prototype-v0.1";

const INGREDIENTS = [
  { id: "cinder-bloom", name: "Cinder Bloom", icon: "✺", rarity: "Common", value: 18, habitat: "Ash fields", traits: ["Heated", "Volatile"], effects: ["Warmth", "Emberguard", "Irritation"], conflicts: ["Frost", "Sedative"], description: "A dry red flower whose petals retain heat long after harvesting." },
  { id: "frostcap", name: "Frostcap", icon: "◌", rarity: "Common", value: 16, habitat: "Cold caverns", traits: ["Chilled", "Brittle"], effects: ["Frost", "Focus", "Numbness"], conflicts: ["Warmth", "Volatile"], description: "A pale mushroom that forms a skin of ice when exposed to open air." },
  { id: "moon-thistle", name: "Moon Thistle", icon: "✦", rarity: "Uncommon", value: 31, habitat: "Moonlit slopes", traits: ["Luminous", "Calming"], effects: ["Focus", "Dreamsight", "Sedative"], conflicts: ["Irritation", "Volatile"], description: "Its silver barbs glow faintly and are traditionally steeped under moonlight." },
  { id: "ironroot", name: "Ironroot", icon: "⌁", rarity: "Common", value: 22, habitat: "Rocky soil", traits: ["Dense", "Earthbound"], effects: ["Fortify", "Stability", "Slow"], conflicts: ["Levitation"], description: "A dense root with mineral fibers that ring softly against stone." },
  { id: "gloom-moss", name: "Gloom Moss", icon: "≋", rarity: "Uncommon", value: 28, habitat: "Ruined wells", traits: ["Shadowed", "Absorbent"], effects: ["Veil", "Numbness", "Toxin Filter"], conflicts: ["Luminous"], description: "Velvet-black moss prized for absorbing both moisture and magical residue." },
  { id: "sunscale", name: "Sunscale", icon: "◇", rarity: "Rare", value: 58, habitat: "Desert ruins", traits: ["Luminous", "Resonant"], effects: ["Radiance", "Emberguard", "Restoration"], conflicts: ["Shadowed", "Veil"], description: "A brittle golden scale shed by desert drakes during the high summer." },
  { id: "whisper-reed", name: "Whisper Reed", icon: "〽", rarity: "Common", value: 19, habitat: "Riverbanks", traits: ["Hollow", "Airborne"], effects: ["Levitation", "Hearing", "Clarity"], conflicts: ["Dense", "Slow"], description: "A hollow reed that hums when held near moving water." },
  { id: "grave-salt", name: "Grave Salt", icon: "▱", rarity: "Uncommon", value: 34, habitat: "Old crypts", traits: ["Dry", "Purifying"], effects: ["Toxin Filter", "Spirit Ward", "Preservation"], conflicts: ["Restoration"], description: "Gray mineral crystals gathered from ancient protective circles." },
  { id: "bloodberry", name: "Bloodberry", icon: "●", rarity: "Common", value: 20, habitat: "Thorn marsh", traits: ["Juicy", "Vital"], effects: ["Restoration", "Vigor", "Irritation"], conflicts: ["Preservation"], description: "A sharp berry with crimson juice used in basic restorative brews." },
  { id: "star-aniseed", name: "Star Aniseed", icon: "✧", rarity: "Rare", value: 66, habitat: "High observatories", traits: ["Aromatic", "Resonant"], effects: ["Clarity", "Dreamsight", "Spirit Ward"], conflicts: ["Numbness"], description: "A star-shaped seed pod that resonates with focused magical intent." },
  { id: "mire-leech", name: "Mire Leech", icon: "◒", rarity: "Uncommon", value: 37, habitat: "Deep marsh", traits: ["Living", "Absorbent"], effects: ["Drain", "Toxin Filter", "Vigor"], conflicts: ["Radiance"], description: "An alchemical specimen used carefully for transference and filtration." },
  { id: "stormglass", name: "Stormglass", icon: "⬡", rarity: "Rare", value: 74, habitat: "Lightning scars", traits: ["Charged", "Brittle"], effects: ["Haste", "Clarity", "Shock Ward"], conflicts: ["Stability", "Sedative"], description: "Translucent glass created where lightning fuses mineral-rich sand." },
  { id: "ember-wasp-wing", name: "Ember Wasp Wing", icon: "⌁", rarity: "Uncommon", value: 39, habitat: "Burnt orchards", traits: ["Heated", "Airborne"], effects: ["Haste", "Warmth", "Levitation"], conflicts: ["Frost"], description: "A papery wing that crackles with residual heat when ground." },
  { id: "deep-pearl", name: "Deep Pearl", icon: "◉", rarity: "Mythic", value: 140, habitat: "Sunken sanctums", traits: ["Resonant", "Purifying"], effects: ["Restoration", "Spirit Ward", "Focus"], conflicts: ["Toxin"], description: "A near-perfect pearl associated with exceptionally stable brews." },
  { id: "witch-fern", name: "Witch Fern", icon: "♧", rarity: "Common", value: 17, habitat: "Old forests", traits: ["Calming", "Earthbound"], effects: ["Sedative", "Stability", "Preservation"], conflicts: ["Haste"], description: "A broad fern used to settle unstable reactions and preserve mixtures." },
  { id: "void-ink", name: "Void Ink", icon: "◐", rarity: "Mythic", value: 155, habitat: "Unknown", traits: ["Shadowed", "Volatile"], effects: ["Veil", "Dreamsight", "Drain"], conflicts: ["Radiance", "Stability"], description: "A rare black fluid that seems to absorb the edges of nearby light." }
];

const DEFAULT_STATE = {
  discovered: ["cinder-bloom", "frostcap", "moon-thistle", "ironroot", "bloodberry", "witch-fern"],
  pinned: ["moon-thistle", "ironroot"],
  recipes: [
    { id: "starter-focus", name: "Clearwake Tonic", ingredients: ["frostcap", "moon-thistle"], effects: ["Focus"], compatibility: 82, rarity: "Uncommon", value: 58, favorite: true, createdAt: "2026-07-21T08:00:00.000Z" }
  ],
  plans: [
    { id: "plan-1", text: "Test a stable restorative base", done: false },
    { id: "plan-2", text: "Compare Frostcap ratios", done: true }
  ],
  notes: "Catalyst stores these notes separately from the Alchemy Game save.\n\nInitial theory: calming traits may reduce volatility penalties.",
  recent: [
    { id: "activity-1", type: "recipe", text: "Saved Clearwake Tonic", at: "2026-07-21T08:00:00.000Z" },
    { id: "activity-2", type: "pin", text: "Pinned Ironroot", at: "2026-07-21T07:55:00.000Z" }
  ],
  importLog: "No imports have been run."
};

let state = loadState();
let labSelection = [];
let toastTimer;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return clone(DEFAULT_STATE);
    return { ...clone(DEFAULT_STATE), ...JSON.parse(saved) };
  } catch (error) {
    console.warn("Catalyst state could not be loaded:", error);
    return clone(DEFAULT_STATE);
  }
}

function saveState(message = "Saved locally") {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const status = $("#saveStatus");
    status.textContent = message;
    clearTimeout(status._timer);
    status._timer = setTimeout(() => { status.textContent = "Local data ready"; }, 1800);
  } catch (error) {
    console.error("Catalyst state could not be saved:", error);
    showToast("Local save failed in this browser.");
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
}

function getIngredient(id) {
  return INGREDIENTS.find((ingredient) => ingredient.id === id);
}

function isDiscovered(id) {
  return state.discovered.includes(id);
}

function addActivity(type, text) {
  state.recent.unshift({ id: crypto.randomUUID?.() || `activity-${Date.now()}`, type, text, at: new Date().toISOString() });
  state.recent = state.recent.slice(0, 10);
}

function navigate(target) {
  $$(".view").forEach((view) => view.classList.toggle("active", view.dataset.view === target));
  $$(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.target === target));
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (target === "dashboard") renderDashboard();
  if (target === "codex") renderCodex();
  if (target === "lab") renderLab();
  if (target === "notebook") renderNotebook();
  if (target === "planner") renderPlanner();
  if (target === "data") renderData();
}

function renderDashboard() {
  const discoveredCount = state.discovered.length;
  const favoriteCount = state.recipes.filter((recipe) => recipe.favorite).length;
  const pendingPlans = state.plans.filter((plan) => !plan.done).length;
  const metrics = [
    ["Ingredients known", discoveredCount],
    ["Recipes saved", state.recipes.length],
    ["Favorite formulas", favoriteCount],
    ["Planned brews", pendingPlans]
  ];
  $("#metricGrid").innerHTML = metrics.map(([label, value]) => `
    <article class="metric-card"><span>${label}</span><strong>${value}</strong></article>
  `).join("");

  const recent = state.recent.slice(0, 5);
  $("#recentActivity").innerHTML = recent.length ? recent.map((item) => `
    <div class="activity-row">
      <span class="activity-dot"></span>
      <div class="activity-copy"><strong>${escapeHtml(item.text)}</strong><small>${formatDate(item.at)}</small></div>
    </div>
  `).join("") : '<div class="empty-copy">No tracked activity yet.</div>';
}

function renderCodex() {
  const query = $("#ingredientSearch").value.trim().toLowerCase();
  const rarity = $("#rarityFilter").value;
  const discovery = $("#discoveryFilter").value;
  const filtered = INGREDIENTS.filter((ingredient) => {
    const searchable = [ingredient.name, ingredient.rarity, ingredient.habitat, ...ingredient.traits, ...ingredient.effects].join(" ").toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesRarity = rarity === "all" || ingredient.rarity === rarity;
    const discovered = isDiscovered(ingredient.id);
    const matchesDiscovery = discovery === "all"
      || (discovery === "discovered" && discovered)
      || (discovery === "unknown" && !discovered)
      || (discovery === "pinned" && state.pinned.includes(ingredient.id));
    return matchesQuery && matchesRarity && matchesDiscovery;
  });

  $("#codexCount").textContent = `${filtered.length} shown`;
  $("#ingredientGrid").innerHTML = filtered.length ? filtered.map(renderIngredientCard).join("") : '<div class="empty-copy">No ingredients match these filters.</div>';
}

function renderIngredientCard(ingredient) {
  const discovered = isDiscovered(ingredient.id);
  const pinned = state.pinned.includes(ingredient.id);
  const effects = discovered ? ingredient.effects : ["Unknown", "Unknown", "Unknown"];
  return `
    <article class="ingredient-card ${discovered ? "" : "unknown"}">
      <div class="ingredient-visual">${discovered ? ingredient.icon : "?"}</div>
      <div class="ingredient-content">
        <div class="ingredient-title-row">
          <div><span class="rarity">${ingredient.rarity}</span><h3>${discovered ? ingredient.name : "Undiscovered Ingredient"}</h3></div>
        </div>
        <p class="ingredient-meta">${discovered ? `${ingredient.habitat} · ${ingredient.value}g estimate` : "Research data concealed"}</p>
        <div class="effect-tags">${effects.map((effect) => `<span class="tag">${effect}</span>`).join("")}</div>
        <div class="card-actions">
          <button class="secondary" data-action="details" data-id="${ingredient.id}">${discovered ? "Inspect" : "Reveal"}</button>
          <button class="icon-button ${pinned ? "active" : ""}" data-action="pin" data-id="${ingredient.id}" aria-label="${pinned ? "Unpin" : "Pin"} ${ingredient.name}">◆</button>
        </div>
      </div>
    </article>
  `;
}

function renderLab() {
  const query = $("#labSearch").value.trim().toLowerCase();
  const available = INGREDIENTS.filter((ingredient) => isDiscovered(ingredient.id) && ingredient.name.toLowerCase().includes(query));
  $("#labSelectionCount").textContent = `${labSelection.length} / 3`;
  $("#labIngredientList").innerHTML = available.map((ingredient) => {
    const selected = labSelection.includes(ingredient.id);
    const disabled = !selected && labSelection.length >= 3;
    return `
      <div class="picker-row ${selected ? "selected" : ""}">
        <div class="picker-icon">${ingredient.icon}</div>
        <div class="picker-copy"><strong>${ingredient.name}</strong><small>${ingredient.rarity} · ${ingredient.effects.slice(0,2).join(" / ")}</small></div>
        <button class="${selected ? "ghost" : "secondary"}" data-lab-id="${ingredient.id}" ${disabled ? "disabled" : ""}>${selected ? "Remove" : "Add"}</button>
      </div>
    `;
  }).join("");
  renderLabResult();
}

function analyzeMixture(ids) {
  const ingredients = ids.map(getIngredient).filter(Boolean);
  const effectCounts = new Map();
  ingredients.forEach((ingredient) => ingredient.effects.forEach((effect) => effectCounts.set(effect, (effectCounts.get(effect) || 0) + 1)));
  const sharedEffects = [...effectCounts.entries()].filter(([, count]) => count >= 2).map(([effect]) => effect);
  const allEffects = [...new Set(ingredients.flatMap((ingredient) => ingredient.effects))];

  const conflictPairs = [];
  for (let i = 0; i < ingredients.length; i += 1) {
    for (let j = i + 1; j < ingredients.length; j += 1) {
      const a = ingredients[i];
      const b = ingredients[j];
      const conflicts = a.conflicts.filter((conflict) => b.effects.includes(conflict) || b.traits.includes(conflict));
      const reverse = b.conflicts.filter((conflict) => a.effects.includes(conflict) || a.traits.includes(conflict));
      [...new Set([...conflicts, ...reverse])].forEach((conflict) => conflictPairs.push(`${a.name} × ${b.name}: ${conflict}`));
    }
  }

  const baseScore = 44 + (sharedEffects.length * 24) + (ingredients.length === 3 ? 8 : 0);
  const conflictPenalty = conflictPairs.length * 17;
  const compatibility = Math.max(8, Math.min(98, baseScore - conflictPenalty));
  const baseValue = ingredients.reduce((sum, ingredient) => sum + ingredient.value, 0);
  const value = Math.round(baseValue * (0.72 + compatibility / 100) * (1 + sharedEffects.length * 0.18));
  const rarityRank = ingredients.reduce((max, ingredient) => Math.max(max, ["Common", "Uncommon", "Rare", "Mythic"].indexOf(ingredient.rarity)), 0);
  const adjustedRank = Math.min(3, rarityRank + (sharedEffects.length >= 2 ? 1 : 0));
  const rarity = ["Common", "Uncommon", "Rare", "Mythic"][adjustedRank];
  const stability = compatibility >= 80 ? "Stable" : compatibility >= 55 ? "Conditional" : "Volatile";

  return { ingredients, sharedEffects, allEffects, conflictPairs, compatibility, value, rarity, stability };
}

function renderLabResult() {
  const root = $("#labResult");
  if (labSelection.length < 2) {
    root.className = "empty-state";
    root.innerHTML = '<div class="empty-orb">+</div><h4>Add at least two ingredients</h4><p>Catalyst will estimate shared effects, conflict risk, rarity, and value.</p>';
    return;
  }
  const result = analyzeMixture(labSelection);
  const primaryEffects = result.sharedEffects.length ? result.sharedEffects : result.allEffects.slice(0, 3);
  root.className = "result-stack";
  root.innerHTML = `
    <div class="selected-mixture">${result.ingredients.map((ingredient) => `<span class="selected-chip">${ingredient.icon} ${ingredient.name}</span>`).join("")}</div>
    <div class="compatibility-score">
      <div class="score-ring" style="--score:${result.compatibility}%;"><strong>${result.compatibility}</strong></div>
      <div><span class="section-kicker">Compatibility</span><h3>${result.stability} reaction</h3><p>${result.sharedEffects.length ? `${result.sharedEffects.length} shared effect${result.sharedEffects.length === 1 ? "" : "s"} found.` : "No shared effect has been confirmed."}</p></div>
    </div>
    <div class="result-grid">
      <div class="result-metric"><span>Est. rarity</span><strong>${result.rarity}</strong></div>
      <div class="result-metric"><span>Est. value</span><strong>${result.value}g</strong></div>
      <div class="result-metric"><span>Conflict flags</span><strong>${result.conflictPairs.length}</strong></div>
    </div>
    <div class="result-section"><h4>Projected effects</h4><div class="effect-tags">${primaryEffects.map((effect) => `<span class="tag">${effect}</span>`).join("")}</div></div>
    <div class="result-section"><h4>Compatibility notes</h4>${result.conflictPairs.length ? `<div class="effect-tags">${result.conflictPairs.map((conflict) => `<span class="tag conflict">${escapeHtml(conflict)}</span>`).join("")}</div>` : '<p>No direct conflict flags found in the current prototype model.</p>'}</div>
    <div class="result-section">
      <h4>Save formula</h4>
      <input class="recipe-name-input" id="recipeNameInput" maxlength="60" value="${generateRecipeName(result)}" aria-label="Recipe name" />
      <button class="primary" id="saveRecipe" style="width:100%;margin-top:10px;">Save to Notebook</button>
    </div>
  `;
}

function generateRecipeName(result) {
  const effect = result.sharedEffects[0] || result.allEffects[0] || "Unknown";
  const suffix = result.stability === "Stable" ? "Tonic" : result.stability === "Conditional" ? "Draught" : "Compound";
  return `${effect} ${suffix}`;
}

function saveCurrentRecipe() {
  const result = analyzeMixture(labSelection);
  const input = $("#recipeNameInput");
  const name = input?.value.trim() || generateRecipeName(result);
  const recipe = {
    id: crypto.randomUUID?.() || `recipe-${Date.now()}`,
    name,
    ingredients: [...labSelection],
    effects: result.sharedEffects.length ? result.sharedEffects : result.allEffects.slice(0, 3),
    compatibility: result.compatibility,
    rarity: result.rarity,
    value: result.value,
    favorite: false,
    createdAt: new Date().toISOString()
  };
  state.recipes.unshift(recipe);
  addActivity("recipe", `Saved ${name}`);
  saveState("Recipe saved");
  renderDashboard();
  showToast(`${name} added to the notebook.`);
}

function renderNotebook() {
  const query = $("#recipeSearch").value.trim().toLowerCase();
  const recipes = state.recipes.filter((recipe) => {
    const ingredientNames = recipe.ingredients.map((id) => getIngredient(id)?.name || id);
    return [recipe.name, recipe.rarity, ...recipe.effects, ...ingredientNames].join(" ").toLowerCase().includes(query);
  });
  $("#recipeCount").textContent = `${state.recipes.length} saved`;
  $("#recipeList").innerHTML = recipes.length ? recipes.map((recipe) => {
    const names = recipe.ingredients.map((id) => getIngredient(id)?.name || id);
    return `
      <article class="recipe-card">
        <header>
          <div><span class="rarity">${recipe.rarity}</span><h3>${escapeHtml(recipe.name)}</h3></div>
          <button class="icon-button ${recipe.favorite ? "active" : ""}" data-recipe-action="favorite" data-id="${recipe.id}" aria-label="Favorite recipe">◆</button>
        </header>
        <p class="recipe-meta">${names.join(" + ")} · ${recipe.compatibility}% compatibility · ${recipe.value}g estimate</p>
        <div class="effect-tags">${recipe.effects.map((effect) => `<span class="tag">${escapeHtml(effect)}</span>`).join("")}</div>
        <div class="recipe-actions">
          <button class="secondary" data-recipe-action="load" data-id="${recipe.id}">Load in Lab</button>
          <button class="ghost" data-recipe-action="plan" data-id="${recipe.id}">Add to Plan</button>
          <button class="ghost" data-recipe-action="delete" data-id="${recipe.id}">Delete</button>
        </div>
      </article>
    `;
  }).join("") : '<div class="empty-copy">No recipes match this search.</div>';
}

function renderPlanner() {
  const pinned = state.pinned.map(getIngredient).filter(Boolean);
  $("#pinnedIngredientList").innerHTML = pinned.length ? pinned.map((ingredient) => `
    <div class="compact-row">
      <div><strong>${ingredient.icon} ${ingredient.name}</strong><small>${ingredient.effects.join(" · ")}</small></div>
      <button class="remove-button" data-unpin-id="${ingredient.id}" aria-label="Unpin ${ingredient.name}">×</button>
    </div>
  `).join("") : '<div class="empty-copy">Pin ingredients from the codex to track them here.</div>';

  $("#plannedBrewList").innerHTML = state.plans.length ? state.plans.map((plan) => `
    <div class="check-row ${plan.done ? "done" : ""}">
      <label><input type="checkbox" data-plan-toggle="${plan.id}" ${plan.done ? "checked" : ""} /><span>${escapeHtml(plan.text)}</span></label>
      <button class="remove-button" data-plan-delete="${plan.id}" aria-label="Delete planned brew">×</button>
    </div>
  `).join("") : '<div class="empty-copy">No planned brews yet.</div>';

  $("#researchNotes").value = state.notes;
}

function renderData() {
  $("#importLog").textContent = state.importLog || "No imports have been run.";
}

function togglePin(id) {
  const ingredient = getIngredient(id);
  if (!ingredient) return;
  const exists = state.pinned.includes(id);
  state.pinned = exists ? state.pinned.filter((item) => item !== id) : [...state.pinned, id];
  addActivity("pin", `${exists ? "Unpinned" : "Pinned"} ${ingredient.name}`);
  saveState(exists ? "Ingredient unpinned" : "Ingredient pinned");
  renderCodex();
  renderPlanner();
  renderDashboard();
}

function openIngredient(id) {
  const ingredient = getIngredient(id);
  if (!ingredient) return;
  if (!isDiscovered(id)) {
    state.discovered.push(id);
    addActivity("discovery", `Discovered ${ingredient.name}`);
    saveState("Discovery added");
    renderCodex();
    renderDashboard();
  }
  $("#ingredientDialogContent").innerHTML = `
    <div class="dialog-visual">${ingredient.icon}</div>
    <div class="dialog-section"><span class="rarity">${ingredient.rarity}</span><h2>${ingredient.name}</h2><p>${ingredient.description}</p></div>
    <div class="dialog-section"><h4>Known effects</h4><div class="effect-tags">${ingredient.effects.map((effect) => `<span class="tag">${effect}</span>`).join("")}</div></div>
    <div class="dialog-section"><h4>Traits</h4><div class="effect-tags">${ingredient.traits.map((trait) => `<span class="tag">${trait}</span>`).join("")}</div></div>
    <div class="dialog-section"><h4>Field data</h4><p>${ingredient.habitat} · Estimated base value ${ingredient.value}g.</p></div>
  `;
  $("#ingredientDialog").showModal();
}

function handleRecipeAction(action, id) {
  const recipe = state.recipes.find((item) => item.id === id);
  if (!recipe) return;
  if (action === "favorite") {
    recipe.favorite = !recipe.favorite;
    saveState(recipe.favorite ? "Recipe favorited" : "Favorite removed");
    renderNotebook();
    renderDashboard();
  }
  if (action === "load") {
    labSelection = recipe.ingredients.slice(0, 3);
    navigate("lab");
    showToast(`${recipe.name} loaded into the lab.`);
  }
  if (action === "plan") {
    state.plans.unshift({ id: crypto.randomUUID?.() || `plan-${Date.now()}`, text: `Brew ${recipe.name}`, done: false });
    addActivity("plan", `Planned ${recipe.name}`);
    saveState("Recipe added to plan");
    renderPlanner();
    renderDashboard();
    showToast(`${recipe.name} added to the brew plan.`);
  }
  if (action === "delete") {
    state.recipes = state.recipes.filter((item) => item.id !== id);
    addActivity("recipe", `Removed ${recipe.name}`);
    saveState("Recipe deleted");
    renderNotebook();
    renderDashboard();
  }
}

function normalizeImportList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") return item.id || item.slug || item.name;
    return null;
  }).filter(Boolean);
}

function resolveIngredientId(value) {
  const normalized = String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return INGREDIENTS.find((ingredient) => ingredient.id === normalized || ingredient.name.toLowerCase() === String(value).trim().toLowerCase())?.id || null;
}

function importAlchemyData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const ingredientCandidates = [
        ...normalizeImportList(data.discoveredIngredients),
        ...normalizeImportList(data.knownIngredients),
        ...normalizeImportList(data.ingredients?.discovered)
      ];
      const resolvedIngredients = [...new Set(ingredientCandidates.map(resolveIngredientId).filter(Boolean))];
      const before = state.discovered.length;
      state.discovered = [...new Set([...state.discovered, ...resolvedIngredients])];

      const recipeCandidates = Array.isArray(data.knownRecipes) ? data.knownRecipes : Array.isArray(data.recipes) ? data.recipes : [];
      let importedRecipes = 0;
      recipeCandidates.forEach((candidate, index) => {
        if (!candidate || typeof candidate !== "object") return;
        const ingredientIds = normalizeImportList(candidate.ingredients).map(resolveIngredientId).filter(Boolean).slice(0, 3);
        if (ingredientIds.length < 2) return;
        const result = analyzeMixture(ingredientIds);
        const name = String(candidate.name || candidate.title || `Imported Formula ${index + 1}`).slice(0, 60);
        const duplicate = state.recipes.some((recipe) => recipe.name.toLowerCase() === name.toLowerCase() && recipe.ingredients.join("|") === ingredientIds.join("|"));
        if (duplicate) return;
        state.recipes.push({
          id: crypto.randomUUID?.() || `imported-${Date.now()}-${index}`,
          name,
          ingredients: ingredientIds,
          effects: result.sharedEffects.length ? result.sharedEffects : result.allEffects.slice(0, 3),
          compatibility: result.compatibility,
          rarity: result.rarity,
          value: result.value,
          favorite: false,
          createdAt: new Date().toISOString(),
          imported: true
        });
        importedRecipes += 1;
      });

      const newlyDiscovered = state.discovered.length - before;
      const timestamp = new Date().toLocaleString();
      state.importLog = `${timestamp}: copied ${newlyDiscovered} new ingredient discover${newlyDiscovered === 1 ? "y" : "ies"} and ${importedRecipes} recipe${importedRecipes === 1 ? "" : "s"} into Catalyst. Source file unchanged.`;
      addActivity("import", `Imported ${newlyDiscovered} discoveries and ${importedRecipes} recipes`);
      saveState("Import complete");
      renderAll();
      showToast("Import complete. The source save was not modified.");
    } catch (error) {
      state.importLog = `${new Date().toLocaleString()}: import failed — ${error.message}`;
      saveState("Import failed");
      renderData();
      showToast("That file is not valid Catalyst-compatible JSON.");
    } finally {
      $("#importFile").value = "";
    }
  };
  reader.readAsText(file);
}

function exportCatalystData() {
  const payload = {
    app: "Catalyst",
    version: "0.1.0-prototype",
    exportedAt: new Date().toISOString(),
    boundary: "Catalyst-only backup. Does not replace an Alchemy Game save.",
    data: state
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `catalyst-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Catalyst backup exported.");
}

function resetPrototype() {
  state = clone(DEFAULT_STATE);
  labSelection = [];
  localStorage.removeItem(STORAGE_KEY);
  saveState("Prototype reset");
  renderAll();
  $("#confirmDialog").close();
  showToast("Catalyst reset. Alchemy Game was untouched.");
}

function renderAll() {
  renderDashboard();
  renderCodex();
  renderLab();
  renderNotebook();
  renderPlanner();
  renderData();
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[character]));
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-target]");
    if (nav) navigate(nav.dataset.target);

    const go = event.target.closest("[data-go]");
    if (go) navigate(go.dataset.go);

    const ingredientAction = event.target.closest("[data-action]");
    if (ingredientAction) {
      const { action, id } = ingredientAction.dataset;
      if (action === "pin") togglePin(id);
      if (action === "details") openIngredient(id);
    }

    const labButton = event.target.closest("[data-lab-id]");
    if (labButton) {
      const id = labButton.dataset.labId;
      labSelection = labSelection.includes(id) ? labSelection.filter((item) => item !== id) : [...labSelection, id].slice(0, 3);
      renderLab();
    }

    if (event.target.closest("#saveRecipe")) saveCurrentRecipe();

    const recipeAction = event.target.closest("[data-recipe-action]");
    if (recipeAction) handleRecipeAction(recipeAction.dataset.recipeAction, recipeAction.dataset.id);

    const unpin = event.target.closest("[data-unpin-id]");
    if (unpin) togglePin(unpin.dataset.unpinId);

    const planDelete = event.target.closest("[data-plan-delete]");
    if (planDelete) {
      state.plans = state.plans.filter((plan) => plan.id !== planDelete.dataset.planDelete);
      saveState("Plan item deleted");
      renderPlanner();
      renderDashboard();
    }
  });

  $$("#ingredientSearch, #rarityFilter, #discoveryFilter").forEach((control) => control.addEventListener("input", renderCodex));
  $("#labSearch").addEventListener("input", renderLab);
  $("#recipeSearch").addEventListener("input", renderNotebook);

  $("#clearLab").addEventListener("click", () => { labSelection = []; renderLab(); });
  $("#closeIngredientDialog").addEventListener("click", () => $("#ingredientDialog").close());

  $("#planForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#planInput");
    const text = input.value.trim();
    if (!text) return;
    state.plans.unshift({ id: crypto.randomUUID?.() || `plan-${Date.now()}`, text, done: false });
    addActivity("plan", `Planned: ${text}`);
    input.value = "";
    saveState("Plan item added");
    renderPlanner();
    renderDashboard();
  });

  $("#plannedBrewList").addEventListener("change", (event) => {
    const toggle = event.target.closest("[data-plan-toggle]");
    if (!toggle) return;
    const plan = state.plans.find((item) => item.id === toggle.dataset.planToggle);
    if (plan) plan.done = toggle.checked;
    saveState("Plan updated");
    renderPlanner();
    renderDashboard();
  });

  $("#researchNotes").addEventListener("input", (event) => {
    state.notes = event.target.value;
    clearTimeout(event.target._timer);
    event.target._timer = setTimeout(() => saveState("Notes saved"), 450);
  });

  $("#importFile").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) importAlchemyData(file);
  });
  $("#exportData").addEventListener("click", exportCatalystData);
  $("#resetData").addEventListener("click", () => $("#confirmDialog").showModal());
  $("#cancelReset").addEventListener("click", () => $("#confirmDialog").close());
  $("#confirmReset").addEventListener("click", resetPrototype);
}

bindEvents();
renderAll();
