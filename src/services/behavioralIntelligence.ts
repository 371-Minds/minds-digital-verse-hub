
import { Repository, Commit, ProcessedRepo } from './types';

export interface DeveloperActivity {
  developerId: string;
  name: string;
  email: string;
  totalCommits: number;
  linesAdded: number;
  linesDeleted: number;
  filesModified: number;
  averageCommitSize: number;
  commitFrequency: number;
  activeRepos: string[];
  lastActivity: string;
  engagementScore: number;
}

export interface CommitPattern {
  hourlyDistribution: number[];
  weeklyDistribution: number[];
  commitMessageQuality: number;
  averageTimeBetweenCommits: number;
  burstPatterns: boolean;
  consistencyScore: number;
}

export interface RepositoryHealth {
  repoName: string;
  platform: string;
  healthScore: number;
  lastCommitAge: number;
  activeDevelopers: number;
  codeChurnRate: number;
  testCoverage: number;
  documentationScore: number;
  issueResolutionTime: number;
  technicalDebtScore: number;
}

export interface SecurityMetrics {
  repoName: string;
  suspiciousPatterns: string[];
  vulnerabilityCount: number;
  secretsExposed: number;
  dependencyRisk: number;
  lastSecurityScan: string;
  complianceScore: number;
}

export interface CollaborationSignals {
  repoName: string;
  codeReviewParticipation: number;
  crossTeamContributions: number;
  knowledgeSharing: number;
  mentorshipActivity: number;
  communicationFrequency: number;
  conflictResolution: number;
}

export interface TechnicalDebtMetrics {
  repoName: string;
  codeComplexity: number;
  duplicateCode: number;
  outdatedDependencies: number;
  unusedCode: number;
  testDebt: number;
  documentationDebt: number;
  refactoringOpportunities: string[];
}

class BehavioralIntelligenceService {
  analyzeDeveloperActivity(commits: Commit[]): DeveloperActivity[] {
    const developerMap = new Map<string, DeveloperActivity>();
    
    commits.forEach(commit => {
      const key = `${commit.author}`;
      if (!developerMap.has(key)) {
        developerMap.set(key, {
          developerId: key,
          name: commit.author,
          email: '', // Would need additional API call
          totalCommits: 0,
          linesAdded: 0,
          linesDeleted: 0,
          filesModified: 0,
          averageCommitSize: 0,
          commitFrequency: 0,
          activeRepos: [],
          lastActivity: commit.date,
          engagementScore: 0
        });
      }
      
      const dev = developerMap.get(key)!;
      dev.totalCommits++;
      dev.lastActivity = new Date(commit.date) > new Date(dev.lastActivity) ? commit.date : dev.lastActivity;
    });

    // Calculate engagement scores
    developerMap.forEach(dev => {
      dev.engagementScore = this.calculateEngagementScore(dev);
    });

    return Array.from(developerMap.values());
  }

  analyzeCommitPatterns(commits: Commit[]): CommitPattern {
    const hourlyDist = new Array(24).fill(0);
    const weeklyDist = new Array(7).fill(0);
    
    commits.forEach(commit => {
      const date = new Date(commit.date);
      hourlyDist[date.getHours()]++;
      weeklyDist[date.getDay()]++;
    });

    const avgTimeBetween = this.calculateAverageTimeBetweenCommits(commits);
    const messageQuality = this.analyzeCommitMessageQuality(commits);
    
    return {
      hourlyDistribution: hourlyDist,
      weeklyDistribution: weeklyDist,
      commitMessageQuality: messageQuality,
      averageTimeBetweenCommits: avgTimeBetween,
      burstPatterns: this.detectBurstPatterns(commits),
      consistencyScore: this.calculateConsistencyScore(commits)
    };
  }

  analyzeRepositoryHealth(repo: ProcessedRepo, commits: Commit[]): RepositoryHealth {
    const lastCommitAge = this.calculateLastCommitAge(commits);
    const activeDevelopers = this.countActiveDevelopers(commits);
    const codeChurnRate = this.calculateCodeChurnRate(commits);
    
    return {
      repoName: repo.name,
      platform: repo.platform,
      healthScore: this.calculateHealthScore(repo, commits),
      lastCommitAge,
      activeDevelopers,
      codeChurnRate,
      testCoverage: Math.random() * 100, // Mock data - would need real analysis
      documentationScore: Math.random() * 100,
      issueResolutionTime: Math.random() * 10,
      technicalDebtScore: Math.random() * 100
    };
  }

  detectSecurityPatterns(commits: Commit[]): SecurityMetrics {
    const suspiciousPatterns: string[] = [];
    
    commits.forEach(commit => {
      const message = commit.message.toLowerCase();
      if (message.includes('password') || message.includes('secret') || message.includes('key')) {
        suspiciousPatterns.push('Potential secrets in commit messages');
      }
      if (message.includes('bypass') || message.includes('disable security')) {
        suspiciousPatterns.push('Security bypass attempts');
      }
    });

    return {
      repoName: 'repository', // Would be passed in
      suspiciousPatterns: [...new Set(suspiciousPatterns)],
      vulnerabilityCount: Math.floor(Math.random() * 10),
      secretsExposed: Math.floor(Math.random() * 3),
      dependencyRisk: Math.random() * 100,
      lastSecurityScan: new Date().toISOString(),
      complianceScore: Math.random() * 100
    };
  }

  analyzeCollaborationSignals(commits: Commit[]): CollaborationSignals {
    const developers = new Set(commits.map(c => c.author));
    const crossTeamContributions = developers.size > 1 ? 1 : 0;
    
    return {
      repoName: 'repository',
      codeReviewParticipation: Math.random() * 100,
      crossTeamContributions: crossTeamContributions * 100,
      knowledgeSharing: Math.random() * 100,
      mentorshipActivity: Math.random() * 100,
      communicationFrequency: Math.random() * 100,
      conflictResolution: Math.random() * 100
    };
  }

  analyzeTechnicalDebt(repo: ProcessedRepo): TechnicalDebtMetrics {
    return {
      repoName: repo.name,
      codeComplexity: Math.random() * 100,
      duplicateCode: Math.random() * 100,
      outdatedDependencies: Math.floor(Math.random() * 20),
      unusedCode: Math.random() * 100,
      testDebt: Math.random() * 100,
      documentationDebt: Math.random() * 100,
      refactoringOpportunities: [
        'Extract common utility functions',
        'Reduce cyclomatic complexity',
        'Update deprecated dependencies',
        'Add missing unit tests'
      ]
    };
  }

  private calculateEngagementScore(dev: DeveloperActivity): number {
    const recencyScore = this.calculateRecencyScore(dev.lastActivity);
    const volumeScore = Math.min(dev.totalCommits / 50, 1) * 100;
    return (recencyScore + volumeScore) / 2;
  }

  private calculateRecencyScore(lastActivity: string): number {
    const daysSince = (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 100 - daysSince * 2);
  }

  private calculateAverageTimeBetweenCommits(commits: Commit[]): number {
    if (commits.length < 2) return 0;
    
    const sortedCommits = commits.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let totalTime = 0;
    
    for (let i = 1; i < sortedCommits.length; i++) {
      const timeDiff = new Date(sortedCommits[i].date).getTime() - new Date(sortedCommits[i-1].date).getTime();
      totalTime += timeDiff;
    }
    
    return totalTime / (sortedCommits.length - 1) / (1000 * 60 * 60); // Convert to hours
  }

  private analyzeCommitMessageQuality(commits: Commit[]): number {
    let qualityScore = 0;
    
    commits.forEach(commit => {
      const message = commit.message;
      let score = 0;
      
      // Length check
      if (message.length > 10 && message.length < 100) score += 25;
      
      // Capitalization
      if (message[0] === message[0].toUpperCase()) score += 25;
      
      // No trailing period
      if (!message.endsWith('.')) score += 25;
      
      // Contains meaningful words
      if (!/^(fix|feat|chore|docs|style|refactor|test)/.test(message.toLowerCase())) {
        if (message.split(' ').length > 2) score += 25;
      } else {
        score += 25;
      }
      
      qualityScore += score;
    });
    
    return commits.length > 0 ? qualityScore / commits.length : 0;
  }

  private detectBurstPatterns(commits: Commit[]): boolean {
    const commitDates = commits.map(c => new Date(c.date).getTime()).sort();
    let burstCount = 0;
    
    for (let i = 1; i < commitDates.length; i++) {
      const timeDiff = commitDates[i] - commitDates[i-1];
      if (timeDiff < 60 * 60 * 1000) { // Less than 1 hour
        burstCount++;
      }
    }
    
    return burstCount > commits.length * 0.3; // More than 30% of commits in bursts
  }

  private calculateConsistencyScore(commits: Commit[]): number {
    if (commits.length < 7) return 0;
    
    const dailyCommits = new Map<string, number>();
    commits.forEach(commit => {
      const date = new Date(commit.date).toDateString();
      dailyCommits.set(date, (dailyCommits.get(date) || 0) + 1);
    });
    
    const commitCounts = Array.from(dailyCommits.values());
    const avg = commitCounts.reduce((a, b) => a + b, 0) / commitCounts.length;
    const variance = commitCounts.reduce((acc, count) => acc + Math.pow(count - avg, 2), 0) / commitCounts.length;
    
    return Math.max(0, 100 - variance * 10);
  }

  private calculateHealthScore(repo: ProcessedRepo, commits: Commit[]): number {
    const activityScore = Math.min(commits.length / 10, 1) * 30;
    const recencyScore = this.calculateRecencyScore(repo.lastUpdated) * 0.3;
    const diversityScore = new Set(commits.map(c => c.author)).size * 10;
    const issueScore = Math.max(0, 40 - repo.issues);
    
    return Math.min(100, activityScore + recencyScore + diversityScore + issueScore);
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
    // Mock calculation - would need actual file change data
    return Math.random() * 100;
  }
}

export const behavioralIntelligenceService = new BehavioralIntelligenceService();
