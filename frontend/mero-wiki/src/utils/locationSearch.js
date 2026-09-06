const normalize = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const distance = (left, right) => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + cost,
      );
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
};

export function getLocationSuggestions(locations, value, limit = 5) {
  const query = normalize(value);

  if (!query || !locations?.length) {
    return [];
  }

  return locations
    .filter(Boolean)
    .map((location) => {
      const normalizedLocation = normalize(location);
      const words = normalizedLocation.split(" ");
      const isPrefix = words.some((word) => word.startsWith(query));
      const isSubstring = normalizedLocation.includes(query);
      const closestDistance = Math.min(
        distance(query, normalizedLocation),
        ...words.map((word) => distance(query, word)),
      );
      const maxTypoDistance = query.length < 5 ? 1 : 2;

      return {
        location,
        score: isPrefix ? 0 : isSubstring ? 1 : closestDistance <= maxTypoDistance ? 2 : 99,
        distance: closestDistance,
      };
    })
    .filter((result) => result.score < 99)
    .sort((left, right) => left.score - right.score || left.distance - right.distance)
    .map(({ location }) => location)
    .filter((location, index, all) => (
      all.findIndex((item) => normalize(item) === normalize(location)) === index
    ))
    .slice(0, limit);
}
