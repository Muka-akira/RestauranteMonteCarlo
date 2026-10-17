// Função serverless (Netlify) que busca nota e avaliações na Google Places API (New).
// Variáveis de ambiente no painel da Netlify:
//   GOOGLE_PLACES_KEY  -> chave da Google Maps Platform com "Places API (New)" ativada
//   GOOGLE_PLACE_ID    -> Place ID do restaurante (ex.: ChIJ...)
// A resposta fica em cache na CDN por 24h, então o Google é consultado ~1 vez por dia.

exports.handler = async () => {
  const key = process.env.GOOGLE_PLACES_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) {
    return json(500, { error: "Configure GOOGLE_PLACES_KEY e GOOGLE_PLACE_ID." });
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=pt-BR&regionCode=BR`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri"
        }
      }
    );
    if (!res.ok) return json(502, { error: "Google respondeu " + res.status });
    const p = await res.json();

    const reviews = (p.reviews || []).map((r) => ({
      author: r.authorAttribution?.displayName || "Cliente do Google",
      authorUri: r.authorAttribution?.uri || null,
      photo: r.authorAttribution?.photoUri || null,
      rating: r.rating || 0,
      text: r.text?.text || r.originalText?.text || "",
      time: r.relativePublishTimeDescription || ""
    })).filter((r) => r.text);

    return json(200, {
      rating: p.rating || null,
      total: p.userRatingCount || null,
      mapsUri: p.googleMapsUri || null,
      reviews
    }, "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400");
  } catch (e) {
    return json(502, { error: "Falha ao consultar o Google." });
  }
};

function json(status, body, cache = "no-store") {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": cache },
    body: JSON.stringify(body)
  };
}
