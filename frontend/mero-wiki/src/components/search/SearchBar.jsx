import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmedService = service.trim();
    const trimmedLocation = location.trim();

    if (!trimmedService && !trimmedLocation) {
      return;
    }

    const params = new URLSearchParams();

    if (trimmedService) {
      params.set("q", trimmedService);
    }

    if (trimmedLocation) {
      params.set("location", trimmedLocation);
    }

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 sm:flex-row ">

      {/* Service */}
      <div className="flex flex-[2] items-center rounded-lg border border-gray-300 bg-white px-4 shadow-sm">
        <Search
          size={19}
          className="mr-3 shrink-0 text-gray-400"
        />

        <input
          type="text"
          value={service}
          onChange={(event) => setService(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="What service are you looking for?"
          className="w-full py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Location */}
      <div className="flex flex-1 items-center rounded-lg border border-gray-300 bg-white px-4 shadow-sm">
        <MapPin
          size={19}
          className="mr-3 shrink-0 text-gray-400"
        />

        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Location"
          className="w-full py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Search Button */}
      <button
        type="button"
        onClick={handleSearch}
        className="rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Search
      </button>

    </div>
  );
}

export default SearchBar;