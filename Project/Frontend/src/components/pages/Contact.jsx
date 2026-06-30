import React, { useState } from "react";
import axios from "axios";
import "./Home2.css";
import { API_BASE_URL } from "../../config/api";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Client-side validation
    if (!email || !message) {
      setErrorMessage("Email and message are required.");
      setStatus("validation_error");
      return;
    }

    const isValidEmail = (value) => {
      // simple email regex
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("validation_error");
      return;
    }

    setStatus("sending");
    try {
      const response = await axios.post(`${API_BASE_URL}/contact/submit`, {
        email,
        message,
      });

      console.log("Success:", response.data);
      setStatus("sent");
      setEmail("");
      setMessage("");
    } catch (err) {
      // Try to show backend validation errors if present
      const backend = err.response?.data;
      if (backend) {
        console.error("Backend error:", backend);
        if (backend.errors) {
          // join field error messages
          const joined = Object.values(backend.errors).join(" ");
          setErrorMessage(joined);
        } else if (backend.message) {
          setErrorMessage(backend.message);
        } else {
          setErrorMessage(JSON.stringify(backend));
        }
      } else {
        console.error("Error:", err.message);
        setErrorMessage("Network or server error. Please try again later.");
      }
      setStatus("error");
    }
  };

  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h3 className="main-heading">Contact Us</h3>
              <div className="underline mx-auto"></div>
              <p className="lead-text">
                If you have any questions or need further information, please
                feel free to reach out to us. We are here to help!
              </p>
              <br />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="vision-mission-card">
                <h4
                  style={{ color: "var(--primary-color)", textAlign: "center" }}
                >
                  Send us a Message
                </h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                      Your Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      name="message"
                      className="form-control"
                      id="message"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn"
                      style={{
                        backgroundColor: "var(--primary-color)",
                        color: "white",
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
                <div style={{ marginTop: 12 }}>
                  {status === "sending" && <div>Sending...</div>}
                  {status === "sent" && (
                    <div className="text-success">
                      Message sent — thank you!
                    </div>
                  )}
                  {status === "validation_error" && (
                    <div className="text-danger">{errorMessage}</div>
                  )}
                  {status === "error" && (
                    <div className="text-danger">
                      {errorMessage || "Failed to send — try again later."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
