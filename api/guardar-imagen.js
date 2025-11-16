import { createClient } from '@supabase/supabase-js';

// Carga las variables de entorno (configuradas en Vercel, no aquí)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Crea el cliente de Supabase usando la Service Role Key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
    
    // --- Lógica de la API (Sin CORS) ---

    // 1. Asegurar que sea un método POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        // 2. Obtener el Base64 del cuerpo de la petición
        const { base64 } = req.body;

        if (!base64) {
            return res.status(400).json({ error: 'Falta el campo "base64"' });
        }

        // 3. Insertar en la tabla 'imagens'
        const { data, error } = await supabase
            .from('imagens')
            .insert([
                { images_base64: base64 } 
            ])
            .select(); 

        if (error) {
            console.error('Error de Supabase:', error.message);
            return res.status(500).json({ error: 'Error al guardar en la base de datos', details: error.message });
        }

        // 4. Éxito
        return res.status(201).json({ message: 'Imagen guardada con éxito', data: data });

    } catch (e) {
        console.error('Error general:', e.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}
