import React from 'react';
import { useState, ChangeEvent } from 'react';
import { User } from "../models/user";
import UserRequests from '../Api/user.requests';
import '../utils/i18n';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Heading,
    Text,
    Input,
    FormControl,
    FormLabel,
    Button,
    Flex
} from '@chakra-ui/react';

function Register({ onToggleView }: { onToggleView: any }) {
    const { t } = useTranslation();
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [information, setInformation] = useState('');
    const [color, setColor] = useState('');


    const setUsernameHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };
    const setEmailHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    const setPasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };


    const handleSignUp = async () => {
        try {
            if (username === '' || email === '' || password === '') {
                setInformation('Please fill in all the fields');
                setColor('red.500');
                return;
            }
            
            const user = await UserRequests.registerUser(username, email, password);
            if (user) {
                setUser(user);
                setColor('green.500');
                setInformation('Successfully registered');
            }
        } catch (error) {
            setColor('red.500');
            setInformation((error as Error).message);
        }
    };


    return (
        <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} boxShadow="lg">
            <Heading as="h3" size="lg" textAlign="left" >
                {t('register_account')}
            </Heading>
            <Text fontSize="sm" textAlign="left" mb={4}>
                {t('fill_your_details')}
            </Text>
            <FormControl id="username" onChange={setUsernameHandler}>
                <FormLabel>{t('username')}</FormLabel>
                <Input type="text" />
            </FormControl>
            <FormControl id="email" mt={4} onChange={setEmailHandler}>
                <FormLabel>{t('email_address')}</FormLabel>
                <Input type="email" />
            </FormControl>
            <FormControl id="password" mt={4} onChange={setPasswordHandler}>
                <FormLabel>{t('password')}</FormLabel>
                <Input type="password" />
            </FormControl>
            <Button width="full" mt={4} colorScheme="teal" size="lg" onClick={handleSignUp}>
                {t('register')}
            </Button>
            <Text id="information" color={color} fontSize={'sm'} mt={4}>
              {information}
            </Text>
            <Flex align="center" justify="center" mt={4}>
                <Text mr={2}>{t('already_have_account')}</Text>
                <Button colorScheme="teal" variant="link" onClick={onToggleView}>{t('log_in')}</Button>
            </Flex>
        </Box>
    );
}

export default Register;
