interface Config {
  domain: string;
  homepage: string;
}

let configCache: Config | null = null;

export async function loadConfig(): Promise<Config> {
  if (configCache) {
    return configCache;
  }

  try {
    const response = await fetch('/config.txt');
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.statusText}`);
    }
    configCache = await response.json();
    return configCache;
  } catch (error) {
    console.error('Error loading config:', error);
    throw error;
  }
}

export async function getApiUrl(endpoint: string): Promise<string> {
  const config = await loadConfig();
  return `${config.domain}${endpoint}`;
}

export async function getHomepageUrl(): Promise<string> {
  const config = await loadConfig();
  return config.homepage;
}