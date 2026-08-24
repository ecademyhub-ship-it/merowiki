import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function Signup() {
  const [show, setShow] = useState({ newP: false, confirm: false });
  const [message, setMessage] = useState({ text: "", type: "" });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setMessage({ text: "", type: "" });
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/user/register/", {
        email: data.email,
        full_name: data.fullname,
        password: data.password,
        password2: data.confirmpassword,
        tc: true,
      });
      setMessage({ text: response.data.msg, type: "success" });
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = "Registration failed";

      if (errorData?.errors) {
        const errs = errorData.errors;
        if (errs.non_field_errors) {
          errorMessage = Array.isArray(errs.non_field_errors) ? errs.non_field_errors[0] : errs.non_field_errors;
        } else if (errs.email) {
          errorMessage = Array.isArray(errs.email) ? errs.email[0] : errs.email;
        } else if (errs.password) {
          errorMessage = Array.isArray(errs.password) ? errs.password[0] : errs.password;
        } else if (errs.password2) {
          errorMessage = Array.isArray(errs.password2) ? errs.password2[0] : errs.password2;
        } else if (errs.fullname) {
          errorMessage = Array.isArray(errs.fullname) ? errs.fullname[0] : errs.fullname;
        } else {
          const firstField = Object.keys(errs)[0];
          const firstVal = errs[firstField];
          errorMessage = Array.isArray(firstVal) ? firstVal[0] : firstVal;
        }
      } else if (errorData?.msg) {
        errorMessage = errorData.msg;
      }

      setMessage({ text: errorMessage, type: "error" });
    }
  };

  return (
    <>
      <div className="signup-container">
        <p className="head">Create Account</p>

        {message.text && (
          <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
            {message.text}
          </div>
        )}

       

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* Full name */}
          <div className="field-row">
            <label className="form-label">User name</label>
            <input
              className="box"
              {...register("fullname", {
                required: "Full name is required",
                minLength: { value: 2, message: "Name should be at least 2 characters" },
                maxLength: { value: 20, message: "Name cannot be greater than 20 characters" },
              })}
              type="text"
              placeholder="Enter your name"
            />
            {errors.fullname && <p className="error-text">{errors.fullname.message}</p>}
          </div>

          {/* Email */}
          <div className="field-row">
            <label className="form-label">Email address</label>
            <input
              className="box"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
              })}
              type="email"
              placeholder="name@example.com"
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="field-row">
            <label className="form-label">Password</label>
            <div className="password-wrapper">
              <input
                className="box"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
                    message: "Must include uppercase, lowercase, number, and special character",
                  },
                })}
                type={show.newP ? "text" : "password"}
                placeholder="Enter password"
              />
              <span className="toggle-icon" onClick={() => setShow((s) => ({ ...s, newP: !s.newP }))}>
                {show.newP ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>

          {/* Confirm password */}
          <div className="field-row">
            <label className="form-label">Confirm password</label>
            <div className="password-wrapper">
              <input
                className="box"
                {...register("confirmpassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === watch("password") || "Passwords do not match",
                })}
                type={show.confirm ? "text" : "password"}
                placeholder="Confirm password"
              />
              <span className="toggle-icon" onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}>
                {show.confirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.confirmpassword && <p className="error-text">{errors.confirmpassword.message}</p>}
          </div>

          <div className="field-row">
            <label className="form-label">Contact No</label>
            <input
              className="box"
              {...register("contact", { required: "Contact number is required" })}
              type="text"
              placeholder="Enter contact number"
            />
            {errors.contact && <p className="error-text">{errors.contact.message}</p>}
          </div>
          <p className="mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </>
  );
}