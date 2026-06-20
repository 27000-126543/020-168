
import type { DentalPackage, AnyDiscount } from '@/types';

export const packages: DentalPackage[] = [
  {
    id: 'child-fluoride',
    name: '儿童涂氟窝沟封闭',
    category: 'child',
    description: '保护儿童乳牙，预防龋齿',
    icon: 'Baby',
    gradientFrom: '#A8E6CF',
    gradientTo: '#56C596',
    priceRange: { min: 200, max: 1200 },
    configOptions: {
      toothCount: { min: 1, max: 8, default: 4 },
      materials: [
        { id: 'child-basic', name: '国产氟保护漆', level: 'basic', basePrice: 50, description: '经济实惠，基础防龋' },
        { id: 'child-standard', name: '进口氟保护漆', level: 'standard', basePrice: 80, description: '温和不刺激，效果持久' },
        { id: 'child-premium', name: '含氟窝沟封闭剂', level: 'premium', basePrice: 150, description: '双重防护，封闭+涂氟' }
      ],
      includesXray: true,
      includesFollowUp: true,
      xrayPrice: 80,
      followUpPrice: 100
    },
    tiers: [
      {
        id: 'tier-economy',
        name: '经济款',
        tagline: '基础防护',
        multiplier: 1,
        includes: ['涂氟操作', '基础材料', '口腔检查一次'],
        excludes: ['窝沟封闭', '定期复查', '全口洁牙'],
        salesPitch: '适合刚长牙的小朋友，做基础防龋保护。'
      },
      {
        id: 'tier-standard',
        name: '标准款',
        tagline: '全面防护',
        multiplier: 1.3,
        includes: ['涂氟操作', '进口材料', '窝沟封闭', '口腔检查', '半年复查一次'],
        excludes: ['全口洁牙', '龋齿治疗'],
        salesPitch: '最受欢迎的选择，涂氟加封闭双重保护，半年复查更放心。'
      },
      {
        id: 'tier-premium',
        name: '尊享款',
        tagline: '全程守护',
        multiplier: 1.6,
        includes: ['涂氟操作', '高端材料', '窝沟封闭', '全口洁牙', '一年三次复查', '龋齿早期干预'],
        excludes: ['根管治疗', '拔牙'],
        salesPitch: '一站式儿童口腔护理套餐，全年守护牙齿健康。'
      }
    ]
  },
  {
    id: 'adult-cleaning',
    name: '成人洁牙美白',
    category: 'adult',
    description: '清洁牙齿，提亮笑容',
    icon: 'Sparkles',
    gradientFrom: '#FDCB6E',
    gradientTo: '#F39C12',
    priceRange: { min: 199, max: 3999 },
    configOptions: {
      materials: [
        { id: 'adult-basic', name: '超声波洁牙', level: 'basic', basePrice: 199, description: '基础清洁，去除牙结石' },
        { id: 'adult-standard', name: '喷砂洁牙', level: 'standard', basePrice: 399, description: '深度清洁，去除色素' },
        { id: 'adult-premium', name: '冷光美白', level: 'premium', basePrice: 1999, description: '快速美白，提升色阶' }
      ],
      includesXray: true,
      includesFollowUp: true,
      xrayPrice: 120,
      followUpPrice: 150
    },
    tiers: [
      {
        id: 'tier-economy',
        name: '经济款',
        tagline: '基础清洁',
        multiplier: 1,
        includes: ['超声波洁牙', '全口抛光', '口腔检查'],
        excludes: ['喷砂美白', '牙周治疗', '全景片'],
        salesPitch: '适合日常口腔维护，定期洁牙保持健康。'
      },
      {
        id: 'tier-standard',
        name: '标准款',
        tagline: '深度清洁',
        multiplier: 1.2,
        includes: ['喷砂洁牙', '超声波洁牙', '全口抛光', '全景片', '牙周护理', '一次复查'],
        excludes: ['冷光美白', '贴面修复'],
        salesPitch: '咖啡、茶渍人群首选，深层清洁还原牙齿本色。'
      },
      {
        id: 'tier-premium',
        name: '尊享款',
        tagline: '亮白笑容',
        multiplier: 2.5,
        includes: ['冷光美白', '喷砂洁牙', '超声波洁牙', '全口抛光', '全景片', '牙周护理', '三次复查', '美白脱敏'],
        excludes: ['瓷贴面', '烤瓷冠'],
        salesPitch: '婚礼、面试、重要场合前的必备项目，快速提升自信。'
      }
    ]
  },
  {
    id: 'implant-restoration',
    name: '缺牙种植修复',
    category: 'implant',
    description: '修复缺牙，恢复咀嚼',
    icon: 'Heart',
    gradientFrom: '#74B9FF',
    gradientTo: '#0984E3',
    priceRange: { min: 3000, max: 18000 },
    configOptions: {
      toothCount: { min: 1, max: 6, default: 1 },
      materials: [
        { id: 'implant-basic', name: '国产种植体', level: 'basic', basePrice: 3000, description: '性价比高，适合多颗种植' },
        { id: 'implant-standard', name: '韩系种植体', level: 'standard', basePrice: 6000, description: '技术成熟，临床应用广' },
        { id: 'implant-premium', name: '瑞士种植体', level: 'premium', basePrice: 12000, description: '高端品质，终身质保' }
      ],
      includesXray: true,
      includesFollowUp: true,
      xrayPrice: 200,
      followUpPrice: 300
    },
    tiers: [
      {
        id: 'tier-economy',
        name: '经济款',
        tagline: '基础修复',
        multiplier: 1,
        includes: ['种植体植入', '基台安装', '普通牙冠', '一期手术', '全景片'],
        excludes: ['骨增量手术', '上颌窦提升', '全瓷牙冠', '终身质保'],
        salesPitch: '预算有限的选择，恢复基本咀嚼功能。'
      },
      {
        id: 'tier-standard',
        name: '标准款',
        tagline: '品质之选',
        multiplier: 1.3,
        includes: ['进口种植体', '定制基台', '全瓷牙冠', '一期二期手术', 'CT拍片', '一年复查', '洁牙一次'],
        excludes: ['骨增量手术', '上颌窦提升', '终身质保'],
        salesPitch: '最受欢迎的方案，外观功能接近真牙，性价比最高。'
      },
      {
        id: 'tier-premium',
        name: '尊享款',
        tagline: '高端定制',
        multiplier: 1.8,
        includes: ['高端种植体', '个性化基台', '全瓷牙冠', '全程无痛', 'CT三维导航', '五年质保', '十次复查', '牙周维护'],
        excludes: ['骨增量手术', '上颌窦提升'],
        salesPitch: '瑞士品质，精准种植，咀嚼效率恢复98%以上。'
      }
    ]
  },
  {
    id: 'invisible-ortho',
    name: '隐形矫正评估',
    category: 'orthodontics',
    description: '隐形美观，悄然变美',
    icon: 'Smile',
    gradientFrom: '#FDA7DF',
    gradientTo: '#D980FA',
    priceRange: { min: 8000, max: 50000 },
    configOptions: {
      materials: [
        { id: 'ortho-basic', name: '国产隐形矫正', level: 'basic', basePrice: 18000, description: '性价比高，适合简单病例' },
        { id: 'ortho-standard', name: '国产正雅隐形', level: 'standard', basePrice: 28000, description: '国产高端，适应症广' },
        { id: 'ortho-premium', name: '进口隐适美', level: 'premium', basePrice: 45000, description: '全球领先，舒适美观' }
      ],
      includesXray: true,
      includesFollowUp: true,
      xrayPrice: 300,
      followUpPrice: 200
    },
    tiers: [
      {
        id: 'tier-economy',
        name: '经济款',
        tagline: '轻度调整',
        multiplier: 1,
        includes: ['隐形牙套', '初诊检查', '方案设计', '8副牙套', '两次复查', '保持器一副'],
        excludes: ['复杂病例', '拔牙矫正', '附件粘接', '精细调整'],
        salesPitch: '适合轻微不齐，快速改善前牙美观。'
      },
      {
        id: 'tier-standard',
        name: '标准款',
        tagline: '全面矫正',
        multiplier: 1.2,
        includes: ['隐形牙套', '全套检查', '3D方案设计', '不限副数', '每月复查', '保持器两副', '美白一次'],
        excludes: ['拔牙费用', '骨钉费用', '复杂病例附加费'],
        salesPitch: '多数人的选择，全面改善牙齿排列和咬合。'
      },
      {
        id: 'tier-premium',
        name: '尊享款',
        tagline: '定制美学',
        multiplier: 1.5,
        includes: ['进口隐形牙套', '全套检查', '美学设计', '不限副数', 'VIP诊室', '优先预约', '终身保持', '洁牙年卡', '微笑设计'],
        excludes: ['拔牙费用', '骨钉费用'],
        salesPitch: '明星同款，全程舒适体验，打造专属微笑曲线。'
      }
    ]
  }
];

export const fullReduceDiscounts: AnyDiscount[] = [
  { type: 'fullReduce', id: 'fr-100', name: '满2000减100', description: '消费满2000元可享', threshold: 2000, reduceAmount: 100, requiresManagerApproval: false },
  { type: 'fullReduce', id: 'fr-300', name: '满5000减300', description: '消费满5000元可享', threshold: 5000, reduceAmount: 300, requiresManagerApproval: false },
  { type: 'fullReduce', id: 'fr-800', name: '满10000减800', description: '消费满10000元可享', threshold: 10000, reduceAmount: 800, requiresManagerApproval: false },
  { type: 'fullReduce', id: 'fr-2000', name: '满20000减2000', description: '消费满20000元可享', threshold: 20000, reduceAmount: 2000, requiresManagerApproval: true }
];

export const installmentDiscounts: AnyDiscount[] = [
  { type: 'installment', id: 'ins-3', name: '3期免息', description: '分3期，0利息0手续费', periods: 3, interestRate: 0, requiresManagerApproval: false },
  { type: 'installment', id: 'ins-6', name: '6期免息', description: '分6期，0利息0手续费', periods: 6, interestRate: 0, requiresManagerApproval: false },
  { type: 'installment', id: 'ins-12', name: '12期免息', description: '分12期，0利息0手续费', periods: 12, interestRate: 0, requiresManagerApproval: true }
];

export const referralDiscounts: AnyDiscount[] = [
  { type: 'referral', id: 'ref-5', name: '老客转介绍95折', description: '老客户转介绍专享', discountRate: 0.95, requiresManagerApproval: false },
  { type: 'referral', id: 'ref-10', name: '亲友特惠9折', description: '直系亲属专属优惠', discountRate: 0.9, requiresManagerApproval: true }
];

export const MAX_AUTHORIZED_DISCOUNT_RATE = 0.2;
