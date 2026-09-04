'use strict';

import { describe, it, expect, beforeEach, afterAll, spyOn } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ReactWebConfig } from '../ReactWebConfig';

const webpack = require('webpack');

spyOn(console, 'log').mockImplementation(() => {});
spyOn(console, 'warn').mockImplementation(() => {});

describe('ReactWebConfig', () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'react-web-config-'));
  const envPath = join(tempDir, '.env');

  afterAll(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    delete process.env.API_URL;
    delete process.env.GOOGLE_MAPS_API_KEY;
  });

  it('should return an instance of webpack.DefinePlugin', () => {
    writeFileSync(envPath, 'API_URL=https://myapi.com\n');

    const plugin = ReactWebConfig(envPath);

    expect(plugin).toBeInstanceOf(webpack.DefinePlugin);
  });

  it('should expose the parsed .env file under __REACT_WEB_CONFIG__', () => {
    writeFileSync(envPath, [
      'API_URL=https://myapi.com',
      'GOOGLE_MAPS_API_KEY=abcdefgh',
      'EMPTY=',
    ].join('\n'));

    const plugin = ReactWebConfig(envPath);

    expect(plugin.definitions['__REACT_WEB_CONFIG__']).toBe(JSON.stringify({
      API_URL: 'https://myapi.com',
      GOOGLE_MAPS_API_KEY: 'abcdefgh',
      EMPTY: '',
    }));
  });

  it('should not override variables already present in process.env', () => {
    process.env.API_URL = 'https://existing.com';
    writeFileSync(envPath, 'API_URL=https://myapi.com\n');

    ReactWebConfig(envPath);

    expect(process.env.API_URL).toBe('https://existing.com');
  });

  it('should expose an empty object when the env file does not exist', () => {
    const plugin = ReactWebConfig(join(tempDir, 'does-not-exist.env'));

    expect(plugin.definitions['__REACT_WEB_CONFIG__']).toBe('{}');
  });
});
