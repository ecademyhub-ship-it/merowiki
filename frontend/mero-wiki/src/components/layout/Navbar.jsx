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
    <header className="relative z-50 w-full max-h-none border-b border-gray-100 bg-white md:max-h-16">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-3 md:px-6">

        <div className="flex items-center gap-2 md:contents">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-[60] rounded-lg border border-gray-200 p-1.5 text-gray-700 hover:bg-gray-50 md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-blue-600 md:text-2xl"
          >
            Mero Wiki
          </Link>
        </div>

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

        {!user && (
          <div className="flex items-center gap-1 md:hidden">
            <Link to="/login" onClick={closeMenu}>
              <Button variant="secondary" className="px-2 py-1.5 text-xs">
                Login
              </Button>
            </Link>
            <Link to="/signup" onClick={closeMenu}>
              <Button className="px-2 py-1.5 text-xs">Signup</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <button
            type="button"
            onClick={closeMenu}
            className="fixed inset-0 z-40 animate-[menuBackdropIn_200ms_ease-out] bg-black/30 md:hidden"
            aria-label="Close menu"
          />
          <div className="absolute left-0 top-0 z-50 w-1/2 max-w-xs animate-[menuDrawerIn_250ms_ease-out] overflow-y-auto rounded-br-xl border border-gray-100 bg-white px-5 pb-5 pt-16 shadow-2xl md:max-h-[calc(100dvh-5rem)] md:hidden">

            <nav className="flex flex-col gap-1">

            <Link
              to="/"
              onClick={closeMenu}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${location.pathname === "/" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"}`}
            >
              Home
            </Link>

            <Link
              to="/services"
              onClick={closeMenu}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${location.pathname === "/services" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"}`}
            >
              Services
            </Link>

            <Link
              to="/professionals"
              onClick={closeMenu}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${location.pathname.startsWith("/professionals") ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"}`}
            >
              Professionals
            </Link>


            <Link
              to="/blogs"
              onClick={closeMenu}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${location.pathname.startsWith("/blogs") ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"}`}
            >
              Blogs
            </Link>

            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 px-3 pt-4 text-sm text-gray-500">
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
            ) : null}

            </nav>
          </div>
        </>
      )}
    </header>
  );
}

export default Navbar;