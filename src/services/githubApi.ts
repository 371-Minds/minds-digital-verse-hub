
import { Repository, Commit, ProcessedRepo, PlatformApiService } from './types';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  created_at: string;
  topics: string[];
  archived: boolean;
  private: boolean;
  default_branch: string;
  html_url: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      date: string;
      name: string;
    };
    message: string;
  };
}

class GitHubApiService implements PlatformApiService {
  private baseUrl = 'https://api.github.com';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async makeRequest(endpoint: string) {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async getUserRepos(username: string): Promise<Repository[]> {
    const repos: GitHubRepo[] = await this.makeRequest(`/users/${username}/repos?sort=updated&per_page=100`);
    return this.transformRepositories(repos);
  }

  async getOrgRepos(orgName: string): Promise<Repository[]> {
    const repos: GitHubRepo[] = await this.makeRequest(`/orgs/${orgName}/repos?sort=updated&per_page=100`);
    return this.transformRepositories(repos);
  }

  async getRecentCommits(owner: string, repo: string): Promise<Commit[]> {
    const commits: GitHubCommit[] = await this.makeRequest(`/repos/${owner}/${repo}/commits?per_page=10`);
    return commits.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      date: commit.commit.author.date,
      author: commit.commit.author.name
    }));
  }

  private transformRepositories(repos: GitHubRepo[]): Repository[] {
    return repos.map(repo => ({
      id: repo.id.toString(),
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
      updatedAt: repo.updated_at,
      createdAt: repo.created_at,
      topics: repo.topics || [],
      archived: repo.archived,
      private: repo.private,
      defaultBranch: repo.default_branch,
      url: repo.html_url
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
      if (repo.topics) {
        technologies.push(...repo.topics);
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
        platform: 'github'
      };
    });
  }
}

export const githubApi = new GitHubApiService();
