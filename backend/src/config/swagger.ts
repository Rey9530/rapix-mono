import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configurarSwagger(app: INestApplication): void {
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
        description:
          'Token de acceso JWT (obtenido en POST /autenticacion/iniciar-sesion)',
      },
      'autenticacion-jwt',
    )
    .addTag('Salud', 'Health checks y diagnóstico del servicio')
    .addTag('Autenticacion', 'Inicio de sesión, registro y refresco de tokens')
    .addTag('Usuarios', 'Gestión de usuarios del sistema')
    .build();

  const documento = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey, methodKey) => methodKey,
  });

  SwaggerModule.setup('docs', app, documento, {
    jsonDocumentUrl: 'docs-json',
    yamlDocumentUrl: 'docs-yaml',
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
