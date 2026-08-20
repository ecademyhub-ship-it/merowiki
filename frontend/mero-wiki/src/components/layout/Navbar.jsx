import { useState } from "react";
import { Link } from "react-router";
import { MapPin, Menu, X } from "lucide-react";
import Button from "../common/Button";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-blue-600"
        >
          Mero Wiki
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={17} strokeWidth={1.8} />
            <span>Butwal, Nepal</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-7">

            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/services"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Services
            </Link>

            <Link
              to="/professionals"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Professionals
            </Link>

            <Link
              to="/hire"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Hire Now
            </Link>

            <Link
              to="/blogs"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Blogs
            </Link>

          </nav>
        </div>

        {/* Login / Signup */}
        <div className="hidden md:block">
          <Link to="/login">
            <Button>
              Login / Signup
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg border border-gray-200 p-2 text-gray-700 hover:bg-gray-50 md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 px-6 py-5 md:hidden">

          <nav className="flex flex-col gap-4">

            <Link
              to="/"
              onClick={closeMenu}
              className="text-sm font-medium text-gray-700"
            >
              Home
            </Link>

            <Link
              to="/services"
              onClick={closeMenu}
              className="text-sm font-medium text-gray-700"
            >
              Services
            </Link>

            <Link
              to="/professionals"
              onClick={closeMenu}
              className="text-sm font-medium text-gray-700"
            >
              Professionals
            </Link>

            <Link
              to="/hire"
              onClick={closeMenu}
              className="text-sm font-medium text-gray-700"
            >
              Hire Now
            </Link>

            <Link
              to="/blogs"
              onClick={closeMenu}
              className="text-sm font-medium text-gray-700"
            >
              Blogs
            </Link>

            <div className="flex items-center gap-2 pt-2 text-sm text-gray-500">
              <MapPin size={16} />
              <span>Butwal, Nepal</span>
            </div>

            <Link
              to="/login"
              onClick={closeMenu}
              className="mt-2 block"
            >
              <Button className="w-full justify-center">
                Login / Signup
              </Button>
            </Link>

          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;