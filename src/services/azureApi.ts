
import { Repository, Commit, ProcessedRepo, PlatformApiService } from './types';

interface AzureRepository {
  id: string;
  name: string;
  url: string;
  project: {
    name: string;
  };
  defaultBranch: string;
  size: number;
  remoteUrl: string;
}

interface AzureCommit {
  commitId: string;
  comment: string;
  author: {
    name: string;
    date: string;
  };
}

class AzureDevOpsApiService implements PlatformApiService {
  private baseUrl = 'https://dev.azure.com';
  private token: string | null = null;
  private organization = '';

  setToken(token: string) {
    this.token = token;
  }

  setOrganization(org: string) {
    this.organization = org;
  }

  private async makeRequest(endpoint: string) {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Basic ${btoa(`:${this.token}`)}`;
    }

    const response = await fetch(`${this.baseUrl}/${this.organization}/_apis${endpoint}?api-version=6.0`, { headers });
    
    if (!response.ok) {
      throw new Error(`Azure DevOps API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async getUserRepos(username: string): Promise<Repository[]> {
    // Azure DevOps doesn't have user repos concept like GitHub
    // This would need to be adapted based on how you want to handle this
    return [];
  }

  async getOrgRepos(orgName: string): Promise<Repository[]> {
    this.setOrganization(orgName);
    const data = await this.makeRequest('/git/repositories');
    return this.transformRepositories(data.value || []);
  }

  async getRecentCommits(owner: string, repo: string): Promise<Commit[]> {
    const data = await this.makeRequest(`/git/repositories/${repo}/commits?searchCriteria.$top=10`);
    const commits: AzureCommit[] = data.value || [];
    
    return commits.map(commit => ({
      sha: commit.commitId,
      message: commit.comment,
      date: commit.author.date,
      author: commit.author.name
    }));
  }

  private transformRepositories(repositories: AzureRepository[]): Repository[] {
    return repositories.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: `${repo.project.name}/${repo.name}`,
      description: null,
      language: null,
      stars: 0,
      forks: 0,
      issues: 0,
      updatedAt: new Date().toISOString(), // Would need separate API call
      createdAt: new Date().toISOString(), // Would need separate API call
      topics: [],
      archived: false,
      private: true, // Azure repos are typically private
      defaultBranch: repo.defaultBranch || 'main',
      url: repo.remoteUrl
    }));
  }

  processRepos(repos: Repository[]): ProcessedRepo[] {
    return repos.map(repo => {
      let status: ProcessedRepo['status'] = 'active';
      
      const lastUpdated = new Date(repo.updatedAt);
      const now = new Date();
      const daysSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 3600 * 24);
      
      if (repo.archived) {
        status = 'legacy';
      } else if (daysSinceUpdate > 90) {
        status = 'planning';
      } else if (daysSinceUpdate > 30) {
        status = 'development';
      }

      return {
        name: repo.name,
        status,
        description: repo.description || 'No description available',
        technologies: [],
        lastUpdated: repo.updatedAt,
        stars: repo.stars,
        forks: repo.forks,
        issues: repo.issues,
        isPrivate: repo.private,
        url: repo.url,
        platform: 'azure'
      };
    });
  }
}

export const azureApi = new AzureDevOpsApiService();
