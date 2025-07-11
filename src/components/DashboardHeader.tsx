
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, BarChart3, Users, TrendingUp } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-16 px-6 mb-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-4 animated-3d-text glow-text gradient-text">
          {title}
        </h1>
        
        <p className="text-xl md:text-2xl animated-3d-text-subtle glow-text-blue max-w-2xl mx-auto">
          {subtitle}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300">
            <CardHeader className="text-center pb-2">
              <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <CardTitle className="text-white animated-3d-text-small">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold animated-3d-text glow-text-cyan">1,234</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300">
            <CardHeader className="text-center pb-2">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <CardTitle className="text-white animated-3d-text-small">Growth Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold animated-3d-text glow-text-green">+24%</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300">
            <CardHeader className="text-center pb-2">
              <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <CardTitle className="text-white animated-3d-text-small">Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold animated-3d-text glow-text-yellow">87%</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
