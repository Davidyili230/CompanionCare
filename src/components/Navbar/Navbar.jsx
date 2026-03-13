import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "My Pet", path: "/my-pet" },
  { label: "History", path: "/history" },
  { label: "Community", path: "/community" },
  { label: "Profile", path: "/profile" },
];

export const NavBar = () => {
  const location = useLocation();

  return (
    <header className="flex flex-col w-full border-[2px] border-solid border-[#f0dece] rounded-[16px] px-[20px] py-[10px] shrink-0 box-border shadow-sm" style={{ backgroundColor: '#ffffff' }}>
      <div className="flex flex-row items-center justify-between w-full">
        <Link to="/" className="flex flex-row items-center gap-[12px] no-underline shrink-0">
          <img
            src="/Logo.png"
            alt="Logo"
            className="w-[44px] h-[44px] object-contain shrink-0"
          />
          <span className="text-[26px] font-[900] italic text-[#d87c5a] leading-none shrink-0">
            CompanionCare
          </span>
        </Link>

        <nav className="flex flex-row items-center gap-[4px] shrink-0">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`px-[16px] py-[8px] text-[14px] font-[600] rounded-[20px] transition-all duration-150 shrink-0 no-underline ${
                location.pathname === item.path
                  ? "bg-[#d87c5a] text-white"
                  : "text-[#111] hover:bg-[#f5f5f5]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
