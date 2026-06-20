
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import {
  User,
  Calendar,
  Clock,
  FileText,
  Printer,
  MessageSquare,
  Save,
  CheckCircle,
  Share2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { useQuoteStore } from '@/store/useQuoteStore';
import { formatPrice, formatDate } from '@/utils/calculator';
import type { ConsultationForm } from '@/types';

const LS_CONSULT_CACHE = 'dental_consult_cache_';

function toBase64(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return encodeURIComponent(str);
  }
}

function fromBase64(str: string): string | null {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    try {
      return decodeURIComponent(str);
    } catch {
      return null;
    }
  }
}

function safeParseConsultation(raw: any): ConsultationForm | null {
  try {
    if (!raw || typeof raw !== 'object') return null;
    const required = ['id', 'packageName', 'finalPrice', 'originalPrice', 'expiresAt'];
    for (const key of required) {
      if (raw[key] === undefined || raw[key] === null) return null;
    }
    return raw as ConsultationForm;
  } catch {
    return null;
  }
}

function decodeConsultationFromUrl(search: string): ConsultationForm | null {
  try {
    const params = new URLSearchParams(search);
    const data = params.get('d');
    if (!data) return null;
    const jsonStr = fromBase64(data);
    if (!jsonStr) return null;
    const parsed = JSON.parse(jsonStr);
    return safeParseConsultation(parsed);
  } catch {
    return null;
  }
}

function encodeConsultationToUrl(form: ConsultationForm): string {
  try {
    localStorage.setItem(LS_CONSULT_CACHE + form.id, JSON.stringify(form));
  } catch {}
  const jsonStr = JSON.stringify(form);
  const encoded = toBase64(jsonStr);
  return `/consultation/${form.id}?d=${encoded}`;
}

function loadFromCache(id: string): ConsultationForm | null {
  try {
    const raw = localStorage.getItem(LS_CONSULT_CACHE + id);
    if (!raw) return null;
    return safeParseConsultation(JSON.parse(raw));
  } catch {
    return null;
  }
}

export { encodeConsultationToUrl };

const Consultation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getConsultation } = useQuoteStore();
  const [fromUrl] = useState(() => new URLSearchParams(location.search).has('d'));

  const consultation = useMemo((): ConsultationForm | null => {
    if (!id) return null;
    const urlData = decodeConsultationFromUrl(location.search);
    if (urlData && urlData.id === id) {
      return urlData;
    }
    const cacheData = loadFromCache(id);
    if (cacheData && cacheData.id === id) {
      return cacheData;
    }
    const storeData = getConsultation(id);
    if (storeData) return storeData;
    return null;
  }, [id, location.search, getConsultation]);

  if (!consultation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="text-center">
          <FileText size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-slate-light mb-4">洽谈单不存在或已过期</p>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  const qrPath = encodeConsultationToUrl(consultation);
  const qrValue = `${(typeof window !== 'undefined' && window.location.origin) || ''}${qrPath}`;
  const discountAmount = consultation.originalPrice - consultation.finalPrice;
  const createdAt = new Date(consultation.createdAt);
  const expiresAt = new Date(consultation.expiresAt);
  const isExpired = new Date() > expiresAt;

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <PageHeader
        title="洽谈单"
        subtitle="患者扫码可查看详情"
        showBack
      />

      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto flex gap-8">
          {/* 左侧 - 洽谈单详情 */}
          <div className="flex-1 space-y-6">
            {/* 过期提示 */}
            {isExpired && (
              <div className="p-4 bg-coral-50 rounded-2xl flex items-center gap-3 text-coral animate-fade-in">
                <Clock size={20} />
                <div>
                  <p className="font-medium">此洽谈单已过期</p>
                  <p className="text-sm opacity-80">有效期至 {formatDate(expiresAt)}，请联系门诊重新获取报价</p>
                </div>
              </div>
            )}

            {/* 患者信息卡片 */}
            <div className="card p-6 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <User size={20} className="text-primary" />
                <h3 className="font-bold text-slate text-lg">患者信息</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-light mb-1">姓名</p>
                  <p className="font-medium text-slate text-lg">
                    {consultation.patientInfo?.name || '未填写'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-light mb-1">年龄</p>
                  <p className="font-medium text-slate text-lg">
                    {consultation.patientInfo?.age || '未填写'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-light mb-1">主诉</p>
                  <p className="font-medium text-slate text-lg truncate">
                    {consultation.patientInfo?.complaint || '未填写'}
                  </p>
                </div>
              </div>
            </div>

            {/* 项目信息 */}
            <div className="card p-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-mint" />
                <h3 className="font-bold text-slate text-lg">项目方案</h3>
              </div>

              <div className="bg-gradient-to-r from-primary-50 to-mint-50 rounded-2xl p-5 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-slate text-lg">{consultation.packageName}</p>
                    <p className="text-sm text-slate-light">
                      {consultation.selectedTier?.name || '标准'}方案
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">
                      ¥{formatPrice(consultation.finalPrice)}
                    </p>
                    {discountAmount > 0 && (
                      <p className="text-sm text-coral">
                        已优惠 ¥{formatPrice(discountAmount)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 配置详情 */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-slate-light">材料</span>
                  <span className="font-medium text-slate">
                    {consultation.materialName || '-'}
                  </span>
                </div>
                {consultation.toothCount > 0 && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-slate-light">牙位数量</span>
                    <span className="font-medium text-slate">{consultation.toothCount} 颗</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-slate-light">拍片检查</span>
                  <span className="font-medium text-slate">
                    {consultation.includesXray ? '包含' : '不包含'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-slate-light">复诊维护</span>
                  <span className="font-medium text-slate">
                    {consultation.includesFollowUp ? '包含' : '不包含'}
                  </span>
                </div>
              </div>

              {/* 包含项目 */}
              {consultation.selectedTier?.includes && consultation.selectedTier.includes.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-medium text-slate mb-3">包含项目</p>
                  <div className="grid grid-cols-2 gap-2">
                    {consultation.selectedTier.includes.map((item: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-mint flex-shrink-0" />
                        <span className="text-sm text-slate-light">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 优惠信息 */}
            {consultation.discount && (
              <div className="card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center">
                      <Share2 size={18} className="text-coral" />
                    </div>
                    <div>
                      <p className="font-medium text-slate">
                        {consultation.discount.name}
                      </p>
                      <p className="text-sm text-slate-light">
                        {consultation.discount.description || ''}
                      </p>
                    </div>
                  </div>
                  <span className="text-coral font-bold text-lg">
                    -¥{formatPrice(discountAmount)}
                  </span>
                </div>
              </div>
            )}

            {/* 时间信息 */}
            <div className="card p-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-primary" />
                  <div>
                    <p className="text-sm text-slate-light">创建时间</p>
                    <p className="font-medium text-slate">{formatDate(createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={20} className={isExpired ? 'text-coral' : 'text-mint'} />
                  <div>
                    <p className="text-sm text-slate-light">有效期至</p>
                    <p className={isExpired ? 'font-medium text-coral' : 'font-medium text-mint'}>
                      {formatDate(expiresAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧 - 二维码和操作 */}
          <div className="w-80 space-y-6">
            {/* 二维码卡片 */}
            <div className="card p-6 text-center animate-scale-in">
              <h3 className="font-bold text-slate text-lg mb-2">扫码查看洽谈单</h3>
              <p className="text-sm text-slate-light mb-6">患者扫码可保存或分享</p>

              <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mb-4">
                <QRCodeCanvas
                  value={qrValue}
                  size={200}
                  level="H"
                  includeMargin={false}
                  fgColor="#1E5F8A"
                />
              </div>

              <div className="bg-mint-50 rounded-2xl p-4 text-left">
                <div className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-mint-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate">电子洽谈单</p>
                    <p className="text-xs text-slate-light mt-0.5">
                      报价透明，避免口头承诺不一致
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按钮 - 仅在咨询师设备显示 */}
            {!fromUrl && (
              <div className="space-y-3">
                <Button variant="primary" fullWidth size="lg">
                  <Printer size={20} className="mr-2" />
                  打印洽谈单
                </Button>
                <Button variant="secondary" fullWidth>
                  <MessageSquare size={18} className="mr-2" />
                  发送短信给患者
                </Button>
                <Button variant="ghost" fullWidth>
                  <Save size={18} className="mr-2" />
                  保存到历史记录
                </Button>
              </div>
            )}

            {/* 温馨提示 */}
            <div className="bg-coral-50 rounded-2xl p-4">
              <p className="text-sm text-coral font-medium mb-1">温馨提示</p>
              <p className="text-xs text-coral/80 leading-relaxed">
                此报价为初步评估，最终治疗方案与费用以医生面诊结果为准。
                报价有效期7天，请在有效期内预约就诊。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Consultation;
