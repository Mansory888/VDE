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
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


interface NavbarProps {
    username: string;
}

// Style for the active link
const activeLinkStyle = {
    fontWeight: "bold",
    textDecoration: "underline",
};

export const Navbar: React.FC<NavbarProps> = ({ username }) => {
    const { isOpen, onToggle } = useDisclosure();
    const { t } = useTranslation();

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
                        <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>{t('home')}</NavLink> 
                        <NavLink to="/ExamPage" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>{t('exam')}</NavLink>
                        <NavLink to="/TopicListPage" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>{t('topics')}</NavLink>
                    </HStack>
                </HStack>
                <Flex alignItems={'center'}>
                    {/* <Text>{username}</Text> */}
                    <NavLink to="/SettingsPage" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>{username}</NavLink>
                </Flex>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <Box pb={4} display={{ md: 'none' }}>
                    <Stack as={'nav'} spacing={4} align={'center'}>
                    <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>{t('home')}</NavLink>
                        <NavLink to="/ExamPage" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>{t('exam')}</NavLink>
                        <NavLink to="/TopicPage" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>{t('topics')}</NavLink>
                    </Stack>
                </Box>
            </Collapse>
        </Box>
    );
};


export default Navbar;
