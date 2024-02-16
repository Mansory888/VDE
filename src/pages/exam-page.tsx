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

interface ReportModalProps {

}

function ExamQuestionView() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [mockExam, setMockExam] = useState<MockExam | null>(null);
    const [viewedQuestions, setViewedQuestions] = useState<{ [key: number]: boolean }>({});
    const initialTime = 30 * 60;
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        LoadData();
    }, []);

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
                        <Text fontSize="sm" mr="4">Viewed</Text>
                        <Circle size="15px" bg="violet" color="white" mr="2" />
                        <Text fontSize="sm">Answered</Text>
                    </Flex>
                </Box>
            </Box>
        );
    }

    function TimerCard({ explanation, onTimerEnd }: {onTimerEnd: () => void }) {
        // Set the initial countdown time (30 minutes = 1800 seconds)
        const initialTime = 30 * 60;
    
        // State to keep track of remaining time in seconds
        const [timeLeft, setTimeLeft] = useState(initialTime);
    
        // Convert the remaining time in seconds to a display format (MM:SS)
        const formatTimeLeft = (time:any) => {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };
    
        useEffect(() => {
            // If timeLeft is 0, call the onTimerEnd function and return to stop the timer
            if (timeLeft === 0) {
                onTimerEnd();
                return;
            }
    
            // Set up a timer to decrement the timeLeft state every second
            const interval = setInterval(() => {
                setTimeLeft((timeLeft) => timeLeft - 1);
            }, 1000);
    
            // Clear the interval timer if the component is unmounted
            return () => clearInterval(interval);
        }, [timeLeft, onTimerEnd]);
    
        return (
            <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Box p="6">
                    <Text fontWeight="bold" fontSize="xl" textAlign="center" mb="4">
                        Remaining Time
                    </Text>
                    {/* Display the formatted time left */}
                    <Text fontSize="2xl" textAlign="center" mb="4">
                        {formatTimeLeft(timeLeft)}
                    </Text>
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
                <ModalHeader>Report Question</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Textarea
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="If you think this question is wrong, tell us"
                    mt={4}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={handleReportSubmit}>Send</Button>
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
                                />
                            </Box>

                            <Box gridArea={{ base: "5 / 1 / 6 / 2", md: "1 / 3 / 2 / 4" }}>
                            <TimerCard onTimerEnd={finishExam} />
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
                                        Previous
                                    </Button>

                                    <ReportModal/>

                                    <Button
                                        onClick={() => handleQuestionSelect(Math.min(currentQuestionIndex + 1, questions.length - 1))}
                                        isDisabled={currentQuestionIndex === questions.length - 1}
                                    >
                                        Next
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

export default ExamQuestionView;
