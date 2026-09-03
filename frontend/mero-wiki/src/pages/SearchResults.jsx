import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import apiClient from "../api/client";
import ProfessionalCard from "../components/professionals/ProfessionalCard";

function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category") || "";
  const searchTerm = searchParams.get("q") || searchParams.get("service") || "";
  const locationTerm = searchParams.get("location") || "";

  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSearch, setNewSearch] = useState("");

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

  const handleSearch = () => {
    if (newSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(newSearch)}`);
      setNewSearch("");
    }
  };

  // Format category name for display
  const getCategoryDisplayName = (cat) => {
    return cat
      .replace(/_/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        
        {/* Header with Back Button */}
        <button
          onClick={() => navigate("/services")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Services</span>
        </button>

        {/* Title Section */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Search Results
          </p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            {category ? getCategoryDisplayName(category) : "Search Results"}
          </h1>

          {/* Search Info */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            {category && (
              <>
                <span className="font-semibold text-gray-900">{getCategoryDisplayName(category)}</span>
              </>
            )}

            {locationTerm && (
              <>
                {category && <span className="text-gray-300">•</span>}
                <span>Location: <span className="font-semibold text-gray-900">{locationTerm}</span></span>
              </>
            )}

            {!isLoading && features.length > 0 && (
              <>
                {(category || locationTerm) && <span className="text-gray-300">•</span>}
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-600">
                  {features.length} professional{features.length === 1 ? "" : "s"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for another service..."
              value={newSearch}
              onChange={(e) => setNewSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            onClick={handleSearch}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* Results Section */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-white px-6 py-12 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900">Unable to load results</h2>
            <p className="mx-auto mt-2 max-w-md text-gray-500">{error}</p>
          </div>
        ) : features.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900">No professionals found</h2>
            <p className="mx-auto mt-2 max-w-md text-gray-500">
              We couldn&apos;t find any professionals matching your criteria. Try a different search or browse other categories.
            </p>
            <button
              onClick={() => navigate("/services")}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition"
            >
              Browse All Services
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Display all professionals in a grid */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Professionals
                </h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default SearchResults;