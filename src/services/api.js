export const fetchProtected = async (token) => {
    const res = await fetch("http://localhost:5000/api/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("Request failed");
    }
  
    return res.json();
  };