
import { Repository, Commit, ProcessedRepo, PlatformApiService } from './types';

interface BitbucketRepository {
  uuid: string;
  name: string;
  full_name: string;
  description: string | null;
  language: string;
  updated_on: string;
  created_on: string;
  is_private: boolean;
  links: {
    html: {
      href: string;
    };
  };
}

interface BitbucketCommit {
  hash: string;
  message: string;
  date: string;
  author: {
    raw: string;
  };
}

class BitbucketApiService implements PlatformApiService {
  private baseUrl = 'https://api.bitbucket.org/2.0';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async makeRequest(endpoint: string) {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });
    
    if (!response.ok) {
      throw new Error(`Bitbucket API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async getUserRepos(username: string): Promise<Repository[]> {
    const data = await this.makeRequest(`/repositories/${username}?pagelen=100&sort=-updated_on`);
    return this.transformRepositories(data.values || []);
  }

  async getOrgRepos(orgName: string): Promise<Repository[]> {
    const data = await this.makeRequest(`/repositories/${orgName}?pagelen=100&sort=-updated_on`);
    return this.transformRepositories(data.values || []);
  }

  async getRecentCommits(owner: string, repo: string): Promise<Commit[]> {
    const data = await this.makeRequest(`/repositories/${owner}/${repo}/commits?pagelen=10`);
    const commits: BitbucketCommit[] = data.values || [];
    
    return commits.map(commit => ({
      sha: commit.hash,
      message: commit.message.split('\n')[0], // First line only
      date: commit.date,
      author: commit.author.raw
    }));
  }

  private transformRepositories(repositories: BitbucketRepository[]): Repository[] {
    return repositories.map(repo => ({
      id: repo.uuid,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      language: repo.language,
      stars: 0, // Bitbucket doesn't have stars
      forks: 0, // Would need separate API call
      issues: 0, // Would need separate API call
      updatedAt: repo.updated_on,
      createdAt: repo.created_on,
      topics: [],
      archived: false,
      private: repo.is_private,
      defaultBranch: 'main', // Would need separate API call
      url: repo.links.html.href
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

      const technologies: string[] = [];
      if (repo.language) {
        technologies.push(repo.language);
      }

      return {
        name: repo.name,
        status,
        description: repo.description || 'No description available',
        technologies: technologies.slice(0, 5),
        lastUpdated: repo.updatedAt,
        stars: repo.stars,
        forks: repo.forks,
        issues: repo.issues,
        isPrivate: repo.private,
        url: repo.url,
        platform: 'bitbucket'
      };
    });
  }
}

export const bitbucketApi = new BitbucketApiService();
