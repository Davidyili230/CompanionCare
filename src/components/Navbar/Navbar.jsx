import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard" },
  { to: "/my-pet", label: "My Pet" },
  { to: "/history", label: "History" },
  { to: "/community", label: "Community" },
  { to: "/profile", label: "Profile" },
];

export default function Navbar() {
  return (
    <header className="flex items-center justify-between rounded-3xl border border-[#ecdcc8] bg-white px-5 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center rounded-lg overflow-hidden border-2 border-[#de7e52] shrink-0">
          <img
            src="/companioncarelogo.png"
            alt="CompanionCare logo"
            className="h-8 w-8 object-contain"
          />
        </div>
        <span className="text-[18px] font-bold italic text-[#de7e52]">
          CompanionCare
        </span>
      </div>
      <nav className="flex items-center gap-1">
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
    </header>
  );
}