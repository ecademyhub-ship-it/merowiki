import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import { ChevronDown, KeyRound, LogOut, MapPin, Menu, UserCircle, X } from "lucide-react";
import Button from "../common/Button";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken || accessToken === "null" || accessToken === "undefined") {
      setUser(null);
      return;
    }

    const loadUser = async () => {
      try {
        const response = await apiClient.get("/welcome/");
        setUser(response.data);
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      }
    };

    loadUser();
  }, [location.pathname]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await apiClient.post(
        "/logout/",
        { refresh: localStorage.getItem("refresh_token") },
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      closeMenu();
      navigate("/login");
    }
  };

  return (
    <header className="w-full border-b border-gray-100 bg-white max-h-16">
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
              to="/blogs"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Blogs
            </Link>

          </nav>
        </div>

        {/* Authentication actions */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((current) => !current)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                aria-expanded={isProfileOpen}
              >
                <UserCircle size={22} className="text-blue-600" />
                <span className="max-w-32 truncate">{user.full_name}</span>
                <ChevronDown size={16} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                  <Link
                    to="/change-password"
                    onClick={closeMenu}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <KeyRound size={16} />
                    Change Password
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" className="px-4 py-2">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="px-4 py-2">Signup</Button>
              </Link>
            </>
          )}
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

            {user ? (
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <UserCircle size={22} className="text-blue-600" />
                  <span>{user.full_name}</span>
                </div>
                <Link
                  to="/change-password"
                  onClick={closeMenu}
                  className="mt-3 flex items-center gap-2 text-sm text-gray-700"
                >
                  <KeyRound size={16} />
                  Change Password
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 flex items-center gap-2 text-sm text-red-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link to="/login" onClick={closeMenu} className="flex-1">
                  <Button variant="secondary" className="w-full justify-center">Login</Button>
                </Link>
                <Link to="/signup" onClick={closeMenu} className="flex-1">
                  <Button className="w-full justify-center">Signup</Button>
                </Link>
              </div>
            )}

          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;