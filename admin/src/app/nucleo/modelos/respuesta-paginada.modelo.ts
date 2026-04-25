export interface MetaPaginacion {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
}

export interface RespuestaPaginada<T> {
  datos: T[];
  meta: MetaPaginacion;
}
