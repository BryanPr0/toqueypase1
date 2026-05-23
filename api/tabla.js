export default async function handler(req, res) {

    const API_KEY = process.env.FOOTBALL_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({
            error: "Variable FOOTBALL_API_KEY no configurada en Vercel"
        });
    }

    // Las 5 grandes ligas
    const ligas = [
        { code: "PL",  nombre: "Premier League",  pais: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
        { code: "PD",  nombre: "La Liga",          pais: "🇪🇸" },
        { code: "BL1", nombre: "Bundesliga",       pais: "🇩🇪" },
        { code: "SA",  nombre: "Serie A",          pais: "🇮🇹" },
        { code: "FL1", nombre: "Ligue 1",          pais: "🇫🇷" }
    ];

    try {
        const resultados = await Promise.all(
            ligas.map(async (liga) => {
                const response = await fetch(
                    `https://api.football-data.org/v4/competitions/${liga.code}/standings`,
                    { headers: { "X-Auth-Token": API_KEY } }
                );
                const data = await response.json();
                return {
                    code: liga.code,
                    nombre: liga.nombre,
                    pais: liga.pais,
                    tabla: response.ok ? data.standings[0].table : []
                };
            })
        );

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json({ ligas: resultados });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
