import { Link } from "react-router";
import PopularServices from "../components/services/PopularServices";
import ProfessionalCard from "../components/professionals/ProfessionalCard";
import SearchBar from "../components/search/SearchBar";
import { professionals } from "../data/professionals";

function Home() {
  const popularProfessionals = professionals.slice(0, 3);

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Search Section */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">

          {/* Small Heading */}
          <div className="mb-4 text-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Find professionals near you
            </h1>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Quick Services */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              "Electrical",
              "Plumbing",
              "Education",
              "Photography",
              "Cleaning",
            ].map((service) => (
              <Link
                key={service}
                to={`/search?service=${encodeURIComponent(service)}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
              >
                {service}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Popular Services */}
      <PopularServices />

      {/* Popular Professionals */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Popular Professionals
            </h2>

            <Link
              to="/professionals"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularProfessionals.map((professional) => (
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

        </div>
      </section>

      {/* Why Mero Wiki */}
      <section className="border-t border-gray-200 bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">
              Why Mero Wiki?
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              A simple way to find reliable local professionals.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">

            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
              <div className="text-2xl">🔍</div>
              <h3 className="mt-2 font-semibold text-gray-900">
                Easy to Find
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Quickly search for the service you need.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
              <div className="text-2xl">⭐</div>
              <h3 className="mt-2 font-semibold text-gray-900">
                Trusted Professionals
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Discover professionals with useful information.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
              <div className="text-2xl">📍</div>
              <h3 className="mt-2 font-semibold text-gray-900">
                Local Services
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Find professionals available in your area.
              </p>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Home;