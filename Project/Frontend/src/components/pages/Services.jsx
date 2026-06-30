import React from "react";
import "./Home2.css";

const Services = () => {
  // Dummy data for services
  const serviceData = [
    {
      icon: "💻", // Example: Use emojis or FontAwesome/React Icons
      title: "Equipment Tracking Software",
      description:
        "Comprehensive solution for real-time location, status, and maintenance history of all your critical assets across multiple sites.",
    },
    {
      icon: "⚙️",
      title: "Maintenance Scheduling",
      description:
        "Automated scheduling and alerts based on usage metrics to minimize downtime and extend the lifespan of your machinery.",
    },
    {
      icon: "📊",
      title: "Utilization & Reporting Analytics",
      description:
        "Gain deep insights into asset performance, utilization rates, and operational bottlenecks with custom reports and dashboards.",
    },
    {
      icon: "🔒",
      title: "Secure Access & User Management",
      description:
        "Role-based access controls ensuring data security and seamless management of permissions for all your team members.",
    },
  ];

  return (
    // Added the content clearance utility class
    <div>
      <section className="section text-center">
        <div className="container">
          {/* 1. Main Heading and Subtitle */}
          <h1 className="main-heading" style={{ color: "#334541ff" }}>
            Our Specialized Services
          </h1>
          {/* Using the underline class from Home2.css */}
          <div className="underline mx-auto"></div>

          <p className="lead-text mb-5">
            EquipTrack provides intelligent solutions designed to maximize asset
            utilization, streamline maintenance, and reduce operational costs
            across your entire organization.
          </p>

          {/* 2. Services Grid */}
          <div className="row g-4">
            {serviceData.map((service, index) => (
              <div className="col-lg-3 col-md-6" key={index}>
                {/* Service Card structure from Home2.css */}
                <div className="service-card shadow-sm">
                  {/* Icon Header Section */}
                  <div className="service-icon-header">
                    <span role="img" aria-label={service.title}>
                      {service.icon}
                    </span>
                  </div>

                  <div className="card-body p-4">
                    <h5 className="card-title">{service.title}</h5>
                    {/* Using the underline style for separation */}
                    <div className="underline mx-auto"></div>
                    <p className="card-text">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
