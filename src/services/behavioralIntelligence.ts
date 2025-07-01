
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
          email: '',
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

    // Calculate engagement scores and commit frequency
    developerMap.forEach(dev => {
      dev.engagementScore = this.calculateEngagementScore(dev);
      dev.commitFrequency = this.calculateCommitFrequency(commits.filter(c => c.author === dev.name));
    });

    return Array.from(developerMap.values());
  }

  analyzeCommitPatterns(commits: Commit[]): CommitPattern {
    if (commits.length === 0) {
      return {
        hourlyDistribution: new Array(24).fill(0),
        weeklyDistribution: new Array(7).fill(0),
        commitMessageQuality: 0,
        averageTimeBetweenCommits: 0,
        burstPatterns: false,
        consistencyScore: 0
      };
    }

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

  detectSecurityPatterns(commits: Commit[]): SecurityMetrics {
    const suspiciousPatterns: string[] = [];
    let secretsCount = 0;
    
    commits.forEach(commit => {
      const message = commit.message.toLowerCase();
      if (message.includes('password') || message.includes('secret') || message.includes('key') || message.includes('token')) {
        suspiciousPatterns.push('Potential secrets in commit messages');
        secretsCount++;
      }
      if (message.includes('bypass') || message.includes('disable security') || message.includes('skip validation')) {
        suspiciousPatterns.push('Security bypass attempts');
      }
      if (message.includes('hack') || message.includes('workaround') || message.includes('quick fix')) {
        suspiciousPatterns.push('Potentially risky workarounds');
      }
    });

    const vulnerabilityCount = this.detectVulnerabilityPatterns(commits);
    
    return {
      repoName: 'repository',
      suspiciousPatterns: [...new Set(suspiciousPatterns)],
      vulnerabilityCount,
      secretsExposed: secretsCount,
      dependencyRisk: this.calculateDependencyRisk(commits),
      lastSecurityScan: new Date().toISOString(),
      complianceScore: this.calculateComplianceScore(commits, suspiciousPatterns.length)
    };
  }

  analyzeCollaborationSignals(commits: Commit[]): CollaborationSignals {
    const developers = new Set(commits.map(c => c.author));
    const crossTeamContributions = this.calculateCrossTeamContributions(commits);
    const knowledgeSharing = this.calculateKnowledgeSharing(commits);
    
    return {
      repoName: 'repository',
      codeReviewParticipation: this.calculateCodeReviewParticipation(commits),
      crossTeamContributions,
      knowledgeSharing,
      mentorshipActivity: this.calculateMentorshipActivity(commits),
      communicationFrequency: this.calculateCommunicationFrequency(commits),
      conflictResolution: this.calculateConflictResolution(commits)
    };
  }

  analyzeTechnicalDebt(repo: ProcessedRepo, commits: Commit[]): TechnicalDebtMetrics {
    const refactoringOpportunities = this.identifyRefactoringOpportunities(commits);
    
    return {
      repoName: repo.name,
      codeComplexity: this.calculateCodeComplexity(commits),
      duplicateCode: this.detectDuplicateCode(commits),
      outdatedDependencies: this.countOutdatedDependencies(commits),
      unusedCode: this.detectUnusedCode(commits),
      testDebt: this.calculateTestDebt(commits),
      documentationDebt: this.calculateDocumentationDebt(commits),
      refactoringOpportunities
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

  private calculateCommitFrequency(commits: Commit[]): number {
    if (commits.length === 0) return 0;
    
    const sortedDates = commits.map(c => new Date(c.date).getTime()).sort();
    const timeSpan = sortedDates[sortedDates.length - 1] - sortedDates[0];
    const days = timeSpan / (1000 * 60 * 60 * 24);
    
    return days > 0 ? commits.length / days : 0;
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
    if (commits.length === 0) return 0;
    
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
      
      // Contains meaningful words or follows conventional commit format
      if (/^(fix|feat|chore|docs|style|refactor|test|perf|ci|build)(\(.+\))?:/.test(message.toLowerCase())) {
        score += 25;
      } else if (message.split(' ').length > 2) {
        score += 25;
      }
      
      qualityScore += score;
    });
    
    return qualityScore / commits.length;
  }

  private detectBurstPatterns(commits: Commit[]): boolean {
    if (commits.length < 3) return false;
    
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
    const diversityScore = Math.min(new Set(commits.map(c => c.author)).size * 10, 30);
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
    if (commits.length === 0) return 0;
    
    // Estimate churn based on commit frequency and message patterns
    const avgTimeBetween = this.calculateAverageTimeBetweenCommits(commits);
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
    // Estimate based on repository activity and issue count
    if (repo.issues === 0) return 0;
    
    // Simple heuristic: more issues relative to activity suggests longer resolution times
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

  private detectVulnerabilityPatterns(commits: Commit[]): number {
    const vulnerabilityKeywords = ['security', 'vulnerability', 'exploit', 'patch', 'cve'];
    return commits.filter(commit => 
      vulnerabilityKeywords.some(keyword => 
        commit.message.toLowerCase().includes(keyword)
      )
    ).length;
  }

  private calculateDependencyRisk(commits: Commit[]): number {
    const dependencyCommits = commits.filter(commit => 
      commit.message.toLowerCase().includes('dependency') ||
      commit.message.toLowerCase().includes('package') ||
      commit.message.toLowerCase().includes('update') ||
      commit.message.toLowerCase().includes('upgrade')
    ).length;
    
    return Math.min((dependencyCommits / Math.max(commits.length, 1)) * 100, 100);
  }

  private calculateComplianceScore(commits: Commit[], suspiciousPatternCount: number): number {
    const baseScore = 100;
    const penaltyPerPattern = 10;
    return Math.max(0, baseScore - (suspiciousPatternCount * penaltyPerPattern));
  }

  private calculateCrossTeamContributions(commits: Commit[]): number {
    const uniqueAuthors = new Set(commits.map(c => c.author)).size;
    return Math.min(uniqueAuthors * 20, 100);
  }

  private calculateKnowledgeSharing(commits: Commit[]): number {
    const sharingCommits = commits.filter(commit => 
      commit.message.toLowerCase().includes('doc') ||
      commit.message.toLowerCase().includes('comment') ||
      commit.message.toLowerCase().includes('readme') ||
      commit.message.toLowerCase().includes('guide')
    ).length;
    
    return Math.min((sharingCommits / Math.max(commits.length, 1)) * 100, 100);
  }

  private calculateCodeReviewParticipation(commits: Commit[]): number {
    const reviewCommits = commits.filter(commit => 
      commit.message.toLowerCase().includes('review') ||
      commit.message.toLowerCase().includes('merge') ||
      commit.message.toLowerCase().includes('pr') ||
      commit.message.toLowerCase().includes('pull request')
    ).length;
    
    return Math.min((reviewCommits / Math.max(commits.length, 1)) * 100, 100);
  }

  private calculateMentorshipActivity(commits: Commit[]): number {
    const mentorshipCommits = commits.filter(commit => 
      commit.message.toLowerCase().includes('help') ||
      commit.message.toLowerCase().includes('guide') ||
      commit.message.toLowerCase().includes('example') ||
      commit.message.toLowerCase().includes('tutorial')
    ).length;
    
    return Math.min((mentorshipCommits / Math.max(commits.length, 1)) * 100, 100);
  }

  private calculateCommunicationFrequency(commits: Commit[]): number {
    // Base communication frequency on commit message quality and frequency
    const messageQuality = this.analyzeCommitMessageQuality(commits);
    const commitFrequency = commits.length > 0 ? Math.min(commits.length / 30, 1) * 100 : 0;
    
    return (messageQuality + commitFrequency) / 2;
  }

  private calculateConflictResolution(commits: Commit[]): number {
    const conflictCommits = commits.filter(commit => 
      commit.message.toLowerCase().includes('conflict') ||
      commit.message.toLowerCase().includes('merge') ||
      commit.message.toLowerCase().includes('resolve')
    ).length;
    
    return Math.min((conflictCommits / Math.max(commits.length, 1)) * 100, 100);
  }

  private calculateCodeComplexity(commits: Commit[]): number {
    const complexityCommits = commits.filter(commit => 
      commit.message.toLowerCase().includes('refactor') ||
      commit.message.toLowerCase().includes('simplify') ||
      commit.message.toLowerCase().includes('cleanup')
    ).length;
    
    return Math.min((complexityCommits / Math.max(commits.length, 1)) * 100, 100);
  }

  private detectDuplicateCode(commits: Commit[]): number {
    const duplicateCommits = commits.filter(commit => 
      commit.message.toLowerCase().includes('duplicate') ||
      commit.message.toLowerCase().includes('dry') ||
      commit.message.toLowerCase().includes('reuse')
    ).length;
    
    return Math.min((duplicateCommits / Math.max(commits.length, 1)) * 100, 100);
  }

  private countOutdatedDependencies(commits: Commit[]): number {
    return commits.filter(commit => 
      commit.message.toLowerCase().includes('update') ||
      commit.message.toLowerCase().includes('upgrade') ||
      commit.message.toLowerCase().includes('dependency')
    ).length;
  }

  private detectUnusedCode(commits: Commit[]): number {
    const cleanupCommits = commits.filter(commit => 
      commit.message.toLowerCase().includes('remove') ||
      commit.message.toLowerCase().includes('cleanup') ||
      commit.message.toLowerCase().includes('unused')
    ).length;
    
    return Math.min((cleanupCommits / Math.max(commits.length, 1)) * 100, 100);
  }

  private calculateTestDebt(commits: Commit[]): number {
    const testCommits = commits.filter(commit => 
      commit.message.toLowerCase().includes('test')
    ).length;
    
    const testCoverage = Math.min((testCommits / Math.max(commits.length, 1)) * 100, 100);
    return 100 - testCoverage; // Inverse of test coverage
  }

  private calculateDocumentationDebt(commits: Commit[]): number {
    const docCommits = commits.filter(commit => 
      commit.message.toLowerCase().includes('doc') ||
      commit.message.toLowerCase().includes('readme') ||
      commit.message.toLowerCase().includes('comment')
    ).length;
    
    const docCoverage = Math.min((docCommits / Math.max(commits.length, 1)) * 100, 100);
    return 100 - docCoverage; // Inverse of documentation coverage
  }

  private identifyRefactoringOpportunities(commits: Commit[]): string[] {
    const opportunities: string[] = [];
    
    const fixCommits = commits.filter(c => c.message.toLowerCase().includes('fix')).length;
    const refactorCommits = commits.filter(c => c.message.toLowerCase().includes('refactor')).length;
    const testCommits = commits.filter(c => c.message.toLowerCase().includes('test')).length;
    const docCommits = commits.filter(c => c.message.toLowerCase().includes('doc')).length;
    
    if (fixCommits > commits.length * 0.3) {
      opportunities.push('High bug fix ratio suggests code quality improvements needed');
    }
    
    if (refactorCommits < commits.length * 0.1) {
      opportunities.push('Low refactoring activity - consider code structure improvements');
    }
    
    if (testCommits < commits.length * 0.2) {
      opportunities.push('Insufficient test coverage - add missing unit tests');
    }
    
    if (docCommits < commits.length * 0.1) {
      opportunities.push('Poor documentation coverage - improve code comments and documentation');
    }
    
    return opportunities.length > 0 ? opportunities : ['Code appears well-maintained'];
  }
}

export const behavioralIntelligenceService = new BehavioralIntelligenceService();
