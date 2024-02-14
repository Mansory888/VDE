// src/components/Navbar.tsx

import React from 'react';
import {
    Box,
    Flex,
    Text,
    Button,
    HStack,
    Stack,
    Collapse,
    IconButton,
    useDisclosure,
    Spacer,
    Center,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

interface NavbarProps {
    username: string;
}

export const Navbar: React.FC<NavbarProps> = ({ username }) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Box px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <IconButton
                    size={'md'}
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    aria-label={'Open Menu'}
                    display={{ md: 'none' }}
                    onClick={onToggle}
                />
                <HStack spacing={8} alignItems={'center'}>
                    <Spacer />
                    <Box><Text fontWeight="bold">Discount</Text></Box>
                    <HStack
                        as={'nav'}
                        spacing={4}
                        display={{ base: 'none', md: 'flex' }}>
                        <Text>Home</Text>
                        <Text>Exam</Text>
                        <Text>Topics</Text>
                    </HStack>ß
                </HStack>
                <Flex alignItems={'center'}>
                    <Text>{username}</Text>
                </Flex>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <Box pb={4} display={{ md: 'none' }}>
                    <Stack as={'nav'} spacing={4} align={'center'}>
                        <Text>Home</Text>
                        <Text>Exam</Text>
                        <Text>Topics</Text>
                    </Stack>
                </Box>
            </Collapse>
        </Box>
    );
};


export default Navbar;
