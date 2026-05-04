import { useState } from "react";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/my-pet", label: "My Pet" },
  { to: "/history", label: "History" },
  { to: "/community", label: "Community" },
  { to: "/adopt", label: "Adopt" },
  { to: "/missing", label: "Missing" },
  { to: "/profile", label: "Profile" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ padding: "16px 24px 0", position: "sticky", top: 0, zIndex: 100, background: "#FFF9F0" }}>
      <header className="rounded-3xl border border-[#ecdcc8] bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-lg overflow-hidden shrink-0">
              <img
                src="public/Logo.PNG"
                alt="CompanionCare logo"
                className="h-8 w-8 object-contain"
              />
            </div>
            <span className="text-[18px] font-bold italic text-[#de7e52]">
              CompanionCare
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-[14px] font-semibold transition-colors duration-200 ${
                    isActive
                      ? "bg-[#de7e52] text-white"
                      : "text-[#1f1f1f] hover:bg-[#f7e9df] hover:text-[#de7e52]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Hamburger button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-[#f7e9df] transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-5 bg-[#de7e52] rounded transition-transform duration-200 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-[#de7e52] rounded transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-[#de7e52] rounded transition-transform duration-200 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav className="md:hidden flex flex-col mt-3 gap-1 pb-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-[14px] font-semibold transition-colors duration-200 ${
                    isActive
                      ? "bg-[#de7e52] text-white"
                      : "text-[#1f1f1f] hover:bg-[#f7e9df] hover:text-[#de7e52]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
    </div>
  );
}
