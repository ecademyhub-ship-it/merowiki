import { Link } from "react-router-dom";
import { services } from "../../data/services";

function PopularServices() {
  const popularServices = services.slice(0, 8);

  const searchAliases = {
    Electrical: "Electrician",
    Plumbing: "Plumber",
    Education: "Tutor",
    Photography: "Photographer",
    Cleaning: "Cleaner",
    "Computer Repairer": "Computer Repairer",
    Designer: "Designer",
    Automotive: "Automotive",
  };

  return (
    <section className="bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Popular Services
          </h2>

          <Link
            to="/services"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>

        {/* Services */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {popularServices.map((service) => {
            const searchTerm =
              searchAliases[service.title] || service.title;

            return (
              <Link
                key={service.id}
                to={`/search?q=${encodeURIComponent(searchTerm)}`}
                className="group flex min-h-[120px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-3 text-center transition hover:border-blue-400 hover:shadow-sm"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl transition group-hover:bg-blue-100">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="mt-3 text-xs font-semibold text-gray-800 group-hover:text-blue-600">
                  {service.title}
                </h3>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default PopularServices;