import { Link } from "react-router";

function ServiceCard({ icon, title, description }) {
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

  const searchTerm = searchAliases[title] || title;

  return (
    <Link
      to={`/search?q=${encodeURIComponent(searchTerm)}`}
      className="group"
    >
      <div className="flex h-full flex-col items-center rounded-lg border border-gray-200 bg-white px-4 py-6 text-center transition hover:border-blue-400 hover:shadow-sm">

        {/* Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl transition group-hover:bg-blue-100">
          {icon}
        </div>

        {/* Title */}
        <h3 className="mt-4 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
          {description}
        </p>

      </div>
    </Link>
  );
}

export default ServiceCard;