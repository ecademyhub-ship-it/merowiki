import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Star,
  Phone,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/client";
import Button from "../components/common/Button";

function ProfessionalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileImageFailed, setProfileImageFailed] = useState(false);
  const [selectedWorkPhoto, setSelectedWorkPhoto] = useState(null);

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const [response, reviewsResponse] = await Promise.all([
          apiClient.get("/features/"),
          apiClient.get(`/features/${id}/reviews/`),
        ]);
        const feature = response.data.find((item) => String(item.id) === id);
        if (feature) {
          setProfessional({
            ...feature,
            profession: feature.category.replaceAll("_", " "),
            available: feature.is_available,
          });
          setReviews(reviewsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching professional:", error);
      } finally {
        setLoading(false);
        setProfileImageFailed(false);
        setReviewRating(0);
        setReviews([]);
        setReviewComment("");
      }
    };

    fetchProfessional();
  }, [id]);

  if (loading) {
    return <main className="min-h-screen bg-gray-50 px-6 py-16 text-center">Loading professional...</main>;
  }

  if (!professional) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Professional not found
          </h1>

          <p className="mt-3 text-gray-500">
            The professional you're looking for doesn't exist.
          </p>

          <div className="mt-6">
            <Button onClick={() => navigate("/professionals")}>
              Back to Professionals
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Generate initials automatically
  const initials = professional.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const about =
    professional.description ||
    professional.about ||
    `${professional.name} provides reliable ${professional.profession.toLowerCase()} services in ${professional.location}. Contact this professional to discuss your requirements and service availability.`;

  const backendOrigin = apiClient.defaults.baseURL
    ? new URL(apiClient.defaults.baseURL).origin
    : "";
  const profileImageUrl = professional.profile
    ? professional.profile.startsWith("http")
      ? professional.profile
      : `${backendOrigin}${professional.profile}`
    : "";
  const workPhotoUrls = [1, 2, 3, 4, 5]
    .map((photoNumber) => professional[`work_photo_${photoNumber}`])
    .filter(Boolean)
    .map((photo) => (photo.startsWith("http") ? photo : `${backendOrigin}${photo}`));

  const contactPhone =
    professional.phone ||
    professional.phone_number ||
    professional.contact_number ||
    "";
  const phoneDigits = contactPhone.replace(/\D/g, "");
  const telHref = contactPhone ? `tel:${contactPhone.replace(/\s+/g, "")}` : "";
  const whatsappHref = phoneDigits ? `https://wa.me/${phoneDigits}` : "";

  const submitReview = async (event) => {
    event.preventDefault();
    if (!reviewRating) {
      setReviewError("Please select a star rating.");
      return;
    }

    try {
      setIsSubmittingReview(true);
      setReviewError("");
      const response = await apiClient.post(`/features/${id}/reviews/`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setProfessional((current) => ({
        ...current,
        rating: response.data.rating,
        review_count: response.data.review_count,
      }));
      setReviews((current) => [
        response.data.review,
        ...current.filter((review) => review.id !== response.data.review.id),
      ]);
      setReviewRating(0);
      setReviewComment("");
    } catch (error) {
      setReviewError(error.response?.data?.detail || "Unable to submit your review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to results
        </button>

        {/* Profile */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Profile Header */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row">

              {/* Avatar */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-2xl font-bold text-blue-600">
                {profileImageUrl && !profileImageFailed ? (
                  <img
                    src={profileImageUrl}
                    alt={professional.name}
                    className="h-full w-full object-cover"
                    onError={() => setProfileImageFailed(true)}
                  />
                ) : (
                  initials
                )}
              </div>

              {/* Information */}
              <div className="flex-1">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                      {professional.name}
                    </h1>

                    <p className="mt-1 text-base text-blue-600">
                      {professional.profession}
                    </p>
                  </div>

                  <span
                    className={
                      professional.available
                        ? "w-fit rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-600"
                        : "w-fit rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-500"
                    }
                  >
                    {professional.available
                      ? "Available"
                      : "Currently unavailable"}
                  </span>

                </div>

                {/* Rating + Location */}
                <div className="mt-5 flex flex-wrap gap-5 text-sm text-gray-600">

                  <span className="flex items-center gap-1.5">
                    <Star
                      size={17}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="font-semibold text-gray-900">
                      {professional.rating}
                    </span>

                    <span>
                      ({professional.review_count || reviews.length} reviews)
                    </span>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <MapPin size={17} />
                    {professional.location}
                  </span>

                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* About */}
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900">
              About
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-gray-600">
              {about}
            </p>
          </div>

          {workPhotoUrls.length > 0 && (
            <div className="border-t border-gray-100 p-6 sm:p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Work photos</h2>
                  <p className="mt-1 text-sm text-gray-500">A closer look at recent work</p>
                </div>
                <span className="shrink-0 text-sm text-gray-500">{workPhotoUrls.length} photos</span>
              </div>

              <div className="mt-5 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                {workPhotoUrls.map((photoUrl, index) => (
                  <button
                    key={photoUrl}
                    type="button"
                    onClick={() => setSelectedWorkPhoto(index)}
                    className="group relative h-40 w-32 shrink-0 snap-start overflow-hidden rounded-xl bg-gray-100 text-left shadow-sm ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:h-48 sm:w-40"
                    aria-label={`Open work photo ${index + 1}`}
                  >
                    <img
                      src={photoUrl}
                      alt={`${professional.name}'s work ${index + 1}`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-8 text-xs font-medium text-white">
                      {index + 1} / {workPhotoUrls.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          <div className="border-t border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Service
            </h2>

            <div className="mt-4 inline-flex rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              {professional.profession}
            </div>
          </div>

          {/* Reviews */}
          <div className="border-t border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>

            <form onSubmit={submitReview} className="mt-4 rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">Rate this professional</p>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    aria-label={`${star} star${star === 1 ? "" : "s"}`}
                    className="text-2xl text-yellow-400"
                  >
                    <Star size={24} className={star <= reviewRating ? "fill-current" : ""} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                placeholder="Write a review (optional)"
                rows={3}
                className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              {reviewError && <p className="mt-2 text-sm text-red-600">{reviewError}</p>}
              <Button type="submit" className="mt-3" disabled={isSubmittingReview}>
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </div>

          {/* Contact */}
          <div className="border-t border-gray-100 bg-gray-50 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Contact Professional
            </h2>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">

              <Button href={telHref} className="gap-2" disabled={!telHref}>
                <Phone size={17} />
                Contact Professional
              </Button>

              <Button
                variant="secondary"
                className="gap-2"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                disabled={!whatsappHref}
              >
                <MessageCircle size={17} />
                Send WhatsApp
              </Button>

            </div>
          </div>

        </section>

      </div>

      {selectedWorkPhoto !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Work photo viewer"
          onClick={() => setSelectedWorkPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedWorkPhoto(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close photo viewer"
          >
            <X size={24} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedWorkPhoto((selectedWorkPhoto - 1 + workPhotoUrls.length) % workPhotoUrls.length);
            }}
            className="absolute left-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:left-6"
            aria-label="Previous work photo"
          >
            <ChevronLeft size={28} />
          </button>
          <img
            src={workPhotoUrls[selectedWorkPhoto]}
            alt={`${professional.name}'s work ${selectedWorkPhoto + 1}`}
            className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedWorkPhoto((selectedWorkPhoto + 1) % workPhotoUrls.length);
            }}
            className="absolute right-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:right-6"
            aria-label="Next work photo"
          >
            <ChevronRight size={28} />
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
            {selectedWorkPhoto + 1} / {workPhotoUrls.length}
          </span>
        </div>
      )}
    </main>
  );
}

export default ProfessionalDetails;