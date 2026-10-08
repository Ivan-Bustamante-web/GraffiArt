const API_URL = 'http://localhost:3000/api/gabinetes';

export async function obtenerGabinetes() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Error al obtener los gabinetes');
    }
    return response.json();
}