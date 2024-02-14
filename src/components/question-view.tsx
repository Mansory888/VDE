import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Text, Button, Image, Checkbox, CheckboxGroup, Stack, Circle, Flex, Grid, Center } from '@chakra-ui/react';
import { Question } from '../models/question';
import { UserResponse } from '../models/userResponse';
import QuestionRequests from '../Api/question.requests';
import { MockExam } from '../models/mockExam';
import { Answer } from '../models/answer';

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

function QuestionView() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [mockExam, setMockExam] = useState<MockExam | null>(null);
    const [viewedQuestions, setViewedQuestions] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        LoadData();
    }, []);

    const LoadData = async () => {
        const storedUser = localStorage.getItem('userResp');
        setUser(storedUser ? JSON.parse(storedUser) : null);

        const mockExam = await QuestionRequests.getExam(user?.language_id || 1);
        setMockExam(mockExam);
        setQuestions(mockExam.questions?.questions || []);

        console.log(mockExam);
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

    function ExplanationCard({ explanation }: { explanation: string }) {
        return (
            <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Box p="6">
                    <Text fontWeight="bold" fontSize="xl" textAlign="center" mb="4">
                        Explanation
                    </Text>
                    <Text fontSize="md">{explanation}</Text>
                </Box>
            </Box>
        );
    }


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
                                <ExplanationCard
                                    explanation={questions[currentQuestionIndex].explanation}
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
                                        Previous
                                    </Button>

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

export default QuestionView;
