import {
  ArrowLeft,
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
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-50 text-2xl font-bold text-blue-600">
                {initials}
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

              <Button className="gap-2">
                <Phone size={17} />
                Contact Professional
              </Button>

              <Button
                variant="secondary"
                className="gap-2"
              >
                <MessageCircle size={17} />
                Send Message
              </Button>

            </div>
          </div>

        </section>

      </div>
    </main>
  );
}

export default ProfessionalDetails;