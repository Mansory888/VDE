import React from 'react';
import { useState, useEffect, ChangeEvent, useRef } from 'react';
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
import FinishPage from './finish-page';

type QuestionCardProps = {
    imageUrl: string;
    question: Question;
};

type AnswerCardProps = {
    answers: Answer[];
    onAnswerSelect: (answerId: number, selected: boolean) => void;
};

type TableCardProps = {
    questions: Question[];
    onQuestionSelect: (index: number) => void;
    viewedQuestions: { [key: number]: boolean };
};

type ReportModalProps = {

}

type TimerCardProps = {
    timeLeft: number;
    formatTimeLeft: (time: number) => string;
    onRetryExam: () => Promise<void>;
}

function ExamQuestionView() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [mockExam, setMockExam] = useState<MockExam | null>(null);
    const [ResultmockExam, setResultMockExam] = useState<MockExam | null>(null);
    const [viewedQuestions, setViewedQuestions] = useState<{ [key: number]: boolean }>({});
    const initialTime = 10;
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [finished, setIsFinished] = useState(false);
    const mockExamRef = useRef<MockExam | null>(mockExam);
    const { t } = useTranslation();

    useEffect(() => {
        LoadData();

        const interval = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                    finishExam();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval);

    }, []);

    useEffect(() => {
        mockExamRef.current = mockExam;
    }, [mockExam]);

    const formatTimeLeft = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const LoadData = async () => {
        const storedUser = localStorage.getItem('userResp');
        setUser(storedUser ? JSON.parse(storedUser) : null);

        const mockExam = await QuestionRequests.getExam(user?.language_id || 1);

        setMockExam(mockExam);
        setQuestions(mockExam.questions?.questions || []);
    }

    const handleAnswerSelect = (answerId: number, selected: boolean) => {
        // Update the selected state of the answer in the current question
        const updatedQuestions = questions.map((question, index) => {
            if (index === currentQuestionIndex) {
                return {
                    ...question,
                    answers: question.answers.map((answer) => {
                        if (answer.answer_id === answerId) {
                            return { ...answer, selected };
                        }
                        return answer;
                    }),
                };
            }
            return question;
        });
        setQuestions(updatedQuestions);
    };

    const finishExam = async () => {
        const currentMockExam = mockExamRef.current;
        if (currentMockExam) {
            currentMockExam.questions!.questions = [...questions];
            const responseExam = await QuestionRequests.postMockExam(currentMockExam);
            setResultMockExam(responseExam);
            setIsFinished(true);
        }
    }

    const handleQuestionSelect = (index: number) => {
        setCurrentQuestionIndex(index);
        setViewedQuestions((prev) => ({ ...prev, [index]: true }));
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

    function AnswerCard({ answers, onAnswerSelect }: AnswerCardProps) {
        const handleCheckboxChange = (answerId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
            onAnswerSelect(answerId, e.target.checked);
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
                        {questions.map((question, index) => (
                            <Circle
                                key={index}
                                size="30px"
                                bg={
                                    question.answers.some((answer) => answer.selected)
                                        ? 'violet'
                                        : viewedQuestions[index]
                                            ? 'blue.500'
                                            : 'gray.200'
                                }
                                color="white"
                                cursor="pointer"
                                onClick={() => onQuestionSelect(index)}
                            >
                                {index + 1}
                            </Circle>
                        ))}
                    </Flex>
                    <Flex align="center" mt="4">
                        <Circle size="15px" bg="blue.500" color="white" mr="2" />
                        <Text fontSize="sm" mr="4">{t('viewed')}</Text>
                        <Circle size="15px" bg="violet" color="white" mr="2" />
                        <Text fontSize="sm">{t('answered')}</Text>
                    </Flex>
                </Box>
            </Box>
        );
    }

    function TimerCard({ timeLeft, formatTimeLeft, onRetryExam }: TimerCardProps) {
        return (
            <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Box p="6">
                    <Text fontWeight="bold" fontSize="xl" textAlign="center" mb="4">
                        Remaining Time
                    </Text>
                    <Text fontSize="2xl" textAlign="center" mb="4">
                        {formatTimeLeft(timeLeft)}
                    </Text>
                    <Center> <Button mt={4} onClick={onRetryExam} >Finish Now</Button> </Center>
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
        <Box>
            {finished ? (
                <FinishPage inputMockExam={ResultmockExam} />
            ) : (
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
                                        />
                                    </Box>

                                    <Box gridArea={{ base: "5 / 1 / 6 / 2", md: "1 / 3 / 2 / 4" }}>
                                        <TimerCard timeLeft={timeLeft} formatTimeLeft={formatTimeLeft} onRetryExam={finishExam} />
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
                                                {t('previous')}
                                            </Button>

                                            <ReportModal />

                                            <Button
                                                onClick={() => handleQuestionSelect(Math.min(currentQuestionIndex + 1, questions.length - 1))}
                                                isDisabled={currentQuestionIndex === questions.length - 1}
                                            >
                                                {t('next')}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </Center>
            )}
        </Box>
    );
}

export default ExamQuestionView;
