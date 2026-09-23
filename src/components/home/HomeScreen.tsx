import React, { useState, useEffect } from 'react';
import { HomeTopProfileHeader } from './HomeTopProfileHeader';
import { HomeOverallProgressBar } from './HomeOverallProgressBar';
import { HomeTargetExamCards } from './HomeTargetExamCards';
import { HomeQuickAccessGrid } from './HomeQuickAccessGrid';
import { CategoryExamsListPage } from './CategoryExamsListPage';
import { ExamOverviewPage } from './ExamOverviewPage';
import { PhaseTopicsPage } from './PhaseTopicsPage';
import { LessonDetailPage } from './LessonDetailPage';
import { 
  EXAM_CATEGORIES, 
  TARGET_EXAMS_DATA, 
  ExamCategory, 
  TargetExam, 
  ExamPhase, 
  ExamTopicDetail 
} from '../../data/examDrillDownData';

type DrillDownLevel = 'home' | 'category' | 'exam' | 'phase' | 'topic';

interface DrillDownState {
  level: DrillDownLevel;
  selectedCategoryId: 'banking' | 'enterprises' | 'loksewa' | null;
  selectedExamId: string | null;
  selectedPhaseId: string | null;
  selectedTopicId: string | null;
}

export const HomeScreen: React.FC = () => {
  const [drillDown, setDrillDown] = useState<DrillDownState>({
    level: 'home',
    selectedCategoryId: null,
    selectedExamId: null,
    selectedPhaseId: null,
    selectedTopicId: null
  });

  // Scroll to top smoothly whenever drill-down navigation occurs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    drillDown.level, 
    drillDown.selectedCategoryId, 
    drillDown.selectedExamId, 
    drillDown.selectedPhaseId, 
    drillDown.selectedTopicId
  ]);

  // Step 1: User selects one of the 3 Core Categories from Home
  const handleSelectCategory = (categoryId: 'banking' | 'enterprises' | 'loksewa') => {
    setDrillDown({
      level: 'category',
      selectedCategoryId: categoryId,
      selectedExamId: null,
      selectedPhaseId: null,
      selectedTopicId: null
    });
  };

  // Step 2: User selects an exam within the category (e.g. NRB, RBB, NBL, ADBL)
  const handleSelectExam = (examId: string) => {
    const exam = TARGET_EXAMS_DATA[examId];
    setDrillDown(prev => ({
      level: 'exam',
      selectedCategoryId: exam?.categoryId || prev.selectedCategoryId || 'banking',
      selectedExamId: examId,
      selectedPhaseId: null,
      selectedTopicId: null
    }));
  };

  // Step 3: User drills into a Phase (e.g. चरण १: पूर्वयोग्यता परीक्षा)
  const handleSelectPhase = (phaseId: string) => {
    setDrillDown(prev => ({
      ...prev,
      level: 'phase',
      selectedPhaseId: phaseId,
      selectedTopicId: null
    }));
  };

  // Step 4: User drills into a specific Topic (e.g. नेपाल राष्ट्र बैंक ऐन, २०५८)
  const handleSelectTopic = (topicId: string) => {
    setDrillDown(prev => ({
      ...prev,
      level: 'topic',
      selectedTopicId: topicId
    }));
  };

  // Back Navigation Handlers
  const handleBackToHome = () => {
    setDrillDown({
      level: 'home',
      selectedCategoryId: null,
      selectedExamId: null,
      selectedPhaseId: null,
      selectedTopicId: null
    });
  };

  const handleBackToCategory = () => {
    setDrillDown(prev => ({
      level: 'category',
      selectedCategoryId: prev.selectedCategoryId || 'banking',
      selectedExamId: null,
      selectedPhaseId: null,
      selectedTopicId: null
    }));
  };

  const handleBackToExam = () => {
    setDrillDown(prev => ({
      ...prev,
      level: 'exam',
      selectedPhaseId: null,
      selectedTopicId: null
    }));
  };

  const handleBackToPhase = () => {
    setDrillDown(prev => ({
      ...prev,
      level: 'phase',
      selectedTopicId: null
    }));
  };

  // Active Data Resolution
  const currentCategory: ExamCategory | undefined = drillDown.selectedCategoryId
    ? EXAM_CATEGORIES[drillDown.selectedCategoryId]
    : undefined;

  const currentExam: TargetExam | undefined = drillDown.selectedExamId 
    ? TARGET_EXAMS_DATA[drillDown.selectedExamId] || TARGET_EXAMS_DATA.nrb
    : undefined;

  const currentPhase: ExamPhase | undefined = currentExam && drillDown.selectedPhaseId
    ? currentExam.phases.find(p => p.id === drillDown.selectedPhaseId) || currentExam.phases[0]
    : undefined;

  const currentTopic: ExamTopicDetail | undefined = currentPhase && drillDown.selectedTopicId
    ? currentPhase.topics.find(t => t.id === drillDown.selectedTopicId) || currentPhase.topics[0]
    : undefined;

  // Level 4: Specific Lesson / Note Detail Page
  if (drillDown.level === 'topic' && currentExam && currentPhase && currentTopic) {
    return (
      <LessonDetailPage
        exam={currentExam}
        phase={currentPhase}
        topic={currentTopic}
        category={currentCategory}
        onBackToPhase={handleBackToPhase}
        onBackToExam={handleBackToExam}
        onBackToCategory={handleBackToCategory}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Level 3: Phase Topics Page
  if (drillDown.level === 'phase' && currentExam && currentPhase) {
    return (
      <PhaseTopicsPage
        exam={currentExam}
        phase={currentPhase}
        category={currentCategory}
        onBackToExam={handleBackToExam}
        onBackToCategory={handleBackToCategory}
        onBackToHome={handleBackToHome}
        onSelectTopic={handleSelectTopic}
      />
    );
  }

  // Level 2: Dedicated Exam Overview Page
  if (drillDown.level === 'exam' && currentExam) {
    return (
      <ExamOverviewPage
        exam={currentExam}
        category={currentCategory}
        onBackToHome={handleBackToHome}
        onBackToCategory={handleBackToCategory}
        onSelectPhase={handleSelectPhase}
      />
    );
  }

  // Level 1: Category Exams List Page (Choose NRB/RBB/NBL/ADBL or NTC/NEA/EPF/CIT or Officer/NaSu/Kharidar)
  if (drillDown.level === 'category' && currentCategory) {
    return (
      <CategoryExamsListPage
        category={currentCategory}
        onBackToHome={handleBackToHome}
        onSelectExam={handleSelectExam}
      />
    );
  }

  // Level 0: Clean, Compact & Premium Home Dashboard
  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* 1. Compact Top Profile & XP Summary Header */}
      <HomeTopProfileHeader />

      {/* 2. High-level Overall Progress Bar (Circular/Horizontal summary) */}
      <HomeOverallProgressBar />

      {/* 3. Target Exam Selection Cards (3 Core Categories Matching Sidebar Navigation) */}
      <HomeTargetExamCards onSelectCategory={handleSelectCategory} />

      {/* 4. Quick-Access Module Grid (Syllabus, Videos, Notes Hub, Quizzes, Tools, Portal) */}
      <HomeQuickAccessGrid />
    </div>
  );
};

export default HomeScreen;
