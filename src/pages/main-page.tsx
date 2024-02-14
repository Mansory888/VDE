import React from 'react';
import { useState, useEffect} from 'react';
import { Box, Text, Container, VStack, Table, Tbody, Th, Tr, Td, Thead, useColorModeValue, ChakraProvider, Grid, } from '@chakra-ui/react';
import { User } from '../models/user';
import { UserResponse } from '../models/userResponse';
import UserRequests from '../Api/user.requests';
import QuestionView from '../components/question-view';

interface UserTableCardProps {
    users: UserResponse[] ;
    currentUser: string;
}

const UserTableCard: React.FC<UserTableCardProps> = ({ users, currentUser }) => {
    // Use Chakra's useColorModeValue to switch colors based on the theme, if you use dark/light mode in your app
    const bgColor = useColorModeValue('gray.200', 'gray.700');
    const highlightColor = useColorModeValue('teal.100', 'teal.700');

    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>User</Th>
                        <Th isNumeric>Points</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {users.map((user: UserResponse) => (
                        <Tr key={user.username} bgColor={user.username === currentUser ? highlightColor : 'transparent'}>
                            <Td>{user.username}</Td>
                            <Td isNumeric>{user.score} pts</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

const AnotherCardType = ({ title, content }: { title: any; content: any }) => {
    // Replace with actual implementation
    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Text fontSize="xl">{title}</Text>
            <Text mt={4}>{content}</Text>
        </Box>
    );
};

function MainPage() {
    const [users, setUsers] = useState<UserResponse[] | null>(null);
    const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);


    useEffect(() => {
        LoadData();
    }, []);


    const LoadData = async () => {
        try { 
            const users = await UserRequests.getUsers();
            const storedUser = localStorage.getItem('userResp');
            let currentUser: UserResponse | null = null;
    
            if (storedUser) {
                currentUser = JSON.parse(storedUser);
                setCurrentUser(currentUser);
            }
    
            if (users) {
                // Sort users by score in descending order
                const sortedUsers = [...users].sort((a, b) => (b.score || 0) - (a.score || 0));
    
                // Get the top 3 users
                let topUsers = sortedUsers.slice(0, 3);
    
                // Check if the current user is not in the top 3 and include them if necessary
                if (currentUser && !topUsers.find(user => user.username === currentUser?.username)) {
                    // This finds the current user in the full list (assuming they exist in it) and adds them to the list
                    const currentUserInList = users.find(user => user.username === currentUser?.username);
                    if (currentUserInList) {
                        topUsers.push(currentUserInList);
                    }
                }
    
                // Update the state with the top 3 users and the current user
                setUsers(topUsers);
            }
        } catch (error) {
            
        }
    };



    const cardData = [
        {
            type: 'userTable',
            data: {
                users: [
                    { username: 'user 777', password: 'pass1', email: 'user1@example.com', score: 10 },
                    { username: 'user 999', password: 'pass2', email: 'user2@example.com', score: 5 }
                ],
                currentUser: 'user 2'
            },
        },
        {
            type: 'anotherType',
            data: { title: 'Another Card', content: 'This is another type of card.' },
        },
        // Add more card data objects as needed
    ];
    


    const renderCard = (card: any) => {
        switch (card.type) {
            case 'userTable':
                return users && currentUser && <UserTableCard users={users} currentUser={currentUser.username} />;
            case 'anotherType':
                return <AnotherCardType title={card.data.title} content={card.data.content} />;
            // Add cases for other card types as needed
            default:
                return <Box>Unknown card type</Box>;
        }
    };

    return (
        <ChakraProvider>
            {/* <Grid templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6} p={5}>
                {cardData.map((card, index) => (
                    <Box key={index}>{renderCard(card)}</Box>
                ))}
            </Grid> */}
            <QuestionView />
        </ChakraProvider>
    );
}

export default MainPage;
