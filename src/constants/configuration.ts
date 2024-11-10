export enum CONFIGURATION_KEY {
  GLOBAL_IPV6_ENABLE_KEY = 'GLOBAL_IPV6_ENABLE',
}

export type ConfigurationType = 'boolean' | 'string';

export type ConfigurationField = 'ipv6GlobalEnabled';
export class ConfigurationModel {
  field: ConfigurationField;
  type: ConfigurationType;
}

export const CONFIGURATION_MAP = new Map<string, ConfigurationModel>(
  Object.entries({
    [CONFIGURATION_KEY.GLOBAL_IPV6_ENABLE_KEY]: {
      field: 'ipv6GlobalEnabled',
      type: 'boolean',
    },
  }),
);

export function getConfigurationKeyByField(field: string): string | undefined {
  for (const [key, configurationModel] of CONFIGURATION_MAP.entries()) {
    if (configurationModel.field === field) {
      return key;
    }
  }
}
