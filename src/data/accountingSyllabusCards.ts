import { StudyNote, TopicItem } from '../types';
import { ACCOUNTING_BASICS_MASTER_CHAPTER } from './accountingBasicsChapter';
import { CHAPTER_2_2_JOURNAL_CASHBOOK } from './accountingChapters/chapter2_2_journal_cashbook';
import { CHAPTER_2_3_TRIAL_BALANCE } from './accountingChapters/chapter2_3_trial_balance';
import { CHAPTER_2_4_RECONCILIATION } from './accountingChapters/chapter2_4_reconciliation';
import { CHAPTER_2_5_FINAL_ACCOUNTS } from './accountingChapters/chapter2_5_final_accounts';
import { CHAPTER_2_6_RATIO_ANALYSIS } from './accountingChapters/chapter2_6_ratio_analysis';
import { CHAPTER_2_7_INTERNAL_CONTROL } from './accountingChapters/chapter2_7_internal_control';
import { CHAPTER_2_8_DEPRECIATION } from './accountingChapters/chapter2_8_depreciation';
import { CHAPTER_2_9_GOVERNMENT_ACCOUNTING } from './accountingChapters/chapter2_9_govt_accounting';
import { CHAPTER_2_10_ACCOUNTING_STANDARDS } from './accountingChapters/chapter2_10_nfrs_nas';
import { CHAPTER_2_11_INVENTORY_MANAGEMENT } from './accountingChapters/chapter2_11_inventory_mgmt';

// ============================================================================
// PAPER I - SECTION (B) ACCOUNTING: 11 DEEP RESEARCH SYLLABUS CARDS (2.1 to 2.11)
// Official Nepal Rastra Bank (NRB) & Commercial Banks Level 4 & 5 Syllabus
// Total Section Weightage: 30 Marks (Paper I / Paper II)
// ============================================================================

/**
 * Card 2.1: २.१ बहिखाता तथा लेखा सम्बन्धी अवधारणा (Bookkeeping & Accounting Concepts)
 */
export const CARD_2_1_ACCOUNTING_CONCEPTS: StudyNote = {
  ...ACCOUNTING_BASICS_MASTER_CHAPTER,
  id: 'note-accounting-2-1',
  title: '२.१ बहिखाता तथा लेखा सम्बन्धी अवधारणा (Bookkeeping & Accounting Concepts)',
  subject: 'Accounting',
  category: 'Banking',
  readTime: '35 min read',
  examTip: 'दोहोरो लेखा प्रणालीका सिद्धान्तहरू, लुका प्यासिओलीको योगदान, BAFIA २०७३ को दफा ५९, कम्पनी ऐन २०६३ को दफा १०९ र गोश्वारा भौचरदेखि सन्तुलन परीक्षणसम्मको लेखा चक्रबाट ५ वा १० अङ्कको प्रश्न प्रायः सोधिन्छ।'
};

/**
 * Card 2.2: २.२ गोश्वारा भौचर, बैंक नगदी किताब (Journal Voucher & Bank Cash Book)
 */
export const CARD_2_2_JOURNAL_CASHBOOK: StudyNote = CHAPTER_2_2_JOURNAL_CASHBOOK;

/**
 * Card 2.3: २.३ सन्तुलन परीक्षण (Trial Balance)
 */
export const CARD_2_3_TRIAL_BALANCE: StudyNote = CHAPTER_2_3_TRIAL_BALANCE;

/**
 * Card 2.4: २.४ हिसाब मिलान विवरण (Reconciliation Statements: BRS & Inter-Branch)
 */
export const CARD_2_4_RECONCILIATION: StudyNote = CHAPTER_2_4_RECONCILIATION;

/**
 * Card 2.5: २.५ नाफा नोक्सान हिसाब र वासलात (Profit & Loss & Balance Sheet)
 */
export const CARD_2_5_FINAL_ACCOUNTS: StudyNote = CHAPTER_2_5_FINAL_ACCOUNTS;

/**
 * Card 2.6: २.६ वित्तीय अनुपात (Financial Ratio Analysis)
 */
export const CARD_2_6_RATIO_ANALYSIS: StudyNote = CHAPTER_2_6_RATIO_ANALYSIS;

/**
 * Card 2.7: २.७ आन्तरिक जाँच, आन्तरिक नियन्त्रण र आन्तरिक लेखापरीक्षण (Internal Check, Control & Audit)
 */
export const CARD_2_7_INTERNAL_CONTROL: StudyNote = CHAPTER_2_7_INTERNAL_CONTROL;

/**
 * Card 2.8: २.८ ह्रास कट्टी: प्रकार तथा विधिहरू (Depreciation: Types & Methods)
 */
export const CARD_2_8_DEPRECIATION: StudyNote = CHAPTER_2_8_DEPRECIATION;

/**
 * Card 2.9: २.९ सरकारी लेखा प्रणाली (Government Accounting System)
 */
export const CARD_2_9_GOVERNMENT_ACCOUNTING: StudyNote = CHAPTER_2_9_GOVERNMENT_ACCOUNTING;

/**
 * Card 2.10: २.१० लेखामान: नेपाल लेखामान, नेपाल वित्तीय प्रतिवेदनमान (NAS & NFRS)
 */
export const CARD_2_10_ACCOUNTING_STANDARDS: StudyNote = CHAPTER_2_10_ACCOUNTING_STANDARDS;

/**
 * Card 2.11: २.११ मौज्दात व्यवस्थापन (Inventory & Stock Management)
 */
export const CARD_2_11_INVENTORY_MANAGEMENT: StudyNote = CHAPTER_2_11_INVENTORY_MANAGEMENT;

// ============================================================================
// ALL 11 SYLLABUS CARDS FOR SECTION B (ACCOUNTING)
// ============================================================================
export const ACCOUNTING_SYLLABUS_CARDS: StudyNote[] = [
  CARD_2_1_ACCOUNTING_CONCEPTS,
  CARD_2_2_JOURNAL_CASHBOOK,
  CARD_2_3_TRIAL_BALANCE,
  CARD_2_4_RECONCILIATION,
  CARD_2_5_FINAL_ACCOUNTS,
  CARD_2_6_RATIO_ANALYSIS,
  CARD_2_7_INTERNAL_CONTROL,
  CARD_2_8_DEPRECIATION,
  CARD_2_9_GOVERNMENT_ACCOUNTING,
  CARD_2_10_ACCOUNTING_STANDARDS,
  CARD_2_11_INVENTORY_MANAGEMENT
];

// ============================================================================
// SECTION B SYLLABUS TOPICS ARRAY (Paper I -> Section B Accounting: 30 Marks)
// ============================================================================
export const ACCOUNTING_SECTION_B_TOPICS: TopicItem[] = [
  { 
    id: 'top-p1-b-01', 
    name: '२.१ बहिखाता तथा लेखा सम्बन्धी अवधारणा', 
    nameEnglish: '2.1 Bookkeeping & Accounting Concepts',
    completed: true, 
    noteId: 'note-accounting-2-1',
    weightageMarks: 5
  },
  { 
    id: 'top-p1-b-02', 
    name: '२.२ गोश्वारा भौचर, बैंक नगदी किताब', 
    nameEnglish: '2.2 Journal Voucher (JV) & Bank Cash Book',
    completed: true, 
    noteId: 'note-accounting-2-2',
    weightageMarks: 5
  },
  { 
    id: 'top-p1-b-03', 
    name: '२.३ सन्तुलन परीक्षण', 
    nameEnglish: '2.3 Trial Balance',
    completed: true, 
    noteId: 'note-accounting-2-3',
    weightageMarks: 5
  },
  { 
    id: 'top-p1-b-04', 
    name: '२.४ हिसाब मिलान विवरण', 
    nameEnglish: '2.4 Reconciliation Statements (BRS & Inter-Branch)',
    completed: true, 
    noteId: 'note-accounting-2-4',
    weightageMarks: 5
  },
  { 
    id: 'top-p1-b-05', 
    name: '२.५ नाफा नोक्सान हिसाब र वासलात', 
    nameEnglish: '2.5 Profit & Loss Account & Balance Sheet',
    completed: true, 
    noteId: 'note-accounting-2-5',
    weightageMarks: 10
  },
  { 
    id: 'top-p1-b-06', 
    name: '२.६ वित्तीय अनुपात', 
    nameEnglish: '2.6 Financial Ratio Analysis',
    completed: true, 
    noteId: 'note-accounting-2-6',
    weightageMarks: 5
  },
  { 
    id: 'top-p1-b-07', 
    name: '२.७ आन्तरिक जाँच, आन्तरिक नियन्त्रण र आन्तरिक लेखापरीक्षण', 
    nameEnglish: '2.7 Internal Check, Internal Control & Internal Audit',
    completed: true, 
    noteId: 'note-accounting-2-7',
    weightageMarks: 5
  },
  { 
    id: 'top-p1-b-08', 
    name: '२.८ ह्रास कट्टी: प्रकार तथा विधिहरू', 
    nameEnglish: '2.8 Depreciation: Types & Methods',
    completed: true, 
    noteId: 'note-accounting-2-8',
    weightageMarks: 5
  },
  { 
    id: 'top-p1-b-09', 
    name: '२.९ सरकारी लेखा प्रणाली', 
    nameEnglish: '2.9 Government Accounting System',
    completed: true, 
    noteId: 'note-accounting-2-9',
    weightageMarks: 5
  },
  { 
    id: 'top-p1-b-10', 
    name: '२.१० लेखामान: नेपाल लेखामान, नेपाल वित्तीय प्रतिवेदनमान', 
    nameEnglish: '2.10 Accounting Standards: Nepal Accounting Standards (NAS) & NFRS',
    completed: true, 
    noteId: 'note-accounting-2-10',
    weightageMarks: 5
  },
  { 
    id: 'top-p1-b-11', 
    name: '२.११ मौज्दात व्यवस्थापन', 
    nameEnglish: '2.11 Inventory / Stock Management',
    completed: true, 
    noteId: 'note-accounting-2-11',
    weightageMarks: 5
  }
];
