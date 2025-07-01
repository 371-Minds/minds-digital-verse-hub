
import { Commit } from '../types';
import { DeveloperActivity } from './types';

export class DeveloperAnalyzer {
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
}
