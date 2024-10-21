import type { APIRoute } from "astro";
import { supabase } from "../../lib/database";

export const GET: APIRoute = async ({ params, request }) => {
    try {
        // Obtener el parámetro de búsqueda desde la URL
        const url = new URL(request.url);
        let modelo = url.searchParams.get("modelo");

        if (!modelo) {
            return new Response("Parámetro 'modelo' es requerido", { status: 400 });
        }

        // Decodificar el valor del modelo para manejar espacios y otros caracteres especiales
        modelo = decodeURIComponent(modelo);

        // Consulta a la base de datos para obtener la laptop específica
        const { data, error } = await supabase
            .from("laptops")
            .select("id,modelo,precio,en_stock,color,marca,procesador,ram,almacenamiento,tarjeta_grafica,anio,imagen")
            .eq("modelo", modelo)
            .single();

        if (error) {
            return new Response("Error al obtener los datos", { status: 500 });
        } else if (!data) {
            return new Response("Laptop no encontrada", { status: 404 });
        } else {
            return new Response(JSON.stringify(data), {
                headers: {
                    "content-type": "application/json",
                },
            });
        }
    } catch (err) {
        return new Response("Error interno del servidor", { status: 500 });
    }
};