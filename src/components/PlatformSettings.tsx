
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Github, GitBranch, Key, User, Building } from 'lucide-react';
import { PlatformConfig } from '@/services/types';

interface PlatformSettingsProps {
  onConfigUpdate: (config: PlatformConfig) => void;
  isLoading: boolean;
  repoCount: number;
}

const PlatformSettings = ({ onConfigUpdate, isLoading, repoCount }: PlatformSettingsProps) => {
  const [platform, setPlatform] = useState<'github' | 'gitlab' | 'bitbucket' | 'azure'>('github');
  const [username, setUsername] = useState('');
  const [organization, setOrganization] = useState('');
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState<'user' | 'org'>('user');

  const handleFetchRepos = () => {
    const config: PlatformConfig = {
      platform,
      token: token || undefined
    };
    
    if (activeTab === 'user' && username) {
      config.username = username;
    } else if (activeTab === 'org' && organization) {
      config.organization = organization;
    }
    
    onConfigUpdate(config);
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case 'github':
        return <Github className="h-5 w-5" />;
      case 'gitlab':
        return <GitBranch className="h-5 w-5" />;
      case 'bitbucket':
        return <GitBranch className="h-5 w-5" />;
      case 'azure':
        return <GitBranch className="h-5 w-5" />;
      default:
        return <Github className="h-5 w-5" />;
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case 'github':
        return 'GitHub';
      case 'gitlab':
        return 'GitLab';
      case 'bitbucket':
        return 'Bitbucket';
      case 'azure':
        return 'Azure DevOps';
      default:
        return 'GitHub';
    }
  };

  const getTokenLink = () => {
    switch (platform) {
      case 'github':
        return 'https://github.com/settings/tokens';
      case 'gitlab':
        return 'https://gitlab.com/-/profile/personal_access_tokens';
      case 'bitbucket':
        return 'https://bitbucket.org/account/settings/app-passwords/';
      case 'azure':
        return 'https://dev.azure.com/_usersSettings/tokens';
      default:
        return 'https://github.com/settings/tokens';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getPlatformIcon()}
          <span>Multi-Platform Integration</span>
        </CardTitle>
        <CardDescription>
          Connect your repositories from GitHub, GitLab, Bitbucket, or Azure DevOps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platform Selection */}
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select value={platform} onValueChange={(value: any) => setPlatform(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="github">
                <div className="flex items-center space-x-2">
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </div>
              </SelectItem>
              <SelectItem value="gitlab">
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4" />
                  <span>GitLab</span>
                </div>
              </SelectItem>
              <SelectItem value="bitbucket">
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4" />
                  <span>Bitbucket</span>
                </div>
              </SelectItem>
              <SelectItem value="azure">
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4" />
                  <span>Azure DevOps</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tab Selection */}
        {platform !== 'azure' && (
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
        )}

        {/* Access Token */}
        <div className="space-y-2">
          <Label htmlFor="token" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>{getPlatformName()} Access Token {platform === 'bitbucket' ? '(App Password)' : '(Optional)'}</span>
          </Label>
          <Input
            id="token"
            type="password"
            placeholder={platform === 'bitbucket' ? 'App password' : 'Personal access token'}
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {platform === 'azure' ? 'Required for Azure DevOps.' : 'Optional: Increases rate limits and allows access to private repos.'}
            <a 
              href={getTokenLink()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline ml-1"
            >
              Generate token
            </a>
          </p>
        </div>

        {/* User/Organization Input */}
        {platform === 'azure' ? (
          <div className="space-y-2">
            <Label htmlFor="organization">Azure DevOps Organization</Label>
            <Input
              id="organization"
              placeholder="your-organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>
        ) : (
          <>
            {activeTab === 'user' ? (
              <div className="space-y-2">
                <Label htmlFor="username">{getPlatformName()} Username</Label>
                <Input
                  id="username"
                  placeholder={platform === 'gitlab' ? 'your-username' : 'octocat'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="organization">{getPlatformName()} Organization</Label>
                <Input
                  id="organization"
                  placeholder={platform === 'gitlab' ? 'group-name' : 'organization-name'}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </div>
            )}
          </>
        )}

        {/* Fetch Button */}
        <Button 
          onClick={handleFetchRepos} 
          disabled={isLoading || (!username && !organization) || (platform === 'azure' && !token)}
          className="w-full"
        >
          {isLoading ? 'Fetching Repositories...' : 'Fetch Repositories'}
        </Button>

        {/* Status */}
        {repoCount > 0 && (
          <div className="flex items-center justify-center">
            <Badge variant="secondary">
              {repoCount} repositories loaded from {getPlatformName()}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlatformSettings;
