import { useState } from "react";
import { Briefcase, MapPin, Send } from "lucide-react";
import Button from "../components/common/Button";

function HireNow() {
  const [formData, setFormData] = useState({
    service: "",
    location: "",
    name: "",
    phone: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Briefcase size={23} />
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Hire a Professional
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
            Tell us what service you need and where you need it.
            We'll help you find the right professional.
          </p>
        </div>

        {/* Form */}
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                ✓
              </div>

              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Request Submitted
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Your hiring request has been submitted successfully.
              </p>

              <div className="mt-6">
                <Button onClick={() => setSubmitted(false)}>
                  Submit Another Request
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Service */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  What service do you need?
                </label>

                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select a service</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Tutor">Tutor</option>
                  <option value="Photographer">Photographer</option>
                  <option value="Cleaner">Cleaner</option>
                  <option value="Computer Repairer">
                    Computer Repairer
                  </option>
                  <option value="Designer">Designer</option>
                  <option value="Automotive">Automotive</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Butwal, Kalikanagar"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Your Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  What do you need?
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Briefly describe the work you need..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full justify-center gap-2"
              >
                <Send size={17} />
                Submit Hiring Request
              </Button>

            </form>
          )}

        </div>
      </div>
    </main>
  );
}

export default HireNow;