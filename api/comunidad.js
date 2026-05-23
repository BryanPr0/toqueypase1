export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");

    const BIN_ID  = process.env.JSONBIN_BIN_ID;
    const API_KEY = process.env.JSONBIN_API_KEY;

    const HEADERS = {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
    };

    const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

    // GET - traer posts
    if (req.method === "GET") {
        try {
            const r = await fetch(`${BIN_URL}/latest`, { headers: HEADERS });
            const data = await r.json();
            const posts = data.record?.posts || [];
            posts.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            return res.status(200).json({ posts });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    // POST - crear post, like, comentario
    if (req.method === "POST") {
        try {
            const r = await fetch(`${BIN_URL}/latest`, { headers: HEADERS });
            const data = await r.json();
            let posts = data.record?.posts || [];

            const { accion } = req.body;

            if (accion === "post") {
                posts.unshift({
                    id: Date.now().toString(),
                    autor: req.body.nombre,
                    titulo: req.body.titulo,
                    texto: req.body.texto,
                    categoria: req.body.categoria,
                    fecha: new Date().toISOString(),
                    likes: 0,
                    comentarios: []
                });
            }

            if (accion === "like") {
                posts = posts.map(p =>
                    p.id === req.body.postId
                        ? { ...p, likes: (p.likes || 0) + 1 }
                        : p
                );
            }

            if (accion === "comentario") {
                posts = posts.map(p => {
                    if (p.id !== req.body.postId) return p;
                    return {
                        ...p,
                        comentarios: [...(p.comentarios || []), {
                            id: Date.now().toString(),
                            autor: req.body.nombre,
                            texto: req.body.texto,
                            fecha: new Date().toISOString()
                        }]
                    };
                });
            }

            await fetch(BIN_URL, {
                method: "PUT",
                headers: HEADERS,
                body: JSON.stringify({ posts })
            });

            return res.status(200).json({ ok: true });

        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    res.status(405).json({ error: "Método no permitido" });
}
