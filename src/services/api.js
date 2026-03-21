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

export const fetchBestBuyRecommendations = async (species) => {
  const res = await fetch(
    `http://localhost:8080/api/bestbuy-recommendations?species=${encodeURIComponent(species)}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Best Buy recommendations");
  }

  return res.json();
};