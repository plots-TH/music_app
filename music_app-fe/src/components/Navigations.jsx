import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navigations({ userToken, setUserToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserToken(null);
    navigate("/login", { replace: true });
  };

  // --- Light/Dark theme only ---
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return prefersDark ? "dark" : "light";
  });

  // Apply theme to <html> and persist choice
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle switch: checked = dark mode
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const isDark = theme === "dark";

  // Small accessible toggle switch (Tailwind-only)
  const ThemeSwitch = ({ checked, onChange }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Toggle dark mode"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${
        checked ? "bg-indigo-600" : "bg-gray-300"
      }`}
    >
      <span className="sr-only">Toggle dark mode</span>
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  const baseLink =
    "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition";
  const inactive =
    "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-200 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/30";
  const active =
    "text-indigo-700 bg-indigo-50 ring-1 ring-indigo-200 hover:bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/40 dark:ring-indigo-700/50 dark:hover:bg-indigo-900/50";

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-neutral-900/90">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          {/* Brand / Home */}
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            aria-label="Catalog - Home"
          >
            <span className="text-2xl">Catalog</span>
            {/* Paste the SVG here */}
            <svg
              width="150"
              height="150"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                stroke="currentColor"
                strokeWidth="5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                {/* <!-- Vinyl disc --> */}
                <circle cx="166" cy="256" r="144" />
                {/* <!-- Center hole / label --> */}
                <circle cx="166" cy="256" r="20" />

                {/* <!-- Album fan: increased radial offset so gap ~= 18px --> */}
                <path d="M302.01 168 H460 L442 186 H312.10 A162 162 0 0 0 302.01 168" />
                <path d="M319.43 204 H460 L442 222 H324.39 A162 162 0 0 0 319.43 204" />
                <path d="M327.21 240 H460 L442 258 H327.99 A162 162 0 0 0 327.21 240" />
                <path d="M326.76 276 H460 L442 294 H323.48 A162 162 0 0 0 326.76 276" />
                <path d="M318.01 312 H460 L442 330 H310.11 A162 162 0 0 0 318.01 312" />
              </g>
            </svg>
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

          {/* Auth actions + theme toggle */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle switch (checked = dark) */}
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-gray-700 dark:text-slate-200 sm:inline">
                Dark Mode
              </span>
              <ThemeSwitch checked={isDark} onChange={toggleTheme} />
            </div>

            {userToken ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-slate-600 dark:bg-neutral-800 dark:text-slate-100 dark:hover:bg-neutral-700"
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
                      ? "inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white ring-1 ring-indigo-300 dark:bg-indigo-500 dark:text-white dark:ring-indigo-700/50"
                      : "inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
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
