import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

const TAMANO_MAXIMO = 10 * 1024 * 1024; // 10 MB
const MIME_PERMITIDOS = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

export interface ResultadoSubida {
  key: string;
  url: string;
}

@Injectable()
export class ArchivosServicio implements OnModuleInit {
  private readonly logger = new Logger(ArchivosServicio.name);
  private readonly cliente: S3Client;
  private readonly bucket: string;
  private readonly urlPublica: string;

  constructor() {
    this.bucket = process.env.MINIO_BUCKET_UPLOADS ?? 'delivery-uploads';
    this.urlPublica = process.env.MINIO_PUBLIC_URL ?? 'http://localhost:9000/delivery-uploads';
    this.cliente = new S3Client({
      endpoint: process.env.MINIO_ENDPOINT ?? 'http://localhost:9000',
      region: process.env.MINIO_REGION ?? 'us-east-1',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
        secretAccessKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
      },
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.cliente.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      try {
        await this.cliente.send(new CreateBucketCommand({ Bucket: this.bucket }));
        this.logger.log(`Bucket '${this.bucket}' creado en MinIO.`);
      } catch (error) {
        this.logger.warn(`No se pudo verificar/crear el bucket '${this.bucket}': ${(error as Error).message}`);
      }
    }
  }

  validar(buffer: Buffer, contentType: string): void {
    if (buffer.length > TAMANO_MAXIMO) {
      throw new PayloadTooLargeException(
        `Archivo excede el límite de ${TAMANO_MAXIMO / (1024 * 1024)} MB`,
      );
    }
    if (!MIME_PERMITIDOS.has(contentType)) {
      throw new UnsupportedMediaTypeException(
        `Tipo ${contentType} no permitido. Permitidos: ${[...MIME_PERMITIDOS].join(', ')}`,
      );
    }
  }

  async subir(buffer: Buffer, key: string, contentType: string): Promise<ResultadoSubida> {
    this.validar(buffer, contentType);
    try {
      await this.cliente.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: contentType,
        }),
      );
    } catch (error) {
      throw new HttpException(
        `Error subiendo archivo: ${(error as Error).message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
    return { key, url: `${this.urlPublica}/${key}` };
  }

  async eliminar(key: string): Promise<void> {
    try {
      await this.cliente.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    } catch (error) {
      this.logger.warn(`No se pudo eliminar '${key}': ${(error as Error).message}`);
    }
  }

  static armarKeyEntrega(pedidoId: string, tipo: 'foto' | 'firma', ext = 'jpg'): string {
    return `pedidos/${pedidoId}/entrega/${tipo}-${Date.now()}.${ext}`;
  }

  static armarKeyCierre(repartidorId: string, fechaIso: string, ext = 'jpg'): string {
    return `cierres/${repartidorId}/${fechaIso}/comprobante-${Date.now()}.${ext}`;
  }
}
