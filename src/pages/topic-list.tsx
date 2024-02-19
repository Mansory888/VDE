import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import { useState, useEffect, ChangeEvent } from 'react';
import { Box, useColorModeValue, Text } from '@chakra-ui/react';
import TopicQuestionView from '../pages/topic-page';
import { Question } from '../models/question';
import { Topic } from '../models/topic';
import { UserResponse } from '../models/userResponse';
import QuestionRequests from '../Api/question.requests';

interface TopicCardProps {
    title: string;
    description: string;
    onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ title, description, onClick }) => {
    return (
        <Box
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            padding="6"
            boxShadow="lg"
            onClick={onClick}
            _hover={{
                bg: useColorModeValue('gray.100', 'gray.700'),
                cursor: 'pointer',
            }}
        >
            <Text fontSize="xl" fontWeight="bold">
                {title}
            </Text>
            <Text >
                {description}
            </Text>
        </Box>
    );
};

const TopicList = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [showQuestionsView, setShowQuestionsView] = useState(false);

    useEffect(() => {
        LoadData();
    }, []);

    const LoadData = async () => {
        const storedUser = localStorage.getItem('userResp');
        setUser(storedUser ? JSON.parse(storedUser) : null);

        const topics = await QuestionRequests.getAllTopics(user?.language_id || 1);
        setTopics(topics);
    }

    const loadQuestions = async (topicId: number) => {
        try {
            const response = await QuestionRequests.getAllQuestionsForTopic(topicId);
            setQuestions(response.questions);
            console.log("Questions loaded:", response);
            setShowQuestionsView(true); 
        } catch (error) {
            console.error("Failed to load questions:", error);
        }
    }

    if (showQuestionsView) {
        return <TopicQuestionView initialQuestions={questions} />;
    }

    return (
        <SimpleGrid columns={{ sm: 2, md: 3 }} spacing="2" p="10">
            {topics.map((topic) => (
                <TopicCard
                    key={topic.topic_id}
                    title={topic.name}
                    description={topic.description}
                    onClick={() => loadQuestions(topic.topic_id)}
                />
            ))}
        </SimpleGrid>
    );
};

export default TopicList;
