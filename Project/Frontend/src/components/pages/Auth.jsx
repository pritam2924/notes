// Auth.jsx (Final)
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Auth.css"; // Global styles
import axios from "axios";
import Login from "./Login";
import Register from "./Register";
import { generateOtp } from "./OTP";
import { API_BASE_URL } from "../../config/api";
const Auth = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Login State
  const [loginData, setLoginData] = useState({
    userID: "",
    password: "",
  });

  // Register State
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    userId: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [correctOtp, setCorrectOtp] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    userId: "",
    otp: "",
  });

  // Handlers for Login (Verification Logic is here)
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // *** CORE LOGIN SUBMISSION LOGIC ***
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const id = loginData.userID.trim();
    const pwd = loginData.password;

    if (!id) {
      setError("User ID cannot be empty");
      return;
    }
    if (!pwd) {
      setError("Password cannot be empty");
      return;
    }
    setLoading(true);

    try {
      // Call backend API for authentication
      const response = await axios.post(
        `${API_BASE_URL}/users/login`,
        {
          userID: id,
          password: pwd,
        }
      );

      if (response.data.success) {
        console.log("Login successful:", response.data);

        const userType = response.data.userType || "USER";
        const token = response.data.token;

        const userData = {
          ...response.data.user,
          userType,
        };
        
        console.log("User Data to store:", userData);
        console.log("User Type:", userType);
        
        // Store JWT token
        if (token) {
          localStorage.setItem('token', token);
        }
        
        // Store user data in both storages
        localStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem("user", JSON.stringify(userData));
        
        console.log("Stored in localStorage:", localStorage.getItem('user'));

        // Redirect based on server-provided redirectTo (preferred)
        if (response.data.redirectTo) {
          const redirectPath = response.data.redirectTo;
          console.log("Redirecting to:", redirectPath);
          if (redirectPath === "operator-dashboard") {
            navigate("/operator");
          } else if (redirectPath === "admin-dashboard") {
            navigate("/admin");
          } else {
            navigate(redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`);
          }
        } else {
          // fallback mapping - use proper paths
          console.log("Using fallback redirect for userType:", userType);
          if (userType === "ADMIN") navigate("/admin");
          else navigate("/operator");
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handlers for Register
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    if ((name === "firstName" || name === "lastName") && value) {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        error = `${
          name === "firstName" ? "First" : "Last"
        } name should only contain letters`;
      }
    }

    if (name === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Please enter a valid email format";
      }
    }

    if (name === "phoneNumber" && value) {
      if (!/^\d{0,10}$/.test(value)) {
        error = "Phone number should only contain digits";
      } else if (value.length > 0 && value.length !== 10) {
        error = "Phone number should be exactly 10 digits";
      }
    }

    if (name === "otp" && value) {
      if (!/^\d*$/.test(value)) {
        error = "OTP should only contain digits";
      }
    }

    if (name === "password" && value) {
      if (value.length < 8) {
        error = "Password must be at least 8 characters long";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        error =
          "Password must contain at least one uppercase letter, one lowercase letter, and one number";
      }
    }

    if (name === "confirmPassword" && value) {
      if (value !== registerData.password) {
        error = "Passwords do not match";
      }
    }

    setValidationErrors({
      ...validationErrors,
      [name]: error,
    });

    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const handleSendOtp = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setValidationErrors({
        ...validationErrors,
        email: "Please enter a valid email format",
      });
      return;
    }

    const newOtp = generateOtp();
    setCorrectOtp(newOtp);
    setOtpSent(true);

    alert(
      "OTP sent to your email: " +
        registerData.email +
        "\n\nYour OTP: " +
        newOtp,
    );
  };

  const handleVerifyOtp = () => {
    if (registerData.otp === correctOtp) {
      setOtpVerified(true);
      setValidationErrors({
        ...validationErrors,
        otp: "",
      });
      alert("OTP verified successfully!");
    } else {
      setOtpVerified(false);
      setValidationErrors({
        ...validationErrors,
        otp: "Invalid OTP. Please try again.",
      });
    }
  };

  const handleGenerateUserId = async () => {
    if (!registerData.firstName || !registerData.lastName) {
      alert("Please enter first name and last name first.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/generate-userid`,
        {
          firstName: registerData.firstName,
          lastName: registerData.lastName,
        },
      );

      if (response.data.success) {
        setRegisterData({
          ...registerData,
          userId: response.data.userId,
        });
        setValidationErrors({
          ...validationErrors,
          userId: "",
        });
        alert("User ID generated successfully!");
      }
    } catch (error) {
      console.error("Generate User ID error:", error);
      alert("Failed to generate User ID. Please try again.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      alert("Please verify your OTP first.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, {
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        phoneNumber: registerData.phoneNumber,
        password: registerData.password,
        userId: registerData.userId,
      });

      if (response.data.success) {
        console.log("Registration successful!");
        alert(
          "Registration successful! Your application is pending admin approval. You will be notified once approved.",
        );

        // Reset form
        setRegisterData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          userId: "",
          otp: "",
        });
        setOtpSent(false);
        setCorrectOtp(null);
        setOtpVerified(false);
        setValidationErrors({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          userId: "",
          otp: "",
        });
        setActiveCard("login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).join(
          "\n",
        );
        alert("Validation errors:\n" + errorMessages);
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };

  const isRegistrationValid = () => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      userId,
      otp,
    } = registerData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      !userId
    ) {
      return false;
    }

    if (!otpSent || !otpVerified) {
      return false;
    }

    if (
      validationErrors.firstName ||
      validationErrors.lastName ||
      validationErrors.email ||
      validationErrors.phoneNumber ||
      validationErrors.password ||
      validationErrors.confirmPassword ||
      validationErrors.userId ||
      validationErrors.otp
    ) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      return false;
    }

    if (!/^[a-zA-Z\s]*$/.test(firstName) || !/^[a-zA-Z\s]*$/.test(lastName)) {
      return false;
    }

    if (password !== confirmPassword) {
      return false;
    }

    return true;
  };

  const handleCardClick = (cardType) => {
    setActiveCard(cardType);
  };

  const location = useLocation();
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const open = params.get("open");
      if (open === "login" || open === "register") {
        setActiveCard(open);
      } else if (open === "both") {
        setActiveCard(null);
      }
    } catch (err) {}
  }, [location.search]);

  const switchToLogin = () => {
    setActiveCard("login");
  };

  const switchToRegister = () => {
    setActiveCard("register");
  };

  const [adminCredentials, setAdminCredentials] = useState([]);
  const [operatorCredentials, setOperatorCredentials] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await axios.get("/Credentials.json");

        const admin = Array.isArray(data?.admin) ? data.admin : [];
        const operator = Array.isArray(data?.operator) ? data.operator : [];

        if (mounted) {
          setAdminCredentials(admin);
          setOperatorCredentials(operator);
        }
      } catch (e) {
        setError(
          "Failed to fetch credentials. Please check file path or server status.",
        );
        console.error("Credential Fetch Error:", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Close expanded card when clicking outside the auth container.
  // Use mousedown/touchstart to avoid race with focus/click handlers,
  // and stop propagation on the container so inside clicks don't bubble up.
  useEffect(() => {
    const handleOutside = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setActiveCard(null);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  const maps = useMemo(() => {
    const toMap = (arr) => {
      const m = new Map();
      arr.forEach((item) => {
        if (typeof item?.userID == "string") {
          m.set(item.userID.trim(), item.password);
        }
      });
      return m;
    };
    return {
      adminMap: toMap(adminCredentials),
      operatorMap: toMap(operatorCredentials),
    };
  }, [adminCredentials, operatorCredentials]);

  return (
    // stopPropagation on the container prevents inside clicks from reaching the document listener
    <div
      className="auth-container"
      ref={containerRef}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Auth Content */}
      <div className="auth-content" style={{ paddingTop: "120px" }}>
        <div className="container">
          <div className="text-center mb-5 auth-header">
            <h1 className="auth-main-title">Welcome to EquipTrack</h1>
            <p className="auth-subtitle">
              Choose an option to get started with your equipment management
              journey
            </p>
          </div>

          <div className="row justify-content-center">
            {/* Login Card - Uses <Login /> component */}
            <div
              className={`col-lg-5 col-md-6 mb-4 ${
                activeCard === "register" ? "inactive-card" : ""
              }`}
            >
              <div
                className={`auth-card login-card ${
                  activeCard === "login" ? "expanded" : ""
                } ${activeCard === "register" ? "collapsed" : ""}`}
                onClick={() =>
                  activeCard !== "login" && handleCardClick("login")
                }
              >
                <div className="auth-card-header">
                  <div className="auth-icon">🔐</div>
                  <h3 className="auth-card-title">Login</h3>
                  {activeCard !== "login" && (
                    <p className="auth-card-subtitle">
                      Click here to login to your account
                    </p>
                  )}
                </div>

                {activeCard === "login" && (
                  <Login
                    loginData={loginData}
                    handleLoginChange={handleLoginChange}
                    handleLoginSubmit={handleLoginSubmit}
                    switchToRegister={switchToRegister}
                    loading={loading}
                    error={error}
                  />
                )}
              </div>
            </div>

            {/* Register Card - Uses <Register /> component */}
            <div
              className={`col-lg-5 col-md-6 mb-4 ${
                activeCard === "login" ? "inactive-card" : ""
              }`}
            >
              <div
                className={`auth-card register-card ${
                  activeCard === "register" ? "expanded" : ""
                } ${activeCard === "login" ? "collapsed" : ""}`}
                onClick={() =>
                  activeCard !== "register" && handleCardClick("register")
                }
              >
                <div className="auth-card-header">
                  <div className="auth-icon">📝</div>
                  <h3 className="auth-card-title">Register</h3>
                  {activeCard !== "register" && (
                    <p className="auth-card-subtitle">
                      Click here to create a new account
                    </p>
                  )}
                </div>

                {activeCard === "register" && (
                  <Register
                    registerData={registerData}
                    handleRegisterChange={handleRegisterChange}
                    handleRegisterSubmit={handleRegisterSubmit}
                    handleSendOtp={handleSendOtp}
                    handleVerifyOtp={handleVerifyOtp}
                    handleGenerateUserId={handleGenerateUserId}
                    isRegistrationValid={isRegistrationValid}
                    otpSent={otpSent}
                    validationErrors={validationErrors}
                    switchToLogin={switchToLogin}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {!activeCard && (
            <div className="row mt-5 fade-in">
              <div className="col-md-12">
                <div className="auth-info-section">
                  <h4 className="text-center mb-4">Why Choose EquipTrack?</h4>
                  <div className="row">
                    <div className="col-md-4 text-center mb-3">
                      <div className="info-icon">⚡</div>
                      <h6>Fast & Efficient</h6>
                      <p>
                        Streamline your operations with our intuitive platform
                      </p>
                    </div>
                    <div className="col-md-4 text-center mb-3">
                      <div className="info-icon">🔒</div>
                      <h6>Secure & Reliable</h6>
                      <p>Enterprise-grade security for your data protection</p>
                    </div>
                    <div className="col-md-4 text-center mb-3">
                      <div className="info-icon">📊</div>
                      <h6>Real-Time Insights</h6>
                      <p>Access powerful analytics and reporting tools</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
