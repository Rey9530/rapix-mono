// Forma plana que devuelve `GET /repartidores` (admin):
// el backend ya hace el flatten desde `Usuario` para evitar
// que el cliente tenga que profundizar en la relación.
export interface PerfilRepartidor {
  id: string;
  usuarioId: string;
  nombreCompleto: string;
  email: string;
  estado: string;
  tipoVehiculo: string;
  placa?: string | null;
  disponible: boolean;
  calificacion: number;
  totalEntregas: number;
  ultimaUbicacionEn?: string | null;
  zonas: Array<{
    id: string;
    codigo: string;
    nombre: string;
    esPrimaria: boolean;
  }>;
}
