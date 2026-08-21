import { Link } from "react-router-dom";

function ServiceCard({ icon, title, description }) {
  const searchAliases = {
    Electrical: "electrician",
    Plumbing: "plumber",
    Education: "teacher",
    Photography: "photographer",
    Cleaning: "cleaner",
    "Computer Repairer": "computer_repair",
    Designer: "designer",
    Automotive: "automobile_engineer",
  };

  const category = searchAliases[title] || title;

  return (
    <Link
      to={`/search?category=${encodeURIComponent(category)}`}
      className="group"
    >
      <div className="flex h-full flex-col items-center rounded-lg border border-gray-200 bg-white px-4 py-6 text-center transition hover:border-blue-400 hover:shadow-md">
        
        {/* Category Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl transition group-hover:bg-blue-100">
          {icon}
        </div>

        {/* Category Title */}
        <h3 className="mt-4 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
          {title}
        </h3>

        {/* Category Description */}
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
          {description}
        </p>

      </div>
    </Link>
  );
}

export default ServiceCard;