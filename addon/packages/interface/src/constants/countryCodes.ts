const mainEU = [
    ["Belgium", "BE"],
    ["Greece", "EL"],
    ["Lithuania", "LT"],
    ["Portugal", "PT"],
    ["Bulgaria", "BG"],
    ["Spain", "ES"],
    ["Luxembourg", "LU"],
    ["Romania", "RO"],
    ["Czechia", "CZ"],
    ["France", "FR"],
    ["Hungary", "HU"],
    ["Slovenia", "SI"],
    ["Denmark", "DK"],
    ["Croatia", "HR"],
    ["Malta", "MT"],
    ["Slovakia", "SK"],
    ["Germany", "DE"],
    ["Italy", "IT"],
    ["Netherlands", "NL"],
    ["Finland", "FI"],
    ["Estonia", "EE"],
    ["Cyprus", "CY"],
    ["Austria", "AT"],
    ["Sweden", "SE"],
    ["Ireland", "IE"],
    ["Latvia", "LV"],
    ["Poland", "PL"],
];

const eftaMembers = [
    ["Iceland", "IS"],
    ["Norway", "NO"],
    ["Liechtenstein", "LI"],
    ["Switzerland", "CH"],
];

const euCandidates = [
    ["Bosnia and Herzegovina", "BA"],
    ["Montenegro", "ME"],
    ["Moldova", "MD"],
    ["North Macedonia", "MK"],
    ["Georgia", "GE"],
    ["Albania", "AL"],
    ["Serbia", "RS"],
    ["Türkiye", "TR"],
    ["Ukraine", "UA"],
];

const includeEFTA = import.meta.env.VITE_FEATURE_EU_INCLUDES_EFTA === "true";
const includeCandidates = import.meta.env.VITE_FEATURE_EU_INCLUDES_CANDIDATES === "true";

const countries_EU = [...mainEU];

if (includeEFTA) {
    countries_EU.push(...eftaMembers);
}
if (includeCandidates) {
    countries_EU.push(...euCandidates);
}

export const countryCodes_EU = countries_EU.map((country) => country[1]);
