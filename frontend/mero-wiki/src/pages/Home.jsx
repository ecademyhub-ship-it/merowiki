import { Link } from "react-router-dom";
import axios from "axios";
import PopularServices from "../components/services/PopularServices";
import ProfessionalCard from "../components/professionals/ProfessionalCard";
import SearchBar from "../components/search/SearchBar";
import { useState } from "react";
import { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  Wrench,
  Clock,
  Search,
  Star,
  MapPin,
} from "lucide-react";

const SLIDES = [
  {
    brand: "The only car care",
    title: (
      <>
        Car Service at{" "}
        <span className="text-brand-blue-600">Your Doorstep</span>
      </>
    ),
    subtitle: "Certified experts. Genuine parts. Best prices.",
    cta: "Book Now & Get 20% Off",
    perks: [
      { icon: Truck, label: "Free Pickup & Drop" },
      { icon: ShieldCheck, label: "Genuine Parts" },
      { icon: Wrench, label: "Expert Technicians" },
      { icon: Clock, label: "24/7 Support" },
    ],
  },
  {
    brand: "Mero Wiki Pro",
    title: (
      <>
        List Your Business &{" "}
        <span className="text-brand-orange-500">Get Discovered</span>
      </>
    ),
    subtitle:
      "Join 5,000+ verified providers already growing on Mero Wiki.",
    cta: "List Your Business",
    perks: [
      { icon: ShieldCheck, label: "Verified Badge" },
      { icon: Clock, label: "Instant Bookings" },
      { icon: Wrench, label: "Free Dashboard" },
      { icon: Truck, label: "Wide Reach" },
    ],
  },
];

function PromoBanner() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  const go = (dir) =>
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);

  return (
    <section className="mt-8 w-full">
      {/* Same centered width and horizontal spacing as other sections */}
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="relative flex min-h-[190px] flex-col items-center gap-4 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-white p-4 shadow-sm md:flex-row md:p-6">

          {/* Previous Button */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous promotion"
            className="absolute left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white shadow-card transition hover:bg-ink-100"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Promotion Content */}
          <div className="min-w-0 flex-1 pl-6 md:pl-8">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-brand-blue-600">
              {slide.brand}
            </p>

            <h3 className="text-xl font-bold text-ink-900 md:text-2xl">
              {slide.title}
            </h3>

            <p className="mt-1 text-sm text-ink-500 md:text-base">
              {slide.subtitle}
            </p>

            <button
              type="button"
              className="btn-primary mt-4"
            >
              {slide.cta}
            </button>
          </div>

          {/* Promotion Perks */}
          <ul className="grid shrink-0 grid-cols-2 gap-x-6 gap-y-3 pr-4 text-sm text-ink-700 md:pr-6">
            {slide.perks.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Icon
                  size={16}
                  className="shrink-0 text-brand-blue-600"
                />
                {label}
              </li>
            ))}
          </ul>

          {/* Next Button */}
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next promotion"
            className="absolute right-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white shadow-card transition hover:bg-ink-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Slider Dots */}
        <div className="mt-3 flex justify-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-brand-blue-600"
                  : "w-1.5 bg-ink-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  const [popularProfessionals, setPopularProfessionals] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user/features/")
      .then(({ data }) => {
        const professionals = data
          .map((feature) => ({
            ...feature,
            profession: feature.category.replaceAll("_", " "),
            rating: Number(feature.rating || 0).toFixed(1),
            profile: feature.profile,
            available: feature.is_available,
          }))
          .sort((a, b) => Number(b.rating) - Number(a.rating));

        setPopularProfessionals(professionals.slice(0, 3));
      })
      .catch((error) => {
        console.error("Error fetching popular professionals:", error);
      });
  }, []);

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
                profile={professional.profile}
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

            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center transition hover:shadow-md hover:border-blue-400">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 mx-auto">
                <Search className="h-7 w-7 text-blue-600" />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Easy to Find
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Quickly search for the service you need.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center transition hover:shadow-md hover:border-amber-400">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 mx-auto">
                <Star className="h-7 w-7 text-amber-600" />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Trusted Professionals
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Discover professionals with useful information.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center transition hover:shadow-md hover:border-green-400">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 mx-auto">
                <MapPin className="h-7 w-7 text-green-600" />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Local Services
              </h3>

              <p className="mt-2 text-sm text-gray-500">
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