import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig.js";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import "../index.css"; 

const ViewCars = () => {
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      const querySnapshot = await getDocs(collection(db, "cars"));
      setCars(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "cars", id));
    setCars(cars.filter(car => car.id !== id));
  };

  const handleEdit = (car) => {
    setEditingCar(car.id);
    setNewName(car.name);
    setNewPrice(car.price);
  };

  const handleUpdate = async () => {
    if (!newName || !newPrice) {
      alert("Please enter valid details");
      return;
    }
    const carRef = doc(db, "cars", editingCar);
    await updateDoc(carRef, { name: newName, price: newPrice });

    setCars(cars.map(car => (car.id === editingCar ? { ...car, name: newName, price: newPrice } : car)));
    setEditingCar(null);
  };

  return (
    <div className="view-cars-container">
      <h2>Car Listings</h2>
      
      <div className="car-grid">
        {cars.map(car => (
          <div key={car.id} className="car-card">
            <img src={car.imageUrl} alt={car.name} className="car-image" />
            {editingCar === car.id ? (
              <>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="edit-input" />
                <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="edit-input" />
                <button onClick={handleUpdate} className="save-button">Save</button>
                <button onClick={() => setEditingCar(null)} className="cancel-button">Cancel</button>
              </>
            ) : (
              <>
                <div className="car-details">
                  <h3 className="car-name">{car.name}</h3>
                  <p className="car-price">Price: ${car.price}</p>
                </div>
                <div className="button-container">
                  <button onClick={() => handleEdit(car)} className="edit-button">Edit</button>
                  <button onClick={() => handleDelete(car.id)} className="delete-button">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewCars;
