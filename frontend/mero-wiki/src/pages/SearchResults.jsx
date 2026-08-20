import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import ProfessionalCard from "../components/professionals/ProfessionalCard";
import Button from "../components/common/Button";
import { professionals } from "../data/professionals";

function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchTerm = searchParams.get("q") || "";
  const locationTerm = searchParams.get("location") || "";

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm, locationTerm]);

  const searchAliases = {
    electrical: "electrician",
  };

  const normalizedSearch =
    searchAliases[searchTerm.toLowerCase()] || searchTerm;

  const filteredProfessionals = professionals.filter((professional) => {
    const matchesService =
      !normalizedSearch ||
      professional.profession
        .toLowerCase()
        .includes(normalizedSearch.toLowerCase());

    const matchesLocation =
      !locationTerm ||
      professional.location
        .toLowerCase()
        .includes(locationTerm.toLowerCase());

    return matchesService && matchesLocation;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Search
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Search Results
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">

            {searchTerm && (
              <>
                <span>Service:</span>

                <span className="font-semibold text-gray-900">
                  "{searchTerm}"
                </span>
              </>
            )}

            {locationTerm && (
              <>
                <span>•</span>

                <span>Location:</span>

                <span className="font-semibold text-gray-900">
                  "{locationTerm}"
                </span>
              </>
            )}

            {!isLoading && (
              <>
                <span>•</span>

                <span className="text-gray-400">
                  {filteredProfessionals.length} professionals found
                </span>
              </>
            )}

          </div>

          <div className="mt-6">
            <Button
              variant="secondary"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="mt-10 flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No professionals found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              We couldn't find any professionals matching your
              service and location. Try a different search.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfessionals.map((professional) => (
              <ProfessionalCard
                key={professional.id}
                id={professional.id}
                name={professional.name}
                profession={professional.profession}
                rating={professional.rating}
                location={professional.location}
                available={professional.available}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

export default SearchResults;