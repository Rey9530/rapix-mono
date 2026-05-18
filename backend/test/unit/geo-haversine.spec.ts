import { GeoServicio } from '../../src/modulos/zonas/geo.servicio.js';

describe('GeoServicio.distanciaHaversineMetros', () => {
  // No usamos PrismaServicio en este test — instanciamos con un stub.
  const geo = new GeoServicio({} as never);

  it('puntos identicos retorna 0', () => {
    const d = geo.distanciaHaversineMetros(
      { lat: 13.6929, lng: -89.2182 },
      { lat: 13.6929, lng: -89.2182 },
    );
    expect(d).toBe(0);
  });

  it('aproxima ~111 km por grado de latitud al ecuador', () => {
    const d = geo.distanciaHaversineMetros(
      { lat: 0, lng: 0 },
      { lat: 1, lng: 0 },
    );
    // 111 km +/- 0.5 km tolerancia.
    expect(d).toBeGreaterThan(110_000);
    expect(d).toBeLessThan(112_000);
  });

  it('detecta un desplazamiento de ~1.5 km en San Salvador', () => {
    // Dos puntos separados ~1.5 km en la misma latitud (~13.69, lng difiere
    // 0.0139 grados ≈ 1500 m en esa latitud).
    const d = geo.distanciaHaversineMetros(
      { lat: 13.6929, lng: -89.2182 },
      { lat: 13.6929, lng: -89.2043 },
    );
    expect(d).toBeGreaterThan(1_400);
    expect(d).toBeLessThan(1_600);
  });

  it('es simetrica (a→b igual a b→a)', () => {
    const a = { lat: 13.6929, lng: -89.2182 };
    const b = { lat: 13.7012, lng: -89.2035 };
    expect(geo.distanciaHaversineMetros(a, b)).toBeCloseTo(
      geo.distanciaHaversineMetros(b, a),
      5,
    );
  });
});
