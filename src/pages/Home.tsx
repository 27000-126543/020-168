
import React from 'react';
import { History, Calculator, FileText } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PackageCard } from '@/components/package/PackageCard';
import { packages } from '@/data/packages';

const Home: React.FC = () => {
  const quickActions = [
    { icon: History, label: '历史记录', color: 'text-mint bg-mint-50' },
    { icon: Calculator, label: '快速计算', color: 'text-coral bg-coral-50' },
    { icon: FileText, label: '常用模板', color: 'text-primary bg-primary-50' },
  ];

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <PageHeader
        title="口腔报价助手"
        subtitle="专业 · 透明 · 高效"
        rightContent={
          <span className="text-sm text-slate-light">张医生</span>
        }
      />

      <main className="flex-1 p-8 overflow-auto">
        {/* 欢迎区域 */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-slate mb-2">
            早上好，张医生 👋
          </h2>
          <p className="text-slate-light">
            请选择咨询项目，为患者生成专属报价方案
          </p>
        </div>

        {/* 快捷操作 */}
        <div className="flex gap-4 mb-10">
          {quickActions.map((action, index) => (
            <button
              key={action.label}
              className="card card-hover flex items-center gap-3 px-6 py-4 animate-slide-up"
              style={{ animationDelay: `${100 + index * 50}ms` }}
            >
              <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center`}>
                <action.icon size={24} />
              </div>
              <span className="font-medium text-slate">{action.label}</span>
            </button>
          ))}
        </div>

        {/* 套餐卡片标题 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate">咨询项目</h3>
          <span className="text-sm text-slate-light">共 {packages.length} 个套餐</span>
        </div>

        {/* 套餐卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              delay={200 + index * 100}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
