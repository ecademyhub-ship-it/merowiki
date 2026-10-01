import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Share2,
  Star,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/client";

const categoryLabel = (value = "") =>
  value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const imageUrl = (value) => {
  if (!value) return "";
  if (value.startsWith("http")) return value;
  const baseUrl = apiClient.defaults.baseURL || window.location.origin;
  const base = baseUrl.startsWith("http")
    ? new URL(baseUrl).origin
    : window.location.origin;
  return new URL(value, base).toString();
};

const normalizeReview = (review) => ({
  ...review,
  reviewer: review.reviewer || "Mero Wiki user",
  comment: typeof review.comment === "string" ? review.comment.trim() : "",
});

function RatingStars({ rating = 0, size = 16 }) {
  return (
    <span
      className="flex items-center gap-0.5 text-amber-500"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(rating) ? "fill-current" : ""}
        />
      ))}
    </span>
  );
}

function ProfessionalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState(null);
  const [similarProfessionals, setSimilarProfessionals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem("favoriteProfessionals") || "[]",
    );
    setIsFavorite(favorites.includes(Number(id)));
  }, [id]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: features } = await apiClient.get("/features/");
        const feature = features.find((item) => String(item.id) === String(id));
        if (!feature) return;
        const [reviewResponse, similarResponse] = await Promise.all([
          apiClient.get(`/features/${id}/reviews/`),
          apiClient.get(
            `/features/?category=${encodeURIComponent(feature.category)}`,
          ),
        ]);
        setProfessional(feature);
        setReviews(reviewResponse.data.map(normalizeReview));
        setSimilarProfessionals(
          similarResponse.data
            .filter((item) => String(item.id) !== String(id))
            .slice(0, 8),
        );
      } catch (error) {
        console.error("Error fetching professional details:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem("favoriteProfessionals") || "[]",
    );
    const professionalId = Number(id);
    const nextFavorites = isFavorite
      ? [...new Set([...favorites, professionalId])]
      : favorites.filter((favoriteId) => favoriteId !== professionalId);
    localStorage.setItem(
      "favoriteProfessionals",
      JSON.stringify(nextFavorites),
    );
  }, [id, isFavorite]);

  const photos = useMemo(() => {
    if (!professional) return [];
    return [professional.profile, 1, 2, 3, 4, 5]
      .map((photo) =>
        typeof photo === "number" ? professional[`work_photo_${photo}`] : photo,
      )
      .filter(Boolean)
      .map(imageUrl);
  }, [professional]);

  if (loading)
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-16 text-center text-slate-500">
        Loading professional...
      </main>
    );
  if (!professional)
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Professional not found</h1>
        <Link
          to="/professionals"
          className="mt-5 inline-block font-semibold text-emerald-600"
        >
          Back to professionals
        </Link>
      </main>
    );

  const phone = professional.phone || "";
  const phoneDigits = phone.replace(/\D/g, "");
  const about =
    professional.description ||
    `${professional.name} provides ${categoryLabel(professional.category).toLowerCase()} services in ${professional.location}.`;
  const coverImage = photos[1] || photos[0];
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(professional.location)}`;

  const submitReview = async (event) => {
    event.preventDefault();
    if (!reviewRating) {
      setReviewError("Please select a star rating.");
      return;
    }
    try {
      setIsSubmittingReview(true);
      const { data } = await apiClient.post(`/features/${id}/reviews/`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      const savedReview = normalizeReview(data.review);
      setReviews((current) => [
        savedReview,
        ...current.filter((review) => review.id !== savedReview.id),
      ]);
      setProfessional((current) => ({
        ...current,
        rating: data.rating,
        review_count: data.review_count,
      }));
      setReviewRating(0);
      setReviewComment("");
      setReviewError("");
    } catch (error) {
      setReviewError(
        error.response?.data?.detail || "Unable to submit your review.",
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const shareProfile = async () => {
    if (navigator.share)
      await navigator.share({
        title: professional.name,
        url: window.location.href,
      });
    else await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <main className="min-h-screen bg-slate-100 pb-10 text-slate-900">
      <div className="mx-auto min-h-screen max-w-[480px] bg-white shadow-xl shadow-slate-300/40">
        <section className="relative h-52 bg-slate-200">
          {coverImage ? (
            <img
              src={coverImage}
              alt={`${professional.name} cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-emerald-700 to-cyan-500" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/25" />
          <div className="absolute left-4 right-4 top-4 flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-sm"
              aria-label="Go back"
            >
              <ArrowLeft size={19} />
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={shareProfile}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-sm"
                aria-label="Share profile"
              >
                <Share2 size={18} />
              </button>
              <button
                type="button"
                onClick={() => setIsFavorite((current) => !current)}
                className={`grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-sm ${isFavorite ? "text-rose-500" : ""}`}
                aria-label="Toggle favorite"
              >
                <Heart size={18} className={isFavorite ? "fill-current" : ""} />
              </button>
            </div>
          </div>
          <div className="absolute -bottom-12 left-5 h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-emerald-100 text-2xl font-bold text-emerald-700 shadow-md">
            {photos[0] ? (
              <img
                src={photos[0]}
                alt={professional.name}
                className="h-full w-full object-cover"
              />
            ) : (
              professional.name.slice(0, 2).toUpperCase()
            )}
          </div>
        </section>

        <section className="px-5 pb-5 pt-16">
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
            {categoryLabel(professional.category)}
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            {professional.name}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <RatingStars rating={professional.rating} />
            <strong className="text-slate-800">
              {Number(professional.rating || 0).toFixed(1)}
            </strong>
            <span>({professional.review_count || reviews.length} reviews)</span>
          </div>
          <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
            <MapPin size={18} className="mt-0.5 text-emerald-600" />
            <span>
              <strong className="block text-slate-800">
                {professional.location}
              </strong>
              <span
                className={`mt-1 flex items-center gap-1.5 text-xs font-semibold ${professional.is_available ? "text-emerald-600" : "text-slate-400"}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${professional.is_available ? "bg-emerald-500" : "bg-slate-300"}`}
                />
                {professional.is_available
                  ? "Available now"
                  : "Currently unavailable"}
              </span>
            </span>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 px-5 pb-5">
          <a
            href={phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold shadow-sm ${phone ? "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600" : "pointer-events-none border-slate-200 text-slate-300"}`}
          >
            <Phone size={18} />
            Call
          </a>
          <a
            href={phoneDigits ? `https://wa.me/${phoneDigits}` : undefined}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold shadow-sm ${phoneDigits ? "border-green-500 bg-green-500 text-white hover:bg-green-600" : "pointer-events-none border-slate-200 text-slate-300"}`}
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
        </div>

        <nav className="sticky top-0 z-10 flex border-b border-slate-200 bg-white">
          {[
            ["overview", "Overview"],
            [
              "reviews",
              `Reviews (${professional.review_count || reviews.length})`,
            ],
            ["photos", `Photos (${Math.max(photos.length - 1, 0)})`],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 px-2 py-4 text-sm font-bold ${activeTab === tab ? "text-emerald-600 after:absolute after:inset-x-1/4 after:bottom-0 after:h-0.5 after:bg-emerald-500" : "text-slate-400"}`}
            >
              {label}
            </button>
          ))}
        </nav>

        {activeTab === "overview" ? (
          <section className="space-y-7 px-5 py-6">
            <div>
              <h2 className="text-lg font-bold">Location</h2>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-3 rounded-xl bg-emerald-50 p-3 text-left hover:bg-emerald-100"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-emerald-600">
                  <Navigation size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm">Get directions</strong>
                  <span className="block truncate text-xs text-slate-500">
                    {professional.location}
                  </span>
                </span>
                <ChevronRight size={18} className="text-slate-400" />
              </a>
            </div>
            <div>
              <h2 className="text-lg font-bold">About</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{about}</p>
              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100">
                  <Clock3 size={18} />
                </span>
                <span>
                  <strong className="block text-sm">
                    Service availability
                  </strong>
                  <span className="text-xs text-slate-500">
                    {professional.is_available
                      ? "Currently available"
                      : "Currently unavailable"}
                  </span>
                </span>
              </div>
            </div>
          </section>
        ) : activeTab === "reviews" ? (
          <section className="px-5 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">All reviews</h2>
              <span className="text-sm text-slate-400">
                {reviews.length} total
              </span>
            </div>
            <form
              onSubmit={submitReview}
              className="mt-4 rounded-xl bg-slate-50 p-4"
            >
              <p className="text-sm font-bold">Rate this professional</p>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    aria-label={`${star} stars`}
                    className="text-amber-500"
                  >
                    <Star
                      size={22}
                      className={star <= reviewRating ? "fill-current" : ""}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                rows={3}
                placeholder="Share your experience"
                className="mt-3 w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-emerald-500"
              />
              {reviewError && (
                <p className="mt-2 text-sm text-rose-600">{reviewError}</p>
              )}
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {isSubmittingReview ? "Submitting..." : "Submit review"}
              </button>
            </form>
            <div className="mt-5 space-y-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-sm">{review.reviewer}</strong>
                    <span className="text-xs text-slate-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <RatingStars rating={review.rating} size={14} />
                  {review.comment && (
                    <p className="mt-2 text-sm leading-5 text-slate-600">
                      {review.comment}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="px-5 py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  Portfolio
                </p>
                <h2 className="mt-1 text-lg font-bold">
                  Photos from this professional
                </h2>
              </div>
              <span className="text-sm text-slate-400">
                {Math.max(photos.length - 1, 0)} photos
              </span>
            </div>
            {photos.length > 1 ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {photos.slice(1).map((photo, index) => (
                  <button
                    key={photo}
                    type="button"
                    onClick={() => setSelectedPhoto(index + 1)}
                    className="h-40 overflow-hidden rounded-xl bg-slate-100"
                  >
                    <img
                      src={photo}
                      alt={`${professional.name} work ${index + 1}`}
                      className="h-full w-full object-cover transition hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                No work photos have been added yet.
              </p>
            )}
          </section>
        )}

        <aside className="border-t border-slate-100 bg-slate-50 px-5 py-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Top rated in category
              </p>
              <h2 className="mt-1 text-lg font-bold">
                Similar {categoryLabel(professional.category)} businesses
              </h2>
            </div>
            <Star size={20} className="fill-amber-400 text-amber-400" />
          </div>
          {similarProfessionals.length > 0 ? (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {similarProfessionals.map((similar, index) => (
                <Link
                  key={similar.id}
                  to={`/professionals/${similar.id}`}
                  className="group relative w-40 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 active:scale-95 active:bg-emerald-50"
                >
                  <div className="h-24 bg-slate-100">
                    {imageUrl(similar.profile) && (
                      <img
                        src={imageUrl(similar.profile)}
                        alt={similar.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-active:scale-100"
                      />
                    )}
                  </div>
                  <div className="p-3">
                    <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      #{index + 1}
                    </span>
                    <h3 className="truncate text-sm font-bold">
                      {similar.name}
                    </h3>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {categoryLabel(similar.category)}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-700">
                      <Star
                        size={13}
                        className="fill-amber-400 text-amber-400"
                      />
                      {Number(similar.rating || 0).toFixed(1)}
                      <span className="ml-auto text-[10px] font-normal text-slate-400">
                        {similar.review_count || 0} reviews
                      </span>
                    </div>
                    <span
                      className={`mt-2 flex items-center gap-1 text-[10px] font-semibold ${similar.is_available ? "text-emerald-600" : "text-slate-400"}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${similar.is_available ? "bg-emerald-500" : "bg-slate-300"}`}
                      />
                      {similar.is_available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-500">
              No other {categoryLabel(professional.category).toLowerCase()}{" "}
              businesses are available yet.
            </p>
          )}
        </aside>
      </div>

      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-white"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Close photo viewer"
          >
            <X size={26} />
          </button>
          <button
            type="button"
            className="absolute left-3 text-white"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedPhoto(
                (selectedPhoto - 1 + photos.length) % photos.length,
              );
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={32} />
          </button>
          <img
            src={photos[selectedPhoto]}
            alt={`${professional.name} work`}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-3 text-white"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedPhoto((selectedPhoto + 1) % photos.length);
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </main>
  );
}

export default ProfessionalDetails;
