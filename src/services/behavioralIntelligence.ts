
import { Repository, Commit, ProcessedRepo } from './types';
import { DeveloperAnalyzer } from './behavioral/developerAnalyzer';
import { CommitPatternAnalyzer } from './behavioral/commitPatternAnalyzer';
import { RepositoryHealthAnalyzer } from './behavioral/repositoryHealthAnalyzer';
import { SecurityAnalyzer } from './behavioral/securityAnalyzer';
import { CollaborationAnalyzer } from './behavioral/collaborationAnalyzer';
import { TechnicalDebtAnalyzer } from './behavioral/technicalDebtAnalyzer';

// Re-export types for backward compatibility
export type {
  DeveloperActivity,
  CommitPattern,
  RepositoryHealth,
  SecurityMetrics,
  CollaborationSignals,
  TechnicalDebtMetrics
} from './behavioral/types';

class BehavioralIntelligenceService {
  private developerAnalyzer = new DeveloperAnalyzer();
  private commitPatternAnalyzer = new CommitPatternAnalyzer();
  private repositoryHealthAnalyzer = new RepositoryHealthAnalyzer();
  private securityAnalyzer = new SecurityAnalyzer();
  private collaborationAnalyzer = new CollaborationAnalyzer();
  private technicalDebtAnalyzer = new TechnicalDebtAnalyzer();

  analyzeDeveloperActivity(commits: Commit[]) {
    return this.developerAnalyzer.analyzeDeveloperActivity(commits);
  }

  analyzeCommitPatterns(commits: Commit[]) {
    return this.commitPatternAnalyzer.analyzeCommitPatterns(commits);
  }

  analyzeRepositoryHealth(repo: ProcessedRepo, commits: Commit[]) {
    return this.repositoryHealthAnalyzer.analyzeRepositoryHealth(repo, commits);
  }

  detectSecurityPatterns(commits: Commit[]) {
    return this.securityAnalyzer.detectSecurityPatterns(commits);
  }

  analyzeCollaborationSignals(commits: Commit[]) {
    return this.collaborationAnalyzer.analyzeCollaborationSignals(commits);
  }

  analyzeTechnicalDebt(repo: ProcessedRepo, commits: Commit[]) {
    return this.technicalDebtAnalyzer.analyzeTechnicalDebt(repo, commits);
  }
}

export const behavioralIntelligenceService = new BehavioralIntelligenceService();
