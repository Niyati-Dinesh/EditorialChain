import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx'; // For potential future use (e.g., saving results)

// --- Helper Functions ---
const calculateReadingTime = (text) => {
  if (!text || typeof text !== 'string') return 0;
  const wordsPerMinute = 225;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return time;
};

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAppContext(); // Get user for potential saving actions

  // Get article data passed from the previous page
  const article = location.state?.article;

  const [questions, setQuestions] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!article) {
      setError("Article data not found. Please go back and select an article.");
      setLoadingQuiz(false);
      return;
    }

    // --- ** SIMULATION ** ---
    // Fetch or generate quiz questions based on article.id or article.content
    // For now, using mock questions like before
    setLoadingQuiz(true);
    setError(null);
    try {
        // Simulate fetching/generating questions
        setTimeout(() => {
            const mockQuestions = [
                { id: `${article.article_id}-q1` || `q1-${Date.now()}`, question: `What is the main topic related to "${article.title.substring(0, 30)}..."?`, options: ['Topic A', article.category?.[0]?.replace(/_/g, ' ').toUpperCase() || 'Unknown Topic', 'Topic C'], correct: article.category?.[0]?.replace(/_/g, ' ').toUpperCase() || 'Unknown Topic'},
                { id: `${article.article_id}-q2` || `q2-${Date.now()}`, question: 'Which source published this article?', options: [article.source_id || 'Unknown', 'A New Source', 'Another Source'], correct: article.source_id || 'Unknown'},
                { id: `${article.article_id}-q3` || `q3-${Date.now()}`, question: 'Based on the estimated reading time, is this a quick read?', options: [article.readingTime <= 5 ? 'Yes (Correct)' : 'Yes', article.readingTime > 5 ? 'No (Correct)' : 'No', 'Maybe'], correct: article.readingTime <= 5 ? 'Yes (Correct)' : 'No (Correct)'}
            ];
            setQuestions(mockQuestions);
            setLoadingQuiz(false);
        }, 500); // Simulate network delay

    } catch(err) {
        console.error("Error generating/fetching quiz:", err);
        setError("Could not load the quiz questions.");
        setLoadingQuiz(false);
    }
    // --- End Simulation ---

  }, [article]); // Rerun if article changes (though unlikely in this flow)

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = () => {
    if (!questions || questions.length === 0) return;
    let score = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        score++;
      }
    });
    setQuizScore(score);
    setSubmittedQuiz(true);
    // TODO: Save quiz result (score, articleId, userId) to Firestore
    console.log(`Quiz submitted for article ${article.article_id}, User: ${currentUser?.uid}, Score: ${score}/${questions.length}`);
  };

  const isQuizComplete = Object.keys(selectedAnswers).length === questions.length;

  // Calculate reading time again or use passed value
  const readingTime = article?.readingTime || calculateReadingTime(article?.content || article?.description || '');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="mb-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          <ArrowLeft size={16} />
          Back to Articles
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 id="quiz-title" className="text-xl font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
              Comprehension Quiz
            </h1>
            {article && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1" title={article.title}>
                Article: {article.title}
              </p>
            )}
            {readingTime > 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Estimated reading time: {readingTime} min
                </p>
            )}
          </div>

          {/* Body */}
          <div className="p-6">
            {loadingQuiz ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading Quiz...</span>
              </div>
            ) : error ? (
                 <div className="text-center py-10 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-6">
                   <XCircle className="h-12 w-12 text-red-400 dark:text-red-500 mx-auto mb-3" />
                   <p className="font-semibold text-red-700 dark:text-red-300">Error Loading Quiz</p>
                   <p className="text-sm text-red-500 dark:text-red-400 mt-1">{error}</p>
                 </div>
            ) : questions.length === 0 ? (
                 <div className="text-center py-10">
                   <HelpCircle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                   <p className="font-semibold text-gray-700 dark:text-gray-300">No Quiz Available</p>
                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">A quiz could not be generated for this article.</p>
                 </div>
            ) : (
              <div className="space-y-6">
                {questions.map((q, qIndex) => (
                  <fieldset key={q.id} className="border-t border-gray-200 dark:border-gray-700 pt-5 first:border-t-0 first:pt-0">
                    <legend className="font-medium mb-3 text-gray-700 dark:text-gray-300 text-base">
                      {qIndex + 1}. {q.question}
                    </legend>
                    <div className="space-y-2">
                      {q.options.map((option, oIndex) => {
                         const isSelected = selectedAnswers[q.id] === option;
                         const isCorrect = q.correct === option;
                         let buttonClass = 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'; // Default
                         let resultIcon = null;

                         if (submittedQuiz) {
                             if (isSelected && isCorrect) {
                                 buttonClass = 'border-green-500 bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-300 ring-1 ring-green-500';
                                 resultIcon = <CheckCircle size={16} className="text-green-600 dark:text-green-400 ml-auto flex-shrink-0"/>;
                             } else if (isSelected && !isCorrect) {
                                 buttonClass = 'border-red-500 bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-300 ring-1 ring-red-500';
                                 resultIcon = <XCircle size={16} className="text-red-600 dark:text-red-400 ml-auto flex-shrink-0"/>;
                             } else if (!isSelected && isCorrect) {
                                  buttonClass = 'border-green-500 bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-300 opacity-80';
                             } else {
                                  buttonClass = 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 opacity-60';
                             }
                         } else if (isSelected) {
                              buttonClass = 'border-blue-500 bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 ring-1 ring-blue-500';
                         }

                        return (
                          <button
                            key={oIndex}
                            onClick={() => !submittedQuiz && handleAnswerSelect(q.id, option)}
                            disabled={submittedQuiz}
                            className={`w-full text-left p-3 border rounded-lg text-sm transition-colors flex items-center justify-between ${buttonClass} ${submittedQuiz ? 'cursor-default' : 'cursor-pointer'}`}
                            aria-pressed={isSelected}
                          >
                            <span className="flex-1 mr-2">{option}</span>
                            {resultIcon}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
                {/* Score Display */}
                {submittedQuiz && quizScore !== null && (
                  <div className="mt-6 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 text-center">
                    <p className="font-semibold text-indigo-800 dark:text-indigo-200 text-lg">
                       Final Score: {quizScore} / {questions.length}
                    </p>
                    <p className="text-sm mt-1 text-indigo-600 dark:text-indigo-300">
                       {quizScore === questions.length ? "Excellent comprehension!" : quizScore >= questions.length / 2 ? "Good understanding!" : "Keep practicing!"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer (Submit Button) - only show if not loading, no error, and questions exist */}
          {!loadingQuiz && !error && questions.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  {!submittedQuiz ? (
                      <button
                          onClick={handleSubmitQuiz}
                          disabled={!isQuizComplete} // Disable if not all questions answered
                          className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                      >
                          Submit Answers
                      </button>
                  ) : (
                      <button
                          onClick={() => navigate(-1)} // Or navigate somewhere else
                          className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
                      >
                          Back to Articles
                      </button>
                  )}
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;