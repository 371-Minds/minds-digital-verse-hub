
import { Commit } from '../types';
import { CollaborationSignals } from './types';

export class CollaborationAnalyzer {
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

  private calculateCommitMessageQuality(commits: Commit[]): number {
    if (commits.length === 0) return 0;
    
    let qualityScore = 0;
    
    commits.forEach(commit => {
      const message = commit.message;
      let score = 0;
      
      if (message.length > 10 && message.length < 100) score += 25;
      if (message[0] === message[0].toUpperCase()) score += 25;
      if (!message.endsWith('.')) score += 25;
      if (/^(fix|feat|chore|docs|style|refactor|test|perf|ci|build)(\(.+\))?:/.test(message.toLowerCase()) || message.split(' ').length > 2) {
        score += 25;
      }
      
      qualityScore += score;
    });
    
    return qualityScore / commits.length;
  }

  private calculateCommunicationFrequency(commits: Commit[]): number {
    const messageQuality = this.calculateCommitMessageQuality(commits);
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
}
