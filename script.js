/* ===========================================================
   International Retro Players — data engine
   Reads .player files (UTF-16LE, tab-separated) exported from
   the mod tooling and renders them as a sticker-album database.
   =========================================================== */

/* ---------- lookup tables ----------
   These IDs are EA's internal database codes. Only the ones we
   have verified against real players in this squad are filled
   in — anything else renders as "Nation #id" / "POS #id" so nothing
   breaks. Extend these two objects as you confirm more codes. */
const SQUAD_NAME_MAP = {
  "150000": "Real Madrid (2011-12)",
  "150001": "Real Madrid (2017-18)",
  "150002": "Liverpool (2018-19)",
  "150004": "Barcelona (2012-13)",
  "150005": "Atletico Madrid (2018-19)",
  "150006": "Manchester United (2012-13)",
  "150007": "AC Milan (2006-07)",
  "150008": "Liverpool (2008-09)",
  "150009": "Manchester United (2007-08)",
  "150010": "Arsenal (2003-04)",
  "150011": "Chelsea (2018-19)",
  "150012": "PSG (2014-15)",
  "150013": "Marseille (2017-18)",
  "150014": "Lyon (2019-20)",
  "150015": "AS Monaco (2016-17)",
  "150019": "PSG (2019-20)",
  "150020": "Bayern Munich (2019-20)",
  "150025": "Borussia Dortmund (2016-17)",
  "150026": "Leicester City (2015-16)",
  "150027": "Ajax (2018-19)",
  "150028": "Barcelona (2015-16)",
  "150031": "Manchester City (2018-19)",
  "150032": "Juventus (2016-17)",
  "150033": "Real Madrid (2004-05)",
  "150034": "Benfica (2016-17)",
  "150035": "Tottenham Hotspur (2018-19)",
  "150036": "Lille (2020-21)",
  "150038": "Inter Milan (2009-10)",
  "150041": "Borussia Dortmund (2020-21)",
  "150044": "Newcastle United (1995-96)",
  "150003": "Spain (2010)",
  "150016": "IRP All-Time XI",
  "150017": "France (2018)",
  "150018": "Germany (2014)",
  "150021": "France (1998)",
  "150022": "Brazil (1998)",
  "150023": "Netherlands (1998)",
  "150024": "Croatia (1998)",
  "150029": "Brazil (2002)",
  "150030": "Italy (2006)",
  "150039": "Portugal (2016)",
  "150040": "Brazil (2014)",
  "150042": "Belgium (2018)",
  "150043": "Croatia (2018)"
};

const NATIONS = {
  1: "Albania",
  2: "Andorra",
  3: "Armenia",
  4: "Austria",
  5: "Azerbaijan",
  6: "Belarus",
  7: "Belgium",
  8: "Bosnia and Herzegovina",
  9: "Bulgaria",
  10: "Croatia",
  11: "Cyprus",
  12: "Czech Republic",
  13: "Denmark",
  14: "England",
  15: "Montenegro",
  16: "Faroe Islands",
  17: "Finland",
  18: "France",
  19: "North Macedonia",
  20: "Georgia",
  21: "Germany",
  22: "Greece",
  23: "Hungary",
  24: "Iceland",
  25: "Republic of Ireland",
  26: "Israel",
  27: "Italy",
  28: "Latvia",
  29: "Liechtenstein",
  30: "Lithuania",
  31: "Luxembourg",
  32: "Malta",
  33: "Moldova",
  34: "Holland",
  35: "Northern Ireland",
  36: "Norway",
  37: "Poland",
  38: "Portugal",
  39: "Romania",
  40: "Russia",
  41: "San Marino",
  42: "Scotland",
  43: "Slovakia",
  44: "Slovenia",
  45: "Spain",
  46: "Sweden",
  47: "Switzerland",
  48: "Turkey",
  49: "Ukraine",
  50: "Wales",
  51: "Serbia",
  52: "Argentina",
  53: "Bolivia",
  54: "Brazil",
  55: "Chile",
  56: "Colombia",
  57: "Ecuador",
  58: "Paraguay",
  59: "Peru",
  60: "Uruguay",
  61: "Venezuela",
  62: "Anguilla",
  63: "Antigua and Barbuda",
  64: "Aruba",
  65: "Bahamas",
  66: "Barbados",
  67: "Belize",
  68: "Bermuda",
  69: "British Virgin Islands",
  70: "Canada",
  71: "Cayman Islands",
  72: "Costa Rica",
  73: "Cuba",
  74: "Dominica",
  75: "International",
  76: "El Salvador",
  77: "Grenada",
  78: "Guatemala",
  79: "Guyana",
  80: "Haiti",
  81: "Honduras",
  82: "Jamaica",
  83: "Mexico",
  84: "Montserrat",
  85: "Curaçao",
  86: "Nicaragua",
  87: "Panama",
  88: "Puerto Rico",
  89: "St. Kitts and Nevis",
  90: "St. Lucia",
  91: "St. Vincent and the Grenadines",
  92: "Suriname",
  93: "Trinidad and Tobago",
  94: "Turks and Caicos Islands",
  95: "United States",
  96: "US Virgin Islands",
  97: "Algeria",
  98: "Angola",
  99: "Benin",
  100: "Botswana",
  101: "Burkina Faso",
  102: "Burundi",
  103: "Cameroon",
  104: "Cape Verde Islands",
  105: "Central African Republic",
  106: "Chad",
  107: "Congo",
  108: "Côte d'Ivoire",
  109: "Djibouti",
  110: "Congo DR",
  111: "Egypt",
  112: "Equatorial Guinea",
  113: "Eritrea",
  114: "Ethiopia",
  115: "Gabon",
  116: "Gambia",
  117: "Ghana",
  118: "Guinea",
  119: "Guinea-Bissau",
  120: "Kenya",
  121: "Lesotho",
  122: "Liberia",
  123: "Libya",
  124: "Madagascar",
  125: "Malawi",
  126: "Mali",
  127: "Mauritania",
  128: "Mauritius",
  129: "Morocco",
  130: "Mozambique",
  131: "Namibia",
  132: "Niger",
  133: "Nigeria",
  134: "Rwanda",
  135: "São Tomé e Príncipe",
  136: "Senegal",
  137: "Seychelles",
  138: "Sierra Leone",
  139: "Somalia",
  140: "South Africa",
  141: "Sudan",
  142: "Eswatini",
  143: "Tanzania",
  144: "Togo",
  145: "Tunisia",
  146: "Uganda",
  147: "Zambia",
  148: "Zimbabwe",
  149: "Afghanistan",
  150: "Bahrain",
  151: "Bangladesh",
  152: "Bhutan",
  153: "Brunei Darussalam",
  154: "Cambodia",
  155: "China PR",
  157: "Guam",
  158: "Hong Kong",
  159: "India",
  160: "Indonesia",
  161: "Iran",
  162: "Iraq",
  163: "Japan",
  164: "Jordan",
  165: "Kazakhstan",
  166: "Korea DPR",
  167: "Korea Republic",
  168: "Kuwait",
  169: "Kyrgyzstan",
  170: "Laos",
  171: "Lebanon",
  172: "Macau",
  173: "Malaysia",
  174: "Maldives",
  175: "Mongolia",
  176: "Myanmar",
  177: "Nepal",
  178: "Oman",
  179: "Pakistan",
  180: "Palestine",
  181: "Philippines",
  182: "Qatar",
  183: "Saudi Arabia",
  184: "Singapore",
  185: "Sri Lanka",
  186: "Syria",
  187: "Tajikistan",
  188: "Thailand",
  189: "Turkmenistan",
  190: "United Arab Emirates",
  191: "Uzbekistan",
  192: "Vietnam",
  193: "Yemen",
  194: "American Samoa",
  195: "Australia",
  196: "Cook Islands",
  197: "Fiji",
  198: "New Zealand",
  199: "Papua New Guinea",
  200: "Samoa",
  201: "Solomon Islands",
  202: "Tahiti",
  203: "Tonga",
  204: "Vanuatu",
  205: "Gibraltar",
  206: "Greenland",
  207: "Dominican Republic",
  208: "Estonia",
  209: "Created Players Country",
  210: "Free Agents Country",
  211: "Rest of World",
  212: "Timor-Leste",
  213: "Chinese Taipei",
  214: "Comoros",
  215: "New Caledonia",
  218: "South Sudan",
  219: "Kosovo",
  222: "International Women",
  225: "CONMEBOL",
};

// 1. The Data: Mapping names directly to flags
const COUNTRY_FLAGS = {
  "Albania": "al", "Andorra": "ad", "Armenia": "am", "Austria": "at",
  "Azerbaijan": "az", "Belarus": "by", "Belgium": "be", "Bosnia and Herzegovina": "ba",
  "Bulgaria": "bg", "Croatia": "hr", "Cyprus": "cy", "Czech Republic": "cz",
  "Denmark": "dk", "England": "gb-eng", "Montenegro": "me", "Faroe Islands": "fo",
  "Finland": "fi", "France": "fr", "North Macedonia": "mk", "Georgia": "ge",
  "Germany": "de", "Greece": "gr", "Hungary": "hu", "Iceland": "is",
  "Republic of Ireland": "ie", "Israel": "il", "Italy": "it", "Latvia": "lv",
  "Liechtenstein": "li", "Lithuania": "lt", "Luxembourg": "lu", "Malta": "mt",
  "Moldova": "md", "Holland": "nl", "Norway": "no", "Poland": "pl",
  "Portugal": "pt", "Romania": "ro", "Russia": "ru", "San Marino": "sm",
  "Scotland": "gb-sct", "Slovakia": "sk", "Slovenia": "si", "Spain": "es",
  "Sweden": "se", "Switzerland": "ch", "Turkey": "tr", "Ukraine": "ua",
  "Wales": "gb-wls", "Serbia": "rs", "Argentina": "ar", "Bolivia": "bo",
  "Brazil": "br", "Chile": "cl", "Colombia": "co", "Ecuador": "ec",
  "Paraguay": "py", "Peru": "pe", "Uruguay": "uy", "Venezuela": "ve",
  "Anguilla": "ai", "Antigua and Barbuda": "ag", "Aruba": "aw", "Bahamas": "bs",
  "Barbados": "bb", "Belize": "bz", "Bermuda": "bm", "British Virgin Islands": "vg",
  "Canada": "ca", "Cayman Islands": "ky", "Costa Rica": "cr", "Cuba": "cu",
  "Dominica": "dm", "El Salvador": "sv", "Grenada": "gd", "Guatemala": "gt",
  "Guyana": "gy", "Haiti": "ht", "Honduras": "hn", "Jamaica": "jm",
  "Mexico": "mx", "Montserrat": "ms", "Curaçao": "cw", "Nicaragua": "ni",
  "Panama": "pa", "Puerto Rico": "pr", "St. Kitts and Nevis": "kn", "St. Lucia": "lc",
  "St. Vincent and the Grenadines": "vc", "Suriname": "sr", "Trinidad and Tobago": "tt", "Turks and Caicos Islands": "tc",
  "United States": "us", "US Virgin Islands": "vi", "Algeria": "dz", "Angola": "ao",
  "Benin": "bj", "Botswana": "bw", "Burkina Faso": "bf", "Burundi": "bi",
  "Cameroon": "cm", "Cape Verde Islands": "cv", "Central African Republic": "cf", "Chad": "td",
  "Congo": "cg", "Côte d'Ivoire": "ci", "Djibouti": "dj", "Congo DR": "cd",
  "Egypt": "eg", "Equatorial Guinea": "gq", "Eritrea": "er", "Ethiopia": "et",
  "Gabon": "ga", "Gambia": "gm", "Ghana": "gh", "Guinea": "gn",
  "Guinea-Bissau": "gw", "Kenya": "ke", "Lesotho": "ls", "Liberia": "lr",
  "Libya": "ly", "Madagascar": "mg", "Malawi": "mw", "Mali": "ml",
  "Mauritania": "mr", "Mauritius": "mu", "Morocco": "ma", "Mozambique": "mz",
  "Namibia": "na", "Niger": "ne", "Nigeria": "ng", "Rwanda": "rw",
  "São Tomé e Príncipe": "st", "Senegal": "sn", "Seychelles": "sc", "Sierra Leone": "sl",
  "Somalia": "so", "South Africa": "za", "Sudan": "sd", "Eswatini": "sz",
  "Tanzania": "tz", "Togo": "tg", "Tunisia": "tn", "Uganda": "ug",
  "Zambia": "zm", "Zimbabwe": "zw", "Afghanistan": "af", "Bahrain": "bh",
  "Bangladesh": "bd", "Bhutan": "bt", "Brunei Darussalam": "bn", "Cambodia": "kh",
  "China PR": "cn", "Guam": "gu", "Hong Kong": "hk", "India": "in",
  "Indonesia": "id", "Iran": "ir", "Iraq": "iq", "Japan": "jp",
  "Jordan": "jo", "Kazakhstan": "kz", "Korea DPR": "kp", "Korea Republic": "kr",
  "Kuwait": "kw", "Kyrgyzstan": "kg", "Laos": "la", "Lebanon": "lb",
  "Macau": "mo", "Malaysia": "my", "Maldives": "mv", "Mongolia": "mn",
  "Myanmar": "mm", "Nepal": "np", "Oman": "om", "Pakistan": "pk",
  "Palestine": "ps", "Philippines": "ph", "Qatar": "qa", "Saudi Arabia": "sa",
  "Singapore": "sg", "Sri Lanka": "lk", "Syria": "sy", "Tajikistan": "tj",
  "Thailand": "th", "Turkmenistan": "tm", "United Arab Emirates": "ae", "Uzbekistan": "uz",
  "Vietnam": "vn", "Yemen": "ye", "American Samoa": "as", "Australia": "au",
  "Cook Islands": "ck", "Fiji": "fj", "New Zealand": "nz", "Papua New Guinea": "pg",
  "Samoa": "ws", "Solomon Islands": "sb", "Tahiti": "pf", "Tonga": "to",
  "Vanuatu": "vu", "Gibraltar": "gi", "Greenland": "gl", "Dominican Republic": "do",
  "Estonia": "ee", "Timor-Leste": "tl", "Chinese Taipei": "tw", "Comoros": "km",
  "New Caledonia": "nc", "South Sudan": "ss", "Kosovo": "xk",
};

function flagUrl(nation) {
  const code = COUNTRY_FLAGS[nation];
  return code ? `https://flagcdn.com/w40/${code}.png` : null;
}

const POSITIONS = {
  0: "GK",
  2: "RWB",
  3: "RB",
  4: "LWB",
  5: "CB",
  7: "LB",
  10: "CDM",
  12: "RM",
  13: "LM",
  14: "CM",
  16: "LM",
  18: "CAM",
  23: "RW",
  25: "ST",
  27: "LW",
};

const FOOT = { 1: "Right", 2: "Left" };

/* six-category groupings, same formula FIFA-style databases use */
const STAT_GROUPS = {
  PAC: ["acceleration", "sprintspeed"],
  SHO: ["positioning", "finishing", "shotpower", "longshots", "volleys", "penalties"],
  PAS: ["vision", "crossing", "freekickaccuracy", "shortpassing", "longpassing", "curve"],
  DRI: ["agility", "balance", "reactions", "ballcontrol", "dribbling", "composure"],
  DEF: ["interceptions", "headingaccuracy", "defensiveawareness", "standingtackle", "slidingtackle"],
  PHY: ["jumping", "stamina", "strength", "aggression"],
};

const ATTR_COLUMNS = {
  Pace: ["acceleration", "sprintspeed"],
  Shooting: ["positioning", "finishing", "shotpower", "longshots", "volleys", "penalties"],
  Passing: ["vision", "crossing", "freekickaccuracy", "shortpassing", "longpassing", "curve"],
  Dribbling: ["agility", "balance", "reactions", "ballcontrol", "dribbling", "composure"],
  Defending: ["interceptions", "headingaccuracy", "defensiveawareness", "standingtackle", "slidingtackle"],
  Physical: ["jumping", "stamina", "strength", "aggression"],
};

const ATTR_LABELS = {
  acceleration: "Acceleration", sprintspeed: "Sprint Speed",
  positioning: "Positioning", finishing: "Finishing", shotpower: "Shot Power",
  longshots: "Long Shots", volleys: "Volleys", penalties: "Penalties",
  vision: "Vision", crossing: "Crossing", freekickaccuracy: "FK Accuracy",
  shortpassing: "Short Passing", longpassing: "Long Passing", curve: "Curve",
  agility: "Agility", balance: "Balance", reactions: "Reactions",
  ballcontrol: "Ball Control", dribbling: "Dribbling", composure: "Composure",
  interceptions: "Interceptions", headingaccuracy: "Heading", defensiveawareness: "Marking",
  standingtackle: "Standing Tackle", slidingtackle: "Sliding Tackle",
  jumping: "Jumping", stamina: "Stamina", strength: "Strength", aggression: "Aggression",
};

/* ---------- parsing ---------- */

async function fetchPlayerFile(path) {
  const res = await fetch(path);
  const buf = await res.arrayBuffer();
  let bytes = new Uint8Array(buf);
  // strip UTF-16LE BOM if present (FF FE)
  if (bytes[0] === 0xff && bytes[1] === 0xfe) bytes = bytes.slice(2);
  const text = new TextDecoder("utf-16le").decode(bytes);
  const lines = text.split(/\r\n|\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return null;
  const headers = lines[0].split("\t");
  const values = lines[1].split("\t");
  const row = {};
  headers.forEach((h, i) => (row[h] = values[i]));
  return row;
}

function num(row, key, fallback = 0) {
  const v = parseInt(row[key], 10);
  return Number.isFinite(v) ? v : fallback;
}

function avg(row, keys) {
  const vals = keys.map((k) => num(row, k, 0));
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function nameFromFilename(filename) {
  const stripped = filename.replace(/\.player$/i, "");
  const dash = stripped.indexOf(" - ");
  if (dash === -1) return stripped;
  return stripped.slice(dash + 3).trim();
}

function idFromFilename(filename) {
  const dash = filename.indexOf(" - ");
  return dash === -1 ? filename : filename.slice(0, dash).trim();
}

function buildPlayer(row, filename, squadLabel, squadId) {
  const id = idFromFilename(filename);
  const name = nameFromFilename(filename);
  const nationCode = num(row, "nationality", -1);
  const posCode = num(row, "preferredposition1", -1);
  const footCode = num(row, "preferredfoot", -1);

  return {
    id,
    name,
    number: num(row, "number", 0),
    overall: num(row, "overallrating", 0),
    potential: num(row, "potential", 0),
    nationCode,
    nation: NATIONS[nationCode] || `Nation #${nationCode}`,
    posCode,
    position: POSITIONS[posCode] || (posCode >= 0 ? `POS #${posCode}` : "—"),
    club: squadLabel,
    squadId,
    height: num(row, "height", 0),
    weight: num(row, "weight", 0),
    foot: FOOT[footCode] || "—",
    skillMoves: num(row, "skillmoves", 0),
    weakFoot: num(row, "weakfootabilitytypecode", 0),
    headClassCode: num(row, "headclasscode", 0),
    hasRealFace: num(row, "headclasscode", 0) === 0,
    stats: Object.fromEntries(
      Object.entries(STAT_GROUPS).map(([k, keys]) => [k, avg(row, keys)])
    ),
    raw: row,
  };
}

/* ---------- rendering ---------- */

const grid = document.getElementById("card-grid");
const resultsLine = document.getElementById("results-line");
const searchInput = document.getElementById("search");
const positionFilter = document.getElementById("position-filter");
const sortBy = document.getElementById("sort-by");
const squadCount = document.getElementById("squad-count");
const teamCount = document.getElementById("team-count");

let ALL_PLAYERS = [];

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function portraitPath(id) {
  return `portraits/p${id}.png`;
}

function crestPath(squadId) {
  return `crests/l${squadId}.png`;
}

function makePortraitEl(player, size) {
  const wrap = document.createElement("div");
  wrap.className = size === "small" ? "sticker-portrait" : "sheet-portrait";

  if (size === "large") {
    const frame = document.createElement("div");
    frame.className = "sheet-portrait-frame";
    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = portraitPath(player.id);
    img.alt = "";
    img.onerror = () => {
      img.src = "assets/portrait-placeholder.png";
      img.onerror = null;
    };
    frame.appendChild(img);
    wrap.appendChild(frame);

    const num = document.createElement("div");
    num.className = "sheet-portrait-num";
    num.textContent = `#${player.number || "-"}`;
    wrap.appendChild(num);
    return wrap;
  }

  const img = document.createElement("img");
  img.loading = "lazy";
  img.src = portraitPath(player.id);
  img.alt = "";
  img.onerror = () => {
    img.src = "assets/portrait-placeholder.png";
    img.onerror = null; // avoid loop if the placeholder itself is missing
  };
  wrap.appendChild(img);
  return wrap;
}

const LEGEND_SQUAD_ID = "150016"; // IRP All-Time XI — gets the gold legend treatment

function renderCard(player) {
  const card = document.createElement("article");
  card.className = player.squadId === LEGEND_SQUAD_ID ? "sticker sticker-legend" : "sticker";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `View ${player.name}`);

  const top = document.createElement("div");
  top.className = "sticker-top";
  const left = document.createElement("span");
  left.className = "sticker-left";
  left.innerHTML = `<span class="sticker-num">#${player.number || "-"}</span>`;
  const compareToggle = document.createElement("button");
  compareToggle.className = "compare-toggle";
  compareToggle.type = "button";
  compareToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3l4 4-4 4"/><path d="M21 7H9"/><path d="M7 21l-4-4 4-4"/><path d="M3 17h12"/></svg>';
  compareToggle.setAttribute("aria-label", `Add ${player.name} to compare`);
  compareToggle.dataset.playerId = player.id;
  compareToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleCompare(player);
  });
  left.appendChild(compareToggle);
  top.appendChild(left);
  const ovr = document.createElement("span");
  ovr.className = "sticker-ovr";
  ovr.textContent = player.overall;
  top.appendChild(ovr);

  const portrait = makePortraitEl(player, "small");

  const name = document.createElement("h3");
  name.className = "sticker-name";
  name.textContent = player.name;

  const sub = document.createElement("p");
  sub.className = "sticker-sub";
  // Look up the flag, fallback to the text name if no flag is found
  const flagSrc = flagUrl(player.nation);
  const flagImg = flagSrc
    ? `<img class="sticker-flag-img" src="${flagSrc}" alt="${player.nation}" onerror="this.style.display='none'">`
    : `<span class="sticker-flag">${player.nation}</span>`;
  sub.innerHTML = `<span class="sticker-pos">${player.position}</span><span class="sticker-flags"><img class="sticker-crest" src="${crestPath(player.squadId)}" alt="" onerror="this.style.display='none'">${flagImg}</span>`;

  const idLine = document.createElement("p");
  idLine.className = "sticker-id";
  idLine.textContent = `ID ${player.id}`;

  card.append(top, portrait, name, sub, idLine);
  card.addEventListener("click", () => openSheet(player));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openSheet(player);
    }
  });
  return card;
}

function applyFiltersAndRender() {
  const q = searchInput.value.trim().toLowerCase();
  const pos = positionFilter.value;
  let list = ALL_PLAYERS.filter((p) => {
    const matchesQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.nation.toLowerCase().includes(q) ||
      p.club.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q);
    const matchesPos = !pos || p.position === pos;
    return matchesQ && matchesPos;
  });

  switch (sortBy.value) {
    case "overall-desc": list.sort((a, b) => b.overall - a.overall); break;
    case "overall-asc": list.sort((a, b) => a.overall - b.overall); break;
    case "number-asc": list.sort((a, b) => (a.number || 999) - (b.number || 999)); break;
    case "name-asc": list.sort((a, b) => a.name.localeCompare(b.name)); break;
  }

  grid.innerHTML = "";
  if (list.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No players match that search.";
    grid.appendChild(empty);
  } else {
    list.forEach((p) => grid.appendChild(renderCard(p)));
  }
  resultsLine.textContent = `Showing ${list.length} of ${ALL_PLAYERS.length} players`;
}

const POSITION_ORDER = ["GK", "CB", "RB", "LB", "RWB", "LWB", "CDM", "CM", "CAM", "RM", "LM", "RW", "LW", "ST"];

function populatePositionFilter() {
  const present = new Set(ALL_PLAYERS.map((p) => p.position));
  const ordered = POSITION_ORDER.filter((pos) => present.has(pos));
  // catch any position that shows up in the data but isn't in POSITION_ORDER yet
  const leftovers = [...present].filter((pos) => !POSITION_ORDER.includes(pos)).sort();

  [...ordered, ...leftovers].forEach((pos) => {
    const opt = document.createElement("option");
    opt.value = pos;
    opt.textContent = pos;
    positionFilter.appendChild(opt);
  });
}

/* ---------- detail overlay ---------- */

const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-btn");

/* ---------- compare mode ---------- */

const compareSet = new Map(); // id -> player, insertion-ordered, max 3
const compareBar = document.getElementById("compare-bar");
const compareBarChips = document.getElementById("compare-bar-chips");
const compareCountEl = document.getElementById("compare-count");
const compareGoBtn = document.getElementById("compare-go-btn");
const compareClearBtn = document.getElementById("compare-clear-btn");
const compareOverlay = document.getElementById("compare-overlay");
const compareCloseBtn = document.getElementById("compare-close-btn");
const compareBody = document.getElementById("compare-body");
const sheetCompareBtn = document.getElementById("sheet-compare-btn");

function toggleCompare(player) {
  if (compareSet.has(player.id)) {
    compareSet.delete(player.id);
  } else {
    if (compareSet.size >= 3) {
      compareSet.delete(compareSet.keys().next().value);
    }
    compareSet.set(player.id, player);
  }
  syncCompareToggles();
  renderCompareBar();
}

function syncCompareToggles() {
  document.querySelectorAll(".compare-toggle").forEach((btn) => {
    const active = compareSet.has(btn.dataset.playerId);
    btn.classList.toggle("active", active);
  });
  if (sheetCompareBtn && currentActivePlayer) {
    sheetCompareBtn.classList.toggle("active", compareSet.has(currentActivePlayer.id));
  }
}

function renderCompareBar() {
  const players = Array.from(compareSet.values());
  compareBar.hidden = players.length === 0;
  compareBarChips.innerHTML = players
    .map(
      (p) => `<span class="compare-chip" data-id="${p.id}">
        <img src="${portraitPath(p.id)}" alt="" onerror="this.style.display='none'">
        <span>${p.name}</span>
        <button type="button" aria-label="Remove ${p.name} from compare">&times;</button>
      </span>`
    )
    .join("");
  compareBarChips.querySelectorAll(".compare-chip button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.closest(".compare-chip").dataset.id;
      const player = compareSet.get(id);
      if (player) toggleCompare(player);
    });
  });
  compareCountEl.textContent = String(players.length);
  compareGoBtn.disabled = players.length < 2;
}

function openCompareOverlay() {
  const players = Array.from(compareSet.values());
  if (players.length < 2) return;

  const row = (label, vals, best) => {
    const max = Math.max(...vals);
    return `<div class="compare-row" style="grid-template-columns: 120px repeat(${players.length}, 1fr)">
      <div class="compare-row-label">${label}</div>
      ${vals.map((v) => `<div class="compare-val ${best !== false && v === max ? "best" : ""}">${v}</div>`).join("")}
    </div>`;
  };

  let html = `<div class="compare-row compare-row-head" style="grid-template-columns: 120px repeat(${players.length}, 1fr)">
    <div></div>
    ${players
      .map(
        (p) => `<div class="compare-player">
          <div class="compare-portrait"><img src="${portraitPath(p.id)}" alt="" onerror="this.style.display='none'"></div>
          <div class="compare-name">${p.name}</div>
          <div class="compare-sub">${p.position} · ${p.club}</div>
        </div>`
      )
      .join("")}
  </div>`;

  html += row("OVR", players.map((p) => p.overall));
  html += row("POT", players.map((p) => p.potential));
  Object.keys(players[0].stats).forEach((statKey) => {
    html += row(statKey, players.map((p) => p.stats[statKey]));
  });

  Object.entries(ATTR_COLUMNS).forEach(([groupName, keys]) => {
    html += `<div class="compare-group-header">${groupName}</div>`;
    keys.forEach((key) => {
      html += row(ATTR_LABELS[key] || key, players.map((p) => num(p.raw, key, 0)));
    });
  });

  compareBody.innerHTML = html;
  compareOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCompareOverlay() {
  compareOverlay.hidden = true;
  document.body.style.overflow = overlay.hidden ? "" : "hidden";
}

compareGoBtn.addEventListener("click", openCompareOverlay);
compareClearBtn.addEventListener("click", () => {
  compareSet.clear();
  syncCompareToggles();
  renderCompareBar();
});
compareCloseBtn.addEventListener("click", closeCompareOverlay);
compareOverlay.addEventListener("click", (e) => {
  if (e.target === compareOverlay) closeCompareOverlay();
});
sheetCompareBtn.addEventListener("click", () => {
  if (currentActivePlayer) toggleCompare(currentActivePlayer);
});

/* ---------- similar players (stat-distance) ---------- */

function statDistance(a, b) {
  return Math.sqrt(
    Object.keys(a.stats).reduce((sum, key) => {
      const diff = (a.stats[key] || 0) - (b.stats[key] || 0);
      return sum + diff * diff;
    }, 0)
  );
}

function findSimilarPlayers(player, count = 6) {
  return ALL_PLAYERS
    .filter((p) => p.id !== player.id)
    .map((p) => ({ player: p, dist: statDistance(player, p) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count)
    .map((entry) => entry.player);
}

function renderSimilarPlayers(player) {
  const grid = document.getElementById("similar-grid");
  if (!grid) return;
  grid.innerHTML = "";
  findSimilarPlayers(player).forEach((sp) => {
    const card = document.createElement("div");
    card.className = "similar-card";
    card.innerHTML = `<div class="similar-portrait"><img src="${portraitPath(sp.id)}" alt="" onerror="this.style.display='none'"></div>
      <div class="similar-name">${sp.name}</div>
      <div class="similar-meta">${sp.position} · ${sp.overall} OVR</div>`;
    card.addEventListener("click", () => openSheet(sp));
    grid.appendChild(card);
  });
}

function openSheet(player) {
  document.getElementById("sheet-portrait").replaceWith(
    Object.assign(makePortraitEl(player, "large"), { id: "sheet-portrait" })
  );
  const sheetFlagSrc = flagUrl(player.nation);
  const sheetFlagImg = sheetFlagSrc
    ? `<img src="${sheetFlagSrc}" alt="${player.nation}" onerror="this.style.display='none'">`
    : `<span>${player.nation}</span>`;
  document.getElementById("sheet-nation").innerHTML =
    sheetFlagImg +
    `<img src="${crestPath(player.squadId)}" alt="" onerror="this.style.display='none'">`;
  document.getElementById("sheet-name").textContent = player.name;
  document.getElementById("sheet-meta").textContent = player.club;
  document.getElementById("sheet-overall").textContent = player.overall;
  document.getElementById("sheet-potential").textContent = player.potential;

  const six = document.getElementById("six-stats");
  six.innerHTML = "";
  Object.entries(player.stats).forEach(([label, val]) => {
    const el = document.createElement("div");
    el.className = "six-stat";
    el.innerHTML = `<span class="six-stat-val">${val}</span><span class="six-stat-label">${label}</span>`;
    six.appendChild(el);
  });

  const bio = document.getElementById("bio-grid");
  const bioItems = [
    ["ID", player.id],
    ["POS", player.position],
    ["Height", player.height ? `${player.height} cm` : "—"],
    ["Weight", player.weight ? `${player.weight} kg` : "—"],
    ["Foot", player.foot],
    ["Face", player.hasRealFace ? "Real Face" : "Generic Face"],
    ["Skill Moves", "★".repeat(player.skillMoves) + "☆".repeat(Math.max(0, 5 - player.skillMoves))],
    ["Weak Foot", "★".repeat(player.weakFoot) + "☆".repeat(Math.max(0, 5 - player.weakFoot))],
  ];
  bio.innerHTML = bioItems
    .map(([l, v]) => `<div class="bio-item"><span class="bio-label">${l}</span><span class="bio-value">${v}</span></div>`)
    .join("");

  const cols = document.getElementById("attr-columns");
  cols.innerHTML = "";
  Object.entries(ATTR_COLUMNS).forEach(([groupName, keys]) => {
    const group = document.createElement("div");
    group.className = "attr-group";
    const h3 = document.createElement("h3");
    h3.textContent = groupName;
    group.appendChild(h3);
    keys.forEach((key) => {
      const val = num(player.raw, key, 0);
      const row = document.createElement("div");
      row.className = "attr-row";
      row.innerHTML = `
        <span class="attr-name">${ATTR_LABELS[key] || key}</span>
        <span class="attr-bar"><span style="width:${Math.min(100, val)}%"></span></span>
        <span class="attr-num">${val}</span>`;
      group.appendChild(row);
    });
    cols.appendChild(group);
  });

  renderSimilarPlayers(player);
  syncCompareToggles();

  overlay.hidden = false;
  closeBtn.focus();
  document.body.style.overflow = "hidden";
}

function closeSheet() {
  overlay.hidden = true;
  document.body.style.overflow = "";
}

closeBtn.addEventListener("click", closeSheet);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeSheet();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!compareOverlay.hidden) closeCompareOverlay();
    else if (!overlay.hidden) closeSheet();
  }
});
/* ---------- share and download handlers ---------- */

const shareBtn = document.getElementById("share-btn");
const downloadBtn = document.getElementById("download-btn");

let currentActivePlayer = null;

// Extend openSheet to keep track of the currently active player for sharing/downloading
const originalOpenSheet = openSheet;
openSheet = function(player) {
  currentActivePlayer = player;
  // Update browser URL query string seamlessly without reloading page
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('player', player.id);
  window.history.replaceState({}, '', newUrl);
  
  originalOpenSheet(player);
};

// Extend closeSheet to clean up URL search parameter if desired
const originalCloseSheet = closeSheet;
closeSheet = function() {
  const newUrl = new URL(window.location);
  newUrl.searchParams.delete('player');
  window.history.replaceState({}, '', newUrl);
  currentActivePlayer = null;
  
  originalCloseSheet();
};

// Copy link functionality
const SHARE_ICON = shareBtn.innerHTML;
const CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
shareBtn.addEventListener("click", async () => {
  if (!currentActivePlayer) return;
  
  const shareUrl = window.location.href;
  try {
    await navigator.clipboard.writeText(shareUrl);
    const originalTitle = shareBtn.title;
    shareBtn.title = "Copied!";
    shareBtn.innerHTML = CHECK_ICON;
    setTimeout(() => {
      shareBtn.title = originalTitle;
      shareBtn.innerHTML = SHARE_ICON;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy link: ", err);
  }
});

// Download card as PNG functionality
downloadBtn.addEventListener("click", async () => {
  if (!currentActivePlayer) return;
  
  const statSheetEl = document.querySelector(".stat-sheet");
  if (!statSheetEl) return;

  downloadBtn.disabled = true;

  try {
    // Render the stat sheet modal element into a canvas
    const canvas = await html2canvas(statSheetEl, {
      scale: 2, // Higher resolution output
      useCORS: true,
      backgroundColor: "#161616" // Matches --panel design token
    });

    const link = document.createElement("a");
    link.download = `${currentActivePlayer.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("Failed to generate player card image:", err);
  } finally {
    downloadBtn.disabled = false;
  }
});

// Check if a player parameter was passed on initial page load
async function checkUrlPlayerParam() {
  const params = new URLSearchParams(window.location.search);
  const playerId = params.get('player');
  if (playerId && ALL_PLAYERS.length > 0) {
    const found = ALL_PLAYERS.find(p => p.id === playerId);
    if (found) {
      openSheet(found);
    }
  }
}
/* ---------- boot ---------- */

async function loadAllPlayers() {
  const manifestRes = await fetch("players/manifest.json");
  const manifest = await manifestRes.json();

  const fetchPromises = [];

  // 1. Queue up all the requests at once
  for (const squad of manifest.squads) {
    // Look up the clean name using the squad ID, falling back to label if missing
    const squadName = SQUAD_NAME_MAP[squad.id] || squad.label;

    for (const file of squad.files) {
      const path = `players/${squad.folder}/${file}`;
      
      const request = fetchPlayerFile(path)
        .then(row => {
          // Pass 'squadName' instead of 'squad.label' into buildPlayer
          if (row) return buildPlayer(row, file, squadName, squad.id);
          return null;
        })
        .catch(err => {
          console.error("Failed to load", path, err);
          return null; // Keep going even if one file fails
        });
        
      fetchPromises.push(request);
    }
  }

  // 2. Execute them all concurrently
  const results = await Promise.all(fetchPromises);
  
  // 3. Filter out any failed/null requests and return the final array
  return results.filter(player => player !== null);
}

async function init() {
  try {
    ALL_PLAYERS = await loadAllPlayers();
    squadCount.textContent = String(ALL_PLAYERS.length).padStart(3, "0");
    const teamSet = new Set(ALL_PLAYERS.map((p) => p.club));
    teamCount.textContent = String(teamSet.size).padStart(2, "0");
    populatePositionFilter();
    applyFiltersAndRender();
    
    // Check if URL contains a direct target player query
    checkUrlPlayerParam();

    // Fade out and remove the loader
    const loader = document.getElementById("loading-screen");
    if (loader) {
      loader.style.opacity = "0";
      loader.style.visibility = "hidden";
      setTimeout(() => {
        loader.remove();
      }, 500);
    }
  } catch (err) {
    resultsLine.textContent = "CRITICAL ERROR, PLEASE REFRESH.";
    console.error(err);
    
    const loader = document.getElementById("loading-screen");
    if (loader) loader.remove();
  }
}

searchInput.addEventListener("input", applyFiltersAndRender);
positionFilter.addEventListener("change", applyFiltersAndRender);
sortBy.addEventListener("change", applyFiltersAndRender);

init();
