import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Building2,
  DollarSign
} from 'lucide-react';
import { LatexFormulaRenderer } from './LatexFormulaRenderer';

export type RatioCalculationType = 
  | 'current-ratio'
  | 'quick-ratio'
  | 'cash-ratio'
  | 'gross-profit-margin'
  | 'net-profit-margin'
  | 'roe'
  | 'roa'
  | 'nim'
  | 'debt-equity'
  | 'interest-coverage'
  | 'inventory-turnover'
  | 'dso'
  | 'pe-ratio'
  | 'car'
  | 'cd-ratio'
  | 'npl-ratio';

interface RatioConfig {
  id: RatioCalculationType;
  nameNe: string;
  nameEn: string;
  categoryNe: string;
  categoryEn: string;
  formulaLatex: string;
  input1Label: string;
  input1Helper: string;
  input2Label: string;
  input2Helper: string;
  input3Label?: string;
  input3Helper?: string;
  unit: string;
  benchmarkText: string;
  evaluate: (v1: number, v2: number, v3?: number) => {
    value: number;
    status: 'good' | 'warning' | 'danger';
    badgeText: string;
    analysisNe: string;
    recommendationNe: string;
  };
}

const RATIO_CONFIGS: Record<RatioCalculationType, RatioConfig> = {
  'current-ratio': {
    id: 'current-ratio',
    nameNe: 'चालु अनुपात (Current Ratio)',
    nameEn: 'Current Ratio',
    categoryNe: 'तरलता (Liquidity)',
    categoryEn: 'Liquidity',
    formulaLatex: '$$\\text{Current Ratio} = \\frac{\\text{Current Assets}}{\\text{Current Liabilities}}$$',
    input1Label: 'कुल चालु सम्पत्ति (Current Assets)',
    input1Helper: 'नगद, बैंक मौज्दात, असुली हुन बाँकी ऋणी, मौज्दात (NPR)',
    input2Label: 'कुल चालु दायित्व (Current Liabilities)',
    input2Helper: 'तिर्न बाँकी साहु, अल्पकालीन ऋण, भुक्तानी दायित्व (NPR)',
    unit: ': 1',
    benchmarkText: 'मानक: २:१ (वाणिज्य बैंकमा १.२ - १.५:१ स्वीकार्य)',
    evaluate: (assets, liabilities) => {
      if (liabilities <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'चालु दायित्व ० भन्दा बढी हुनुपर्दछ।', recommendationNe: '-' };
      const val = assets / liabilities;
      if (val >= 1.5 && val <= 3.0) {
        return {
          value: val,
          status: 'good',
          badgeText: 'उत्कृष्ट तरलता (Optimal)',
          analysisNe: `चालु अनुपात ${val.toFixed(2)}:१ रहेको छ। संस्थासँग प्रत्येक १ रुपैयाँ अल्पकालीन दायित्व भुक्तान गर्न रु. ${val.toFixed(2)} बराबरको चालु सम्पत्ति उपलब्ध छ।`,
          recommendationNe: 'तरलता स्थिति मजबुत र स्वस्थ छ।'
        };
      } else if (val >= 1.0 && val < 1.5) {
        return {
          value: val,
          status: 'warning',
          badgeText: 'स्वीकार्य तर न्यून (Tight)',
          analysisNe: `चालु अनुपात ${val.toFixed(2)}:१ रहेको छ। यो न्यूनतम सीमामा छ, आकस्मिक भुक्तानीका लागि थप तरल सम्पत्ति आवश्यक पर्न सक्छ।`,
          recommendationNe: 'अल्पकालीन दायित्व घटाउने वा तरल निक्षेप बढाउने रणनीति अपनाउनुहोस्।'
        };
      } else if (val < 1.0) {
        return {
          value: val,
          status: 'danger',
          badgeText: 'जोखिमयुक्त (Critical Illiquidity)',
          analysisNe: `चालु अनुपात ${val.toFixed(2)}:१ रहेको छ, जुन १ भन्दा कम छ। संस्थाले तत्काल दायित्व चुक्ता गर्न नसक्ने प्राविधिक टाट पल्टिने जोखिम छ।`,
          recommendationNe: 'तुरुन्त कार्यशील पुँजी व्यवस्थापन र अल्पकालीन कर्जा चुक्ता गर्नुपर्दछ।'
        };
      } else {
        return {
          value: val,
          status: 'warning',
          badgeText: 'अत्यधिक तरलता (Idle Funds)',
          analysisNe: `चालु अनुपात ${val.toFixed(2)}:१ रहेको छ। अत्यधिक चालु सम्पत्ति थन्किएर नाफा आर्जन गर्ने अवसर गुमेको संकेत गर्दछ।`,
          recommendationNe: 'निष्क्रिय नगदलाई उच्च प्रतिफल दिने अल्पकालीन सरकारी ऋणपत्र वा लगानीमा परिचालन गर्नुहोस्।'
        };
      }
    }
  },
  'quick-ratio': {
    id: 'quick-ratio',
    nameNe: 'शीघ्र / तरल अनुपात (Quick Ratio)',
    nameEn: 'Quick / Acid-Test Ratio',
    categoryNe: 'तरलता (Liquidity)',
    categoryEn: 'Liquidity',
    formulaLatex: '$$\\text{Quick Ratio} = \\frac{\\text{Current Assets} - \\text{Inventory} - \\text{Prepaids}}{\\text{Current Liabilities}}$$',
    input1Label: 'कुल चालु सम्पत्ति (Current Assets)',
    input1Helper: 'कुल चालु सम्पत्ति (NPR)',
    input2Label: 'मौज्दात + पेश्की (Inventory + Prepaids)',
    input2Helper: 'तुरुन्त नगद नहुने मौज्दात र अग्रिम भुक्तानी (NPR)',
    input3Label: 'कुल चालु दायित्व (Current Liabilities)',
    input3Helper: 'तिर्न बाँकी साहु तथा अल्पकालीन दायित्व (NPR)',
    unit: ': 1',
    benchmarkText: 'मानक: १:१',
    evaluate: (assets, invPrepaid, liabilities = 1) => {
      const quickAssets = Math.max(0, assets - invPrepaid);
      if (liabilities <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'चालु दायित्व ० भन्दा बढी हुनुपर्दछ।', recommendationNe: '-' };
      const val = quickAssets / liabilities;
      if (val >= 1.0) {
        return {
          value: val,
          status: 'good',
          badgeText: 'उत्कृष्ट (Safe)',
          analysisNe: `शीघ्र अनुपात ${val.toFixed(2)}:१ रहेको छ। सामान बिक्री नगरीकनै संस्थाले तत्काल आफ्ना सम्पूर्ण अल्पकालीन दायित्व तिर्न सक्छ।`,
          recommendationNe: 'आकस्मिक दायित्व भुक्तानी क्षमता निकै भरपर्दो छ।'
        };
      } else {
        return {
          value: val,
          status: 'danger',
          badgeText: 'कमजोर शीघ्र तरलता (Alert)',
          analysisNe: `शीघ्र अनुपात ${val.toFixed(2)}:१ रहेको छ, जुन १ भन्दा कम छ। तत्काल दायित्व तिर्न मौज्दात बिक्री गर्नैपर्ने बाध्यता छ।`,
          recommendationNe: 'नगद प्रवाह सुधार र ऋणी असुलीलाई तीव्रता दिनुहोस्।'
        };
      }
    }
  },
  'cash-ratio': {
    id: 'cash-ratio',
    nameNe: 'नगद अनुपात (Cash Ratio)',
    nameEn: 'Cash Ratio',
    categoryNe: 'तरलता (Liquidity)',
    categoryEn: 'Liquidity',
    formulaLatex: '$$\\text{Cash Ratio} = \\frac{\\text{Cash and Bank} + \\text{Marketable Securities}}{\\text{Current Liabilities}}$$',
    input1Label: 'नगद + बैंक मौज्दात + धितोपत्र (Cash Equivalents)',
    input1Helper: 'हातमा भएको नगद, राष्ट्र बैंक मौज्दात, र ट्रेजरी बिल्स (NPR)',
    input2Label: 'कुल चालु दायित्व (Current Liabilities)',
    input2Helper: 'तिर्नुपर्ने अल्पकालीन दायित्व (NPR)',
    unit: ': 1',
    benchmarkText: 'मानक: ०.२:१ देखि ०.५:१',
    evaluate: (cash, liabilities) => {
      if (liabilities <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'दायित्व ० भन्दा बढी हुनुपर्छ', recommendationNe: '-' };
      const val = cash / liabilities;
      if (val >= 0.2) {
        return {
          value: val,
          status: 'good',
          badgeText: 'बलियो नगद बफर (Strong Cash Buffer)',
          analysisNe: `नगद अनुपात ${val.toFixed(2)}:१ छ। कुनै पनि सम्पत्ति बेच्न नपरी तुरुन्त नगदबाट दायित्व तिर्न पर्याप्त क्षमता छ।`,
          recommendationNe: 'परम तरलता अवस्था सन्तुष्ट छ।'
        };
      }
      return {
        value: val,
        status: 'warning',
        badgeText: 'न्यून नगद मौज्दात (Low Cash Buffer)',
        analysisNe: `नगद अनुपात ${val.toFixed(2)}:१ छ, जुन सामान्य मापदण्ड ०.२ भन्दा कम छ।`,
        recommendationNe: 'नगद मौज्दात वृद्धि गर्नुहोस्।'
      };
    }
  },
  'gross-profit-margin': {
    id: 'gross-profit-margin',
    nameNe: 'कुल नाफा मार्जिन (Gross Profit Margin)',
    nameEn: 'Gross Profit Margin (GPM)',
    categoryNe: 'नाफामूलकता (Profitability)',
    categoryEn: 'Profitability',
    formulaLatex: '$$\\text{GPM} = \\frac{\\text{Gross Profit}}{\\text{Total Revenue / Sales}} \\times 100\\%$$',
    input1Label: 'कुल नाफा (Gross Profit)',
    input1Helper: 'बिक्री आम्दानी - प्रत्यक्ष उत्पादन लागत (NPR)',
    input2Label: 'कुल बिक्री आम्दानी (Total Sales / Revenue)',
    input2Helper: 'कुल वार्षिक बिक्री वा सञ्चालन आम्दानी (NPR)',
    unit: '%',
    benchmarkText: 'मानक: २०% - ३०% भन्दा माथि',
    evaluate: (gp, revenue) => {
      if (revenue <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'बिक्री आम्दानी ० भन्दा बढी हुनुपर्छ', recommendationNe: '-' };
      const val = (gp / revenue) * 100;
      return {
        value: val,
        status: val >= 20 ? 'good' : 'warning',
        badgeText: val >= 20 ? 'उत्कृष्ट मार्जिन' : 'न्यून मार्जिन',
        analysisNe: `कुल नाफा मार्जिन ${val.toFixed(2)}% रहेको छ। प्रत्येक १०० रुपैयाँ बिक्रीमा रु. ${val.toFixed(2)} कुल नाफा बाँकी रहन्छ।`,
        recommendationNe: val >= 20 ? 'उत्पादन लागत नियन्त्रण चुस्त छ।' : 'कच्चा पदार्थ र प्रत्यक्ष लागत घटाउनुहोस्।'
      };
    }
  },
  'net-profit-margin': {
    id: 'net-profit-margin',
    nameNe: 'खुद नाफा मार्जिन (Net Profit Margin)',
    nameEn: 'Net Profit Margin (NPM)',
    categoryNe: 'नाफामूलकता (Profitability)',
    categoryEn: 'Profitability',
    formulaLatex: '$$\\text{NPM} = \\frac{\\text{Net Profit After Tax (NPAT)}}{\\text{Total Revenue / Sales}} \\times 100\\%$$',
    input1Label: 'कर पछिको खुद नाफा (NPAT)',
    input1Helper: 'सबै खर्च र कर कट्टी पछिको नाफा (NPR)',
    input2Label: 'कुल आम्दानी वा बिक्री (Total Revenue)',
    input2Helper: 'कुल सञ्चालन आम्दानी (NPR)',
    unit: '%',
    benchmarkText: 'मानक: १०% - १५% भन्दा माथि',
    evaluate: (npat, revenue) => {
      if (revenue <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'आम्दानी ० भन्दा बढी हुनुपर्छ', recommendationNe: '-' };
      const val = (npat / revenue) * 100;
      return {
        value: val,
        status: val >= 10 ? 'good' : val >= 5 ? 'warning' : 'danger',
        badgeText: val >= 10 ? 'उत्कृष्ट नाफा' : val >= 5 ? 'मध्यम' : 'न्यून नाफा',
        analysisNe: `खुद नाफा मार्जिन ${val.toFixed(2)}% छ। प्रत्येक १०० रुपैयाँको कुल आम्दानीमा संस्थाले रु. ${val.toFixed(2)} खुद बचत गरेको छ।`,
        recommendationNe: val >= 10 ? 'सञ्चालन तथा वित्तीय लागत नियन्त्रण प्रभावकारी छ।' : 'प्रशासनिक तथा सञ्चालन खर्च नियन्त्रण आवश्यक।'
      };
    }
  },
  'roe': {
    id: 'roe',
    nameNe: 'स्वपुँजी प्रतिफल अनुपात (ROE)',
    nameEn: 'Return on Equity (ROE)',
    categoryNe: 'नाफामूलकता (Profitability)',
    categoryEn: 'Profitability',
    formulaLatex: '$$\\text{ROE} = \\frac{\\text{Net Profit After Tax}}{\\text{Shareholders\' Equity}} \\times 100\\%$$',
    input1Label: 'कर पछिको खुद नाफा (NPAT)',
    input1Helper: 'वार्षिक खुद नाफा (NPR)',
    input2Label: 'कुल सेयरधनी कोष (Total Equity)',
    input2Helper: 'सेयर पुँजी + जगेडा कोष + प्रतिधारित नाफा (NPR)',
    unit: '%',
    benchmarkText: 'मानक: १५% भन्दा माथि उत्कृष्ट',
    evaluate: (np, eq) => {
      if (eq <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'सेयरधनी कोष ० भन्दा बढी हुनुपर्छ', recommendationNe: '-' };
      const val = (np / eq) * 100;
      return {
        value: val,
        status: val >= 15 ? 'good' : val >= 10 ? 'warning' : 'danger',
        badgeText: val >= 15 ? 'उत्कृष्ट प्रतिफल (High Value)' : 'कमजोर प्रतिफल',
        analysisNe: `स्वपुँजी प्रतिफल ${val.toFixed(2)}% रहेको छ। सेयरधनीहरूको प्रत्येक १०० रुपैयाँ लगानीले वार्षिक रु. ${val.toFixed(2)} खुद नाफा दिएको छ।`,
        recommendationNe: val >= 15 ? 'सेयरधनीको सम्पत्ति अभिवृद्धि दर उच्च छ।' : 'सम्पत्ति उपयोग र मार्जिन बढाउनुपर्छ।'
      };
    }
  },
  'roa': {
    id: 'roa',
    nameNe: 'सम्पत्ति प्रतिफल अनुपात (ROA)',
    nameEn: 'Return on Assets (ROA)',
    categoryNe: 'नाफामूलकता (Profitability)',
    categoryEn: 'Profitability',
    formulaLatex: '$$\\text{ROA} = \\frac{\\text{Net Profit After Tax}}{\\text{Total Assets}} \\times 100\\%$$',
    input1Label: 'कर पछिको खुद नाफा (NPAT)',
    input1Helper: 'वार्षिक खुद नाफा (NPR)',
    input2Label: 'कुल सम्पत्ति (Total Assets)',
    input2Helper: 'संस्थाको सम्पूर्ण वासलात सम्पत्ति (NPR)',
    unit: '%',
    benchmarkText: 'मानक: १% - २% (बैंकहरूमा १.५%+ उत्कृष्ट)',
    evaluate: (np, assets) => {
      if (assets <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'कुल सम्पत्ति ० भन्दा बढी हुनुपर्छ', recommendationNe: '-' };
      const val = (np / assets) * 100;
      return {
        value: val,
        status: val >= 1.5 ? 'good' : val >= 1.0 ? 'warning' : 'danger',
        badgeText: val >= 1.5 ? 'उत्कृष्ट सम्पत्ति परिचालन' : 'न्यून प्रतिफल',
        analysisNe: `सम्पत्ति प्रतिफल ${val.toFixed(2)}% छ। कुल सम्पत्तिको प्रत्येक १०० रुपैयाँ परिचालनबाट रु. ${val.toFixed(2)} नाफा भएको छ।`,
        recommendationNe: val >= 1.5 ? 'व्यवस्थापकीय कार्यकुशलता उच्च छ।' : 'निष्क्रिय सम्पत्ति घटाउनुहोस्।'
      };
    }
  },
  'nim': {
    id: 'nim',
    nameNe: 'खुद ब्याज मार्जिन (NIM)',
    nameEn: 'Net Interest Margin (NIM)',
    categoryNe: 'नाफामूलकता (Profitability)',
    categoryEn: 'Profitability',
    formulaLatex: '$$\\text{NIM} = \\frac{\\text{Net Interest Income}}{\\text{Average Earning Assets}} \\times 100\\%$$',
    input1Label: 'खुद ब्याज आम्दानी (Net Interest Income)',
    input1Helper: 'ब्याज आम्दानी - ब्याज खर्च (NPR)',
    input2Label: 'औसत ब्याज आर्जन गर्ने सम्पत्ति (Earning Assets)',
    input2Helper: 'कर्जा लगानी + सरकारी ऋणपत्र + अन्तरबैंक निक्षेप (NPR)',
    unit: '%',
    benchmarkText: 'मानक: ३.०% - ४.५%',
    evaluate: (nii, assets) => {
      if (assets <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'ब्याज आर्जन गर्ने सम्पत्ति ० भन्दा बढी हुनुपर्छ', recommendationNe: '-' };
      const val = (nii / assets) * 100;
      return {
        value: val,
        status: val >= 3.0 && val <= 4.5 ? 'good' : 'warning',
        badgeText: val >= 3.0 ? 'स्वस्थ ब्याज मार्जिन' : 'न्यून स्प्रेड',
        analysisNe: `खुद ब्याज मार्जिन ${val.toFixed(2)}% रहेको छ। बैंकको मुख्य वित्तीय मध्यस्थता कार्य स्वस्थ छ।`,
        recommendationNe: 'निक्षेप लागत (Cost of Funds) र कर्जा दर बीच सन्तुलन कायम राख्नुहोस्।'
      };
    }
  },
  'debt-equity': {
    id: 'debt-equity',
    nameNe: 'ऋण-इक्विटी अनुपात (Debt-to-Equity)',
    nameEn: 'Debt-to-Equity (D/E)',
    categoryNe: 'शोधनक्षमता (Solvency)',
    categoryEn: 'Solvency',
    formulaLatex: '$$\\text{D/E Ratio} = \\frac{\\text{Total Long-Term Debt}}{\\text{Shareholders\' Equity}}$$',
    input1Label: 'दीर्घकालीन ऋण (Long-term Debt)',
    input1Helper: 'ऋणपत्र, बैंक ऋण, बण्ड्स (NPR)',
    input2Label: 'कुल सेयरधनी कोष (Shareholders\' Equity)',
    input2Helper: 'पुँजी + सञ्चित जगेडा (NPR)',
    unit: ': 1',
    benchmarkText: 'मानक: १:१ देखि २:१ (उद्योग अनुसार)',
    evaluate: (debt, equity) => {
      if (equity <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'इक्विटी ० भन्दा बढी हुनुपर्छ', recommendationNe: '-' };
      const val = debt / equity;
      return {
        value: val,
        status: val <= 2.0 ? 'good' : 'danger',
        badgeText: val <= 2.0 ? 'सन्तुलित वित्तीय संरचना' : 'उच्च वित्तीय लिभरेज (High Risk)',
        analysisNe: `ऋण-इक्विटी अनुपात ${val.toFixed(2)}:१ छ। सेयरधनीको प्रत्येक १ रुपैयाँ पुँजी बराबर रु. ${val.toFixed(2)} बाह्य ऋण प्रयोग भएको छ।`,
        recommendationNe: val <= 2.0 ? 'दीर्घकालीन शोधनक्षमता सन्तोषजनक छ।' : 'बाह्य ऋणको अत्यधिक भार घटाउनुहोस्।'
      };
    }
  },
  'interest-coverage': {
    id: 'interest-coverage',
    nameNe: 'ब्याज भुक्तानी क्षमता अनुपात (ICR)',
    nameEn: 'Interest Coverage Ratio',
    categoryNe: 'शोधनक्षमता (Solvency)',
    categoryEn: 'Solvency',
    formulaLatex: '$$\\text{ICR} = \\frac{\\text{EBIT}}{\\text{Interest Expense}}$$',
    input1Label: 'ब्याज तथा कर अघिको सञ्चालन नाफा (EBIT)',
    input1Helper: 'Earnings Before Interest and Taxes (NPR)',
    input2Label: 'वार्षिक ब्याज खर्च (Interest Expense)',
    input2Helper: 'ऋण बापत तिर्नुपर्ने ब्याज (NPR)',
    unit: 'गुणा (Times)',
    benchmarkText: 'मानक: २.५ गुणाभन्दा बढी (३+ गुणा उत्कृष्ट)',
    evaluate: (ebit, interest) => {
      if (interest <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'ब्याज खर्च ० भन्दा बढी हुनुपर्छ', recommendationNe: '-' };
      const val = ebit / interest;
      return {
        value: val,
        status: val >= 2.5 ? 'good' : val >= 1.0 ? 'warning' : 'danger',
        badgeText: val >= 2.5 ? 'सुरक्षित कभरेज' : val >= 1.0 ? 'कमजोर' : 'डिफल्ट जोखिम (Default Risk)',
        analysisNe: `ब्याज कभरेज अनुपात ${val.toFixed(2)} गुणा छ। संस्थाले आफ्नो नाफाबाट वार्षिक ब्याज ${val.toFixed(2)} पटकसम्म तिर्न सक्ने क्षमता राख्दछ।`,
        recommendationNe: val >= 2.5 ? 'ऋण तिर्ने क्षमता पूर्ण सुरक्षित छ।' : 'ब्याज तिर्न अपुग हुने खतरा छ।'
      };
    }
  },
  'inventory-turnover': {
    id: 'inventory-turnover',
    nameNe: 'मौज्दात चक्रण अनुपात (Inventory Turnover)',
    nameEn: 'Inventory Turnover Ratio (ITR)',
    categoryNe: 'कार्यकुशलता (Efficiency)',
    categoryEn: 'Activity',
    formulaLatex: '$$\\text{ITR} = \\frac{\\text{Cost of Goods Sold (COGS)}}{\\text{Average Inventory}}$$',
    input1Label: 'बिक्री भएको वस्तुको लागत (COGS)',
    input1Helper: 'Cost of Goods Sold (NPR)',
    input2Label: 'औसत मौज्दात (Average Inventory)',
    input2Helper: '(सुरु मौज्दात + अन्तिम मौज्दात) / २ (NPR)',
    unit: 'पटक (Times)',
    benchmarkText: 'मानक: ५ - ८ पटक प्रति वर्ष',
    evaluate: (cogs, inv) => {
      if (inv <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'औसत मौज्दात ० भन्दा बढी हुनुपर्छ', recommendationNe: '-' };
      const val = cogs / inv;
      return {
        value: val,
        status: val >= 5 ? 'good' : 'warning',
        badgeText: val >= 5 ? 'चुस्त चक्रण (Fast Moving)' : 'सुस्त मौज्दात (Slow Moving)',
        analysisNe: `मौज्दात चक्रण ${val.toFixed(2)} पटक भएको छ। वर्षमा मौज्दात यति पटक बिक्री भएर नगदमा परिणत भएको छ।`,
        recommendationNe: val >= 5 ? 'सामान बिक्री गति उत्कृष्ट छ।' : 'स्टक थन्किने समस्या समाधान गर्नुहोस्।'
      };
    }
  },
  'dso': {
    id: 'dso',
    nameNe: 'औसत संकलन अवधि (DSO)',
    nameEn: 'Days Sales Outstanding (DSO)',
    categoryNe: 'कार्यकुशलता (Efficiency)',
    categoryEn: 'Activity',
    formulaLatex: '$$\\text{DSO} = \\frac{\\text{Accounts Receivable}}{\\text{Total Credit Sales}} \\times 365\\text{ Days}$$',
    input1Label: 'प्राप्य हिसाब / ऋणी (Accounts Receivable)',
    input1Helper: 'उठाउन बाँकी ग्राहक ऋण (NPR)',
    input2Label: 'वार्षिक उधारो बिक्री (Net Credit Sales)',
    input2Helper: 'वर्षभरिको कुल उधारो बिक्री आम्दानी (NPR)',
    unit: 'दिन (Days)',
    benchmarkText: 'मानक: ३० देखि ४५ दिनभित्र',
    evaluate: (ar, sales) => {
      if (sales <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'बिक्री आम्दानी ० भन्दा बढी हुनुपर्छ', recommendationNe: '-' };
      const val = (ar / sales) * 365;
      return {
        value: val,
        status: val <= 45 ? 'good' : val <= 60 ? 'warning' : 'danger',
        badgeText: val <= 45 ? 'छिटो असुली (Efficient)' : 'ढिलो असुली (Delayed Recovery)',
        analysisNe: `उधारो असुली हुन औसत ${val.toFixed(0)} दिन लाग्ने देखिएको छ।`,
        recommendationNe: val <= 45 ? 'ऋणी व्यवस्थापन कुशल छ।' : 'उधारो असुली कडा पार्नुहोस्।'
      };
    }
  },
  'pe-ratio': {
    id: 'pe-ratio',
    nameNe: 'मूल्य-आम्दानी अनुपात (P/E Ratio)',
    nameEn: 'Price to Earnings (P/E) Ratio',
    categoryNe: 'बजार मूल्य (Market Value)',
    categoryEn: 'Market Value',
    formulaLatex: '$$\\text{P/E Ratio} = \\frac{\\text{Market Price Per Share (MPS)}}{\\text{Earnings Per Share (EPS)}}$$',
    input1Label: 'प्रति सेयर बजार मूल्य (MPS)',
    input1Helper: 'नेप्से (NEPSE) मा हालको बजार मूल्य (NPR)',
    input2Label: 'प्रति सेयर आम्दानी (EPS)',
    input2Helper: 'वार्षिक प्रति सेयर आम्दानी (NPR)',
    unit: 'गुणा (Times)',
    benchmarkText: 'मानक: १५ - २५ गुणा',
    evaluate: (mps, eps) => {
      if (eps <= 0) return { value: 0, status: 'danger', badgeText: 'अमान्य वा नोक्सान', analysisNe: 'EPS ० वा ऋणात्मक हुँदा P/E गणना हुँदैन।', recommendationNe: '-' };
      const val = mps / eps;
      return {
        value: val,
        status: val <= 25 ? 'good' : 'warning',
        badgeText: val <= 20 ? 'उचित मूल्याङ्कन (Attractive)' : 'महँगो मूल्याङ्कन (Overvalued)',
        analysisNe: `कम्पनीको P/E अनुपात ${val.toFixed(2)} गुणा छ। प्रत्येक रु. १ आम्दानीका लागि लगानीकर्ताले रु. ${val.toFixed(2)} तिर्न तयार छन्।`,
        recommendationNe: val <= 20 ? 'लगानीका दृष्टिकोणले सेयर आकर्षक मान्न सकिन्छ।' : 'मूल्य बढी भएकाले सतर्क हुनुहोस्।'
      };
    }
  },
  'car': {
    id: 'car',
    nameNe: 'पुँजी पर्याप्तता अनुपात (CAR / CRAR)',
    nameEn: 'Capital Adequacy Ratio (CAR)',
    categoryNe: 'नियामकीय (NRB Prudential)',
    categoryEn: 'Regulatory',
    formulaLatex: '$$\\text{CAR} = \\frac{\\text{Total Capital (Tier 1 + Tier 2)}}{\\text{Total Risk-Weighted Assets (RWA)}} \\times 100\\%$$',
    input1Label: 'कुल पुँजी कोष (Tier 1 + Tier 2 Capital)',
    input1Helper: 'प्राथमिक पुँजी + पूरक पुँजी (NPR)',
    input2Label: 'कुल जोखिम भारित सम्पत्ति (Risk-Weighted Assets)',
    input2Helper: 'क्रेडिट, बजार र सञ्चालन जोखिम भार (NPR)',
    unit: '%',
    benchmarkText: 'NRB मापदण्ड: न्यूनतम ११.०% (Tier 1 कम्तीमा ८.५%)',
    evaluate: (capital, rwa) => {
      if (rwa <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'RWA ० भन्दा बढी हुनुपर्दछ', recommendationNe: '-' };
      const val = (capital / rwa) * 100;
      if (val >= 11.0) {
        return {
          value: val,
          status: 'good',
          badgeText: 'NRB मापदण्ड पालना (Compliant)',
          analysisNe: `पुँजी पर्याप्तता अनुपात ${val.toFixed(2)}% छ, जुन राष्ट्र बैंकले तोकेको न्यूनतम ११.०% भन्दा माथि छ।`,
          recommendationNe: 'बैंकको पुँजीगत आधार बलियो र वित्तीय जोखिम धान्न सक्षम छ।'
        };
      }
      return {
        value: val,
        status: 'danger',
        badgeText: 'NRB मापदण्ड उल्लंघन (PCA Alert)',
        analysisNe: `पुँजी पर्याप्तता अनुपात ${val.toFixed(2)}% मात्र छ, जुन न्यूनतम ११.०% भन्दा कम छ।`,
        recommendationNe: 'शीघ्र सुधारात्मक कारबाही (PCA) बाट बच्न तत्काल हकप्रद सेयर, डिबेन्चर वा बोनस सेयर जारी गरी पुँजी कोष बढाउनुपर्छ।'
      };
    }
  },
  'cd-ratio': {
    id: 'cd-ratio',
    nameNe: 'कर्जा-निक्षेप अनुपात (CD Ratio)',
    nameEn: 'Credit to Deposit (CD) Ratio',
    categoryNe: 'नियामकीय (NRB Prudential)',
    categoryEn: 'Regulatory',
    formulaLatex: '$$\\text{CD Ratio} = \\frac{\\text{Total Domestic Credit}}{\\text{Total Domestic Deposit}} \\times 100\\%$$',
    input1Label: 'कुल स्थानीय कर्जा तथा सापट (Domestic Credit)',
    input1Helper: 'बैंकले प्रवाह गरेको कुल कर्जा (NPR)',
    input2Label: 'कुल स्थानीय निक्षेप (Domestic Deposit)',
    input2Helper: 'सर्वसाधारण र संस्थागत कुल निक्षेप (NPR)',
    unit: '%',
    benchmarkText: 'NRB मापदण्ड: अधिकतम ९०.०%',
    evaluate: (credit, deposit) => {
      if (deposit <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'निक्षेप ० भन्दा बढी हुनुपर्छ', recommendationNe: '-' };
      const val = (credit / deposit) * 100;
      if (val <= 90.0) {
        return {
          value: val,
          status: 'good',
          badgeText: 'NRB सीमाभित्र (Compliant)',
          analysisNe: `कर्जा-निक्षेप अनुपात ${val.toFixed(2)}% रहेको छ, जुन राष्ट्र बैंकको अधिकतम ९०.०% को सीमाभित्र छ।`,
          recommendationNe: 'बैंकसँग अझै थप कर्जा विस्तार गर्ने तरलता ठाउँ उपलब्ध छ।'
        };
      }
      return {
        value: val,
        status: 'danger',
        badgeText: 'सीमा नाघेको (Regulatory Breach)',
        analysisNe: `CD अनुपात ${val.toFixed(2)}% पुगेको छ, जुन राष्ट्र बैंकको ९०% सीमा भन्दा बढी हो।`,
        recommendationNe: 'नयाँ आक्रामक कर्जा रोक्ने र तुरुन्त नयाँ निक्षेप संकलन गरी ९०% भित्र ल्याउनुपर्छ।'
      };
    }
  },
  'npl-ratio': {
    id: 'npl-ratio',
    nameNe: 'निष्क्रिय कर्जा अनुपात (NPL Ratio)',
    nameEn: 'Non-Performing Loan (NPL) Ratio',
    categoryNe: 'नियामकीय (NRB Prudential)',
    categoryEn: 'Regulatory',
    formulaLatex: '$$\\text{NPL Ratio} = \\frac{\\text{Total Gross Non-Performing Loans}}{\\text{Total Gross Loans and Advances}} \\times 100\\%$$',
    input1Label: 'कुल निष्क्रिय कर्जा (NPL Amount)',
    input1Helper: 'कमसल, शंकास्पद र खराब कर्जाको कुल योग (NPR)',
    input2Label: 'कुल कर्जा तथा सापट (Total Gross Loans)',
    input2Helper: 'बैंकको कुल कर्जा पोर्टफोलियो (NPR)',
    unit: '%',
    benchmarkText: 'NRB मापदण्ड: अधिकतम ५.०% भन्दा कम',
    evaluate: (npl, totalLoans) => {
      if (totalLoans <= 0) return { value: 0, status: 'warning', badgeText: 'अमान्य', analysisNe: 'कुल कर्जा ० भन्दा बढी हुनुपर्छ', recommendationNe: '-' };
      const val = (npl / totalLoans) * 100;
      if (val <= 2.5) {
        return {
          value: val,
          status: 'good',
          badgeText: 'उत्कृष्ट कर्जा गुणस्तर (Healthy Asset Quality)',
          analysisNe: `निष्क्रिय कर्जा अनुपात ${val.toFixed(2)}% छ। बैंकको कर्जा असुली अत्यन्त प्रभावकारी छ।`,
          recommendationNe: 'कर्जा जोखिम न्यून छ।'
        };
      } else if (val <= 5.0) {
        return {
          value: val,
          status: 'warning',
          badgeText: 'स्वीकार्य तर सतर्कता आवश्यक (Watchlist)',
          analysisNe: `निष्क्रिय कर्जा अनुपात ${val.toFixed(2)}% छ, जुन राष्ट्र बैंकको ५% सीमाभित्र भए पनि बढ्दो जोखिमको संकेत हो।`,
          recommendationNe: 'भाखा नाघेका कर्जा असुलीमा थप कडाइ गर्नुहोस्।'
        };
      }
      return {
        value: val,
        status: 'danger',
        badgeText: 'गम्भीर खतरा (Severe Distress / Red Zone)',
        analysisNe: `निष्क्रिय कर्जा ${val.toFixed(2)}% पुगेको छ, जुन ५% को सुरक्षित सीमा भन्दा बढी हो।`,
        recommendationNe: 'कर्जा नोक्सानी व्यवस्था (Loan Loss Provision) बढाउनुपर्छ र धितो लिलाम प्रक्रिया अघि बढाउनुपर्छ।'
      };
    }
  }
};

const PRESETS = [
  {
    name: 'क वर्गको वाणिज्य बैंक (Sample Commercial Bank)',
    description: 'नेपालको औसत वाणिज्य बैंकको वासलात स्थिति',
    ratioType: 'cd-ratio' as RatioCalculationType,
    v1: 180000000000, // 180 Billion Loans
    v2: 215000000000  // 215 Billion Deposits
  },
  {
    name: 'पुँजी पर्याप्तता नमुना (Healthy CAR)',
    description: 'NRB Directive No. 1 अनुसार बासेल ३ मापदण्ड',
    ratioType: 'car' as RatioCalculationType,
    v1: 28000000000,  // 28 Billion Capital
    v2: 220000000000  // 220 Billion RWA
  },
  {
    name: 'सबल उत्पादन कम्पनी (Healthy Liquid Firm)',
    description: 'चालु अनुपात र शीघ्र अनुपात मानक परीक्षण',
    ratioType: 'current-ratio' as RatioCalculationType,
    v1: 45000000, // 4.5 Crore Assets
    v2: 22500000  // 2.25 Crore Liabilities
  },
  {
    name: 'खराब कर्जा समस्याग्रस्त (High NPL Alert)',
    description: '५% सीमा नाघेको संकटग्रस्त बैंक',
    ratioType: 'npl-ratio' as RatioCalculationType,
    v1: 12500000000, // 12.5 Billion NPL
    v2: 175000000000 // 175 Billion Loans
  }
];

export const FinancialRatioCalculator: React.FC = () => {
  const [selectedRatio, setSelectedRatio] = useState<RatioCalculationType>('current-ratio');
  const [input1, setInput1] = useState<string>('50000000');
  const [input2, setInput2] = useState<string>('25000000');
  const [input3, setInput3] = useState<string>('5000000');

  const config = RATIO_CONFIGS[selectedRatio];

  const handleRatioSelect = (id: RatioCalculationType) => {
    setSelectedRatio(id);
    // Provide sensible defaults per ratio
    if (id === 'current-ratio') {
      setInput1('50000000');
      setInput2('25000000');
    } else if (id === 'quick-ratio') {
      setInput1('50000000');
      setInput2('10000000');
      setInput3('25000000');
    } else if (id === 'car') {
      setInput1('28000000000');
      setInput2('220000000000');
    } else if (id === 'cd-ratio') {
      setInput1('180000000000');
      setInput2('215000000000');
    } else if (id === 'npl-ratio') {
      setInput1('4500000000');
      setInput2('150000000000');
    } else if (id === 'roe') {
      setInput1('2500000000');
      setInput2('15000000000');
    } else if (id === 'pe-ratio') {
      setInput1('540');
      setInput2('28');
    } else {
      setInput1('10000000');
      setInput2('50000000');
    }
  };

  const handlePresetApply = (preset: typeof PRESETS[0]) => {
    setSelectedRatio(preset.ratioType);
    setInput1(preset.v1.toString());
    setInput2(preset.v2.toString());
  };

  const result = useMemo(() => {
    const v1 = parseFloat(input1) || 0;
    const v2 = parseFloat(input2) || 0;
    const v3 = parseFloat(input3) || 0;
    return config.evaluate(v1, v2, v3);
  }, [config, input1, input2, input3]);

  // Group ratios by category
  const categories = useMemo(() => {
    const groups: Record<string, RatioConfig[]> = {};
    Object.values(RATIO_CONFIGS).forEach(cfg => {
      if (!groups[cfg.categoryNe]) groups[cfg.categoryNe] = [];
      groups[cfg.categoryNe].push(cfg);
    });
    return groups;
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6 text-[#0F172A]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-50 text-[#1E40AF] border border-blue-200 shadow-sm">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">
                अन्तरक्रियात्मक वित्तीय अनुपात क्याल्कुलेटर
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#DC2626] text-white">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              NRB निर्देशन, NFRS र वित्तीय विश्लेषण सूत्रहरूमा आधारित वास्तविक गणना र स्वास्थ्य मूल्याङ्कन
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            नमुना डाटा:
          </span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetApply(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-[11px] font-bold text-slate-700 hover:text-[#1E40AF] border border-slate-200 transition cursor-pointer"
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills & Ratio Selector */}
      <div className="space-y-3">
        <div className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
          <span>अनुपात छनोट गर्नुहोस् (Select Ratio to Calculate):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categories).map(([catName, ratios]) => (
            <div key={catName} className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-black text-slate-500 px-2 py-0.5">
                {catName}:
              </span>
              <div className="flex flex-wrap gap-1">
                {ratios.map(r => {
                  const isActive = selectedRatio === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRatioSelect(r.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isActive
                          ? 'bg-[#1E40AF] text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {r.nameEn}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200 space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#0F172A]">
                {config.nameNe}
              </h3>
              <span className="text-xs font-bold text-[#1E40AF] px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200">
                {config.categoryNe}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {config.benchmarkText}
            </p>
          </div>

          {/* LaTeX Formula Display */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] font-black uppercase text-slate-500 mb-1">
              गणितीय सूत्र (Mathematical Formula):
            </div>
            <div className="overflow-x-auto py-1 text-center font-serif text-slate-900">
              <LatexFormulaRenderer latex={config.formulaLatex} />
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                {config.input1Label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent transition"
                  placeholder="संख्या प्रविष्ट गर्नुहोस्"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-500">
                  NPR
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                {config.input1Helper}
              </p>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                {config.input2Label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent transition"
                  placeholder="संख्या प्रविष्ट गर्नुहोस्"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-500">
                  NPR
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                {config.input2Helper}
              </p>
            </div>

            {config.input3Label && (
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  {config.input3Label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={input3}
                    onChange={(e) => setInput3(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent transition"
                    placeholder="संख्या प्रविष्ट गर्नुहोस्"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-500">
                    NPR
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  {config.input3Helper}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Output & Analysis Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              गणना नतिजा (Calculated Result)
            </span>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black ${
              result.status === 'good'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : result.status === 'warning'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}>
              {result.status === 'good' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : result.status === 'warning' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
              )}
              <span>{result.badgeText}</span>
            </div>
          </div>

          {/* Big Output Number */}
          <div className="text-center py-4 bg-[#F8FAFC] rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
              {config.nameEn}
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-black text-[#1E40AF] tracking-tight">
              {result.value.toFixed(2)}
              <span className="text-lg font-bold text-slate-600 ml-1">
                {config.unit}
              </span>
            </div>
            <span className="text-[11px] text-slate-600 font-semibold block mt-1">
              {config.benchmarkText}
            </span>
          </div>

          {/* Analysis Note */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="font-black text-[#0F172A] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#1E40AF]" />
                <span>व्याख्यात्मक विश्लेषण (Interpretation):</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {result.analysisNe}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-1.5">
              <div className="font-black text-[#1E40AF] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1E40AF]" />
                <span>सुझाव / कार्यदिशा (Recommendation):</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {result.recommendationNe}
              </p>
            </div>
          </div>

          {/* Lok Sewa Exam Tip */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-black text-amber-950">लोकसेवा परीक्षा टिप्स:</strong> परीक्षामा अनुपातको केवल गणितीय सूत्र मात्र लेखेर पुग्दैन; मानक तुलना, निष्कर्ष र संस्थाको तरलता/शोधनक्षमतामा पर्ने व्यावहारिक प्रभाव स्पष्ट खुलाउनुपर्छ।
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
