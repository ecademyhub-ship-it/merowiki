import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";

function ServiceCard({ icon, title, description, category, color, iconColor }) {
  // Get the icon component from lucide-react
  const IconComponent = LucideIcons[icon] || LucideIcons.Wrench;

  return (
    <Link
      to={`/search?category=${encodeURIComponent(category)}`}
      className="group"
    >
      <div className="flex h-full flex-col items-center rounded-lg border border-gray-200 bg-white px-4 py-6 text-center transition hover:border-blue-400 hover:shadow-lg">
        
        {/* Category Icon */}
        <div className={`flex h-14 w-14 items-center justify-center rounded-full ${color} transition group-hover:scale-110`}>
          <IconComponent className={`h-7 w-7 ${iconColor}`} />
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