import React, { useState } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import relayService from "../Admin/AppProviders/Axios/hook";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    toast.warning("Logging in...");
    try {
      const response = await relayService({
        url: `/auth/login`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          UserName: username,
          Password: password,
        },
      });
      if (response) {
        console.log(response);
        localStorage.setItem("UserName", response.data.data.UserName);
        toast.success("Login successful. Redirecting to dashboard...");
        // if(response.data.data.UserName === "admin"){
        //   navigate(`/admin`);}
        // else{navigate(`/`);}
        navigate(`/admin`);
      }
    } catch (error) {
      toast.error("Login failed: " + error.message);
    }
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    try {
      const response = await relayService({
        url: `/Users/sendOtp`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          Username: username,
        },
      });
      if (response) {
        toast.success("OTP sent successfully.");
        setOtpSent(true);
      }
    } catch (error) {
      toast.error("Failed to send OTP: " + error.message);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    try {
      const response = await relayService({
        url: `/Users/verifyOtp`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          Username: username,
          Otp: otp,
        },
      });
      if (response) {
        toast.success("OTP verified. You can now reset your password.");
        setOtpVerified(true);
      } else {
        throw new Error("Invalid OTP.");
      }
    } catch (error) {
      toast.error("Failed to verify OTP: " + error.message);
    }
  };

 
  return (
    <div className="login-container">
      <Container>
        <Row className="justify-content-center"> 
          <Col xs={12} md={6}> 
            <div className="login-form-container">
              <div className="login-logo">
                <img src="./manipal.png" alt="logo" />
              </div>
              {!forgotPassword ? (
                <Form className="login-form">
                  <Form.Group controlId="formBasicUsername" className="mb-3"> 
                    <Form.Control
                      type="text"
                      placeholder="Username" 
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword" className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </Form.Group>

                  <Button onClick={handleLoginSubmit}>
                    Login
                  </Button>
                  {/* <div className="forgot-password">
                    <Button
                      variant="link"
                      onClick={() => setForgotPassword(true)}
                    >
                      Forgot password?
                    </Button>
                  </div> */}
                </Form>
              ) : (
                <Form className="login-form">
                  <Form.Group controlId="formBasicUsername" className="mb-3"> 
                    <Form.Control
                      type="text"
                      placeholder="Username" 
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      disabled={otpSent}
                    />
                  </Form.Group>

                  {!otpSent ? (
                    <Button onClick={handleSendOtp}>
                      Send OTP
                    </Button>
                  ) : !otpVerified ? (
                    <>
                      <Form.Group controlId="formBasicOtp" className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(event) => setOtp(event.target.value)}
                        />
                      </Form.Group>
                      <Button onClick={handleVerifyOtp}>
                        Verify OTP
                      </Button>
                    </>
                  ) : (
                    <>
                      <Form.Group controlId="formBasicNewPassword" className="mb-3">
                        <Form.Control
                          type="password"
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(event) =>
                            setNewPassword(event.target.value)
                          }
                        />
                      </Form.Group>

                      <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
                        <Form.Control
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                        />
                      </Form.Group>

                      {/* <Button onClick={handleResetPassword}>
                        Reset Password
                      </Button> */}
                    </>
                  )}
                  <div className="forgot-password">
                    <Button
                      variant="link"
                      onClick={() => {
                        setForgotPassword(false);
                        setOtpSent(false);
                        setOtpVerified(false);
                      }}
                    >
                      Back to login
                    </Button>
                  </div>
                </Form>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;