import React from "react";
import "./Home2.css";

const About = () => {
  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h3 className="main-heading " style={{ color: "#334541ff" }}>
                Welcome to EquipTrack
              </h3>
              <div className="underline mx-auto"></div>
              <p className="lead-text">
                EquipTrack is a cutting-edge equipment tracking system designed
                to streamline asset management for businesses of all sizes. Our
                platform offers real-time tracking, maintenance scheduling, and
                comprehensive reporting features to help you optimize the
                utilization and lifespan of your equipment.
              </p>
              <p className="lead-text">
                With EquipTrack, you can easily monitor the location and status
                of your assets, schedule preventive maintenance to reduce
                downtime, and generate detailed reports to analyze equipment
                performance. Our user-friendly interface and robust features
                make it easy for your team to stay organized and efficient.
              </p>
              <p className="lead-text">
                Join the many businesses that trust EquipTrack for their
                equipment management needs. Sign up today and take the first
                step towards smarter asset management!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
