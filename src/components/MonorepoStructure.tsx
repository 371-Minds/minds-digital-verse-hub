import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Folder, FolderOpen, GitBranch, Settings, Rocket, Code, Music, Briefcase, Gamepad2, Brain, GraduationCap, Scale, Database, BarChart3, Mail, Bot } from 'lucide-react';

interface Application {
  name: string;
  status: 'active' | 'development' | 'planning' | 'legacy';
  description: string;
  technologies: string[];
}

interface Vertical {
  name: string;
  icon: React.ElementType;
  color: string;
  applications: Application[];
  description: string;
}

const MonorepoStructure = () => {
  const [openVerticals, setOpenVerticals] = useState<string[]>(['developer-tools']);

  const verticals: Vertical[] = [
    {
      name: 'Developer Tools',
      icon: Code,
      color: 'bg-blue-500',
      description: 'Code generation, architecture, and development tools',
      applications: [
        { name: 'MetaForge', status: 'active', description: 'Meta-programming framework', technologies: ['React', 'TypeScript', 'AI'] },
        { name: 'Code Architect Vision', status: 'development', description: 'Visual code architecture tool', technologies: ['React', 'D3.js'] },
        { name: 'Repo Time Traveler Tool', status: 'planning', description: 'Git history visualization', technologies: ['React', 'Git API'] },
        { name: 'Tech Future Seer', status: 'active', description: 'Technology trend predictor', technologies: ['AI', 'Analytics'] },
        { name: 'Insight Lens Reports', status: 'active', description: 'Code quality insights', technologies: ['React', 'Charts'] }
      ]
    },
    {
      name: 'Music & Entertainment',
      icon: Music,
      color: 'bg-purple-500',
      description: 'Music creation, remixing, and entertainment platforms',
      applications: [
        { name: 'Rhythm Forge Galaxy', status: 'active', description: 'AI music composition', technologies: ['AI', 'Audio', 'React'] },
        { name: 'Lyric Lounge Remix', status: 'development', description: 'Collaborative lyric writing', technologies: ['React', 'WebSocket'] },
        { name: 'SongSpark AI Composer', status: 'active', description: 'AI-powered song creation', technologies: ['AI', 'Music Theory'] },
        { name: 'LyricLines Studio Forge', status: 'development', description: 'Professional lyric studio', technologies: ['React', 'Audio'] },
        { name: 'LyricAid Builder', status: 'planning', description: 'Lyric writing assistant', technologies: ['AI', 'NLP'] },
        { name: 'LyricLinesStore', status: 'active', description: 'Lyric marketplace', technologies: ['React', 'Commerce'] }
      ]
    },
    {
      name: 'Business Management',
      icon: Briefcase,
      color: 'bg-green-500',
      description: 'Business operations, management, and automation tools',
      applications: [
        { name: '371 Minds Platform', status: 'active', description: 'Core business platform', technologies: ['React', 'Node.js', 'AI'] },
        { name: 'ReadySetBuild', status: 'development', description: 'Business automation suite', technologies: ['React', 'Automation'] },
        { name: 'Crypto Merchant Launchpad', status: 'planning', description: 'Crypto payment integration', technologies: ['Blockchain', 'React'] },
        { name: 'CustomerServe', status: 'active', description: 'Customer service platform', technologies: ['React', 'AI', 'Chat'] },
        { name: 'Daycare Management', status: 'development', description: 'Childcare management system', technologies: ['React', 'Database'] }
      ]
    },
    {
      name: 'Games',
      icon: Gamepad2,
      color: 'bg-red-500',
      description: 'Interactive games and entertainment',
      applications: [
        { name: '100Men', status: 'development', description: 'Strategic battle game', technologies: ['React', 'WebGL', 'AI'] }
      ]
    },
    {
      name: 'AI & Productivity',
      icon: Brain,
      color: 'bg-indigo-500',
      description: 'AI-powered productivity and automation tools',
      applications: [
        { name: 'Ethics AI Stories', status: 'active', description: 'AI ethics education', technologies: ['AI', 'React', 'Education'] },
        { name: 'AI Clarity for Everyone', status: 'development', description: 'AI explanation platform', technologies: ['AI', 'React', 'NLP'] },
        { name: 'AutoML Power Kits', status: 'planning', description: 'No-code ML tools', technologies: ['ML', 'React', 'AutoML'] },
        { name: 'NoCode Template Conversions', status: 'active', description: 'Template conversion tools', technologies: ['React', 'Templates'] }
      ]
    },
    {
      name: 'Family & Education',
      icon: GraduationCap,
      color: 'bg-yellow-500',
      description: 'Educational tools and family-focused applications',
      applications: [
        { name: 'Cyber Superhero Academy', status: 'active', description: 'Digital safety education', technologies: ['React', 'Education', 'Gamification'] },
        { name: 'Little Zen Friends Club', status: 'development', description: 'Mindfulness for kids', technologies: ['React', 'Meditation'] },
        { name: 'Sprout Spark World', status: 'planning', description: 'Creative learning platform', technologies: ['React', 'Creative Tools'] },
        { name: 'Digital Parenting Compass', status: 'active', description: 'Parenting guidance app', technologies: ['React', 'AI', 'Education'] },
        { name: 'Kid Calm Connect', status: 'development', description: 'Child anxiety support', technologies: ['React', 'Mental Health'] },
        { name: 'Safe Kids Online', status: 'active', description: 'Online safety tools', technologies: ['React', 'Security'] }
      ]
    }
  ];

  const toggleVertical = (verticalName: string) => {
    setOpenVerticals(prev => 
      prev.includes(verticalName) 
        ? prev.filter(name => name !== verticalName)
        : [...prev, verticalName]
    );
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'legacy': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalApps = verticals.reduce((sum, vertical) => sum + vertical.applications.length, 0);
  const activeApps = verticals.reduce((sum, vertical) => 
    sum + vertical.applications.filter(app => app.status === 'active').length, 0
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApps}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeApps}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verticals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verticals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((activeApps / totalApps) * 100)}%</div>
            <Progress value={(activeApps / totalApps) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Verticals */}
      <div className="space-y-4">
        {verticals.map((vertical) => {
          const isOpen = openVerticals.includes(vertical.name.toLowerCase().replace(' ', '-'));
          const Icon = vertical.icon;
          
          return (
            <Card key={vertical.name} className="overflow-hidden">
              <Collapsible open={isOpen} onOpenChange={() => toggleVertical(vertical.name.toLowerCase().replace(' ', '-'))}>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${vertical.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <CardTitle className="text-lg">{vertical.name}</CardTitle>
                          <CardDescription>{vertical.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{vertical.applications.length} apps</Badge>
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vertical.applications.map((app) => (
                        <Card key={app.name} className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm">{app.name}</CardTitle>
                              <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                            </div>
                            <CardDescription className="text-xs">{app.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex flex-wrap gap-1">
                              {app.technologies.map((tech) => (
                                <Badge key={tech} variant="outline" className="text-xs px-2 py-0.5">
                                  {tech}
                                </Badge>
                              ))}
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
    </div>
  );
};

export default MonorepoStructure;
