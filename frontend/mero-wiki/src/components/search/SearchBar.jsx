import { useEffect, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import { getLocationSuggestions } from "../../utils/locationSearch";
import { getServiceSuggestions, resolveServiceQuery } from "../../utils/serviceSearch";

function SearchBar() {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isLocationSuggestionsOpen, setIsLocationSuggestionsOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get("/locations/")
      .then(({ data }) => setLocations(data))
      .catch(() => setLocations([]));
  }, []);

  const handleSearch = () => {
    const trimmedService = service.trim();
    const trimmedLocation = location.trim();

    if (!trimmedService && !trimmedLocation) {
      return;
    }

    const params = new URLSearchParams();

    if (trimmedService) {
      const resolved = resolveServiceQuery(trimmedService);
      params.set(resolved.category ? "category" : "q", resolved.category || trimmedService);
    }

    if (trimmedLocation) {
      params.set("location", trimmedLocation);
    }

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 sm:flex-row">

      {/* Service */}
      <div className="relative flex flex-[2] items-center rounded-lg border border-gray-300 bg-white px-4 shadow-sm">
        <Search
          size={19}
          className="mr-3 shrink-0 text-gray-400"
        />

        <input
          type="text"
          value={service}
          onChange={(event) => {
            setService(event.target.value);
            setIsSuggestionsOpen(true);
          }}
          onFocus={() => setIsSuggestionsOpen(true)}
          onBlur={() => setTimeout(() => setIsSuggestionsOpen(false), 150)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="What service are you looking for?"
          className="w-full py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
        {isSuggestionsOpen && getServiceSuggestions(service).length > 0 && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-card">
            {getServiceSuggestions(service).map((suggestion) => (
              <button
                key={suggestion.category}
                type="button"
                onMouseDown={() => {
                  setService(suggestion.title);
                  setIsSuggestionsOpen(false);
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-brand-blue-600"
              >
                {suggestion.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="relative flex flex-1 items-center rounded-lg border border-gray-300 bg-white px-4 shadow-sm">
        <MapPin
          size={19}
          className="mr-3 shrink-0 text-gray-400"
        />

        <input
          type="text"
          value={location}
          onChange={(event) => {
            setLocation(event.target.value);
            setIsLocationSuggestionsOpen(true);
          }}
          onFocus={() => setIsLocationSuggestionsOpen(true)}
          onBlur={() => setTimeout(() => setIsLocationSuggestionsOpen(false), 150)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Location"
          className="w-full py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
        {isLocationSuggestionsOpen && getLocationSuggestions(locations, location).length > 0 && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-card">
            {getLocationSuggestions(locations, location).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={() => {
                  setLocation(suggestion);
                  setIsLocationSuggestionsOpen(false);
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-brand-blue-600"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        type="button"
        onClick={handleSearch}
        className="rounded-lg bg-brand-blue-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-blue-700 hover:shadow-md"
      >
        Search
      </button>

    </div>
  );
}

export default SearchBar;