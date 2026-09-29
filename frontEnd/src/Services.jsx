 import {
  FaCode,
  FaBrain,
  FaCloud,
  FaShieldAlt,
  FaDatabase,
  FaBullhorn,
} from "react-icons/fa";

function Services() {
  return (
    <>
      <section
        id="services"
        className="w-full bg-white py-20 px-6 md:px-12 lg:px-16"
      >
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-purple-900">
            Our Services
          </h1>

          <p className="text-gray-600 mt-5 text-base sm:text-lg max-w-[800px] mx-auto leading-8">
            Professional technology services for modern businesses,
            startups, and digital products.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

          {/* Card 1 - Web Development */}
          <div className="bg-purple-50 p-8 rounded-3xl shadow-lg hover:-translate-y-3 hover:shadow-2xl duration-300">

            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FaCode className="text-4xl text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Web Development
            </h2>

            <p className="text-gray-600 mt-4 leading-7">
              Build modern, responsive, and scalable websites and web
              applications using the latest technologies.
            </p>
          </div>

          {/* Card 2 - AI/ML */}
          <div className="bg-purple-50 p-8 rounded-3xl shadow-lg hover:-translate-y-3 hover:shadow-2xl duration-300">

            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FaBrain className="text-4xl text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold mt-6">
              AI / ML
            </h2>

            <p className="text-gray-600 mt-4 leading-7">
              Develop intelligent solutions using machine learning,
              deep learning, NLP, and artificial intelligence.
            </p>
          </div>

          {/* Card 3 - DevOps */}
          <div className="bg-purple-50 p-8 rounded-3xl shadow-lg hover:-translate-y-3 hover:shadow-2xl duration-300">

            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FaCloud className="text-4xl text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Cloud & DevOps
            </h2>

            <p className="text-gray-600 mt-4 leading-7">
              Deploy, automate, and manage applications using cloud
              platforms, CI/CD pipelines, Docker, and DevOps tools.
            </p>
          </div>

          {/* Card 4 - Cyber Security */}
          <div className="bg-purple-50 p-8 rounded-3xl shadow-lg hover:-translate-y-3 hover:shadow-2xl duration-300">

            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FaShieldAlt className="text-4xl text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Cyber Security
            </h2>

            <p className="text-gray-600 mt-4 leading-7">
              Protect applications and digital infrastructure with
              security testing, monitoring, and vulnerability solutions.
            </p>
          </div>

          {/* Card 5 - Data Science */}
          <div className="bg-purple-50 p-8 rounded-3xl shadow-lg hover:-translate-y-3 hover:shadow-2xl duration-300">

            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FaDatabase className="text-4xl text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Data Science
            </h2>

            <p className="text-gray-600 mt-4 leading-7">
              Transform data into useful insights using data analysis,
              visualization, statistics, and predictive modeling.
            </p>
          </div>

          {/* Card 6 - Digital Marketing */}
          <div className="bg-purple-50 p-8 rounded-3xl shadow-lg hover:-translate-y-3 hover:shadow-2xl duration-300">

            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FaBullhorn className="text-4xl text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold mt-6">
              Digital Marketing
            </h2>

            <p className="text-gray-600 mt-4 leading-7">
              Grow your online presence through SEO, social media,
              content marketing, and digital advertising.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}

export default Services;
 