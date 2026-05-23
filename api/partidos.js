export default async function handler(req, res) {

    const API_KEY = process.env.FOOTBALL_API_KEY;

    // Si no hay key, devuelve error claro
    if (!API_KEY) {
        return res.status(500).json({
            error: "Variable FOOTBALL_API_KEY no configurada en Vercel"
        });
    }

    try {

        const response = await fetch(
            "https://api.football-data.org/v4/matches",
            {
                headers: {
                    "X-Auth-Token": API_KEY
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({
                error: `Football API error ${response.status}`,
                detalle: data
            });
        }

        // Permite CORS por si acaso
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}
