
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, GitFork, AlertCircle, Calendar } from 'lucide-react';
import { ProcessedRepo, PlatformConfig } from '@/services/types';
import { platformService } from '@/services/platformService';
import { toast } from "@/components/ui/use-toast";
import PlatformSettings from './PlatformSettings';

const MultiPlatformStructure = () => {
  const [config, setConfig] = useState<PlatformConfig | null>(null);

  const { data: repositories, isLoading, error, refetch } = useQuery({
    queryKey: ['repositories', config],
    queryFn: async () => {
      if (!config) return [];
      
      try {
        console.log('Fetching repositories with config:', config);
        return await platformService.fetchRepositories(config);
      } catch (error) {
        console.error('Error fetching repositories:', error);
        toast({
          title: "Error",
          description: `Failed to fetch repositories: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!config,
  });

  const handleConfigUpdate = (newConfig: PlatformConfig) => {
    console.log('Updating config:', newConfig);
    setConfig(newConfig);
    toast({
      title: "Fetching Repositories",
      description: `Loading repositories from ${newConfig.platform.charAt(0).toUpperCase() + newConfig.platform.slice(1)}...`,
    });
  };

  const getStatusColor = (status: ProcessedRepo['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'development':
        return 'bg-blue-500';
      case 'planning':
        return 'bg-yellow-500';
      case 'legacy':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'github':
        return 'bg-gray-900 text-white';
      case 'gitlab':
        return 'bg-orange-500 text-white';
      case 'bitbucket':
        return 'bg-blue-600 text-white';
      case 'azure':
        return 'bg-blue-700 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <PlatformSettings 
          onConfigUpdate={handleConfigUpdate}
          isLoading={isLoading}
          repoCount={repositories?.length || 0}
        />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Failed to load repositories. Please check your configuration and try again.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PlatformSettings 
        onConfigUpdate={handleConfigUpdate}
        isLoading={isLoading}
        repoCount={repositories?.length || 0}
      />

      {repositories && repositories.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {repositories.map((repo) => (
            <Card key={`${repo.platform}-${repo.name}`} className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>{repo.name}</span>
                      {repo.isPrivate && (
                        <Badge variant="outline" className="text-xs">
                          Private
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getPlatformBadgeColor(repo.platform)}>
                        {repo.platform.charAt(0).toUpperCase() + repo.platform.slice(1)}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(repo.status)}`} />
                      <span className="text-sm text-muted-foreground capitalize">{repo.status}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={repo.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <CardDescription className="mb-4 flex-1">
                  {repo.description}
                </CardDescription>
                
                {/* Technologies */}
                {repo.technologies.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {repo.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    {repo.platform !== 'bitbucket' && (
                      <>
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
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(repo.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {config && !isLoading && (!repositories || repositories.length === 0) && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>No repositories found. Try adjusting your search criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiPlatformStructure;
