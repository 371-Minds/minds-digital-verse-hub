
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { GitBranch, Settings, Package, Rocket, FolderGit2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface SetupTask {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  category: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  dependencies?: string[];
}

const SetupStatus = () => {
  const [tasks, setTasks] = useState<SetupTask[]>([
    {
      id: '1',
      title: 'Set up as GitHub template repository',
      description: 'Configure the monorepo as a GitHub template for easy replication',
      status: 'pending',
      category: 'GitHub Setup',
      priority: 'high',
      estimatedTime: '2 hours'
    },
    {
      id: '2',
      title: 'Configure workspace settings',
      description: 'Set up IDE configurations, ESLint, Prettier, and TypeScript settings',
      status: 'pending',
      category: 'Development Environment',
      priority: 'high',
      estimatedTime: '3 hours'
    },
    {
      id: '3',
      title: 'Add shared dependencies',
      description: 'Install and configure shared packages across the monorepo',
      status: 'pending',
      category: 'Dependencies',
      priority: 'high',
      estimatedTime: '4 hours',
      dependencies: ['2']
    },
    {
      id: '4',
      title: 'Set up deployment pipelines',
      description: 'Configure CI/CD pipelines for automated testing and deployment',
      status: 'pending',
      category: 'DevOps',
      priority: 'high',
      estimatedTime: '6 hours',
      dependencies: ['1', '2']
    },
    {
      id: '5',
      title: 'Begin migrating existing applications',
      description: 'Start moving existing applications into the monorepo structure',
      status: 'pending',
      category: 'Migration',
      priority: 'medium',
      estimatedTime: '20 hours',
      dependencies: ['1', '2', '3', '4']
    },
    {
      id: '6',
      title: 'Configure Nx or Lerna workspace',
      description: 'Set up monorepo tooling for better dependency management',
      status: 'pending',
      category: 'Tooling',
      priority: 'medium',
      estimatedTime: '4 hours',
      dependencies: ['3']
    },
    {
      id: '7',
      title: 'Set up Docker configurations',
      description: 'Create Docker templates for consistent deployment',
      status: 'pending',
      category: 'Infrastructure',
      priority: 'medium',
      estimatedTime: '3 hours'
    },
    {
      id: '8',
      title: 'Configure monitoring and analytics',
      description: 'Set up application monitoring and analytics tracking',
      status: 'pending',
      category: 'Monitoring',
      priority: 'low',
      estimatedTime: '5 hours',
      dependencies: ['4']
    }
  ]);

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const getStatusIcon = (status: SetupTask['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColor = (status: SetupTask['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: SetupTask['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  const categories = Array.from(new Set(tasks.map(task => task.category)));

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Monorepo Setup Progress</span>
          </CardTitle>
          <CardDescription>
            Track the progress of setting up your 371 Minds monorepo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedTasks} of {totalTasks} tasks completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-center text-2xl font-bold text-green-600">
              {Math.round(progressPercentage)}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks by Category */}
      {categories.map(category => {
        const categoryTasks = tasks.filter(task => task.category === category);
        const categoryCompleted = categoryTasks.filter(task => task.status === 'completed').length;
        const categoryProgress = (categoryCompleted / categoryTasks.length) * 100;

        return (
          <Card key={category}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category}</CardTitle>
                <Badge variant="secondary">
                  {categoryCompleted}/{categoryTasks.length} completed
                </Badge>
              </div>
              <Progress value={categoryProgress} className="h-1" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryTasks.map(task => (
                  <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <div className="flex items-center space-x-2 mt-1">
                      <Checkbox
                        checked={task.status === 'completed'}
                        onCheckedChange={() => toggleTaskStatus(task.id)}
                      />
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{task.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>⏱️ {task.estimatedTime}</span>
                        {task.dependencies && (
                          <span>🔗 Depends on: {task.dependencies.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SetupStatus;
