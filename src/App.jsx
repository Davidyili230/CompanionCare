import { Routes, Route } from "react-router-dom"
import Community from "./pages/Community/Community"

export default function App(){
  return(
    <Routes>
      {/* <Route path ="/" element={<Dashboard />} /> */}
      <Route path ="/community" element={<Community />} />
      {/* <Route path ="/profile" element={<Profile />} /> */}
    </Routes>
  )
}
