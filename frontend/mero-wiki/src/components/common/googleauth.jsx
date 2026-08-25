import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function GoogleAuth() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/google-login/",
        {
          token: credentialResponse.credential,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.token;

      if (token?.access) {
        localStorage.setItem(
          "access_token",
          token.access
        );

        localStorage.setItem(
          "refresh_token",
          token.refresh
        );
      }

      navigate("/professionals");

    } catch (error) {
      console.error(
        "Google authentication failed:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.msg ||
        "Google authentication failed"
      );
    }
  };

  return (
    <div className="google-login-container">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.log("Google Login Failed");
        }}
        text="continue_with"
      />
    </div>
  );
}