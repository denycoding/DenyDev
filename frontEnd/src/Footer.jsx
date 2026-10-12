import { FaLinkedin, FaGithub, FaInstagram, FaFacebookF } from "react-icons/fa";
function Footer() {
  return (
    <>
      <footer
        id="contact"
        className="w-full bg-[#10002b] text-white py-16 px-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h1 className="text-4xl font-bold text-blue-500">DenyDev</h1>
            <p className="text-gray-300 mt-6 leading-8">
              DenyDev is a modern developer marketplace platform connecting
              businesses with professional developers for websites, SaaS
              products, and digital solutions.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6"> Quick Links</h2>
            <ul className="space-y-4 text-gray-300 ">
              <li className="hover:text-blue-400 cursor-pointer">Home</li>
              <li className="hover:text-blue-400 cursor-pointer">Services</li>
              <li className="hover:text-blue-400 cursor-pointer">Developers</li>
              <li className="hover:text-blue-400 cursor-pointer">Projects</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Services</h2>
            <ul className="space-y-4 text-gray-300">
              <li className="hover:text-blue-400 cursor-pointer">
                Web Development
              </li>
              <li className="hover:text-blue-400 cursor-pointer">
                Data Science & Analytics
              </li>
              <li className="hover:text-blue-400 cursor-pointer">
                AI & Machine Learning
              </li>
              <li className="hover:text-blue-400 cursor-pointer">
                Cybersecurity
              </li>
              <li className="hover:text-blue-400 cursor-pointer">
                Cloud & DevOps
              </li>
              <li className="hover:text-blue-400 cursor-pointer">
                Digital Marketing
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact</h2>
            <div className="space-y-4 text-gray-300">
              <p>Email: denycoding200@gmail.com</p>

              <p>Phone: +91 7984292907</p>

              <p>Location: Vadodara, Gujarat, India</p>
            </div>
          </div>
          <div className="flex gap-4 mt-8 text-3xl">
            <a
              href="https://www.linkedin.com/in/kazi-mohammad-kaif-57b11423b/"
              target="_blank"
            >
              <FaLinkedin className="cursor-pointer hover:text-blue-500 duration-300" />
            </a>
            <a href="https://github.com/Denycoding2004" target="_blank">
              <FaGithub className="cursor-pointer hover:text-blue-500 duration-300" />
            </a>
            <a href="https://www.instagram.com/_.kaifffff_29" target="_blank">
              <FaInstagram className="cursor-pointer hover:text-pink-500 duration-300" />
            </a>
            <a
              href="https://www.facebook.com/kaif.kazi.9440234"
              target="_blank"
            >
              <FaFacebookF
                size={24}
                className="-ml-1 mt-0.5 cursor-pointer hover:text-sky-600 duration-300"
              />
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-16 pt-8 text-center text-gray-400">
          <p> © 2026 DenyDev. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}
export default Footer;
