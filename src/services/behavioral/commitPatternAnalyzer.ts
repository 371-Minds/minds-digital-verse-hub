
import { Commit } from '../types';
import { CommitPattern } from './types';

export class CommitPatternAnalyzer {
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
}
