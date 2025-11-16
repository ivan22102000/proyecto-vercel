import { createClient } from '@supabase/supabase-js';

// URL de tu Supabase
const SUPABASE_URL = 'https://ybtbxdgrtlkewfmudpqh.supabase.co';
// Service Role Key (sólo aquí, backend seguro)
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64 } = req.body;
    if (!base64) return res.status(400).json({ error: 'No base64 provided' });

    // Insertar en la tabla "imagens"
    const { data, error } = await supabase
      .from('imagens')
      .insert([{ images_base64: base64 }]);

    if (error) throw error;

    res.status(200).json({ message: 'Imagen guardada', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
