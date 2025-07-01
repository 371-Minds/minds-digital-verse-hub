
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Users, 
  Shield, 
  AlertCircle, 
  TrendingUp, 
  GitCommit,
  Clock,
  Code,
  FileText,
  MessageSquare
} from 'lucide-react';
import { platformService } from '@/services/platformService';
import { behavioralIntelligenceService, DeveloperActivity, RepositoryHealth, SecurityMetrics } from '@/services/behavioralIntelligence';
import { PlatformConfig } from '@/services/types';
import PlatformSettings from './PlatformSettings';

const BehavioralIntelligenceDashboard = () => {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [developerActivities, setDeveloperActivities] = useState<DeveloperActivity[]>([]);
  const [repositoryHealth, setRepositoryHealth] = useState<RepositoryHealth[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics[]>([]);

  const { data: repositories, isLoading } = useQuery({
    queryKey: ['behavioral-repositories', config],
    queryFn: async () => {
      if (!config) return [];
      return await platformService.fetchRepositories(config);
    },
    enabled: !!config,
  });

  useEffect(() => {
    const analyzeRepositories = async () => {
      if (!repositories || !config) return;

      const activities: DeveloperActivity[] = [];
      const healthMetrics: RepositoryHealth[] = [];
      const securityData: SecurityMetrics[] = [];

      for (const repo of repositories.slice(0, 5)) { // Limit for demo
        try {
          const [owner, repoName] = repo.name.includes('/') 
            ? repo.name.split('/') 
            : [config.username || config.organization || '', repo.name];
          
          const commits = await platformService.fetchCommits(
            config.platform, 
            owner, 
            repoName, 
            config.token
          );

          const devActivity = behavioralIntelligenceService.analyzeDeveloperActivity(commits);
          const health = behavioralIntelligenceService.analyzeRepositoryHealth(repo, commits);
          const security = behavioralIntelligenceService.detectSecurityPatterns(commits);

          activities.push(...devActivity);
          healthMetrics.push(health);
          securityData.push({ ...security, repoName: repo.name });
        } catch (error) {
          console.error(`Error analyzing ${repo.name}:`, error);
        }
      }

      setDeveloperActivities(activities);
      setRepositoryHealth(healthMetrics);
      setSecurityMetrics(securityData);
    };

    analyzeRepositories();
  }, [repositories, config]);

  const handleConfigUpdate = (newConfig: PlatformConfig) => {
    setConfig(newConfig);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { label: 'High', color: 'bg-green-500' };
    if (score >= 60) return { label: 'Medium', color: 'bg-yellow-500' };
    return { label: 'Low', color: 'bg-red-500' };
  };

  return (
    <div className="space-y-6">
      <PlatformSettings 
        onConfigUpdate={handleConfigUpdate}
        isLoading={isLoading}
        repoCount={repositories?.length || 0}
      />

      {repositories && repositories.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="developers">Developers</TabsTrigger>
            <TabsTrigger value="health">Repository Health</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Developers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{developerActivities.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {repositories.length} repositories
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Health Score</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {repositoryHealth.length > 0 
                      ? Math.round(repositoryHealth.reduce((sum, r) => sum + r.healthScore, 0) / repositoryHealth.length)
                      : 0
                    }%
                  </div>
                  <Progress 
                    value={repositoryHealth.length > 0 
                      ? repositoryHealth.reduce((sum, r) => sum + r.healthScore, 0) / repositoryHealth.length
                      : 0
                    } 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {securityMetrics.reduce((sum, s) => sum + s.suspiciousPatterns.length, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Suspicious patterns detected
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Technical Debt</CardTitle>
                  <Code className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {repositoryHealth.length > 0 
                      ? Math.round(repositoryHealth.reduce((sum, r) => sum + r.technicalDebtScore, 0) / repositoryHealth.length)
                      : 0
                    }%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average debt score
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="developers" className="space-y-4">
            <div className="grid gap-4">
              {developerActivities.map((dev, index) => {
                const engagement = getEngagementLevel(dev.engagementScore);
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{dev.name}</CardTitle>
                          <CardDescription>Developer Activity Profile</CardDescription>
                        </div>
                        <Badge className={`${engagement.color} text-white`}>
                          {engagement.label} Engagement
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <GitCommit className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{dev.totalCommits}</p>
                            <p className="text-xs text-muted-foreground">Total Commits</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {Math.round(dev.engagementScore)}%
                            </p>
                            <p className="text-xs text-muted-foreground">Engagement Score</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(dev.lastActivity).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">Last Activity</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{dev.filesModified}</p>
                            <p className="text-xs text-muted-foreground">Files Modified</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <div className="grid gap-4">
              {repositoryHealth.map((health, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{health.repoName}</CardTitle>
                        <CardDescription>Repository Health Metrics</CardDescription>
                      </div>
                      <div className={`text-2xl font-bold ${getHealthColor(health.healthScore)}`}>
                        {Math.round(health.healthScore)}%
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium">Active Developers</p>
                        <p className="text-2xl font-bold text-blue-600">{health.activeDevelopers}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Code Churn</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {Math.round(health.codeChurnRate)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Issue Resolution</p>
                        <p className="text-2xl font-bold text-green-600">
                          {Math.round(health.issueResolutionTime)}d
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Commit</p>
                        <p className="text-2xl font-bold text-gray-600">
                          {Math.round(health.lastCommitAge)}d
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Test Coverage</span>
                        <span>{Math.round(health.testCoverage)}%</span>
                      </div>
                      <Progress value={health.testCoverage} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Documentation</span>
                        <span>{Math.round(health.documentationScore)}%</span>
                      </div>
                      <Progress value={health.documentationScore} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid gap-4">
              {securityMetrics.map((security, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{security.repoName}</CardTitle>
                        <CardDescription>Security Analysis</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        {security.suspiciousPatterns.length > 0 && (
                          <Badge variant="destructive">
                            {security.suspiciousPatterns.length} Alerts
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {Math.round(security.complianceScore)}% Compliance
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-sm font-medium">{security.vulnerabilityCount}</p>
                          <p className="text-xs text-muted-foreground">Vulnerabilities</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="text-sm font-medium">{security.secretsExposed}</p>
                          <p className="text-xs text-muted-foreground">Exposed Secrets</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">{Math.round(security.dependencyRisk)}%</p>
                          <p className="text-xs text-muted-foreground">Dependency Risk</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(security.lastSecurityScan).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Last Scan</p>
                        </div>
                      </div>
                    </div>
                    
                    {security.suspiciousPatterns.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Suspicious Patterns Detected:</h4>
                        <div className="space-y-1">
                          {security.suspiciousPatterns.map((pattern, i) => (
                            <Badge key={i} variant="destructive" className="mr-2 mb-1">
                              {pattern}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cross-Team Development Workflows</CardTitle>
                <CardDescription>
                  Analysis of collaboration patterns and team interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Code Review Participation
                    </h4>
                    <Progress value={75} className="h-2" />
                    <p className="text-sm text-muted-foreground">75% participation rate</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Cross-Team Contributions
                    </h4>
                    <Progress value={60} className="h-2" />
                    <p className="text-sm text-muted-foreground">60% cross-team activity</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Knowledge Sharing
                    </h4>
                    <Progress value={80} className="h-2" />
                    <p className="text-sm text-muted-foreground">80% documentation coverage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default BehavioralIntelligenceDashboard;
