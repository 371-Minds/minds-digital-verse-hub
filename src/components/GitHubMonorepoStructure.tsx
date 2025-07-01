
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Star, GitFork, AlertCircle, Lock } from 'lucide-react';
import { githubApi, ProcessedRepo } from '../services/githubApi';
import GitHubSettings from './GitHubSettings';

interface GroupedRepos {
  [key: string]: ProcessedRepo[];
}

const GitHubMonorepoStructure = () => {
  const [repos, setRepos] = useState<ProcessedRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<string[]>(['active']);

  const handleConfigUpdate = async (config: { username?: string; organization?: string; token?: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (config.token) {
        githubApi.setToken(config.token);
      }
      
      let githubRepos;
      if (config.username) {
        githubRepos = await githubApi.getUserRepos(config.username);
      } else if (config.organization) {
        githubRepos = await githubApi.getOrgRepos(config.organization);
      } else {
        throw new Error('Please provide either a username or organization');
      }
      
      const processedRepos = githubApi.processRepos(githubRepos);
      setRepos(processedRepos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
      console.error('GitHub API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    );
  };

  const getStatusColor = (status: ProcessedRepo['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'legacy': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Group repositories by status
  const groupedRepos: GroupedRepos = repos.reduce((acc, repo) => {
    if (!acc[repo.status]) {
      acc[repo.status] = [];
    }
    acc[repo.status].push(repo);
    return acc;
  }, {} as GroupedRepos);

  const totalRepos = repos.length;
  const activeRepos = repos.filter(repo => repo.status === 'active').length;

  if (repos.length === 0 && !isLoading) {
    return <GitHubSettings onConfigUpdate={handleConfigUpdate} isLoading={isLoading} repoCount={0} />;
  }

  return (
    <div className="space-y-6">
      {/* Settings Card - Always show for reconfiguration */}
      <GitHubSettings onConfigUpdate={handleConfigUpdate} isLoading={isLoading} repoCount={totalRepos} />

      {/* Error Display */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      {repos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRepos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeRepos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Stars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {repos.reduce((sum, repo) => sum + repo.stars, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Activity Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((activeRepos / totalRepos) * 100)}%</div>
              <Progress value={(activeRepos / totalRepos) * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Repository Groups */}
      {Object.entries(groupedRepos).map(([status, statusRepos]) => {
        const isOpen = openGroups.includes(status);
        
        return (
          <Card key={status} className="overflow-hidden">
            <Collapsible open={isOpen} onOpenChange={() => toggleGroup(status)}>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-left">
                        <CardTitle className="text-lg capitalize">{status} Repositories</CardTitle>
                        <CardDescription>
                          {status === 'active' && 'Recently updated and actively maintained'}
                          {status === 'development' && 'Currently being worked on'}
                          {status === 'planning' && 'In planning or early development phase'}
                          {status === 'legacy' && 'Archived or legacy repositories'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{statusRepos.length} repos</Badge>
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statusRepos.map((repo) => (
                      <Card key={repo.name} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center space-x-2">
                              <span>{repo.name}</span>
                              {repo.isPrivate && <Lock className="h-3 w-3" />}
                            </CardTitle>
                            <Badge className={getStatusColor(repo.status)}>{repo.status}</Badge>
                          </div>
                          <CardDescription className="text-xs">{repo.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          {/* Technologies */}
                          <div className="flex flex-wrap gap-1">
                            {repo.technologies.map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs px-2 py-0.5">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          
                          {/* Stats */}
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3" />
                              <span>{repo.stars}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <GitFork className="h-3 w-3" />
                              <span>{repo.forks}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <AlertCircle className="h-3 w-3" />
                              <span>{repo.issues}</span>
                            </div>
                          </div>
                          
                          {/* Last Updated */}
                          <div className="text-xs text-muted-foreground">
                            Updated: {new Date(repo.lastUpdated).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
};

export default GitHubMonorepoStructure;
