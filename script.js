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
  "150044": "Newcastle United (1995-96)"
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
  "Albania": "🇦🇱", "Andorra": "🇦🇩", "Armenia": "🇦🇲", "Austria": "🇦🇹", 
  "Azerbaijan": "🇦🇿", "Belarus": "🇧🇾", "Belgium": "🇧🇪", "Bosnia and Herzegovina": "🇧🇦", 
  "Bulgaria": "🇧🇬", "Croatia": "🇭🇷", "Cyprus": "🇨🇾", "Czech Republic": "🇨🇿", 
  "Denmark": "🇩🇰", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Montenegro": "🇲🇪", "Faroe Islands": "🇫🇴", 
  "Finland": "🇫🇮", "France": "🇫🇷", "North Macedonia": "🇲🇰", "Georgia": "🇬🇪", 
  "Germany": "🇩🇪", "Greece": "🇬🇷", "Hungary": "🇭🇺", "Iceland": "🇮🇸", 
  "Republic of Ireland": "🇮🇪", "Israel": "🇮🇱", "Italy": "🇮🇹", "Latvia": "🇱🇻", 
  "Liechtenstein": "🇱🇮", "Lithuania": "🇱🇹", "Luxembourg": "🇱🇺", "Malta": "🇲🇹", 
  "Moldova": "🇲🇩", "Holland": "🇳🇱", "Norway": "🇳🇴", "Poland": "🇵🇱", 
  "Portugal": "🇵🇹", "Romania": "🇷🇴", "Russia": "🇷🇺", "San Marino": "🇸🇲", 
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Slovakia": "🇸🇰", "Slovenia": "🇸🇮", "Spain": "🇪🇸", 
  "Sweden": "🇸🇪", "Switzerland": "🇨🇭", "Turkey": "🇹🇷", "Ukraine": "🇺🇦", 
  "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "Serbia": "🇷🇸", "Argentina": "🇦🇷", "Bolivia": "🇧🇴", 
  "Brazil": "🇧🇷", "Chile": "🇨🇱", "Colombia": "🇨🇴", "Ecuador": "🇪🇨", 
  "Paraguay": "🇵🇾", "Peru": "🇵🇪", "Uruguay": "🇺🇾", "Venezuela": "🇻🇪", 
  "Anguilla": "🇦🇮", "Antigua and Barbuda": "🇦🇬", "Aruba": "🇦🇼", "Bahamas": "🇧🇸", 
  "Barbados": "🇧🇧", "Belize": "🇧🇿", "Bermuda": "🇧🇲", "British Virgin Islands": "🇻🇬", 
  "Canada": "🇨🇦", "Cayman Islands": "🇰🇾", "Costa Rica": "🇨🇷", "Cuba": "🇨🇺", 
  "Dominica": "🇩🇲", "El Salvador": "🇸🇻", "Grenada": "🇬🇩", "Guatemala": "🇬🇹", 
  "Guyana": "🇬🇾", "Haiti": "🇭🇹", "Honduras": "🇭🇳", "Jamaica": "🇯🇲", 
  "Mexico": "🇲🇽", "Montserrat": "🇲🇸", "Curaçao": "🇨🇼", "Nicaragua": "🇳🇮", 
  "Panama": "🇵🇦", "Puerto Rico": "🇵🇷", "St. Kitts and Nevis": "🇰🇳", "St. Lucia": "🇱🇨", 
  "St. Vincent and the Grenadines": "🇻🇨", "Suriname": "🇸🇷", "Trinidad and Tobago": "🇹🇹", 
  "Turks and Caicos Islands": "🇹🇨", "United States": "🇺🇸", "US Virgin Islands": "🇻🇮", 
  "Algeria": "🇩🇿", "Angola": "🇦🇴", "Benin": "🇧🇯", "Botswana": "🇧🇼", 
  "Burkina Faso": "🇧🇫", "Burundi": "🇧🇮", "Cameroon": "🇨🇲", "Cape Verde Islands": "🇨🇻", 
  "Central African Republic": "🇨🇫", "Chad": "🇹🇩", "Congo": "🇨🇬", "Côte d'Ivoire": "🇨🇮", 
  "Djibouti": "🇩🇯", "Congo DR": "🇨🇩", "Egypt": "🇪🇬", "Equatorial Guinea": "🇬🇶", 
  "Eritrea": "🇪🇷", "Ethiopia": "🇪🇹", "Gabon": "🇬🇦", "Gambia": "🇬🇲", "Ghana": "🇬🇭", 
  "Guinea": "🇬🇳", "Guinea-Bissau": "🇬🇼", "Kenya": "🇰🇪", "Lesotho": "🇱🇸", 
  "Liberia": "🇱🇷", "Libya": "🇱🇾", "Madagascar": "🇲🇬", "Malawi": "🇲🇼", "Mali": "🇲🇱", 
  "Mauritania": "🇲🇷", "Mauritius": "🇲🇺", "Morocco": "🇲🇦", "Mozambique": "🇲🇿", 
  "Namibia": "🇳🇦", "Niger": "🇳🇪", "Nigeria": "🇳🇬", "Rwanda": "🇷🇼", 
  "São Tomé e Príncipe": "🇸🇹", "Senegal": "🇸🇳", "Seychelles": "🇸🇨", "Sierra Leone": "🇸🇱", 
  "Somalia": "🇸🇴", "South Africa": "🇿🇦", "Sudan": "🇸🇩", "Eswatini": "🇸🇿", 
  "Tanzania": "🇹🇿", "Togo": "🇹🇬", "Tunisia": "🇹🇳", "Uganda": "🇺🇬", "Zambia": "🇿🇲", 
  "Zimbabwe": "🇿🇼", "Afghanistan": "🇦🇫", "Bahrain": "🇧🇭", "Bangladesh": "🇧🇩", 
  "Bhutan": "🇧🇹", "Brunei Darussalam": "🇧🇳", "Cambodia": "🇰🇭", "China PR": "🇨🇳", 
  "Guam": "🇬🇺", "Hong Kong": "🇭🇰", "India": "🇮🇳", "Indonesia": "🇮🇩", "Iran": "🇮🇷", 
  "Iraq": "🇮🇶", "Japan": "🇯🇵", "Jordan": "🇯🇴", "Kazakhstan": "🇰🇿", "Korea DPR": "🇰🇵", 
  "Korea Republic": "🇰🇷", "Kuwait": "🇰🇼", "Kyrgyzstan": "🇰🇬", "Laos": "🇱🇦", 
  "Lebanon": "🇱🇧", "Macau": "🇲🇴", "Malaysia": "🇲🇾", "Maldives": "🇲🇻", 
  "Mongolia": "🇲🇳", "Myanmar": "🇲🇲", "Nepal": "🇳🇵", "Oman": "🇴🇲", "Pakistan": "🇵🇰", 
  "Palestine": "🇵🇸", "Philippines": "🇵🇭", "Qatar": "🇶🇦", "Saudi Arabia": "🇸🇦", 
  "Singapore": "🇸🇬", "Sri Lanka": "🇱🇰", "Syria": "🇸🇾", "Tajikistan": "🇹🇯", 
  "Thailand": "🇹🇭", "Turkmenistan": "🇹🇲", "United Arab Emirates": "🇦🇪", "Uzbekistan": "🇺🇿", 
  "Vietnam": "🇻🇳", "Yemen": "🇾🇪", "American Samoa": "🇦🇸", "Australia": "🇦🇺", 
  "Cook Islands": "🇨🇰", "Fiji": "🇫🇯", "New Zealand": "🇳🇿", "Papua New Guinea": "🇵🇬", 
  "Samoa": "🇼🇸", "Solomon Islands": "🇸🇧", "Tahiti": "🇵🇫", "Tonga": "🇹🇴", 
  "Vanuatu": "🇻🇺", "Gibraltar": "🇬🇮", "Greenland": "🇬🇱", "Dominican Republic": "🇩🇴", 
  "Estonia": "🇪🇪", "Timor-Leste": "🇹🇱", "Chinese Taipei": "🇹🇼", "Comoros": "🇰🇲", 
  "New Caledonia": "🇳🇨", "South Sudan": "🇸🇸", "Kosovo": "🇽🇰"
};

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

function buildPlayer(row, filename, squadLabel) {
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

function makePortraitEl(player, size) {
  const wrap = document.createElement("div");
  wrap.className = size === "small" ? "sticker-portrait" : "sheet-portrait";
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

function renderCard(player) {
  const card = document.createElement("article");
  card.className = "sticker";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `View ${player.name}`);

  const top = document.createElement("div");
  top.className = "sticker-top";
  top.innerHTML = `<span class="sticker-num">#${player.number || "-"}</span>`;
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
  const flagLogo = COUNTRY_FLAGS[player.nation] || player.nation; 
  sub.innerHTML = `<span class="sticker-pos">${player.position}</span><span class="sticker-flag">${flagLogo}</span>`;

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

function populatePositionFilter() {
  const positions = [...new Set(ALL_PLAYERS.map((p) => p.position))].sort();
  positions.forEach((pos) => {
    const opt = document.createElement("option");
    opt.value = pos;
    opt.textContent = pos;
    positionFilter.appendChild(opt);
  });
}

/* ---------- detail overlay ---------- */

const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-btn");

function openSheet(player) {
  document.getElementById("sheet-portrait").replaceWith(
    Object.assign(makePortraitEl(player, "large"), { id: "sheet-portrait" })
  );
  document.getElementById("sheet-number").textContent = `#${player.number || "-"}`;
  document.getElementById("sheet-nation").textContent = COUNTRY_FLAGS[player.nation] || player.nation;
  document.getElementById("sheet-name").textContent = player.name;
  document.getElementById("sheet-meta").textContent = `${player.position} · ${player.club}`;
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
  if (e.key === "Escape" && !overlay.hidden) closeSheet();
});

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
          if (row) return buildPlayer(row, file, squadName);
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
    populatePositionFilter();
    applyFiltersAndRender();

    // Slide the loader up and off-screen, then remove it
    const loader = document.getElementById("loading-screen");
    if (loader) {
      loader.classList.add("slide-up");
      setTimeout(() => {
        loader.remove();
      }, 700); // match the CSS transition duration below
    }
  } catch (err) {
    resultsLine.textContent = "CRITICAL ERROR, PLEASE REFRESH.";
    console.error(err);
    
    // Remove loader even if there is an error so the user can see the error message
    const loader = document.getElementById("loading-screen");
    if (loader) loader.remove();
  }
}

searchInput.addEventListener("input", applyFiltersAndRender);
positionFilter.addEventListener("change", applyFiltersAndRender);
sortBy.addEventListener("change", applyFiltersAndRender);

init();
