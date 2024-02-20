import React from 'react';
import { useState, useEffect, ChangeEvent } from 'react';
import {
    Box, Text, Button, Image, Checkbox, CheckboxGroup, Stack,
    Circle, Flex, Grid, Center, IconButton, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Textarea, ModalFooter, useDisclosure
} from '@chakra-ui/react';
import { Question } from '../models/question';
import { WarningIcon } from '@chakra-ui/icons';
import { UserResponse } from '../models/userResponse';
import QuestionRequests from '../Api/question.requests';
import { MockExam } from '../models/mockExam';
import { Answer } from '../models/answer';
import { QuestionReport } from '../models/questionReport';
import { useTranslation } from 'react-i18next';

interface TopicQuestionViewProps {
    initialQuestions: Question[];
}

type QuestionCardProps = {
    imageUrl: string;
    question: Question;
};

type AnswerCardProps = {
    answers: Answer[];
    questionStatus: string;
    onAnswerSelect: (answerId: number, selected: boolean) => void;
};

type TableCardProps = {
    questions: Question[];
    onQuestionSelect: (index: number) => void;
    viewedQuestions: { [key: number]: boolean };
};

type ReportModalProps = {

}

type ExplanationCardProps = {
    explanation: string;
    showExplanation: boolean; // Add this line
}

const TopicQuestionView: React.FC<TopicQuestionViewProps> = ({ initialQuestions = [] }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [viewedQuestions, setViewedQuestions] = useState<{ [key: number]: boolean }>({});
    const { t } = useTranslation();

    useEffect(() => {
        setQuestions(initialQuestions);
        console.log(initialQuestions);
    }, [initialQuestions]);

    // const LoadData = async () => {
    //     const storedUser = localStorage.getItem('userResp');
    //     setUser(storedUser ? JSON.parse(storedUser) : null);
    // }

    const handleAnswerSelect = (answerId: number, selected: boolean) => {
        const updatedQuestions = questions.map((question, index) => {
            if (index === currentQuestionIndex) {
                const updatedAnswers = question.answers.map((answer) => {
                    return answer.answer_id === answerId ? { ...answer, selected } : answer;
                });

                return {
                    ...question,
                    answers: updatedAnswers,
                };
            }
            return question;
        });

        setQuestions(updatedQuestions);
    };

    const handleQuestionSelect = (index: number) => {
        setCurrentQuestionIndex(index);
        setViewedQuestions((prev) => ({ ...prev, [index]: true }));
    };

    const handleSubmitAnswer = async () => {
        const updatedQuestions = questions.map((question, index) => {
            if (index === currentQuestionIndex) {
                // Assume multiple correct answers are possible
                let correctAnswers = question.answers.filter(ans => ans.is_correct).map(ans => ans.answer_id);
                let selectedAnswers = question.answers.filter(ans => ans.selected).map(ans => ans.answer_id);

                // Evaluate correctness
                const isCorrect = correctAnswers.length === selectedAnswers.length && correctAnswers.every(id => selectedAnswers.includes(id));

                return {
                    ...question,
                    status: isCorrect ? 'correct' : 'incorrect', // Update question status based on correctness
                };
            }
            return question;
        });

        await QuestionRequests.postQuestion(questions[currentQuestionIndex]);

        setQuestions(updatedQuestions);
    };


    function QuestionCard({ imageUrl, question }: QuestionCardProps) {
        return (
            <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Image src={imageUrl} alt="Question image" />

                <Box p="6">
                    <Text fontWeight="bold" fontSize="xl" textAlign="center">
                        {question.question}
                    </Text>
                </Box>
            </Box>
        );
    }

    function AnswerCard({ answers, onAnswerSelect, questionStatus }: AnswerCardProps) {
        const isDisabled = questionStatus !== 'unanswered'; // Assuming 'unanswered' is the default status

        const handleCheckboxChange = (answerId: number) => (e: ChangeEvent<HTMLInputElement>) => {
            if (!isDisabled) { // Only process changes if the question is not answered
                onAnswerSelect(answerId, e.target.checked);
            }
        };

        return (
            <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Box p="6">
                    <CheckboxGroup>
                        <Stack spacing={3}>
                            {answers.map((answer) => (
                                <Checkbox
                                    key={answer.answer_id}
                                    isChecked={answer.selected}
                                    onChange={handleCheckboxChange(answer.answer_id)}
                                    isDisabled={isDisabled}
                                >
                                    {answer.answer}
                                </Checkbox>
                            ))}
                        </Stack>
                    </CheckboxGroup>
                </Box>
            </Box>
        );
    }


    function TableCard({ questions, onQuestionSelect, viewedQuestions }: TableCardProps) {
        return (
            <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Box p="6">
                    <Flex wrap="wrap" gap="2">
                        {questions.map((question, index) => {
                            let bgColor = 'gray.200'; // Default background color
                            if (question.status === 'correct') {
                                bgColor = 'green';
                            } else if (question.status === 'incorrect') {
                                bgColor = 'red';
                            } else if (viewedQuestions[index]) {
                                bgColor = 'blue.500';
                            }

                            return (
                                <Circle
                                    key={index}
                                    size="30px"
                                    bg={bgColor}
                                    color="white"
                                    cursor="pointer"
                                    onClick={() => onQuestionSelect(index)}
                                >
                                    {index + 1}
                                </Circle>
                            );
                        })}
                    </Flex>
                    <Flex align="center" mt="4">
                        <Circle size="15px" bg="green" color="white" mr="2" />
                        <Text fontSize="sm" mr="4">{t('correct')}</Text>
                        <Circle size="15px" bg="red" color="white" mr="2" />
                        <Text fontSize="sm" mr="4"  >{t('wrong')}</Text>
                        <Circle size="15px" bg="blue.500" color="white" mr="2" />
                        <Text fontSize="sm" mr="4">{t('viewed')}</Text>
                    </Flex>
                </Box>
            </Box>
        );
    }

    function ExplanationCard({ explanation, showExplanation }: ExplanationCardProps) {
        return (
            <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Box p="6">
                    {showExplanation && (
                        <Text fontWeight="bold" fontSize="xl" textAlign="center" mb="4">
                            {t('explanation')}
                        </Text>
                    )}
                    <Text fontSize="md">{explanation}</Text>
                </Box>
            </Box>
        );
    }

    const ReportModal: React.FC<ReportModalProps> = () => {
        const { isOpen, onOpen, onClose } = useDisclosure();
        const [reportText, setReportText] = useState('');

        const handleReportSubmit = async () => {
            const questionReport: QuestionReport = {
                question_id: questions[currentQuestionIndex].question_id,
                report: reportText,
                report_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            }

            await QuestionRequests.postQuestionReport(questionReport);
            onClose(); // Close the modal after submitting
            setReportText(''); // Clear the report text
        };

        return (
            <>
                <IconButton
                    icon={<WarningIcon />}
                    onClick={onOpen}
                    aria-label="Report Question"
                />
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{t('report_question')}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Textarea
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                                placeholder={t('report_explanation')}
                                mt={4}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button mr={3} onClick={onClose}>
                            {t('cancel')}
                            </Button>
                            <Button colorScheme="blue" onClick={handleReportSubmit}>{t('send')}</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        );
    };


    return (
        <Center>
            <Box p="5">
                {questions.length > 0 && (
                    <Box>
                        <Grid
                            templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
                            templateRows={{ base: "repeat(5, auto)", md: "repeat(2, auto)" }}
                            gap={{ base: "3", md: "2" }}
                            alignItems="start"
                        >
                            <Box gridArea={{ base: "4 / 1 / 5 / 2", md: "1 / 1 / 2 / 2" }}>
                                <TableCard
                                    questions={questions}
                                    onQuestionSelect={handleQuestionSelect}
                                    viewedQuestions={viewedQuestions}
                                />
                            </Box>

                            <Box gridArea={{ base: "1 / 1 / 2 / 2", md: "1 / 2 / 2 / 3" }}>
                                <QuestionCard
                                    imageUrl={questions[currentQuestionIndex].image}
                                    question={questions[currentQuestionIndex]}
                                />
                            </Box>

                            <Box gridArea={{ base: "2 / 1 / 3 / 2", md: "2 / 2 / 3 / 3" }}>
                                <AnswerCard
                                    answers={questions[currentQuestionIndex].answers}
                                    onAnswerSelect={handleAnswerSelect}
                                    questionStatus={questions[currentQuestionIndex].status}
                                />
                            </Box>

                            <Box gridArea={{ base: "5 / 1 / 6 / 2", md: "1 / 3 / 2 / 4" }}>
                                <ExplanationCard
                                    explanation={questions[currentQuestionIndex].explanation}
                                    showExplanation={questions[currentQuestionIndex].status !== 'unanswered'}
                                />
                            </Box>

                            <Box
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                gridArea={{ base: "3 / 1 / 4 / 2", md: "3 / 2 / 4 / 3" }}
                            >
                                <Box display="flex" justifyContent="space-between" p="6">
                                    <Button
                                        onClick={() => handleQuestionSelect(Math.max(currentQuestionIndex - 1, 0))}
                                        isDisabled={currentQuestionIndex === 0}
                                    >
                                        ◄
                                    </Button>

                                    <ReportModal />

                                    <Button
                                        aria-label="Submit Answer"
                                        onClick={handleSubmitAnswer}
                                        isDisabled={questions[currentQuestionIndex].status !== 'unanswered'}
                                    >
                                        {t('sumbit_answer')}
                                    </Button>

                                    <Button
                                        onClick={() => handleQuestionSelect(Math.min(currentQuestionIndex + 1, questions.length - 1))}
                                        isDisabled={currentQuestionIndex === questions.length - 1}
                                    >
                                        ►
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Box>
                )}
            </Box>
        </Center>


    );
}

export default TopicQuestionView;
