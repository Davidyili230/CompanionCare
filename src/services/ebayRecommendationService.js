import { getEbayAccessToken } from "./ebayTokenService.js";

const BROWSE_BASE = "https://api.ebay.com/buy/browse/v1/item_summary/search";

const BUCKETS = [
  { key: "vitaminA", label: "Vitamin A", keyword: "vitamin a" },
  { key: "vitaminD", label: "Vitamin D", keyword: "vitamin d" },
  { key: "vitaminE", label: "Vitamin E", keyword: "vitamin e" },
  { key: "multivitamin", label: "Multivitamin", keyword: "multivitamin" },
];

function makeKeyword(species, keyword) {
  const petWord = species === "Cat" ? "cat" : "dog";
  return `${petWord} ${keyword} supplement`;
}

function mapItem(item, label, bucket) {
  const price = item?.price?.value ?? "";
  const currency = item?.price?.currency ?? "";

  return {
    bucket,
    label,
    item: {
      title: item?.title || label,
      imageUrl: item?.image?.imageUrl || "",
      detailPageUrl: item?.itemWebUrl || "",
      price: price !== "" ? `${price} ${currency}` : "",
      seller: item?.seller?.username || "",
      condition: item?.condition || "",
      reason: "Top eBay Browse result",
    },
  };
}

async function searchBucket(species, bucket) {
  const token = await getEbayAccessToken();
  const q = encodeURIComponent(makeKeyword(species, bucket.keyword));

  const url =
    `${BROWSE_BASE}?q=${q}` +
    `&limit=10` +
    `&filter=buyingOptions:{FIXED_PRICE}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message || `eBay request failed for ${bucket.label}`);
  }

  const first = data?.itemSummaries?.[0];

  if (!first) {
    return {
      bucket: bucket.key,
      label: bucket.label,
      item: null,
    };
  }

  return mapItem(first, bucket.label, bucket.key);
}

export async function getEbayRecommendations(species = "Dog") {
  const normalizedSpecies = species === "Cat" ? "Cat" : "Dog";

  const recommendations = await Promise.all(
    BUCKETS.map((bucket) => searchBucket(normalizedSpecies, bucket))
  );

  return {
    species: normalizedSpecies,
    recommendations,
  };
}