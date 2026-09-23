import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/bankingExamNotesData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update interfaces at the top to include all deep research fields
const updatedInterfaces = `export interface PracticalCalculationStep {
  stepNumber: number;
  stepTitleNe: string;
  formulaOrWorkingLatex?: string;
  explanationNe: string;
}

export interface PracticalNumericalExample {
  scenarioTitleNe: string;
  bankNameNe: string;
  fiscalYearNe: string;
  givenData: { labelNe: string; valueFormatted: string }[];
  steps: PracticalCalculationStep[];
  resultValueLatex: string;
  interpretationNe: string;
}

export interface RatioRegulatoryDetails {
  directiveNumberNe: string;
  mandatoryThresholdNe: string;
  nonCompliancePenaltyNe: string;
  baselFrameworkNe?: string;
}

export interface RatioPracticalApplications {
  regulatorySupervisionNe: string;
  creditRiskApprovalNe: string;
  investorPerceptionNe: string;
}

export interface RatioWindowDressingRisks {
  manipulationTechniquesNe: string[];
  auditorDetectionGuideNe: string[];
}

export interface FinancialRatioFormula {
  id: string;
  nameNe: string;
  nameEn: string;
  category: 'Liquidity' | 'Profitability' | 'Solvency' | 'Activity' | 'MarketValue' | 'Regulatory';
  formulaLatex: string;
  numeratorNe: string;
  denominatorNe: string;
  multiplier?: string;
  standardBenchmark: string;
  significanceNe: string;
  conceptAndPurposeNe: string;
  bankingApplicationNe: string;
  nrbDirectiveNormsNe: string;
  numericalExample: PracticalNumericalExample;
  strategicLimitationsNe: string;
  // Ultra-Premium Deep Research Fields
  deepConceptualRationaleNe?: string;
  practicalApplications?: RatioPracticalApplications;
  regulatoryFramework?: RatioRegulatoryDetails;
  windowDressingRisks?: RatioWindowDressingRisks;
}`;

content = content.replace(/export interface PracticalCalculationStep[\s\S]*?^}/m, updatedInterfaces);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated interfaces in bankingExamNotesData.ts');
