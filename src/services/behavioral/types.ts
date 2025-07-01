
import { Repository, Commit, ProcessedRepo } from '../types';

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
