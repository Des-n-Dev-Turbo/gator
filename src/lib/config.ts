import * as os from 'node:os';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { getUserByName } from './db/queries/users.js';

type Config = {
  dbUrl: string;
};

export const getConfigFilePath = (): string => {
  const homeDir = os.homedir();

  const fileName = '.gatorconfig.json';

  const filePath = path.join(homeDir, fileName);

  return filePath;
};

export const readConfig = () => {
  const configFilePath = getConfigFilePath();

  const configFileData = fs.readFileSync(configFilePath, {
    encoding: 'utf-8',
  });

  return configFileData;
};

export const getDBUrl = () => {
  const fileData = readConfig();

  const config = JSON.parse(fileData);

  return (config.dbUrl as string) ?? '';
};

const writeConfig = (cfg: Config, currentUserName: string) => {
  const configFilePath = getConfigFilePath();
  if (!cfg) return;

  const updatedContent = { ...cfg, currentUserName };

  fs.writeFileSync(configFilePath, JSON.stringify(updatedContent));
};

const validateConfig = (rawConfig: any): Config | undefined => {
  if (typeof rawConfig === 'string') {
    const content = JSON.parse(rawConfig);

    return {
      dbUrl: content.db_url ?? content.dbUrl,
    };
  }

  return;
};

export function setUser(userName: string) {
  const configFileData = readConfig();
  const configFileContent = validateConfig(configFileData);

  writeConfig(configFileContent!, userName);
}

export function getCurrentUserFromConfig() {
  const configFileData = readConfig();

  const data = JSON.parse(configFileData);

  return data.currentUserName;
}
