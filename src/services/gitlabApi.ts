
import { Repository, Commit, ProcessedRepo, PlatformApiService } from './types';

interface GitLabProject {
  id: number;
  name: string;
  name_with_namespace: string;
  description: string | null;
  star_count: number;
  forks_count: number;
  open_issues_count: number;
  last_activity_at: string;
  created_at: string;
  topics: string[];
  archived: boolean;
  visibility: string;
  default_branch: string;
  web_url: string;
}

interface GitLabCommit {
  id: string;
  title: string;
  created_at: string;
  author_name: string;
}

class GitLabApiService implements PlatformApiService {
  private baseUrl = 'https://gitlab.com/api/v4';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async makeRequest(endpoint: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });
    
    if (!response.ok) {
      throw new Error(`GitLab API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async getUserRepos(username: string): Promise<Repository[]> {
    const projects: GitLabProject[] = await this.makeRequest(`/users/${username}/projects?per_page=100&order_by=updated_at`);
    return this.transformProjects(projects);
  }

  async getOrgRepos(orgName: string): Promise<Repository[]> {
    const projects: GitLabProject[] = await this.makeRequest(`/groups/${orgName}/projects?per_page=100&order_by=updated_at`);
    return this.transformProjects(projects);
  }

  async getRecentCommits(owner: string, repo: string): Promise<Commit[]> {
    const projectPath = encodeURIComponent(`${owner}/${repo}`);
    const commits: GitLabCommit[] = await this.makeRequest(`/projects/${projectPath}/repository/commits?per_page=10`);
    
    return commits.map(commit => ({
      sha: commit.id,
      message: commit.title,
      date: commit.created_at,
      author: commit.author_name
    }));
  }

  private transformProjects(projects: GitLabProject[]): Repository[] {
    return projects.map(project => ({
      id: project.id.toString(),
      name: project.name,
      fullName: project.name_with_namespace,
      description: project.description,
      language: null, // GitLab doesn't provide primary language in project list
      stars: project.star_count,
      forks: project.forks_count,
      issues: project.open_issues_count,
      updatedAt: project.last_activity_at,
      createdAt: project.created_at,
      topics: project.topics || [],
      archived: project.archived,
      private: project.visibility === 'private',
      defaultBranch: project.default_branch,
      url: project.web_url
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
        platform: 'gitlab'
      };
    });
  }
}

export const gitlabApi = new GitLabApiService();
