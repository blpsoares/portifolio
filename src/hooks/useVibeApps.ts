import { useState, useEffect } from 'react';

export interface VibeApp {
  name: string;
  folderName: string;
  rootDomain: boolean;
  subdomain: string;
  appDeployment: string;
  cloudflareUse: boolean;
}

const APPS_URL =
  'https://raw.githubusercontent.com/opvibes/openvibes-embark/refs/heads/main/apps.jsonc';
const DOMAIN = 'openvibes.tech';

export function getAppUrl(app: VibeApp): string {
  return `https://${app.subdomain}.${DOMAIN}`;
}

export function useVibeApps() {
  const [apps, setApps] = useState<VibeApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(APPS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        // Strip JSONC comments (// and /* */)
        const json = text
          .replace(/\/\/.*$/gm, '')
          .replace(/\/\*[\s\S]*?\*\//g, '');
        setApps(JSON.parse(json));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { apps, loading, error };
}
