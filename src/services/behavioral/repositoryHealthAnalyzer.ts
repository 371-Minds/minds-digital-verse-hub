
import { ProcessedRepo, Commit } from '../types';
import { RepositoryHealth } from './types';

export class RepositoryHealthAnalyzer {
  analyzeRepositoryHealth(repo: ProcessedRepo, commits: Commit[]): RepositoryHealth {
    const lastCommitAge = this.calculateLastCommitAge(commits);
    const activeDevelopers = this.countActiveDevelopers(commits);
    const healthScore = this.calculateHealthScore(repo, commits);
    
    return {
      repoName: repo.name,
      platform: repo.platform,
      healthScore,
      lastCommitAge,
      activeDevelopers,
      codeChurnRate: this.calculateCodeChurnRate(commits),
      testCoverage: this.estimateTestCoverage(repo, commits),
      documentationScore: this.calculateDocumentationScore(repo, commits),
      issueResolutionTime: this.calculateIssueResolutionTime(repo),
      technicalDebtScore: this.calculateTechnicalDebtScore(repo, commits)
    };
  }

  private calculateHealthScore(repo: ProcessedRepo, commits: Commit[]): number {
    const activityScore = Math.min(commits.length / 10, 1) * 30;
    const recencyScore = this.calculateRecencyScore(repo.lastUpdated) * 0.3;
    const diversityScore = Math.min(new Set(commits.map(c => c.author)).size * 10, 30);
    const issueScore = Math.max(0, 40 - repo.issues);
    
    return Math.min(100, activityScore + recencyScore + diversityScore + issueScore);
  }

  private calculateRecencyScore(lastActivity: string): number {
    const daysSince = (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 100 - daysSince * 2);
  }

  private calculateLastCommitAge(commits: Commit[]): number {
    if (commits.length === 0) return Infinity;
    const lastCommit = commits.reduce((latest, commit) => 
      new Date(commit.date) > new Date(latest.date) ? commit : latest
    );
    return (Date.now() - new Date(lastCommit.date).getTime()) / (1000 * 60 * 60 * 24);
  }

  private countActiveDevelopers(commits: Commit[]): number {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentCommits = commits.filter(c => new Date(c.date) > thirtyDaysAgo);
    return new Set(recentCommits.map(c => c.author)).size;
  }

  private calculateCodeChurnRate(commits: Commit[]): number {
    if (commits.length === 0) return 0;
    
    const burstCommits = commits.filter(commit => 
      commit.message.toLowerCase().includes('fix') || 
      commit.message.toLowerCase().includes('bug')
    ).length;
    
    const churnIndicator = (burstCommits / commits.length) * 100;
    return Math.min(churnIndicator, 100);
  }

  private estimateTestCoverage(repo: ProcessedRepo, commits: Commit[]): number {
    const testCommits = commits.filter(commit => 
      commit.message.toLowerCase().includes('test') ||
      commit.message.toLowerCase().includes('spec') ||
      commit.message.toLowerCase().includes('coverage')
    ).length;
    
    return Math.min((testCommits / Math.max(commits.length, 1)) * 100, 100);
  }

  private calculateDocumentationScore(repo: ProcessedRepo, commits: Commit[]): number {
    const docCommits = commits.filter(commit => 
      commit.message.toLowerCase().includes('doc') ||
      commit.message.toLowerCase().includes('readme') ||
      commit.message.toLowerCase().includes('comment')
    ).length;
    
    return Math.min((docCommits / Math.max(commits.length, 1)) * 100, 100);
  }

  private calculateIssueResolutionTime(repo: ProcessedRepo): number {
    if (repo.issues === 0) return 0;
    
    const issueRatio = repo.issues / Math.max(repo.stars + repo.forks, 1);
    return Math.min(issueRatio * 10, 30); // Cap at 30 days
  }

  private calculateTechnicalDebtScore(repo: ProcessedRepo, commits: Commit[]): number {
    const fixCommits = commits.filter(commit => 
      commit.message.toLowerCase().includes('fix') ||
      commit.message.toLowerCase().includes('bug') ||
      commit.message.toLowerCase().includes('hotfix')
    ).length;
    
    const debtIndicator = (fixCommits / Math.max(commits.length, 1)) * 100;
    return Math.min(debtIndicator, 100);
  }
}
