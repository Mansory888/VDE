import React, { useState } from 'react';
import { Box, Text, Container, VStack, Center, Flex } from '@chakra-ui/react';
import LoginCard from '../components/login-card';
import Register from '../components/register-card';

function LogInRegisterPage() {
    const [showLogin, setShowLogin] = useState(true);
    const toggleView = () => setShowLogin(!showLogin);
    
    return (
        <Box width="100%" maxW="sm" mx="auto">
        {showLogin ? <LoginCard onToggleView={toggleView} /> : <Register onToggleView={toggleView} />}
      </Box>
    );
}

export default LogInRegisterPage;
