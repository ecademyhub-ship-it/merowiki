import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../api/client";
import ProfessionalCard from "../components/professionals/ProfessionalCard";
import Button from "../components/common/Button";

function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category") || "";
  const searchTerm = searchParams.get("q") || searchParams.get("service") || "";
  const locationTerm = searchParams.get("location") || "";

  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const searchAliases = {
    electrical: "electrician",
    plumbing: "plumber",
    education: "teacher",
    photography: "photographer",
    cleaning: "cleaner",
    "computer repairer": "computer_repair",
    automotive: "automobile_engineer",
  };

  const normalizedSearch =
    searchAliases[searchTerm.trim().toLowerCase()] || searchTerm.trim();

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setIsLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (category) {
          params.set("category", category);
        }

        if (normalizedSearch) {
          params.set("q", normalizedSearch);
        }

        if (locationTerm) {
          params.set("location", locationTerm);
        }

        const response = await apiClient.get(`/features/?${params.toString()}`);

        setFeatures(response.data.map((feature) => ({
          ...feature,
          profession: feature.category.replaceAll("_", " "),
          rating: Number(feature.rating || 0).toFixed(1),
          available: feature.is_available,
        })));
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("We could not load search results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatures();
  }, [category, normalizedSearch, locationTerm]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
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
                <span className="font-semibold text-gray-900">&quot;{searchTerm}&quot;</span>
              </>
            )}

            {locationTerm && (
              <>
                {searchTerm && <span>•</span>}
                <span>Location:</span>
                <span className="font-semibold text-gray-900">&quot;{locationTerm}&quot;</span>
              </>
            )}

            {!isLoading && !error && (
              <>
                {(searchTerm || locationTerm) && <span>•</span>}
                <span className="text-gray-400">
                  {features.length} professional{features.length === 1 ? "" : "s"} found
                </span>
              </>
            )}
          </div>

          <div className="mt-6">
            <Button variant="secondary" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-10 flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-100 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-900">Unable to load results</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-red-600">{error}</p>
          </div>
        ) : features.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-900">No professionals found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              We couldn&apos;t find any professionals matching your service and location. Try a different search.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <ProfessionalCard
                key={feature.id}
                id={feature.id}
                name={feature.name}
                profession={feature.profession}
                rating={feature.rating}
                location={feature.location}
                available={feature.available}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default SearchResults;