
import { useState } from "react";
import { db } from "../firebase/firebaseConfig.js"; 
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dufjgrsi2/image/upload";
const UPLOAD_PRESET = "mt_upload";  

const AdminDashboard = () => {
  const [carName, setCarName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!carName || !price || !brand || !year || !mileage || !fuelType || !transmission || !color || !image) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", UPLOAD_PRESET);

    
      const res = await axios.post(CLOUDINARY_URL, formData);
      const imageUrl = res.data.secure_url;

     
      await addDoc(collection(db, "cars"), { 
        name: carName, 
        price, 
        brand, 
        year, 
        mileage, 
        fuelType, 
        transmission, 
        color, 
        imageUrl 
      });

      setCarName("");
      setPrice("");
      setBrand("");
      setYear("");
      setMileage("");
      setFuelType("");
      setTransmission("");
      setColor("");
      setImage(null);
      setLoading(false);
      alert("Car added successfully!");

      navigate("/view-cars"); 
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      
      <h2 className="title">Add Car Details</h2>

      <div className="form-group">
        <input type="text" placeholder="Car Name" value={carName} onChange={(e) => setCarName(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="number" placeholder="Mileage (km)" value={mileage} onChange={(e) => setMileage(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="text" placeholder="Fuel Type (e.g., Petrol, Diesel, Electric)" value={fuelType} onChange={(e) => setFuelType(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="text" placeholder="Transmission (e.g., Manual, Automatic)" value={transmission} onChange={(e) => setTransmission(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="text" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
      </div>
      <div className="form-group">
        
  <label htmlFor="file-upload" className="file-upload-label">
    <img src="upload.png" alt="Upload Icon" className="upload-icon" />
    
  </label>
 
  click here to upload
  <input
    type="file"
    id="file-upload"
    onChange={(e) => setImage(e.target.files[0])}
    className="file-input"
  />
</div>

      <div className="button-container">
        <button onClick={handleUpload} disabled={loading} className="submit-btn">
          {loading ? "Uploading..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;

