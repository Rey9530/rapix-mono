import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configurarSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Delivery System API')
    .setDescription(
      'API REST del sistema de delivery — autenticación JWT, gestión de pedidos, ' +
        'zonas (PostGIS), repartidores, paquetes recargados, cierres financieros y notificaciones.',
    )
    .setVersion('1.0.0')
    .setContact('Equipo Delivery', '', 'soporte@delivery.com')
    .addServer(`http://localhost:${process.env.PORT ?? 3000}`, 'Desarrollo local')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token de acceso JWT (obtenido en POST /autenticacion/iniciar-sesion)',
      },
      'autenticacion-jwt',
    )
    .addTag('Salud', 'Health checks y diagnóstico del servicio')
    .addTag('Autenticacion', 'Inicio de sesión, registro y refresco de tokens')
    .addTag('Usuarios', 'Gestión de usuarios del sistema')
    .addTag('Pedidos', 'Creación, asignación y seguimiento de pedidos')
    .addTag('Zonas', 'Administración de zonas de cobertura (PostGIS)')
    .addTag('Repartidores', 'Gestión de repartidores y asignaciones')
    .addTag('Paquetes Recargados', 'Paquetes prepagados por clientes')
    .addTag('Cierres Financieros', 'Cierres diarios y liquidación')
    .addTag('Notificaciones', 'Envío multicanal: push, WhatsApp, email')
    .addTag('Mapas', 'Geocodificación y rutas (Mapbox)')
    .addTag('Archivos', 'Subida de archivos a MinIO (S3-compatible)')
    .addTag('Reportes', 'Reportes operativos y financieros')
    .build();

  const documento = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey, methodKey) => methodKey,
  });

  SwaggerModule.setup('api/docs', app, documento, {
    jsonDocumentUrl: 'api/docs/json',
    yamlDocumentUrl: 'api/docs/yaml',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Delivery System API — Docs',
  });
}
