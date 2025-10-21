import { Upload, Database, BarChart3, Download, Shield, Zap } from 'lucide-react';

export const features = [
  {
    id: 'feature-1',
    icon: Upload,   // 👈 store component reference, not JSX
    title: 'Easy Upload',
    description: 'Streamlined data import process supporting multiple file formats.'
  },
  {
    id: 'feature-2',
    icon: Database,
    title: 'Smart Storage',
    description: 'Intelligent organization with advanced search capabilities.'
  },
  {
    id: 'feature-3',
    icon: BarChart3,
    title: 'Analytics',
    description: 'Built-in visualization tools for immediate insights.'
  },
  {
    id: 'feature-4',
    icon: Download,
    title: 'Export',
    description: 'Flexible export options in various standard formats.'
  },
  {
    id: 'feature-5',
    icon: Shield,
    title: 'Secure',
    description: 'Enterprise-grade security for sensitive data protection.'
  },
  {
    id: 'feature-6',
    icon: Zap,
    title: 'Performance',
    description: 'Optimized processing for large-scale dataset operations.'
  },
];
