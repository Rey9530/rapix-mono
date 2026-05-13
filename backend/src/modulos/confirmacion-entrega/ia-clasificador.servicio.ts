import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import OpenAI from 'openai';
import { ClasificacionIaDto } from './dto/clasificacion-ia.dto.js';
import type {
  ContextoPedidoIa,
  ResultadoClasificacionIa,
  TurnoConversacionIa,
} from './dto/contexto-conversacion.tipo.js';
import {
  PROMPT_SISTEMA_CONFIRMACION,
  RESPUESTA_FALLBACK_AMBIGUO,
  componerMensajeInicial,
} from './prompts/prompt-confirmacion-entrega.js';

interface ClasificarRespuestaParams {
  pedido: ContextoPedidoIa;
  turnosPrevios: TurnoConversacionIa[];
  mensajeCliente: string;
  repreguntaPrevia: boolean;
}

const TIMEOUT_MS_DEFAULT = 8_000;

@Injectable()
export class IaClasificadorServicio implements OnModuleInit {
  private readonly logger = new Logger(IaClasificadorServicio.name);
  private cliente: OpenAI | null = null;
  private modelo = 'gpt-4o-mini';

  onModuleInit(): void {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    this.modelo = process.env.OPENAI_MODEL_CONFIRMACION_ENTREGA ?? 'gpt-4o-mini';
    if (!apiKey) {
      this.logger.warn(
        'OPENAI_API_KEY no configurada — clasificador degradara a AMBIGUO en cada respuesta.',
      );
      return;
    }
    this.cliente = new OpenAI({ apiKey, timeout: TIMEOUT_MS_DEFAULT });
    this.logger.log(`Clasificador IA listo (modelo=${this.modelo}).`);
  }

  /**
   * Mensaje inicial determinista — sin tokens.
   */
  componerMensajeInicial(p: ContextoPedidoIa): string {
    return componerMensajeInicial({
      nombreCliente: p.nombreCliente,
      nombreNegocio: p.nombreNegocio,
    });
  }

  /**
   * Clasifica la respuesta del cliente. Si OpenAI no esta configurado, falla
   * o devuelve un payload invalido, retorna AMBIGUO con `respuestaCliente`
   * de fallback. El llamador decide si repreguntar o cerrar la conversacion.
   */
  async clasificarRespuesta(
    params: ClasificarRespuestaParams,
  ): Promise<ResultadoClasificacionIa> {
    if (!this.cliente) {
      return this.fallbackAmbiguo(params.repreguntaPrevia);
    }

    try {
      const historial = params.turnosPrevios
        .map((t) => `${t.rol === 'BOT' ? 'Bot' : 'Cliente'}: ${t.texto}`)
        .join('\n');
      const contenidoUsuario = [
        `nombreCliente: ${params.pedido.nombreCliente}`,
        `nombreNegocio: ${params.pedido.nombreNegocio}`,
        `codigoSeguimiento: ${params.pedido.codigoSeguimiento}`,
        `repreguntaPrevia: ${params.repreguntaPrevia}`,
        '',
        'Historial de turnos previos:',
        historial.length > 0 ? historial : '(ninguno)',
        '',
        `Ultimo mensaje del cliente a clasificar:\n${params.mensajeCliente}`,
      ].join('\n');

      const respuesta = await this.cliente.chat.completions.create({
        model: this.modelo,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: PROMPT_SISTEMA_CONFIRMACION },
          { role: 'user', content: contenidoUsuario },
        ],
      });

      const contenido = respuesta.choices[0]?.message?.content ?? '';
      const parsed = this.parsearJson(contenido);
      if (!parsed) {
        this.logger.warn('Respuesta IA no es JSON valido — fallback AMBIGUO.');
        return this.fallbackAmbiguo(params.repreguntaPrevia);
      }
      const validado = this.validar(parsed);
      if (!validado) {
        this.logger.warn('Respuesta IA no paso validacion — fallback AMBIGUO.');
        return this.fallbackAmbiguo(params.repreguntaPrevia);
      }
      // Coercion final del invariante: si la previa ya fue una repregunta,
      // forzamos repregunta=false para no entrar en loop.
      if (params.repreguntaPrevia) {
        validado.repregunta = false;
      }
      return validado;
    } catch (error) {
      this.logger.error(
        `Fallo clasificacion IA: ${(error as Error).message ?? 'desconocido'}`,
      );
      return this.fallbackAmbiguo(params.repreguntaPrevia);
    }
  }

  private parsearJson(texto: string): unknown {
    const limpio = texto.trim();
    if (!limpio) return null;
    try {
      return JSON.parse(limpio);
    } catch {
      return null;
    }
  }

  private validar(payload: unknown): ResultadoClasificacionIa | null {
    if (typeof payload !== 'object' || payload === null) return null;
    const instancia = plainToInstance(ClasificacionIaDto, payload);
    const errores = validateSync(instancia, { whitelist: false });
    if (errores.length > 0) return null;
    return {
      intencion: instancia.intencion,
      notaRider: instancia.notaRider ?? null,
      respuestaCliente: instancia.respuestaCliente,
      repregunta: instancia.repregunta,
    };
  }

  private fallbackAmbiguo(repreguntaPrevia: boolean): ResultadoClasificacionIa {
    return {
      intencion: 'AMBIGUO',
      notaRider: null,
      respuestaCliente: RESPUESTA_FALLBACK_AMBIGUO,
      repregunta: !repreguntaPrevia,
    };
  }
}
