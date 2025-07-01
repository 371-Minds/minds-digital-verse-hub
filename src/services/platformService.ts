
import { PlatformApiService, PlatformConfig } from './types';
import { githubApi } from './githubApi';
import { gitlabApi } from './gitlabApi';
import { bitbucketApi } from './bitbucketApi';
import { azureApi } from './azureApi';

class PlatformService {
  private getApiService(platform: string): PlatformApiService {
    switch (platform) {
      case 'github':
        return githubApi;
      case 'gitlab':
        return gitlabApi;
      case 'bitbucket':
        return bitbucketApi;
      case 'azure':
        return azureApi;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  async fetchRepositories(config: PlatformConfig) {
    const apiService = this.getApiService(config.platform);
    
    if (config.token) {
      apiService.setToken(config.token);
    }

    let repos;
    if (config.username) {
      repos = await apiService.getUserRepos(config.username);
    } else if (config.organization) {
      repos = await apiService.getOrgRepos(config.organization);
    } else {
      throw new Error('Username or organization is required');
    }

    return apiService.processRepos(repos);
  }

  async fetchCommits(platform: string, owner: string, repo: string, token?: string) {
    const apiService = this.getApiService(platform);
    
    if (token) {
      apiService.setToken(token);
    }

    return await apiService.getRecentCommits(owner, repo);
  }
}

export const platformService = new PlatformService();
