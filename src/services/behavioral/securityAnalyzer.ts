
import { Commit } from '../types';
import { SecurityMetrics } from './types';

export class SecurityAnalyzer {
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
}
