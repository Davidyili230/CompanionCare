import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/my-pet", label: "My Pet" },
  { to: "/history", label: "History" },
  { to: "/community", label: "Community" },
  { to: "/profile", label: "Profile" },
];

export default function Navbar() {
  return (
    <header className="flex items-center justify-between rounded-3xl border border-[#ecdcc8] bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden">
          <img
            src="/companioncarelogo.png"
            alt="CompanionCare logo"
            className="h-full w-full object-contain"
          />
        </div>

        <div className="text-[20px] font-bold italic text-[#de7e52]">
          CompanionCare
        </div>
      </div>

      <nav className="flex items-center gap-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-[16px] font-semibold transition-colors duration-200 ${
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