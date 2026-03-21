export async function fetchEbayRecommendations(species) {
  const res = await fetch(
    `http://localhost:8080/api/ebay-recommendations?species=${encodeURIComponent(species)}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch eBay recommendations");
  }

  return res.json();
}