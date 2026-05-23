export default async function handler(req, res) {

    const API_KEY = process.env.FOOTBALL_API_KEY;

    try {

        const response = await fetch(
            "https://api.football-data.org/v4/matches",
            {
                headers: {
                    "X-Auth-Token": c1c9cfed0b354edca2ce6b220447352c
                }
            }
        );

        const data = await response.json();

        res.status(200).json(data);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
}
