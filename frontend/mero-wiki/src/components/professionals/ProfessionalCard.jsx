import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function ProfessionalCard({
  id,
  name,
  profession,
  rating,
  location,
  profile,
  available = true,
}) {
  const [isFavorite, setIsFavorite] = useState(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favoriteProfessionals") || "[]"
    );

    return savedFavorites.includes(id);
  });
  const [profileImageFailed, setProfileImageFailed] = useState(false);

  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favoriteProfessionals") || "[]"
    );

    if (isFavorite) {
      if (!savedFavorites.includes(id)) {
        savedFavorites.push(id);
      }
    } else {
      const index = savedFavorites.indexOf(id);

      if (index !== -1) {
        savedFavorites.splice(index, 1);
      }
    }

    localStorage.setItem(
      "favoriteProfessionals",
      JSON.stringify(savedFavorites)
    );
  }, [id, isFavorite]);

  useEffect(() => {
    setProfileImageFailed(false);
  }, [profile, id]);

  const profileImageUrl = profile
    ? profile.startsWith("http")
      ? profile
      : `http://localhost:8000${profile}`
    : "";

  const handleFavorite = (event) => {
    event.preventDefault();
    setIsFavorite((current) => !current);
  };

  return (
    <article className="group relative h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">

      {/* Favorite */}
      <button
        type="button"
        onClick={handleFavorite}
        className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border bg-white transition ${
          isFavorite
            ? "border-red-200 text-red-500"
            : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500"
        }`}
        aria-label={
          isFavorite
            ? `Remove ${name} from favorites`
            : `Add ${name} to favorites`
        }
      >
        <Heart
          size={18}
          className={isFavorite ? "fill-current" : ""}
        />
      </button>

      {/* Profile */}
      <Link to={`/professionals/${id}`}>
        <div className="flex items-start gap-4 pr-10">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-lg font-bold text-blue-600">
            {profileImageUrl && !profileImageFailed ? (
              <img
                src={profileImageUrl}
                alt={name}
                className="h-full w-full object-cover"
                onError={() => setProfileImageFailed(true)}
              />
            ) : (
              name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-gray-900">
              {name}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {profession}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            ⭐ {rating}
          </span>

          <span className="text-gray-500">
            {location}
          </span>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">

            <span
              className={
                available
                  ? "text-sm font-medium text-green-600"
                  : "text-sm font-medium text-gray-400"
              }
            >
              {available
                ? "Available"
                : "Currently unavailable"}
            </span>

            <span className="flex items-center gap-1 text-sm font-semibold text-blue-600 transition group-hover:gap-2">
              View Profile
              <ArrowRight size={16} />
            </span>

          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProfessionalCard;