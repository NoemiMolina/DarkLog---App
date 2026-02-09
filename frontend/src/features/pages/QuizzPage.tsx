import React, { useState, useEffect } from "react";
import { API_URL } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { GiRaiseZombie } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { SiGhostery } from "react-icons/si";
import { FaGhost } from "react-icons/fa6";
import { GiGhost } from "react-icons/gi";

interface Question {
    question: string;
    options: string[];
    correctIndex: number;
}

interface QuizzPageProps {
    isTVShowMode: boolean;
}

const QuizzPage: React.FC<QuizzPageProps> = ({ isTVShowMode }) => {
    const navigate = useNavigate();
    const [mediaType, setMediaType] = useState<'movies' | 'tvshows'>('movies');
    const [showDifficultyModal, setShowDifficultyModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<'culture' | 'dumbDescription' | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);

    useEffect(() => {
        if (!quizStarted) {
            setMediaType(isTVShowMode ? 'tvshows' : 'movies');
        }
    }, [isTVShowMode, quizStarted]);

    const handleCategoryClick = (category: 'culture' | 'dumbDescription') => {
        setSelectedCategory(category);
        setShowDifficultyModal(true);
    };

    const startQuiz = async (difficulty: 'easy' | 'medium' | 'hard') => {
        try {
            const token = localStorage.getItem('token');
            const quizUrl = `${API_URL}/quiz/${mediaType}/${selectedCategory}/${difficulty}`;
            console.log('🎯 Starting quiz with:', {
                mediaType,
                selectedCategory,
                difficulty,
                url: quizUrl,
                token: token ? 'present' : 'missing'
            });
            const response = await fetch(quizUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log('📊 Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API Error:', response.status, errorText);
                throw new Error(`Failed to fetch questions: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Quiz data fetched:', data);
            setQuestions(data.questions);
            setCurrentQuestionIndex(0);
            setScore(0);
            setSelectedAnswer(null);
            setShowResult(false);
            setQuizStarted(true);
            setShowDifficultyModal(false);
        } catch (error) {
            console.error('Error fetching quiz:', error);
            alert('Failed to load quiz. Please try again.');
        }
    };

    const handleAnswerClick = (answer: string) => {
        if (selectedAnswer) return;

        setSelectedAnswer(answer);

        if (questions[currentQuestionIndex].correctIndex === questions[currentQuestionIndex].options.indexOf(answer)) {
            setScore(score + 10);
        }
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(null);
            } else {
                setShowResult(true);
            }
        }, 2000);
    };

    const resetQuiz = () => {
        setQuizStarted(false);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setSelectedCategory(null);
    };

    if (quizStarted && !showResult) {
        const currentQuestion = questions[currentQuestionIndex];

        return (
            <div className="min-h-screen bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] text-white p-8">
                <button
                    onClick={() => navigate('/home')}
                    className="absolute top-4 right-4 text-white text-3xl hover:opacity-70 transition-opacity"
                    aria-label="Close quiz"
                >
                    <IoClose />
                </button>
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8 text-center">
                        <p className="text-xl text-gray-400">
                            Question {currentQuestionIndex + 1} / {questions.length}
                        </p>
                        <p className="text-3xl font-bold mt-2">Score: {score}</p>
                    </div>

                    <Card className="bg-[#2A2A2A] border-red-900/50 border-2">
                        <CardContent className="p-8">
                            <h2 className="text-2xl mb-8 text-white text-center">{currentQuestion.question}</h2>

                            <div className="space-y-4">
                                {currentQuestion.options.map((option, index) => {
                                    let buttonStyle = "bg-[#1A1A1A] hover:bg-[#333333] border-white/20";

                                    if (selectedAnswer) {
                                        if (index === currentQuestion.correctIndex) {
                                            buttonStyle = "bg-green-600 border-green-400";
                                        } else if (option === selectedAnswer) {
                                            buttonStyle = "bg-red-600 border-red-400 hover:bg-red-600";
                                        }
                                    }

                                    return (
                                        <Button
                                            key={index}
                                            onClick={() => handleAnswerClick(option)}
                                            disabled={selectedAnswer !== null}
                                            className={`w-full py-6 text-lg ${buttonStyle} transition-all duration-300`}
                                        >
                                            {option}
                                        </Button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (showResult) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] text-white flex items-center justify-center p-4 sm:p-8">
                <Card className="bg-[#2A2A2A] border-red-900/50 border-2 max-w-2xl w-full">
                    <CardContent className="p-6 sm:p-12 text-center">
                        <GiRaiseZombie className="text-6xl sm:text-9xl mx-auto mb-4 sm:mb-6 text-red-600" />
                        <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">Quiz Completed!</h2>
                        <p className="text-4xl sm:text-6xl font-bold text-green-400 mb-6 sm:mb-8">
                            {score} / {questions.length * 10}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button
                                onClick={resetQuiz}
                                className="bg-red-600 hover:bg-red-700 text-base sm:text-xl px-4 sm:px-8 py-3 sm:py-6"
                            >
                                Try Another Quiz
                            </Button>
                            <Button
                                onClick={() => navigate('/home')}
                                className="bg-gray-600 hover:bg-gray-700 text-base sm:text-xl px-4 sm:px-8 py-3 sm:py-6"
                            >
                                Home
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen dark:bg-gray-700 text-white flex flex-col items-center justify-center p-4 sm:p-8">
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 text-white text-2xl hover:opacity-70 transition-opacity"
                aria-label="Go back"
            >
                &lt;
            </button>
            <GiRaiseZombie className="text-5xl sm:text-9xl mb-4 text-red-600 animate-pulse" />
            <p className="text-xs sm:text-sm text-gray-400 mb-2">Welcome to our</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 text-red-600 tracking-wider text-center animate-pulse">HORROR QUIZZ</h1>
            <p className="text-sm sm:text-lg font-bold text-gray-300 mb-8 sm:mb-12 text-center max-w-2xl">
                Challenge your horrific knowledge with our home made quizz
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl w-full">
                <Card
                    className="bg-[#2A2A2A] border-red-900/50 border-2 cursor-pointer hover:scale-105 transition-transform duration-300 hover:border-red-600 text-red-600 animate-pulse"
                    onClick={() => handleCategoryClick('culture')}
                >
                    <CardContent className="p-4 sm:p-8 text-center">
                        <h3 className="text-lg sm:text-3xl font-bold mb-2 sm:mb-4">General Culture</h3>
                        <p className="text-white font-semibold">
                            Test your knowledge about {mediaType === 'movies' ? 'horror movies' : 'horror TV shows'}.
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className="bg-[#2A2A2A] border-red-900/50 border-2 cursor-pointer hover:scale-105 transition-transform duration-300 hover:border-red-600 text-red-600 animate-pulse"
                    onClick={() => handleCategoryClick('dumbDescription')}
                >
                    <CardContent className="p-4 sm:p-8 text-center">
                        <h3 className="text-lg sm:text-3xl font-bold mb-2 sm:mb-4">Dumb Description</h3>
                        <p className="text-white text-sm sm:text-base font-semibold">
                            Guess the {mediaType === 'movies' ? 'movie' : 'show'} from the worst descriptions.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={showDifficultyModal} onOpenChange={setShowDifficultyModal}>
                <DialogContent className="bg-[#2A2A2A] border-red-900/50 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-center">Choose Difficulty</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <Button
                            onClick={() => startQuiz('easy')}
                            className="w-full bg-green-600 hover:bg-green-700 text-xl py-6"
                        >
                            < SiGhostery /> Easy
                        </Button>
                        <Button
                            onClick={() => startQuiz('medium')}
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-xl py-6"
                        >
                            < FaGhost /> Medium
                        </Button>
                        <Button
                            onClick={() => startQuiz('hard')}
                            className="w-full bg-red-600 hover:bg-red-700 text-xl py-6"
                        >
                            < GiGhost /> Hard
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default QuizzPage;