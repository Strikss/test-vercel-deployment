import type { ThemeId } from './themes'

export const TEMPLATE_REPO_URL =
  'https://github.com/your-org/test-vercel-template'

export const DEMO_TITLE = 'White-label shadcn starter'
export const DEMO_DESCRIPTION =
  'A themed React + Vite + shadcn instance deployed via Vercel.'

export type DeployParams = {
  theme: ThemeId
  name: string
  repoUrl?: string
}

export function buildVercelDeployUrl({
  theme,
  name,
  repoUrl = TEMPLATE_REPO_URL,
}: DeployParams) {
  const params = new URLSearchParams({
    'repository-url': repoUrl,
    'project-name': name,
    'repository-name': name,
    env: 'VITE_INSTANCE_THEME,VITE_INSTANCE_NAME',
    envDescription:
      'Theme color and instance display name baked into the build.',
    envLink: `${repoUrl}#environment-variables`,
    'demo-title': DEMO_TITLE,
    'demo-description': DEMO_DESCRIPTION,
  })

  params.set('env-VITE_INSTANCE_THEME', theme)
  params.set('env-VITE_INSTANCE_NAME', name)

  return `https://vercel.com/new/clone?${params.toString()}`
}

export function suggestVercelUrl(name: string) {
  if (!name) return ''
  return `https://${name}.vercel.app`
}

export function sanitizeProjectName(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 52)
}

export function isValidProjectName(name: string) {
  return /^[a-z0-9](?:[a-z0-9-]{0,50}[a-z0-9])?$/.test(name)
}

export type SimulatedStep = {
  label: string
  endpoint: string
  method: 'POST' | 'GET' | 'PATCH'
  body?: unknown
  duration: number
}

export function buildApiSimulationSteps({
  theme,
  name,
}: DeployParams): SimulatedStep[] {
  return [
    {
      label: 'Exchange OAuth code for an access token',
      endpoint: 'https://api.vercel.com/v2/oauth/access_token',
      method: 'POST',
      body: {
        client_id: 'oac_xxx',
        client_secret: '••••••',
        code: 'cd_xxx',
        redirect_uri: 'https://yourapp.com/api/vercel/callback',
      },
      duration: 600,
    },
    {
      label: 'Create the project from your template',
      endpoint: 'https://api.vercel.com/v9/projects',
      method: 'POST',
      body: {
        name,
        framework: 'vite',
        gitRepository: {
          type: 'github',
          repo: 'your-org/test-vercel-template',
        },
        environmentVariables: [
          {
            key: 'VITE_INSTANCE_THEME',
            value: theme,
            target: ['production', 'preview'],
            type: 'plain',
          },
          {
            key: 'VITE_INSTANCE_NAME',
            value: name,
            target: ['production', 'preview'],
            type: 'plain',
          },
        ],
      },
      duration: 900,
    },
    {
      label: 'Trigger the first production deployment',
      endpoint: 'https://api.vercel.com/v13/deployments',
      method: 'POST',
      body: {
        name,
        target: 'production',
        gitSource: {
          type: 'github',
          ref: 'main',
          repoId: '<from previous response>',
        },
      },
      duration: 1100,
    },
  ]
}
