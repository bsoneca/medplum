import express from 'express';
import { initApp } from './app';
import { loadConfig } from './config';
import { getRootSchema } from './fhir/operations/graphql';
import { logger } from './logger';

export async function main(configName: string): Promise<void> {
  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled promise rejection', err);
  });
  process.on('uncaughtException', (err) => {
    logger.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

  logger.info('Starting Medplum Server...');
  logger.info('configName: ' + configName);

  const config = await loadConfig(configName);
  logger.info('config: ' + JSON.stringify(config, undefined, 2));

  // Preload the schema
  getRootSchema();

  const app = await initApp(express(), config);
  app.listen(config.port);
}

if (require.main === module) {
  main(process.argv.length === 3 ? process.argv[2] : 'file:medplum.config.json').catch(console.log);
}
