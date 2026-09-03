import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { services } from "../../data/services";

function PopularServices() {
  const popularServices = services.slice(0, 8);

  return (
    <section className="bg-gray-50 py-7 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

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
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-8">
          {popularServices.map((service) => {
            const IconComponent = LucideIcons[service.icon] || LucideIcons.Wrench;

            return (
              <Link
                key={service.id}
                to={`/search?category=${encodeURIComponent(service.category)}`}
                className="group flex min-h-[112px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-2.5 text-center transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-sm sm:min-h-[120px] sm:p-3"
              >
                {/* Icon */}
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${service.color} transition group-hover:scale-110`}>
                  <IconComponent className={`h-6 w-6 ${service.iconColor}`} />
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