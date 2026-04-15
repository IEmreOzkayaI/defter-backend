import * as fs from 'fs';
import * as path from 'path';

import { ERROR_DEFINITIONS } from '../configs/error-definitions.config';
import { TerminalModel } from '../enums';
import { throwInternalServerException } from './error.util';

type EnvValue = string | undefined;

export class CommonUtil {
  static validateEnv(env: Record<string, EnvValue>, schema: Record<string, { required: boolean }>): void {
    const errors: string[] = [];

    for (const key of Object.keys(schema)) {
      const rule = schema[key];
      if (!rule?.required) continue;

      const value = env[key];
      const isEmpty = value === undefined || value === null || (typeof value === 'string' ? value.trim() === '' : true);
      if (isEmpty) {
        errors.push(key);
      }
    }

    if (errors.length > 0) {
      console.error('\n❌ Missing required environment variables:\n');
      errors.forEach((key) => console.error(`   • ${key}`));
      console.error('\nSet them in .env and restart the application.\n');
      process.exit(1);
    }
  }

  static findTerminalModel = (fiscalId: string | undefined): TerminalModel | undefined => {
    if (!fiscalId || fiscalId.length < 2) return undefined;
    const prefix = fiscalId.slice(0, 2);
    switch (prefix) {
      case 'AX':
        return TerminalModel['400TR'];
      case 'AU':
        return TerminalModel['1000TR'];
      case 'AW':
        return TerminalModel['430TR'];
      default:
        return undefined;
    }
  };

  static readFileContentAsString(filepath: string): string {
    try {
      const fullPath = path.resolve(filepath);
      if (!fs.existsSync(fullPath)) {
        throw throwInternalServerException(ERROR_DEFINITIONS.FILE_NOT_FOUND.reason);
      }
      const fileContent = fs.readFileSync(fullPath).toString();
      return fileContent;
    } catch (error) {
      throw throwInternalServerException(ERROR_DEFINITIONS.FILE_NOT_FOUND.reason);
    }
  }

  static enumKeyByValue(enumObj: Record<string, string | number>, value: number): string | null {
    return Object.entries(enumObj).find(([, v]) => typeof v === 'number' && v === value)?.[0] ?? null;
  }

  static resolvePartialEnumNames(
    ids: number[],
    enumObj: Record<string, string | number>,
  ): {
    ids: number[] | null;
    names: string[] | null;
  } {
    const resolved: { id: number; name: string }[] = ids
      .map((id) => {
        const name = CommonUtil.enumKeyByValue(enumObj, id);
        return name !== null ? { id, name } : null;
      })
      .filter((item): item is { id: number; name: string } => item !== null);

    return {
      ids: resolved.length > 0 ? (CommonUtil.nonEmpty(resolved.map((i) => i.id)) ?? null) : null,
      names: resolved.length > 0 ? (CommonUtil.nonEmpty(resolved.map((i) => i.name)) ?? null) : null,
    };
  }

  static resolveStrictEnumNames(ids: number[], enumObj: Record<string, string | number>): { names: string[] | null } {
    const names = ids.map((id) => CommonUtil.enumKeyByValue(enumObj, id));
    const validNames = names.filter((n): n is string => !!n);

    return {
      names: validNames.length > 0 ? (CommonUtil.nonEmpty(validNames) ?? null) : null,
    };
  }

  static compact = <T extends Record<string, any>>(obj: T): Partial<T> => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;

  static nonEmpty = <T>(arr: T[]): T[] | undefined => (arr.length > 0 ? arr : undefined);

  static pluck = (arr: any[], key: string): any[] => arr.map((i) => i[key]).filter((v) => v != null);

  static resolveEnumValue = <T>(value: unknown, enumObj: Record<string, T>): T | null => (value != null && Object.values(enumObj).includes(value as T) ? (value as T) : null);

  static stripNullAndUndefined<T>(value: T): T {
    if (value === null || value === undefined) {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => CommonUtil.stripNullAndUndefined(item)) as T;
    }
    if (value instanceof Date) {
      return value;
    }
    if (typeof value === 'object' && value !== null) {
      return Object.fromEntries(
        Object.entries(value)
          .filter(([, v]) => v !== null && v !== undefined)
          .map(([k, v]) => [k, CommonUtil.stripNullAndUndefined(v)]),
      ) as T;
    }
    return value;
  }

  static stripUndefinedOnly<T>(value: T): T {
    if (value === undefined) {
      return value;
    }
    if (value === null) {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => CommonUtil.stripUndefinedOnly(item)) as T;
    }
    if (value instanceof Date) {
      return value;
    }
    if (typeof value === 'object' && value !== null) {
      return Object.fromEntries(
        Object.entries(value)
          .filter(([, v]) => v !== undefined) // null kalsın
          .map(([k, v]) => [k, CommonUtil.stripUndefinedOnly(v)]),
      ) as T;
    }
    return value;
  }

  static toArray(value: unknown): string[] {
    if (value == null) return [];
    if (Array.isArray(value)) return value.flatMap((v) => (typeof v === 'string' ? v.split(',').map((s) => s.trim()) : []));
    if (typeof value === 'string')
      return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    return [];
  }

  static toNumberArray(value: unknown): number[] {
    const arr = CommonUtil.toArray(value);
    return arr.map((s) => parseInt(s, 10)).filter((n) => !Number.isNaN(n));
  }
}
