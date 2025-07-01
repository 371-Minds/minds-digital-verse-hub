
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Github, Key, User, Building } from 'lucide-react';

interface GitHubSettingsProps {
  onConfigUpdate: (config: { username?: string; organization?: string; token?: string }) => void;
  isLoading: boolean;
  repoCount: number;
}

const GitHubSettings = ({ onConfigUpdate, isLoading, repoCount }: GitHubSettingsProps) => {
  const [username, setUsername] = useState('');
  const [organization, setOrganization] = useState('');
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState<'user' | 'org'>('user');

  const handleFetchRepos = () => {
    const config: { username?: string; organization?: string; token?: string } = {};
    
    if (activeTab === 'user' && username) {
      config.username = username;
    } else if (activeTab === 'org' && organization) {
      config.organization = organization;
    }
    
    if (token) {
      config.token = token;
    }
    
    onConfigUpdate(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Github className="h-5 w-5" />
          <span>GitHub Integration</span>
        </CardTitle>
        <CardDescription>
          Connect your GitHub repositories to populate the dashboard with real data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tab Selection */}
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'user' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('user')}
          >
            <User className="h-4 w-4 mr-2" />
            User Repos
          </Button>
          <Button
            variant={activeTab === 'org' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('org')}
          >
            <Building className="h-4 w-4 mr-2" />
            Organization Repos
          </Button>
        </div>

        {/* GitHub Token */}
        <div className="space-y-2">
          <Label htmlFor="token" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>GitHub Personal Access Token (Optional)</span>
          </Label>
          <Input
            id="token"
            type="password"
            placeholder="ghp_xxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Optional: Increases rate limits and allows access to private repos. 
            <a 
              href="https://github.com/settings/tokens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline ml-1"
            >
              Generate token
            </a>
          </p>
        </div>

        {/* User/Organization Input */}
        {activeTab === 'user' ? (
          <div className="space-y-2">
            <Label htmlFor="username">GitHub Username</Label>
            <Input
              id="username"
              placeholder="octocat"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="organization">GitHub Organization</Label>
            <Input
              id="organization"
              placeholder="github"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>
        )}

        {/* Fetch Button */}
        <Button 
          onClick={handleFetchRepos} 
          disabled={isLoading || (!username && !organization)}
          className="w-full"
        >
          {isLoading ? 'Fetching Repositories...' : 'Fetch Repositories'}
        </Button>

        {/* Status */}
        {repoCount > 0 && (
          <div className="flex items-center justify-center">
            <Badge variant="secondary">
              {repoCount} repositories loaded
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GitHubSettings;
