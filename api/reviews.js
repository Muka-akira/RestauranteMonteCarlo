// Função serverless (Vercel) que busca nota e avaliações na Google Places API (New).
// Responde em /api/reviews. Variáveis de ambiente no painel da Vercel (Settings → Environment Variables):
//   GOOGLE_PLACES_KEY  -> chave da Google Maps Platform com "Places API (New)" ativada
//   GOOGLE_PLACE_ID    -> Place ID do restaurante (ex.: ChIJ...)
// A resposta fica em cache na CDN por 24h, então o Google é consultado ~1 vez por dia.

module.exports = async (req, res) => {
  const key = process.env.GOOGLE_PLACES_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) {
    return json(res, 500, { error: "Configure GOOGLE_PLACES_KEY e GOOGLE_PLACE_ID." });
  }

  try {
    const r = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=pt-BR&regionCode=BR`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri"
        }
      }
    );
    if (!r.ok) return json(res, 502, { error: "Google respondeu " + r.status });
    const p = await r.json();

    const reviews = (p.reviews || []).map((rv) => ({
      author: rv.authorAttribution?.displayName || "Cliente do Google",
      authorUri: rv.authorAttribution?.uri || null,
      photo: rv.authorAttribution?.photoUri || null,
      rating: rv.rating || 0,
      text: rv.text?.text || rv.originalText?.text || "",
      time: rv.relativePublishTimeDescription || ""
    })).filter((rv) => rv.text);

    return json(res, 200, {
      rating: p.rating || null,
      total: p.userRatingCount || null,
      mapsUri: p.googleMapsUri || null,
      reviews
    }, "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400");
  } catch (e) {
    return json(res, 502, { error: "Falha ao consultar o Google." });
  }
};

function json(res, status, body, cache = "no-store") {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cache);
  res.end(JSON.stringify(body));
}
