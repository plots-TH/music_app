import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navigations({ userToken, setUserToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserToken(null);
    navigate("/login", { replace: true });
  };

  const baseLink =
    "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition";
  const inactive = "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50";
  const active =
    "text-indigo-700 bg-indigo-50 ring-1 ring-indigo-200 hover:bg-indigo-100";

  return (
    <nav className="sticky top-0 z-40 border-b bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          {/* Brand / Home */}
          <Link
            to="/"
            className="text-base font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Music App
          </Link>

          {/* Primary links */}
          <div className="flex flex-wrap items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? active : inactive}`
              }
            >
              Explore All Music
            </NavLink>

            {userToken && (
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? active : inactive}`
                }
              >
                Account
              </NavLink>
            )}

            <NavLink
              to="/publicPlaylists"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? active : inactive}`
              }
            >
              Browse User-Playlists
            </NavLink>
          </div>

          {/* Auth actions */}
          <div className="flex items-center gap-2">
            {userToken ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${baseLink} ${isActive ? active : inactive}`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive
                      ? "inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white ring-1 ring-indigo-300"
                      : "inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                  }
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigations;
