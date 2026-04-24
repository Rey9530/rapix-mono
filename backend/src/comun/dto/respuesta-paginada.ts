export interface MetaPaginacion {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
}

export class RespuestaPaginada<T> {
  constructor(
    public readonly datos: T[],
    public readonly meta: MetaPaginacion,
  ) {}

  static de<T>(
    datos: T[],
    total: number,
    pagina: number,
    limite: number,
  ): RespuestaPaginada<T> {
    return new RespuestaPaginada(datos, {
      pagina,
      limite,
      total,
      totalPaginas: total === 0 ? 0 : Math.ceil(total / limite),
    });
  }
}
