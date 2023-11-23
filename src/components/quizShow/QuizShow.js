import React, { useState } from 'react';
import styles from './QuizShow.module.css';

const QuizShow = ({ quizData }) => {
  // State variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answers, setAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(quizData.length);
  const [progressPercent, setProgressPercent] = useState(0);
  const [topProgressPercent, setTopProgressPercent] = useState(0);

  // Function to shuffle options 
  const shuffleOptions = (options) => {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  };

  // Function to render options dynamically
  const renderOptions = () => {
    const currentQuestion = quizData[currentQuestionIndex];
    const options = currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer);
    const shuffledOptions = shuffleOptions(options);

    return shuffledOptions.map((option, index) => (
      <li
        key={index}
        className={`${styles.option} ${feedback === 'Correct' && option === currentQuestion.correct_answer ? styles.correct : ''} ${
          feedback !== 'Correct' && option === selectedOption ? styles.selected : ''
        }`}
        onClick={() => !answerSubmitted && handleOptionClick(option === currentQuestion.correct_answer, option)}
      >
        {decodeURIComponent(option)}
      </li>
    ));
  };

  // Function to reset states for the next question
  const showQuestion = () => {
    setFeedback('');
    setShowNextButton(false);
    setSelectedOption(null);
    setAnswerSubmitted(false);
  };

  // Function to handle option click
  const handleOptionClick = (isCorrect, selectedOption) => {
    setAnswerSubmitted(true);
    setFeedback(isCorrect ? 'Correct' : 'Sorry. Please try again.');
    setSelectedOption(selectedOption);
    setShowNextButton(true);

    // Update correct answers and progress if the selected option is correct
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      const newProgressPercent = (correctAnswers + 1) / totalQuestions * 100;
      setProgressPercent(newProgressPercent);
    }

    // Update total answers and progress for any selected option
    if (selectedOption) {
      setAnswers(answers + 1);
      const newProgressPercent = (answers + 1) / totalQuestions * 100;
      setTopProgressPercent(newProgressPercent);
    }
  };

  // Function to move to the next question or end the quiz
  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      showQuestion();
    } else {
      setFeedback('Quiz Over');
      setShowNextButton(false);
    }
  };

  // Function to get star
  const getDifficultyStars = (difficulty) => {
    const stars = {
      easy: '⭐',
      medium: '⭐⭐',
      hard: '⭐⭐⭐',
    };

    return stars[difficulty] || '';
  };

  // Current question details
  const currentQuestion = quizData[currentQuestionIndex];

   
  return (
    <div className={styles.quizContainer}>
      {/* Progress meter */}
      <div id={styles.progressMeterContainer}>
        <div id={styles.progressMeter}>
          <div className={styles.foregroundYellow} style={{ width: `${topProgressPercent}%` }}></div>
        </div>
      </div>
      
      {/* Question details */}
      <div id={styles.questionNumber}>Question {currentQuestionIndex + 1} of {totalQuestions}</div>
      <div id={styles.difficultyStars} className={styles.stars}>
        Difficulty: {getDifficultyStars(currentQuestion.difficulty)}
      </div>
      <div id={styles.question} className={styles.question}>
        {decodeURIComponent(currentQuestion.question)}
      </div>

      {/* Options */}
      <ul id={styles.options} className={styles.options}>
        {renderOptions()}
      </ul>
      
      {/* Feedback and percentage indicators */}
      <div id={styles.feedback}>{feedback}</div>
      <div id={styles.percentageIndicator}>
        <div>
          {`Score: ${progressPercent.toFixed(2)}%`}
        </div>
        <div>
          Max Score: 75%
        </div>
      </div>

      {/* Progress bar */}
      <div id={styles.progressMeterContainer}>
        <div id={styles.progressMeter}>
          <div className={styles.backgroundBlack}></div>
          <div className={styles.foregroundYellow} style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
      
      {/* Next Question button */}
      {showNextButton && (
        <button id={styles.nextBtn} onClick={nextQuestion}>
          Next Question
        </button>
      )}
    </div>
  );
};

export default QuizShow;
