import { Box, Text, Collapse, Button, useDisclosure, Grid, Flex, VStack } from '@chakra-ui/react';
import { Question } from '../models/question';
import React, { useState, useEffect, useContext } from 'react';
import { MockExam } from '../models/mockExam';
import { Navigate, useNavigate } from 'react-router-dom';
import { ExamContext } from '../context/exam.context';


type QuestionsListCardProps = {
    questions: Question[];
}

type QuestionCardProps = {
    question: Question;
    isOpen: boolean;
    onToggle: () => void;
}

type finishPageProps = {
    inputMockExam: MockExam | null;
}


const ResultsCard = ({ percentage, points }: { percentage: number; points: number }) => {
    const navigate = useNavigate();
    const handleRetry = () => navigate('/ExamPage');

    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Text fontSize="xl" fontWeight="bold">Results</Text>
            <Text mt={4}>You got {percentage}% of your exam</Text>
            <Text mt={4}>Points: {points}</Text>
            <Button mt={4} onClick={handleRetry}>Retry exam</Button>
        </Box>
    );
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, isOpen, onToggle }) => {
    return (
        <Box borderWidth="1px" borderRadius="lg" p={4} width="100%">
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="lg">{question.question}</Text>
                <Text color="gray.500">{question.status}</Text>
            </Flex>
            <Text
                size="sm"
                mt={2}
                cursor="pointer"
                textDecoration="underline"
                onClick={onToggle}
                color="blue.500"
            >
                {isOpen ? 'Hide Explanation' : 'Show Explanation'}
            </Text>
            <Collapse in={isOpen} animateOpacity>
                <Text mt={4}>{question.explanation}</Text>
            </Collapse>
        </Box>
    );
};

const QuestionsListCard: React.FC<QuestionsListCardProps> = ({ questions }) => {
    const [openIndexes, setOpenIndexes] = useState<number[]>([]);

    const handleToggle = (index: number) => {
        setOpenIndexes(prevIndexes =>
            prevIndexes.includes(index)
                ? prevIndexes.filter(i => i !== index)
                : [...prevIndexes, index]
        );
    };

    return (
        <Box borderWidth="1px" borderRadius="lg" maxHeight="400px" p={4} w="100%">
            <Text fontSize="xl" fontWeight="bold" mb={3}>Questions and Explanations</Text>
            <Box overflowY="auto" maxHeight="320px">
                <VStack spacing={4} width="100%">
                    {questions.map((question, index) => (
                        <QuestionCard
                            key={index}
                            question={question}
                            isOpen={openIndexes.includes(index)}
                            onToggle={() => handleToggle(index)}
                        />
                    ))}
                </VStack>
            </Box>

        </Box>
    );
};



const FinishPage = () => {
    const [mockExam, setMockExam] = useState<MockExam | null>(null);
    const { exam } = useContext(ExamContext);

    useEffect(() => {
        //console.log(exam);
        if (exam) {
            setMockExam(exam);
        }
    }, [exam]);

    const renderCard = (card: any) => {
        if (card.type === 'results') {
            return <ResultsCard percentage={card.data.percentage} points={card.data.points} />;
        } else if (card.type === 'questionlist') {
            return <QuestionsListCard questions={card.data.questions} />;
        }
    };

    const cardData = [
        {
            type: 'results',
            data: { percentage: mockExam?.percentage || 0, points: mockExam?.points || 0 },
        },
        {
            type: 'questionlist',
            data: { questions: mockExam?.questions?.questions || [] },
        },
    ];

    return (
        <Grid templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={6} p={5}>
            {cardData.map((card, index) => (
                <Box key={index}>{renderCard(card)}</Box>
            ))}
        </Grid>
    );
};

export default FinishPage;