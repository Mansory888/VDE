import { useState, ChangeEvent, useContext } from 'react';
import { UserContext } from '../context/user.context';
import { useNavigate } from 'react-router-dom';
import '../utils/i18n';
import UserRequests from '../Api/user.requests';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  Link,
  Flex,
} from '@chakra-ui/react';


function LoginCard({ onToggleView }: { onToggleView: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [information, setInformation] = useState('');
  const [color, setColor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(UserContext);

  const setEmailHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const setPasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    if (!email || !password) {
      setInformation('Please fill in all the fields');
      setColor('red.500');
      setIsLoading(false);
      return;
    }

    try {
      const user = await UserRequests.loginUser(email, password);

      if (user) {
        setUser(user);
        localStorage.setItem('userResp', JSON.stringify(user));
        setInformation('');
        navigate('/');
        console.log('Navigate called');
      }
    } catch (e) {
      setInformation((e as Error).message);
      setColor('red.500');
    }

    setIsLoading(false);
  };


  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} boxShadow="lg">
      <Heading as="h3" size="lg" textAlign="left" >
        {t('welcome_back')}
      </Heading>
      <Text fontSize="sm" textAlign="left" mb={8}>
        {t('fill_in_details')}
      </Text>
      <FormControl id="email" onChange={setEmailHandler}>
        <FormLabel>{t('email_address')}</FormLabel>
        <Input type="email" />
      </FormControl>
      <FormControl id="password" mt={4} onChange={setPasswordHandler}>
        <FormLabel>{t('password')}</FormLabel>
        <Input type="password" />
      </FormControl>
      <Flex justify="flex-end">
        <Text fontSize="sm" mt={2}>
          <Link color="teal.500" href="#">
            {t('forgot_pass')}
          </Link>
        </Text>
      </Flex>
      <Button width="full" mt={4} colorScheme="teal" size="lg" onClick={handleLogin} isLoading={isLoading}>
        {t('log_in')}
      </Button>
      <Text id="information" color={color} fontSize={'sm'} mt={4}>
        {information}
      </Text>
      <Flex align="center" justify="center" mt={4}>
        <Text mr={2}>New user?</Text>
        <Button colorScheme="teal" variant="link" onClick={onToggleView}>{t('register')}</Button>
      </Flex>
    </Box>
  );
}

export default LoginCard;
