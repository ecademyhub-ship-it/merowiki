import { useEffect, useState } from "react";
import axios from "axios";
import SectionHeading from "../components/common/SectionHeading";
import ProfessionalCard from "../components/professionals/ProfessionalCard";

function Professionals() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating-desc");

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/user/features/",
          { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
        );
        setProfessionals(response.data.map((feature) => ({
          ...feature,
          profession: feature.category.replaceAll("_", " "),
          rating: feature.rating || 0,
          available: feature.is_available,
        })));
      } catch (error) {
        console.error("Error fetching professionals:", error);
        setLoadError("Unable to load professionals right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const filteredProfessionals = professionals.filter((professional) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      professional.name.toLowerCase().includes(search) ||
      professional.profession.toLowerCase().includes(search) ||
      professional.location.toLowerCase().includes(search);

    const matchesLocation =
      locationFilter === "all" ||
      professional.location.toLowerCase().includes(locationFilter);

    const matchesService =
      serviceFilter === "all" ||
      professional.profession.toLowerCase().includes(serviceFilter);

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && professional.available) ||
      (availabilityFilter === "unavailable" && !professional.available);

    return (
      matchesSearch &&
      matchesLocation &&
      matchesService &&
      matchesAvailability
    );
  });

  const sortedProfessionals = [...filteredProfessionals].sort(
    (a, b) => {
      if (sortBy === "rating-desc") {
        return Number(b.rating) - Number(a.rating);
      }

      if (sortBy === "rating-asc") {
        return Number(a.rating) - Number(b.rating);
      }

      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    }
  );

  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("all");
    setServiceFilter("all");
    setAvailabilityFilter("all");
    setSortBy("rating-desc");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    locationFilter !== "all" ||
    serviceFilter !== "all" ||
    availabilityFilter !== "all" ||
    sortBy !== "rating-desc";

  if (loading) {
    return <main className="min-h-screen bg-gray-50 px-6 py-16 text-center">Loading professionals...</main>;
  }

  if (loadError) {
    return <main className="min-h-screen bg-gray-50 px-6 py-16 text-center text-red-600">{loadError}</main>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

        <SectionHeading
          eyebrow="Professionals"
          title="Find trusted professionals"
          description="Connect with skilled professionals who can help with your everyday needs."
        />

        {/* Filters */}
        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-5">

          {/* Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search..."
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {/* Location */}
          <select
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            <option value="all">All locations</option>
            <option value="butwal">Butwal</option>
            <option value="bhairahawa">Bhairahawa</option>
             <option value="bhairahawa">Manigram</option>
              <option value="bhairahawa">Drivertol</option>
               <option value="bhairahawa">kalikanagar</option>
                <option value="bhairahawa">Buddhachowk</option>
                 <option value="bhairahawa">Nayamil</option>
                  <option value="bhairahawa">Bhalwari</option>
          </select>

          {/* Service */}
          <select
            value={serviceFilter}
            onChange={(event) => setServiceFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            <option value="all">All services</option>
            <option value="electrician">Electrical</option>
          </select>

          {/* Availability */}
          <select
            value={availabilityFilter}
            onChange={(event) =>
              setAvailabilityFilter(event.target.value)
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            <option value="all">All availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            <option value="rating-desc">Highest rated</option>
            <option value="rating-asc">Lowest rated</option>
            <option value="name-asc">Name A-Z</option>
          </select>
        </div>

        {/* Count + Clear */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            {sortedProfessionals.length} professional
            {sortedProfessionals.length !== 1 ? "s" : ""} found
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results */}
        {sortedProfessionals.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No professionals found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProfessionals.map((professional) => (
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

      </section>
    </main>
  );
}

export default Professionals;