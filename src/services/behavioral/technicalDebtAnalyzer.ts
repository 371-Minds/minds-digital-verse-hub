
import { ProcessedRepo, Commit } from '../types';
import { TechnicalDebtMetrics } from './types';

export class TechnicalDebtAnalyzer {
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
