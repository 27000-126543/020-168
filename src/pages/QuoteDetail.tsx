
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Scissors,
  Scan,
  CalendarCheck,
  Tag,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { NumberStepper } from '@/components/ui/NumberStepper';
import { SegmentControl } from '@/components/ui/SegmentControl';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { QuoteTierCard } from '@/components/quote/QuoteTierCard';
import { DiscountPanel } from '@/components/quote/DiscountPanel';
import { Button } from '@/components/ui/Button';
import { packages } from '@/data/packages';
import { useQuoteStore } from '@/store/useQuoteStore';
import { calculateQuote, applyDiscount, formatPrice } from '@/utils/calculator';
import type { QuoteTier, AnyDiscount } from '@/types';

const QuoteDetail: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [showDiscountPanel, setShowDiscountPanel] = useState(false);

  const {
    currentConfig,
    selectedTierId,
    selectedDiscount,
    patientInfo,
    setConfig,
    setSelectedTier,
    setDiscount,
    setPatientInfo,
    createConsultation,
  } = useQuoteStore();

  const pkg = useMemo(
    () => packages.find((p) => p.id === packageId),
    [packageId]
  );

  useEffect(() => {
    if (pkg) {
      const defaultMaterial = pkg.configOptions.materials.find(
        (m) => m.level === 'standard'
      ) || pkg.configOptions.materials[0];
      
      setConfig({
        packageId: pkg.id,
        toothCount: pkg.configOptions.toothCount?.default || 1,
        materialId: defaultMaterial.id,
        includesXray: pkg.configOptions.includesXray,
        includesFollowUp: pkg.configOptions.includesFollowUp,
      });
      
      setSelectedTier('tier-standard');
      setDiscount(null);
    }
  }, [packageId, pkg, setConfig, setSelectedTier, setDiscount]);

  const quoteResult = useMemo(() => {
    if (!pkg) return null;
    return calculateQuote(pkg, currentConfig);
  }, [pkg, currentConfig]);

  const selectedTier = useMemo((): QuoteTier | null => {
    if (!quoteResult?.tiers) return null;
    return quoteResult.tiers.find((t) => t.id === selectedTierId) || null;
  }, [quoteResult, selectedTierId]);

  const finalPrice = useMemo(() => {
    if (!selectedTier) return 0;
    return applyDiscount(selectedTier.totalPrice, selectedDiscount);
  }, [selectedTier, selectedDiscount]);

  const discountAmount = useMemo(() => {
    if (!selectedTier) return 0;
    return selectedTier.totalPrice - finalPrice;
  }, [selectedTier, finalPrice]);

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-light">套餐不存在</p>
      </div>
    );
  }

  const materialOptions = pkg.configOptions.materials.map((m) => ({
    id: m.id,
    label: m.name,
    description: `¥${formatPrice(m.basePrice)}/颗`,
  }));

  const handleGenerateForm = () => {
    if (!selectedTier) return;

    const material = pkg.configOptions.materials.find(
      (m) => m.id === currentConfig.materialId
    );

    const form = createConsultation({
      packageId: pkg.id,
      packageName: pkg.name,
      tier: selectedTier,
      finalPrice,
      originalPrice: selectedTier.totalPrice,
      toothCount: currentConfig.toothCount,
      materialName: material?.name || '',
      includesXray: currentConfig.includesXray,
      includesFollowUp: currentConfig.includesFollowUp,
    });

    navigate(`/consultation/${form.id}`);
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <PageHeader
        title={pkg.name}
        subtitle={pkg.description}
        showBack
        rightContent={
          <div className="flex items-center gap-2">
            <User size={18} className="text-slate-light" />
            <span className="text-sm text-slate-light">张医生</span>
          </div>
        }
      />

      <main className="flex-1 overflow-auto">
        <div className="flex h-full">
          {/* 左侧配置区 */}
          <div className="w-2/5 p-6 border-r border-gray-100 overflow-y-auto">
            {/* 患者信息 */}
            <div className="card p-5 mb-6 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <User size={20} className="text-primary" />
                <h3 className="font-bold text-slate">患者信息</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-light mb-1 block">姓名</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="请输入"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({ name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-light mb-1 block">年龄</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="请输入"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo({ age: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-slate-light mb-1 block">主诉</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="如：牙齿不齐想矫正"
                    value={patientInfo.complaint}
                    onChange={(e) => setPatientInfo({ complaint: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 牙位数量 */}
            {pkg.configOptions.toothCount && (
              <div className="card p-5 mb-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Scissors size={20} className="text-mint" />
                  <h3 className="font-bold text-slate">牙位数量</h3>
                </div>
                <NumberStepper
                  value={currentConfig.toothCount}
                  min={pkg.configOptions.toothCount.min}
                  max={pkg.configOptions.toothCount.max}
                  onChange={(val) => setConfig({ toothCount: val })}
                  unit="颗"
                />
              </div>
            )}

            {/* 材料档次 */}
            <div className="card p-5 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <Tag size={20} className="text-coral" />
                <h3 className="font-bold text-slate">材料档次</h3>
              </div>
              <SegmentControl
                options={materialOptions}
                value={currentConfig.materialId}
                onChange={(val) => setConfig({ materialId: val })}
              />
              {pkg.configOptions.materials.find((m) => m.id === currentConfig.materialId) && (
                <p className="text-sm text-slate-light mt-3">
                  {pkg.configOptions.materials.find((m) => m.id === currentConfig.materialId)?.description}
                </p>
              )}
            </div>

            {/* 附加项目 */}
            <div className="card p-5 mb-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <Scan size={20} className="text-primary" />
                <h3 className="font-bold text-slate">附加项目</h3>
              </div>
              <div className="space-y-4">
                {pkg.configOptions.includesXray && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="font-medium text-slate">拍片检查</p>
                      <p className="text-sm text-slate-light">全景片 + 口腔CT</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-medium">
                        +¥{formatPrice(pkg.configOptions.xrayPrice || 0)}
                      </span>
                      <ToggleSwitch
                        checked={currentConfig.includesXray}
                        onChange={(val) => setConfig({ includesXray: val })}
                      />
                    </div>
                  </div>
                )}

                {pkg.configOptions.includesFollowUp && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="font-medium text-slate">复诊维护</p>
                      <p className="text-sm text-slate-light">定期复查 + 维护</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-medium">
                        +¥{formatPrice(pkg.configOptions.followUpPrice || 0)}
                      </span>
                      <ToggleSwitch
                        checked={currentConfig.includesFollowUp}
                        onChange={(val) => setConfig({ includesFollowUp: val })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 优惠调整入口 */}
            <div
              className="card p-5 cursor-pointer hover:shadow-card-hover transition-shadow animate-slide-up"
              style={{ animationDelay: '200ms' }}
              onClick={() => setShowDiscountPanel(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-mint-50 flex items-center justify-center">
                    <Tag size={22} className="text-mint" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate">优惠调整</h3>
                    <p className="text-sm text-slate-light">
                      {selectedDiscount ? selectedDiscount.name : '暂未使用优惠'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {discountAmount > 0 && (
                    <span className="text-coral font-bold">-¥{formatPrice(discountAmount)}</span>
                  )}
                  <ChevronRight size={20} className="text-slate-light" />
                </div>
              </div>
            </div>
          </div>

          {/* 右侧报价展示区 */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* 三档报价标题 */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate">方案报价</h3>
                <p className="text-sm text-slate-light mt-1">点击选择适合患者的方案</p>
              </div>
              {selectedTier && (
                <div className="text-right">
                  <p className="text-sm text-slate-light">已选方案总价</p>
                  <p className="text-3xl font-bold text-primary">
                    ¥{formatPrice(finalPrice)}
                  </p>
                  {discountAmount > 0 && (
                    <p className="text-sm text-coral">
                      已优惠 ¥{formatPrice(discountAmount)}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 三档报价卡片 */}
            <div className="grid grid-cols-3 gap-5 mb-8">
              {quoteResult?.tiers.map((tier, index) => (
                <QuoteTierCard
                  key={tier.id}
                  tier={{
                    ...tier,
                    totalPrice: applyDiscount(tier.totalPrice, selectedDiscount as AnyDiscount),
                    originalPrice: tier.totalPrice,
                  }}
                  isSelected={selectedTierId === tier.id}
                  isHighlighted={tier.id === 'tier-standard'}
                  onSelect={() => setSelectedTier(tier.id)}
                  delay={index * 100}
                />
              ))}
            </div>

            {/* 费用明细 */}
            {selectedTier && (
              <div className="card p-6 animate-fade-in">
                <h4 className="font-bold text-slate mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  费用明细
                </h4>
                <div className="space-y-3 text-sm">
                  {pkg.configOptions.toothCount && (
                    <div className="flex justify-between">
                      <span className="text-slate-light">
                        {pkg.configOptions.materials.find((m) => m.id === currentConfig.materialId)?.name} × {currentConfig.toothCount}颗
                      </span>
                      <span className="text-slate">
                        ¥{formatPrice(
                          (pkg.configOptions.materials.find((m) => m.id === currentConfig.materialId)?.basePrice || 0) *
                            currentConfig.toothCount
                        )}
                      </span>
                    </div>
                  )}
                  {currentConfig.includesXray && (
                    <div className="flex justify-between">
                      <span className="text-slate-light">拍片检查</span>
                      <span className="text-slate">¥{formatPrice(quoteResult?.xrayPrice || 0)}</span>
                    </div>
                  )}
                  {currentConfig.includesFollowUp && (
                    <div className="flex justify-between">
                      <span className="text-slate-light">复诊维护</span>
                      <span className="text-slate">¥{formatPrice(quoteResult?.followUpPrice || 0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-light">方案等级</span>
                    <span className="text-slate">{selectedTier.name}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-coral">
                      <span>{selectedDiscount?.name}</span>
                      <span>-¥{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-100 flex justify-between">
                    <span className="font-medium text-slate">合计</span>
                    <span className="text-xl font-bold text-primary">¥{formatPrice(finalPrice)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 生成洽谈单按钮 */}
            <div className="mt-6">
              <Button
                size="lg"
                fullWidth
                onClick={handleGenerateForm}
                disabled={!selectedTier}
              >
                <FileText size={20} className="mr-2" />
                生成洽谈单
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* 优惠面板 */}
      <DiscountPanel
        isOpen={showDiscountPanel}
        onClose={() => setShowDiscountPanel(false)}
        originalPrice={selectedTier?.totalPrice || 0}
        selectedDiscount={selectedDiscount as AnyDiscount}
        onSelectDiscount={(discount) => setDiscount(discount)}
      />
    </div>
  );
};

export default QuoteDetail;
