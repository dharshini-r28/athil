
import { useState } from "react";
import { auth, provider, db } from "../firebase/firebaseConfig.js";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { ADMIN_EMAILS } from "../utils/authUtils"; 





const SignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
    
          const role = ADMIN_EMAILS.includes(user.email) ? "admin" : "user";
    
          localStorage.setItem("user", JSON.stringify({ ...user, role }));
    
          navigate(role === "admin" ? "/dashboard" : "/home");
        } catch (error) {
          console.error("Google Sign-in failed", error);
        }
      };
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, "defaultPassword123");
      const user = userCredential.user;

      const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";

      await addDoc(collection(db, "users"), {
        name,
        email,
        phone,
        role
      });

      localStorage.setItem("user", JSON.stringify({ ...user, role, name, phone }));

      navigate(role === "admin" ? "/dashboard" : "/home");
    } catch (error) {
      console.error("Sign-up failed", error);
      alert("Error signing up. Try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div>
          <img src="car1.avif" width="700px" height="510px" alt="Car" />
        </div>
        <div className="loginsider">
          <h1>Car Space</h1>
          
          <button className="button inactive" onClick={() => navigate("/")}>Login</button>
          <button className="button active" onClick={() => navigate("/signin")}>Sign In</button> 

          <form onSubmit={handleSignUp}>
            <div className="name">
              <label>Enter your name : </label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="email">
              <label>Enter your email : </label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="phone">
              <label>Enter your phone number : </label>
              <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
            <center> <button type="submit" className="buttonc">Continue</button></center> 
            </div>
            <center>
            <h3>OR <br /> Sign in with Google</h3>
             <button type="button" className="buttong" onClick={handleGoogleSignIn}>Sign in with Google</button>
             </center>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

