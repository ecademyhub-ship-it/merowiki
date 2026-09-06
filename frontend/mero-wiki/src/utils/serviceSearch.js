import { services } from "../data/services";

const normalize = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const aliases = {
  plumbing: "plumber",
  electrical: "electrician",
  automotive: "automobile_engineer",
  bhajan: "bhajan_toli",
  band: "band_baja",
  "bhajan toli": "bhajan_toli",
  "band baja": "band_baja",
  "panche baja": "panche_baja",
  "half catrine": "half_catering",
  "half catering": "half_catering",
  flowers: "flower_decorator",
  "flower decorator": "flower_decorator",
  decoration: "flower_decorator",
  "interior decorator": "interior_designer",
  rental: "car_rental",
  "car hire": "car_rental",
  "bike hire": "bike_rental",
  toilet: "toilet_tank_cleaner",
  "toilet tank": "toilet_tank_cleaner",
  septic: "toilet_tank_cleaner",
  "septic tank": "toilet_tank_cleaner",
};

const distance = (left, right) => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + substitutionCost,
      );
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
};

const serviceTerms = services.map((service) => ({
  service,
  terms: [service.title, service.category, service.description]
    .map(normalize)
    .filter(Boolean),
}));

export function getServiceSuggestions(value, limit = 5) {
  const query = normalize(value);

  if (!query) {
    return [];
  }

  const aliasCategory = aliases[query];
  const ranked = serviceTerms
    .map(({ service, terms }) => {
      const exactAlias = aliasCategory === service.category;
      const includesQuery = terms.some((term) => term.includes(query));
      const closestDistance = Math.min(
        ...terms.map((term) => distance(query, term.split(" ")[0])),
      );
      const maxTypoDistance = query.length < 5 ? 1 : query.length < 8 ? 2 : 3;

      return {
        service,
        score: exactAlias ? 0 : includesQuery ? 1 : closestDistance <= maxTypoDistance ? 2 : 99,
        distance: closestDistance,
      };
    })
    .filter((result) => result.score < 99)
    .sort((left, right) => left.score - right.score || left.distance - right.distance)
    .map(({ service }) => service);

  return ranked.filter((service, index, all) => (
    all.findIndex((item) => item.category === service.category) === index
  )).slice(0, limit);
}

export function resolveServiceQuery(value) {
  const query = normalize(value);
  const suggestion = getServiceSuggestions(value, 1)[0];

  if (!suggestion) {
    return { query: value.trim(), category: "" };
  }

  const terms = [suggestion.title, suggestion.category].map(normalize);
  const exactMatch = terms.includes(query) || aliases[query] === suggestion.category;
  const substringMatch = terms.some((term) => term.includes(query));
  const typoMatch = getServiceSuggestions(value, 1).length > 0;

  return {
    query: suggestion.title,
    category: exactMatch || substringMatch || typoMatch ? suggestion.category : "",
  };
}

export { normalize };
