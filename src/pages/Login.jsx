
import { useState, useEffect } from "react";
import { auth, provider } from "../firebase/firebaseConfig.js";
import { 
  signInWithPopup, 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink, 
  fetchSignInMethodsForEmail 
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ADMIN_EMAILS } from "../utils/authUtils"; 

const actionCodeSettings = {
  url: "http://localhost:5173/", 
  handleCodeInApp: true,
};

const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let storedEmail = localStorage.getItem("emailForSignIn");

      if (!storedEmail) {
        storedEmail = window.prompt("Please enter your email for confirmation:");
      }

      if (storedEmail) {
        signInWithEmailLink(auth, storedEmail, window.location.href)
          .then((result) => {
            const user = result.user;
            const role = ADMIN_EMAILS.includes(user.email) ? "admin" : "user";

            localStorage.setItem("user", JSON.stringify({ ...user, role }));
            localStorage.removeItem("emailForSignIn");

            navigate(role === "admin" ? "/dashboard" : "/home");
          })
          .catch((error) => {
            console.error("Error signing in with email link:", error);
            alert("Sign-in failed. Please try again.");
          });
      }
    }
  }, [navigate]);

  
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
  
      if (signInMethods.length === 0 || signInMethods.includes("emailLink")) {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        localStorage.setItem("emailForSignIn", email);
        alert("A sign-in link has been sent to your email. Check your inbox!");
      } else {
        alert("This email is not registered for email link sign-in. Try another method.");
      }
    } catch (error) {
      console.error("Error sending sign-in link:", error);
      alert("Failed to send sign-in link. Try again.");
    }
  };

 
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const role = ADMIN_EMAILS.includes(user.email) ? "admin" : "user";

      localStorage.setItem("user", JSON.stringify({ ...user, role }));
      navigate(role === "admin" ? "/dashboard" : "/home");
    } catch (error) {
      console.error("Google Login failed", error);
      alert("Google Sign-In failed. Try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div>
          <img src="car1.avif" width="700px" height="465px" alt="Car" />
        </div>
        <div className="loginside">
          <h1>Car Space</h1>

          <button className="button active" onClick={() => navigate("/")}>Login</button>
          <button className="button inactive" onClick={() => navigate("/signin")}>Sign In</button>
   
         
          <form onSubmit={handleEmailLogin}>
            <div className="email">
              <label>Enter your email :</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
           <center> <button type="submit" className="buttonc">Continue</button></center>
          </form>

          <center>
          <h3>OR <br /> Sign in with Google</h3>
          <button type="button" className="buttong" onClick={handleGoogleLogin}>Sign in with Google</button>
          </center>
        </div>
      </div>
    </div>
  );
};

export default Login;
