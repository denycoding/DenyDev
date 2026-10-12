import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Code2 } from "lucide-react";

function Header() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  // ==============================
  // NAVIGATION LINKS
  // ==============================

  const navLinks = [
    {
      name: "Home",
      path: "#hero",
    },
    {
      name: "Services",
      path: "#services",
    },
    {
      name: "Developers",
      path: "#developers",
    },
    {
      name: "About",
      path: "#about",
    },
    {
      name: "Reviews",
      path: "#reviews",
    },
    {
      name: "Contact",
      path: "#contact",
    },
  ];

  // ==============================
  // NAVIGATE
  // ==============================

  const handleNavigation = (path) => {
    setMenuOpen(false);

    if (path.startsWith("#")) {
      const section = document.querySelector(path);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    navigate(path);
  };

  // ==============================
  // LOGIN
  // ==============================

  const handleLogin = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  // ==============================
  // REGISTER
  // ==============================

  const handleRegister = () => {
    navigate("/register");
    setMenuOpen(false);
  };

  return (
    <header
      className="
       sticky
        top-0
        z-50
        w-full
bg-[#10002b]/90  
        backdrop-blur-xl
        border-b
        border-white/20
        shadow-lg
      "
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        {/* ========================================= */}
        {/* MAIN HEADER */}
        {/* ========================================= */}

        <div className="h-20 flex items-center justify-between">
          {/* ========================================= */}
          {/* LOGO */}
          {/* ========================================= */}

          <button
            onClick={() => handleNavigation("#")}
            className="
              flex
              items-center
              gap-3
              group
              cursor-pointer
            "
          >
            {/* Logo Icon */}

            <div
              className="
                w-10
                h-10
                flex
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-purple-500
                to-blue-600
                shadow-lg
                shadow-purple-500/20
                group-hover:scale-105
                transition
              "
            >
              <Code2 size={22} className="text-white" />
            </div>

            {/* Logo Text */}

            <div className="text-left">
              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  font-extrabold
                   text-white
                "
              >
                Deny<span className="text-purple-400">Dev</span>
              </h1>

              <p className="hidden sm:block text-[10px] text-gray-400 tracking-widest uppercase">
                Freelance Platform
              </p>
            </div>
          </button>

          {/* ========================================= */}
          {/* DESKTOP NAVIGATION */}
          {/* ========================================= */}

          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavigation(link.path)}
                    className="
                      relative
                      
                      px-3
                      py-2
                      text-md
                      font-medium
                      text-gray-300
                      hover:text-white
                      rounded-lg
                      hover:bg-white/5
                      transition
                      duration-300
                      group
                    "
                  >
                    {link.name}

                    {/* Bottom Hover Line */}

                    <span
                      className="
                        absolute
                        left-1/2
                        -bottom-0.5
                        w-0
                        h-0.5
                        bg-purple-400
                        rounded-full
                        group-hover:w-1/2
                        group-hover:left-1/4
                        transition-all
                        duration-300
                      "
                    />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* ========================================= */}
          {/* DESKTOP BUTTONS */}
          {/* ========================================= */}

          <div className="hidden lg:flex items-center gap-3">
            {/* Login */}

            <button
              onClick={handleLogin}
              className="
    px-5
    py-2.5
    rounded-xl
    border
    border-[#8B5CF6]
    text-white
    text-sm
    font-semibold
    hover:bg-[#16003b]/70
     hover:border-[#A78BFA]
    transition-all
    duration-200
  "
            >
              Login
            </button>

            {/* Register */}

            <button
              onClick={handleRegister}
              className="
                px-5
                py-2.5
                rounded-xl
                bg-gradient-to-r
                from-purple-600
                to-blue-600
                text-white
                text-sm
                font-semibold
                shadow-lg
                shadow-purple-600/20
                hover:from-purple-500
                hover:to-blue-500
                hover:-translate-y-0.5
                transition
              "
            >
              Get Started
            </button>
          </div>

          {/* ========================================= */}
          {/* MOBILE MENU BUTTON */}
          {/* ========================================= */}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              lg:hidden
              w-10
              h-10
              flex
              items-center
              justify-center
              rounded-xl
              bg-white/10
              border
              border-white/10
              text-white
              hover:bg-purple-600
              transition
            "
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ========================================= */}
        {/* MOBILE MENU */}
        {/* ========================================= */}

        {menuOpen && (
          <div
            className="
              lg:hidden
              pb-6
            "
          >
            <div
              className="
                bg-[#21094a]
                border
                border-white/10
                rounded-2xl
                p-4
                shadow-2xl
              "
            >
              {/* Mobile Navigation */}

              <nav>
                <ul className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => handleNavigation(link.path)}
                        className="
                          w-full
                          text-left
                          px-4
                          py-3
                          rounded-xl
                          text-gray-300
                          hover:text-white
                          hover:bg-white/10
                          font-medium
                          transition
                        "
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Divider */}

              <div className="h-px bg-white/10 my-4" />

              {/* Mobile Buttons */}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleLogin}
                  className="
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-purple-400/40
                    text-white
                    font-semibold
                    hover:bg-purple-500/10
                    transition
                  "
                >
                  Login
                </button>

                <button
                  onClick={handleRegister}
                  className="
                    px-4
                    py-3
                    rounded-xl
                    bg-gradient-to-r
                    from-purple-600
                    to-blue-600
                    text-white
                    font-semibold
                    hover:from-purple-500
                    hover:to-blue-500
                    transition
                  "
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
