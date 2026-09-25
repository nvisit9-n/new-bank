import { SubjectCategory, DifficultyLevel, Question } from './index';

export type InstitutionId = 'NRB' | 'RBB' | 'NBL' | 'ADBL' | 'EPF' | 'CIT' | 'NTC' | 'NEA' | 'LOKSEWA' | 'ALL';

export type ExamLevelNumber = '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type ContentStatus = 'draft' | 'review' | 'approved' | 'published';

export type ContentDepthLevel = 1 | 2 | 3 | 4 | 5; // 1: Foundation, 2: Level 3/4, 3: Level 5/6, 4: Officer (6-9), 5: Research

export type QuestionArchetype = 
  | 'mcq'
  | 'multiple_response'
  | 'true_false'
  | 'assertion_reason'
  | 'match_following'
  | 'fill_blanks'
  | 'numerical'
  | 'short_answer_5m'
  | 'long_answer_10m'
  | 'comprehensive_15m'
  | 'case_study'
  | 'analytical'
  | 'data_interpretation'
  | 'legal_section'
  | 'interview_viva';

export type VerificationTier = 'TIER_1_GOV' | 'TIER_2_INTL' | 'TIER_3_ACADEMIC' | 'TIER_4_REPUTABLE';

export interface SourceRecord {
  id: string;
  sourceName: string;
  sourceType: 'Regulator_NRB' | 'Law_Commission' | 'Ministry_Finance' | 'NSO_Statistics' | 'Official_Gazette' | 'Annual_Report';
  tier: VerificationTier;
  publicationDate: string;
  referenceFiscalYear: string;
  topicRef: string;
  officialCitation: string;
  verificationStatus: 'CONFIRMED' | 'PENDING_GAZETTE' | 'NEEDS_VERIFICATION';
  urlOrDocRef?: string;
}

export interface SubjectiveModelAnswer {
  marks: 2 | 5 | 10 | 15;
  questionNepali: string;
  questionEnglish?: string;
  timeAllocationMinutes: number;
  structure: {
    introduction: string;
    definitionsAndLegalBase?: string;
    mainBodyPoints: { title: string; explanation: string }[];
    nepalBankingContext: string;
    challengesOrGaps?: string[];
    recommendationsOrWayForward?: string[];
    conclusion: string;
  };
  flowchartOrTableSummary?: {
    type: 'table' | 'flowchart' | 'framework';
    title: string;
    data: any;
  };
  examTips: string[];
}

export interface NumericalProblemSolution {
  id: string;
  title: string;
  topic: string;
  marks: number;
  problemStatementNepali: string;
  problemStatementEnglish?: string;
  givenData: { variable: string; symbol: string; value: string; unit?: string }[];
  requiredToCalculate: string[];
  applicableFormulas: { formulaName: string; latexOrText: string; explanation: string }[];
  stepByStepSolution: {
    stepNumber: number;
    stepTitle: string;
    calculationText: string;
    workingNote?: string;
  }[];
  finalAnswerText: string;
  interpretationAndExamTrap: string;
  relatedMcqIds?: string[];
}

export interface PreviousExamQuestionRecord {
  id: string;
  yearBS: string;
  yearAD?: string;
  institution: InstitutionId;
  postName: string;
  level: ExamLevelNumber;
  paper: 'Paper I (Pre-Test / General)' | 'Paper I (Written Core)' | 'Paper II (Service / Written Subjective)';
  topic: string;
  marks: number;
  questionNepali: string;
  questionEnglish?: string;
  difficulty: DifficultyLevel;
  repeatedFrequencyNote?: string;
  officialSourceCitation: string;
  modelAnswerSummary: string;
  keyConceptsTested: string[];
}

export interface MasterChapterSection {
  sectionNumber: string;
  titleNepali: string;
  titleEnglish: string;
  contentMarkdown: string;
  diagramSvgOrAscii?: string;
  keyTakeaways: string[];
  exactLegalClauses?: {
    actName: string;
    sectionClause: string;
    legalText: string;
    practicalApplication: string;
  }[];
}

export interface MasterChapter {
  id: string;
  chapterNumber: number;
  bookId: string;
  titleNepali: string;
  titleEnglish: string;
  subject: SubjectCategory;
  targetInstitutions: InstitutionId[];
  targetLevels: ExamLevelNumber[];
  depthLevel: ContentDepthLevel;
  estimatedStudyTimeMinutes: number;
  syllabusMapping: {
    institution: InstitutionId;
    level: ExamLevelNumber;
    paper: string;
    unitNumber: string;
    topicName: string;
  }[];
  sections: MasterChapterSection[];
  nepalContextAnalysis: string;
  numericalSolutions: NumericalProblemSolution[];
  subjectiveAnswers: SubjectiveModelAnswer[];
  highYieldMcqs: Question[];
  interviewVivaQuestions: {
    questionNepali: string;
    questionEnglish?: string;
    expectedInsight: string;
    sampleHighScoringResponse: string;
  }[];
  revisionSummary: {
    coreMemoryMnemonic?: string;
    bulletSummary: string[];
    quickReviewPoints: string[];
  };
  sources: SourceRecord[];
  status: ContentStatus;
  lastVerifiedDate: string;
}

export interface MasterBook {
  id: string;
  bookCode: string;
  titleNepali: string;
  titleEnglish: string;
  subject: SubjectCategory;
  targetLevels: ExamLevelNumber[];
  targetInstitutions: InstitutionId[];
  descriptionNepali: string;
  totalChapters: number;
  totalEstimatedHours: number;
  authorEditorialBoard: string;
  latestEditionYear: string;
  syllabusVersionCode: string;
  isPremium: boolean;
  priceNpr?: number;
  coverAccent: string;
  chapters: MasterChapter[];
}

export interface SyllabusTopicDiff {
  topicId: string;
  topicNameNepali: string;
  changeType: 'ADDED' | 'REMOVED' | 'MODIFIED' | 'UNCHANGED';
  previousSyllabusText?: string;
  currentSyllabusText: string;
  changeImpactNotice: string;
}

export interface SyllabusVersionRecord {
  id: string;
  institution: InstitutionId;
  postName: string;
  level: ExamLevelNumber;
  versionYearBS: string;
  status: 'CURRENT_OFFICIAL' | 'HISTORICAL_ARCHIVE';
  effectiveDateBS: string;
  officialGazetteRef: string;
  totalMarks: number;
  preTestMarks?: number;
  writtenPaperMarks?: number;
  interviewMarks?: number;
  hasNegativeMarking: boolean;
  negativeMarkingPercent: number;
  diffFromPreviousVersion?: SyllabusTopicDiff[];
}

export interface SyllabusTopicProgressItem {
  topicId: string;
  topicName: string;
  subject: SubjectCategory;
  status: 'NOT_STARTED' | 'LEARNING' | 'PRACTICED' | 'REVISED' | 'MASTERED';
  confidenceScore: number; // 0 - 100
  mcqAccuracy: number;
  lastStudiedAt?: string;
  notesBookmarked?: boolean;
}

export interface PersonalizedStudyPlan {
  userId: string;
  selectedInstitution: InstitutionId;
  selectedLevel: ExamLevelNumber;
  postName: string;
  targetExamDateBS?: string;
  dailyAvailableHours: number;
  currentPreparationStage: 'BEGINNER' | 'INTERMEDIATE' | 'INTENSIVE_REVISION' | 'MOCK_SPRINT';
  overallCompletionPercent: number;
  subjectProgress: {
    subject: SubjectCategory;
    totalTopics: number;
    masteredTopics: number;
    completionPercent: number;
  }[];
  spacedRevisionQueue: {
    topicId: string;
    topicName: string;
    scheduledForDate: string;
    intervalType: '1_DAY' | '3_DAY' | '7_DAY' | '15_DAY' | '30_DAY';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  weakAreasToTarget: {
    topicId: string;
    topicName: string;
    reason: string;
    recommendedLessonId: string;
  }[];
}
