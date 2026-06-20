
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Scissors,
  Scan,
  Tag,
  FileText,
  ChevronRight,
  AlertTriangle,
  ShieldCheck,
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
import { encodeConsultationToUrl } from '@/pages/Consultation';

const QuoteDetail: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [showDiscountPanel, setShowDiscountPanel] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const {
    currentConfig,
    selectedTierId,
    selectedDiscount,
    managerApproved,
    patientInfo,
    setConfig,
    setSelectedTier,
    setDiscount,
    setManagerApproved,
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

  const needsApproval = useMemo(() => {
    return selectedDiscount?.requiresManagerApproval === true;
  }, [selectedDiscount]);

  const discountApproved = useMemo(() => {
    return needsApproval ? managerApproved : true;
  }, [needsApproval, managerApproved]);

  const finalPrice = useMemo(() => {
    if (!selectedTier) return 0;
    if (!discountApproved) return selectedTier.totalPrice;
    return applyDiscount(selectedTier.totalPrice, selectedDiscount);
  }, [selectedTier, selectedDiscount, discountApproved]);

  const previewPrice = useMemo(() => {
    if (!selectedTier || !selectedDiscount) return 0;
    return applyDiscount(selectedTier.totalPrice, selectedDiscount);
  }, [selectedTier, selectedDiscount]);

  const discountAmount = useMemo(() => {
    if (!selectedTier) return 0;
    return selectedTier.totalPrice - finalPrice;
  }, [selectedTier, finalPrice]);

  const previewDiscountAmount = useMemo(() => {
    if (!selectedTier || !selectedDiscount) return 0;
    return selectedTier.totalPrice - previewPrice;
  }, [selectedTier, selectedDiscount, previewPrice]);

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

    if (needsApproval && !managerApproved) {
      setShowBlockModal(true);
      return;
    }

    const material = pkg.configOptions.materials.find(
      (m) => m.id === currentConfig.materialId
    );

    const effectiveDiscount = discountApproved ? selectedDiscount : null;
    const effectiveFinalPrice = effectiveDiscount
      ? applyDiscount(selectedTier.totalPrice, effectiveDiscount)
      : selectedTier.totalPrice;

    const form = createConsultation({
      packageId: pkg.id,
      packageName: pkg.name,
      tier: selectedTier,
      finalPrice: effectiveFinalPrice,
      originalPrice: selectedTier.totalPrice,
      toothCount: currentConfig.toothCount,
      materialName: material?.name || '',
      includesXray: currentConfig.includesXray,
      includesFollowUp: currentConfig.includesFollowUp,
      discount: effectiveDiscount,
    });

    navigate(encodeConsultationToUrl(form));
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
                      {selectedDiscount
                        ? needsApproval && !managerApproved
                          ? `${selectedDiscount.name}（测算中）`
                          : selectedDiscount.name
                        : '暂未使用优惠'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedDiscount && needsApproval && !managerApproved && previewDiscountAmount > 0 && (
                    <span className="text-coral/60 font-medium text-sm">
                      测算 -¥{formatPrice(previewDiscountAmount)}
                    </span>
                  )}
                  {discountAmount > 0 && discountApproved && (
                    <span className="text-coral font-bold">-¥{formatPrice(discountAmount)}</span>
                  )}
                  <ChevronRight size={20} className="text-slate-light" />
                </div>
              </div>
              {/* 未授权优惠提示 */}
              {selectedDiscount && needsApproval && !managerApproved && (
                <div className="mt-3 p-3 bg-coral-50 rounded-xl flex items-center gap-2 text-coral text-sm">
                  <AlertTriangle size={16} />
                  <span>该优惠需主管确认，当前仅做测算展示，不计入成交价</span>
                </div>
              )}
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
                  <p className="text-sm text-slate-light">
                    {needsApproval && !managerApproved ? '测算价（待确认）' : '已选方案总价'}
                  </p>
                  <p className={needsApproval && !managerApproved ? 'text-3xl font-bold text-coral/60' : 'text-3xl font-bold text-primary'}>
                    ¥{formatPrice(finalPrice)}
                  </p>
                  {needsApproval && !managerApproved && previewDiscountAmount > 0 && (
                    <p className="text-sm text-coral/60">
                      确认后可享 -¥{formatPrice(previewDiscountAmount)}
                    </p>
                  )}
                  {discountAmount > 0 && discountApproved && (
                    <p className="text-sm text-coral">
                      已优惠 ¥{formatPrice(discountAmount)}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 三档报价卡片 - 始终按成交价展示（不含未授权优惠） */}
            <div className="grid grid-cols-3 gap-5 mb-8">
              {quoteResult?.tiers.map((tier, index) => {
                const tierFinalPrice = discountApproved
                  ? applyDiscount(tier.totalPrice, selectedDiscount as AnyDiscount)
                  : tier.totalPrice;
                const tierPreviewPrice = selectedDiscount
                  ? applyDiscount(tier.totalPrice, selectedDiscount as AnyDiscount)
                  : tier.totalPrice;

                return (
                  <QuoteTierCard
                    key={tier.id}
                    tier={{
                      ...tier,
                      totalPrice: tierFinalPrice,
                      originalPrice: tier.totalPrice,
                      previewPrice: needsApproval && !managerApproved && tierPreviewPrice !== tierFinalPrice
                        ? tierPreviewPrice
                        : undefined,
                    }}
                    isSelected={selectedTierId === tier.id}
                    isHighlighted={tier.id === 'tier-standard'}
                    onSelect={() => setSelectedTier(tier.id)}
                    delay={index * 100}
                  />
                );
              })}
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

                  {/* 已授权优惠 - 正常显示 */}
                  {discountAmount > 0 && discountApproved && (
                    <div className="flex justify-between text-coral">
                      <span>{selectedDiscount?.name}</span>
                      <span>-¥{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  {/* 未授权优惠 - 测算展示 */}
                  {needsApproval && !managerApproved && selectedDiscount && previewDiscountAmount > 0 && (
                    <div className="flex justify-between text-coral/50">
                      <span className="flex items-center gap-1">
                        {selectedDiscount.name}
                        <span className="text-xs bg-coral/10 text-coral px-1.5 py-0.5 rounded">测算</span>
                      </span>
                      <span>-¥{formatPrice(previewDiscountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-100 flex justify-between">
                    <span className="font-medium text-slate">
                      {needsApproval && !managerApproved ? '成交价（不含待确认优惠）' : '合计'}
                    </span>
                    <span className="text-xl font-bold text-primary">¥{formatPrice(finalPrice)}</span>
                  </div>

                  {/* 测算价对比提示 */}
                  {needsApproval && !managerApproved && previewDiscountAmount > 0 && (
                    <div className="p-3 bg-coral-50 rounded-xl flex items-center gap-2 text-coral text-xs">
                      <AlertTriangle size={14} />
                      <span>
                        主管确认后成交价可降至 ¥{formatPrice(previewPrice)}（再减 ¥{formatPrice(previewDiscountAmount)}）
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 生成洽谈单按钮 */}
            <div className="mt-6">
              {needsApproval && !managerApproved ? (
              <div className="p-4 bg-coral-50 rounded-2xl mb-3 flex items-start gap-3">
                <AlertTriangle size={20} className="text-coral flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-coral font-medium mb-0.5">当前优惠需主管确认</p>
                  <p className="text-coral/70 text-sm">
                    该优惠「{selectedDiscount?.name}」尚未授权，无法直接生成洽谈单。请先联系主管确认，或到上方「优惠调整」中清除该优惠后再生成。
                  </p>
                </div>
              </div>
            ) : null}

              <Button
                size="lg"
                fullWidth
                onClick={handleGenerateForm}
                disabled={!selectedTier || (needsApproval && !managerApproved)}
              >
                <FileText size={20} className="mr-2" />
                {needsApproval && !managerApproved ? '优惠待主管确认' : '生成洽谈单'}
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
        managerApproved={managerApproved}
        onSelectDiscount={(discount) => setDiscount(discount)}
        onManagerApprove={() => setManagerApproved(true)}
      />

      {/* 拦截弹窗 */}
      {showBlockModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowBlockModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-6 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-coral-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-coral" />
              </div>
              <h3 className="text-xl font-bold text-slate mb-2">优惠待主管确认</h3>
              <p className="text-slate-light mb-6">
                当前选用的「{selectedDiscount?.name}」需主管确认后方可生效。
                请联系主管完成授权，或移除该优惠后生成洽谈单。
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    setDiscount(null);
                    setShowBlockModal(false);
                  }}
                >
                  移除优惠并生成
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    setManagerApproved(true);
                    setShowBlockModal(false);
                  }}
                >
                  <ShieldCheck size={18} className="mr-2" />
                  主管已确认
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteDetail;
