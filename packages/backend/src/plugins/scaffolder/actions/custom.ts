// @ts-nocheck
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import {resolvePackagePath} from '@backstage/backend-common';
import fs from 'fs-extra';
import { z } from 'zod';
import PUMLSnippets from '../../../constants/snippets.json';

// Create a new file with the contents provided by the user
export const createNewFileAction = () => {
  return createTemplateAction({
    id: 'acme:file:create',
    schema: {
      input: z.object({
        contents: z.string().describe('The contents of the file'),
        filename: z
          .string()
          .describe('The filename of the file that will be created'),
      }),
    },

    async handler(ctx) {
      await fs.outputFile(
        `${ctx.workspacePath}/${ctx.input.filename}`,
        ctx.input.contents,
      );
    },
  });
};

// Add VSCode Snippets for PlantUML if the user opted in
export const createKBTGPlantUMLSnippets = () => {
  // read the Snippets as string
  const snippets = JSON.stringify(PUMLSnippets)
  
  return createTemplateAction({
    id: 'acme:file:createPUMLSnippets',
    async handler(ctx) {
      await fs.outputFile(
        `${ctx.workspacePath}/.vscode/puml-snippets.code-snippets`,
        snippets,
      );
    },
  });
};

// Set React Version based on the user's selection
export const setReactVersion = () => {
  // read the Snippets as string  
  return createTemplateAction({
    id: 'react:setVersion',
    // generage the schema for the select type of backstage that has the field reactVersion
    schema: {
      input: z.object({
        reactVersion: z

          .string()
          .default('17.0.2')
          .describe('The version of react that will be used'),
      }),
    },
    async handler(ctx) {
      // get the package json file content
      const packageJsonContent = await fs.readFile(`${ctx.workspacePath}/package.json`, 'utf8');
      // set it as JS object
      const packageJsonObject = JSON.parse(packageJsonContent);
      packageJsonObject.dependencies.react = ctx.input.reactVersion;
      packageJsonObject.dependencies["react-dom"] = ctx.input.reactVersion;
      // convert it back to string
      const updatedPackageJsonObject = JSON.stringify(packageJsonObject, null, 2);
      // write it back to the file
      await fs.outputFile(
        `${ctx.workspacePath}/package.json`,
        updatedPackageJsonObject,
      );
    },
  });
};