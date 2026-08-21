import { useState, useEffect } from 'react';

export interface OpenSourceApp {
  name: string;
  /** Human label shown on the card. */
  displayName: string;
  folderName: string;
  rootDomain: boolean;
  subdomain: string;
  appDeployment: string;
  cloudflareUse: boolean;
  /** Absolute URL — set for apps that live outside the openvibes domain. */
  externalUrl?: string;
  /** Host shown under the title. */
  host: string;
}

interface RegistryApp {
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

/** Explicit running order for the flagship projects; everything else follows. */
const PRIORITY_SUBDOMAINS = ['agentistics', 'pdd', 'embark'];

/** Nicer labels than the raw folder names coming out of the registry. */
const DISPLAY_NAMES: Record<string, string> = {
  agentistics: 'Agentistics',
  pdd: 'PDD · Parity-Driven Development',
  embark: 'Embark',
  duckflux: 'DuckFlux',
  'docs.duckflux': 'DuckFlux · Docs',
  'editor.duckflux': 'DuckFlux · Editor',
  autoducks: 'AutoDucks',
};

/**
 * Lives on its own domain, so it is not in the openvibes registry — but it is
 * one of the projects worth showing, so it is merged in by hand.
 */
const STANDALONE: OpenSourceApp[] = [
  {
    name: 'learning',
    displayName: 'Learning',
    folderName: 'learning',
    rootDomain: false,
    subdomain: 'learning',
    appDeployment: 'cloudflare-pages',
    cloudflareUse: true,
    externalUrl: 'https://learning.blpsoares.dev',
    host: 'learning.blpsoares.dev',
  },
];

export function getAppUrl(app: OpenSourceApp): string {
  return app.externalUrl ?? `https://${app.subdomain}.${DOMAIN}`;
}

export function useOpenSourceApps() {
  const [apps, setApps] = useState<OpenSourceApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(APPS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const json = text
          .replace(/\/\/.*$/gm, '')
          .replace(/\/\*[\s\S]*?\*\//g, '');
        const parsed: RegistryApp[] = JSON.parse(json);

        const normalized: OpenSourceApp[] = parsed.map((a) => ({
          ...a,
          displayName: DISPLAY_NAMES[a.subdomain] ?? a.name,
          host: `${a.subdomain}.${DOMAIN}`,
        }));

        const priority = PRIORITY_SUBDOMAINS.map((sub) =>
          normalized.find((a) => a.subdomain === sub)
        ).filter(Boolean) as OpenSourceApp[];

        const rest = normalized.filter((a) => !PRIORITY_SUBDOMAINS.includes(a.subdomain));

        // Flagships in the requested order, then the standalone ones, then the rest.
        setApps([...priority, ...STANDALONE, ...rest]);
      })
      .catch((err) => {
        setError(err.message);
        // The registry being unreachable should not hide the projects that do
        // not depend on it.
        setApps(STANDALONE);
      })
      .finally(() => setLoading(false));
  }, []);

  return { apps, loading, error };
}
