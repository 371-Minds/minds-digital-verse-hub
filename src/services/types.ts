
export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  issues: number;
  updatedAt: string;
  createdAt: string;
  topics: string[];
  archived: boolean;
  private: boolean;
  defaultBranch: string;
  url: string;
}

export interface Commit {
  sha: string;
  message: string;
  date: string;
  author: string;
}

export interface ProcessedRepo {
  name: string;
  status: 'active' | 'development' | 'planning' | 'legacy';
  description: string;
  technologies: string[];
  lastUpdated: string;
  stars: number;
  forks: number;
  issues: number;
  isPrivate: boolean;
  url: string;
  platform: 'github' | 'gitlab' | 'bitbucket' | 'azure';
}

export interface PlatformApiService {
  setToken(token: string): void;
  getUserRepos(username: string): Promise<Repository[]>;
  getOrgRepos(orgName: string): Promise<Repository[]>;
  getRecentCommits(owner: string, repo: string): Promise<Commit[]>;
  processRepos(repos: Repository[]): ProcessedRepo[];
}

export interface PlatformConfig {
  username?: string;
  organization?: string;
  token?: string;
  platform: 'github' | 'gitlab' | 'bitbucket' | 'azure';
}
