import React from 'react';
import { FlashcardEngine } from './FlashcardEngine';

export const FlashcardsScreen: React.FC = () => {
  return (
    <div className="w-full">
      <FlashcardEngine />
    </div>
  );
};

export default FlashcardsScreen;
