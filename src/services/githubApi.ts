
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
}

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      date: string;
    };
    message: string;
  };
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
}

class GitHubApiService {
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

  async getUserRepos(username: string): Promise<GitHubRepo[]> {
    return this.makeRequest(`/users/${username}/repos?sort=updated&per_page=100`);
  }

  async getOrgRepos(orgName: string): Promise<GitHubRepo[]> {
    return this.makeRequest(`/orgs/${orgName}/repos?sort=updated&per_page=100`);
  }

  async getRecentCommits(owner: string, repo: string): Promise<GitHubCommit[]> {
    return this.makeRequest(`/repos/${owner}/${repo}/commits?per_page=10`);
  }

  processRepos(repos: GitHubRepo[]): ProcessedRepo[] {
    return repos.map(repo => {
      // Determine status based on recent activity and repository state
      let status: ProcessedRepo['status'] = 'active';
      
      const lastUpdated = new Date(repo.updated_at);
      const now = new Date();
      const daysSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 3600 * 24);
      
      if (repo.archived) {
        status = 'legacy';
      } else if (daysSinceUpdate > 90) {
        status = 'planning';
      } else if (daysSinceUpdate > 30) {
        status = 'development';
      }

      // Extract technologies from language and topics
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
        technologies: technologies.slice(0, 5), // Limit to 5 technologies
        lastUpdated: repo.updated_at,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        issues: repo.open_issues_count,
        isPrivate: repo.private
      };
    });
  }
}

export const githubApi = new GitHubApiService();
