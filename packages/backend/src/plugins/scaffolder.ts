import { CatalogClient } from '@backstage/catalog-client';
import { ScmIntegrations } from '@backstage/integration';
import { createRouter } from '@backstage/plugin-scaffolder-backend';
import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { createNewFileAction, createKBTGPlantUMLSnippets, setReactVersion } from './scaffolder/actions/custom';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  const integrations = ScmIntegrations.fromConfig(env.config);

  const builtInActions = createBuiltinActions({
    // @ts-ignore
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [...builtInActions, createNewFileAction(),
    createKBTGPlantUMLSnippets(),
    setReactVersion()
  ];

  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    identity: env.identity,
    permissions: env.permissions,
    actions,
  });
}
