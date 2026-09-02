import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./signup.css";

function ChangePassword() {
  const navigate = useNavigate();
  const [show, setShow] = useState({ old: false, next: false, confirm: false });
  const [message, setMessage] = useState({ text: "", type: "" });
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setMessage({ text: "", type: "" });

    if (data.new_password !== data.confirm_password) {
      setError("confirm_password", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      const response = await apiClient.post(
        "/change_password/",
        {
          old_password: data.old_password,
          new_password: data.new_password,
          confirm_password: data.confirm_password,
        }
      );

      setMessage({
        text: response.data.msg || "Password changed successfully.",
        type: "success",
      });
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      const responseData = error.response?.data;
      const serverErrors = responseData?.errors || responseData || {};
      const firstError = Object.values(serverErrors)[0];
      const text = Array.isArray(firstError)
        ? firstError[0]
        : firstError || responseData?.msg || "Unable to change password.";

      setMessage({ text: String(text), type: "error" });
    }
  };

  const passwordField = (name, label, visibleKey, placeholder, rules) => (
    <div className="field-row">
      <label className="form-label">{label}</label>
      <div className="password-wrapper">
        <input
          type={show[visibleKey] ? "text" : "password"}
          className="box"
          placeholder={placeholder}
          {...register(name, rules)}
        />
        <button
          type="button"
          className="toggle-icon"
          onClick={() => setShow((current) => ({ ...current, [visibleKey]: !current[visibleKey] }))}
          aria-label={show[visibleKey] ? `Hide ${label}` : `Show ${label}`}
        >
          {show[visibleKey] ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {errors[name] && <p className="error-text">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="signup-container">
      <p className="head">Change Password</p>

      {message.text && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {passwordField("old_password", "Current password", "old", "Enter current password", {
          required: "Current password is required",
        })}
        {passwordField("new_password", "New password", "next", "Enter new password", {
          required: "New password is required",
          minLength: { value: 8, message: "Password must be at least 8 characters" },
        })}
        {passwordField("confirm_password", "Confirm new password", "confirm", "Confirm new password", {
          required: "Please confirm your password",
          validate: (value) => value === watch("new_password") || "Passwords do not match",
        })}

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Change Password"}
        </button>

        <p className="mt-3">
          <Link to="/">Back to home</Link>
        </p>
      </form>
    </div>
  );
}

export default ChangePassword;
