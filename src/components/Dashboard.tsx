
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MonorepoStructure from './MonorepoStructure';
import SetupStatus from './SetupStatus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitBranch, Settings, FolderTree, Rocket, BarChart3, Users } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            371 Minds Digital Empire
          </h1>
          <p className="text-xl text-gray-600">
            Monorepo Management Dashboard - 40+ Applications
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="px-4 py-2">
              <GitBranch className="h-4 w-4 mr-2" />
              Monorepo Structure
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Settings className="h-4 w-4 mr-2" />
              Enterprise Scale
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Rocket className="h-4 w-4 mr-2" />
              Production Ready
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="structure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="structure" className="flex items-center space-x-2">
              <FolderTree className="h-4 w-4" />
              <span>Monorepo Structure</span>
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Setup Progress</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="space-y-6">
            <MonorepoStructure />
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            <SetupStatus />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive analytics and insights for your digital empire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Development Velocity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">85%</div>
                      <p className="text-xs text-muted-foreground">
                        Average completion rate across all verticals
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Code Quality Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">92/100</div>
                      <p className="text-xs text-muted-foreground">
                        Automated code quality assessment
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Infrastructure Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">98.5%</div>
                      <p className="text-xs text-muted-foreground">
                        System uptime and performance
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Next Steps Recommendations</h3>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• Complete GitHub template repository setup</li>
                    <li>• Configure shared dependencies and workspace settings</li>
                    <li>• Set up automated deployment pipelines</li>
                    <li>• Begin systematic application migration</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
