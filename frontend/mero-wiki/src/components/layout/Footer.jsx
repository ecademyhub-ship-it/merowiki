import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-blue-600 text-white">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold">
              Mero Wiki
            </h2>

            <p className="mt-3 max-w-xs text-sm leading-6">
              Find trusted professionals and local services near you.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold">
              Services
            </h3>

            <div className="mt-3 space-y-2 text-sm">
              <Link 
                to="/services"
                className="block text-white hover:text-white"
              >
                All Services
              </Link>

              <Link
                to="/professionals"
                className="block text-white hover:text-white"
              >
                Professionals
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold">
              Mero Wiki
            </h3>

            <div className="mt-3 space-y-2 text-sm">
              <Link
                to="/"
                className="block text-white hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/services"
                className="block hover:text-white text-white"
              >
                Services
              </Link>

              <Link
                to="/professionals"
                className="block text-white hover:text-white"
              >
                Find Professionals
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold">
              Contact: 
             ecademyhub@gmail.com            </h3>

            <p className="mt-3 text-sm leading-6">
              Find reliable local professionals for your everyday needs.
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-7 border-t border-blue-500 pt-4 text-center text-xs sm:mt-8 sm:pt-5 sm:text-sm">
          © {new Date().getFullYear()} Mero Wiki. All rights reserved.
        </div>

      </div>

    </footer>
  );
}

export default Footer;