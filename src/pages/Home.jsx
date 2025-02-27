import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig.js"; 
import { collection, getDocs } from "firebase/firestore";

const Home = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      const querySnapshot = await getDocs(collection(db, "cars"));
      setCars(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCars();
  }, []);

  return (
    <>
    <h1>Explore our car</h1>
      <h3>Features listing</h3>
   
    <div className="home">
      
      {cars.map((car) => (
        <div key={car.id}>
          <div className="containers">
         <div className="carfeatures"> <img src={car.imageUrl} alt={car.name} width="200" /></div>
         <h3><div>{car.name} </div> <div>${car.price}</div></h3>
         <div className="things">
          <div>
       <img src="pet.png" width={"20px"}/>Fuel type<br/><div className="sec">petrol</div>
</div>
      <div>
       <img src="mile.png" width={"20px"}/>Mileage<br/><div className="sec">90km</div>
       </div>

         <div>
       <img src="gear.png" width={"20px"}/>Trasmission<br/><div className="sec">Auto</div>
</div>


         </div>
          <button>Request to Purchase</button>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default Home;
