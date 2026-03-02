
import { BrowserRouter, Routes, Route } from "react-router-dom"


import PetAdoptionHomePage from "./petAdoption/PetAdoptionHomePage"
import LostPet from "./LostPet/LostPet"
import StrayPet from "./StrayPet/StrayPet"
import AdoptPet from "./AdoptPet/AdoptPet"

import LostPetReport from "./LostPet/Report"
import PetDetails from "./LostPet/PetDetails"


export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PetAdoptionHomePage />} />
        <Route path="/AdoptPet" element={<AdoptPet/>} />
        <Route path="/LostPet" element={<LostPet/>} /> 
        <Route path="/LostPetReport" element={<LostPetReport/>} />
      </Routes>
    </BrowserRouter>
  )
}
