import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home2.css";

const Home = () => {
  // const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Smart Equipment Tracking",
      subtitle: "Real-time monitoring and analytics for your industrial assets",
      image:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&h=600&fit=crop",
    },
    {
      title: "Predictive Maintenance",
      subtitle: "Reduce downtime with AI-powered maintenance scheduling",
      image:
        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=600&fit=crop",
    },
    {
      title: "Complete Asset Management",
      subtitle: "Streamline operations across your entire facility",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=600&fit=crop",
    },
  ];

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrolled(window.scrollY > 50);
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "📊",
      title: "Real-Time Analytics",
      description:
        "Monitor equipment performance with live data dashboards and comprehensive reporting tools",
    },
    {
      icon: "🔧",
      title: "Maintenance Scheduling",
      description:
        "Automated maintenance alerts and work order management to minimize equipment downtime",
    },
    {
      icon: "📱",
      title: "Mobile Access",
      description:
        "Access your equipment data anywhere, anytime with our responsive mobile interface",
    },
    {
      icon: "🔒",
      title: "Secure & Compliant",
      description:
        "Enterprise-grade security with full compliance to industry standards and regulations",
    },
  ];

  const stats = [
    { number: "10K+", label: "Equipment Tracked" },
    { number: "98%", label: "Uptime Rate" },
    { number: "500+", label: "Companies Trust Us" },
    { number: "24/7", label: "Support Available" },
  ];

  const clients = [
    { name: "TechCorp Industries", logo: "🏭", country: "USA" },
    { name: "Global Manufacturing", logo: "⚙️", country: "Germany" },
    { name: "Asiatech Solutions", logo: "🔧", country: "Japan" },
    { name: "Euro Systems", logo: "🏗️", country: "France" },
    { name: "Pacific Industries", logo: "🌏", country: "Australia" },
    { name: "Nordic Equipment", logo: "❄️", country: "Sweden" },
    { name: "Latin America Tech", logo: "🌎", country: "Brazil" },
    { name: "Middle East Corp", logo: "🏜️", country: "UAE" },
  ];

  const organizationHighlights = [
    {
      icon: "🏆",
      title: "Industry Leader",
      description:
        "Over 25 years of excellence in industrial equipment management and maintenance solutions",
    },
    {
      icon: "🌍",
      title: "Global Presence",
      description:
        "Serving clients across 50+ countries with local support teams and expertise",
    },
    {
      icon: "💡",
      title: "Innovation Driven",
      description:
        "Continuously investing in R&D to bring cutting-edge technology to our clients",
    },
    {
      icon: "👥",
      title: "Expert Team",
      description:
        "500+ certified professionals dedicated to your success and operational excellence",
    },
  ];

  const services = [
    {
      icon: "🏭",
      title: "Manufacturing Services",
      description:
        "Our manufacturing services encompass a wide range of solutions designed to optimize production processes, enhance product quality, and improve operational efficiency.",
    },
    {
      icon: "🤖",
      title: "Automation Solutions",
      description:
        "We deliver automation systems to streamline operations, reduce downtime, and increase throughput using the latest industry technologies.",
    },
    {
      icon: "💼",
      title: "Consulting & Support",
      description:
        "Expert consulting to help you plan, execute, and maintain projects with a focus on quality, safety, and cost-efficiency.",
    },
  ];

  return (
    <div className="home-container">
      {/* Navigation */}

      {/* Hero Section with Carousel */}
      <section className="hero-section" id="home">
        <div className="hero-carousel">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-overlay"></div>
            </div>
          ))}
        </div>
        <div className="container hero-content">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="hero-title animate-fade-in">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="hero-subtitle animate-fade-in-delay">
                {heroSlides[currentSlide].subtitle}
              </p>
            </div>
          </div>
        </div>
        <div className="carousel-indicators-custom">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={index === currentSlide ? "active" : ""}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="row">
            {stats.map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4 mb-lg-0">
                <div className="stat-card">
                  <h2 className="stat-number">{stat.number}</h2>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h3 className="main-heading">About Our Organization</h3>
              <div className="underline mx-auto"></div>
              <p className="lead-text">
                A strong industrial website is important for setting the tone
                with your customers, regardless of your industry vertical. Long
                gone are the days when you could get by with a sub-par
                industrial website. Everything from the look of the site to the
                messaging to — most importantly — the site's ability to convert
                your visitors into prospects are crucial in a web-centric
                society. Your visitors expect to be engaged and captivated
                quickly — otherwise they'll lose interest and move on.
              </p>
              <Link
                to="/about"
                className="btn shadow mt-3"
                style={{ background: "var(--primary-color)", color: "white" }}
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Organization Highlights */}
      <section className="section" style={{ backgroundColor: "#b7ddd5ff" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center mb-5">
              <h3 className="main-heading">Why Choose Us</h3>
              <div className="underline mx-auto"></div>
            </div>
          </div>
          <div className="row">
            {organizationHighlights.map((item, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="highlight-card">
                  <div className="highlight-icon">{item.icon}</div>
                  <h5 className="highlight-title">{item.title}</h5>
                  <p className="highlight-description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center mb-5">
              <h3 className="main-heading">Our Vision & Mission</h3>
              <div className="underline mx-auto"></div>
            </div>
            <div className="col-md-6">
              <div className="vision-mission-card">
                <div className="vm-icon">🎯</div>
                <h4>Our Vision</h4>
                <p className="text-justify">
                  To be a global leader in providing innovative and sustainable
                  solutions that empower communities and drive progress. We
                  envision a future where our technologies and services
                  contribute to a better quality of life for people around the
                  world, fostering growth, inclusivity, and environmental
                  stewardship.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="vision-mission-card">
                <div className="vm-icon">🚀</div>
                <h4>Our Mission</h4>
                <p className="text-justify">
                  Our mission is to deliver high-quality products and services
                  that exceed our customers' expectations. We are committed to
                  continuous improvement, innovation, and sustainability in all
                  aspects of our business. By fostering a collaborative and
                  inclusive work environment, we aim to attract and retain top
                  talent dedicated to achieving excellence and making a positive
                  impact on society.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section" style={{ backgroundColor: "#b7ddd5ff" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h3 className="main-heading">Our Services</h3>
              <div className="underline mx-auto"></div>
              <p className="lead-text" style={{ color: "#334541ff" }}>
                We provide a wide range of services to meet your needs. Our team
                of experts is dedicated to delivering top-notch solutions that
                drive success and innovation. From consulting to implementation,
                we are here to support you every step of the way.
              </p>
            </div>
          </div>

          <div className="row cards-row mt-5">
            {services.map((service, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card service-card h-100 shadow-sm">
                  <div className="service-icon-header">{service.icon}</div>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{service.title}</h6>
                    <div className="underline"></div>
                    <p className="card-text flex-grow-1">
                      {service.description}
                    </p>
                    <Link
                      to="/services"
                      className="btn mt-2 align-self-start"
                      style={{
                        background: "var(--primary-color)",
                        color: "white",
                      }}
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <section className="section clients-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center mb-5">
              <h3 className="main-heading">Our Global Clients</h3>
              <div className="underline mx-auto"></div>
              <p className="lead-text">
                Trusted by leading organizations across the world
              </p>
            </div>
          </div>
          <div className="row">
            {clients.map((client, index) => (
              <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="client-card">
                  <div className="client-logo">{client.logo}</div>
                  <h6 className="client-name">{client.name}</h6>
                  <p className="client-country">📍 {client.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="features-section "
        id="features"
        style={{ backgroundColor: "#b7ddd5ff" }}
      >
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="main-heading">Powerful Features</h2>
            <div className="underline mx-auto"></div>
            <p className="lead-text" style={{ color: "#334541ff" }}>
              Everything you need to manage your equipment efficiently
            </p>
          </div>
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h5 className="feature-title">{feature.title}</h5>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="cta-title">Ready to Transform Your Operations?</h2>
              <p className="cta-text">
                Join hundreds of companies optimizing their equipment management
              </p>
              <button className="cta-button-secondary">Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
};

export default Home;
