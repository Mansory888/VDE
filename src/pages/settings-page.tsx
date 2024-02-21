import React, {useContext} from 'react';
import { Box, Grid, GridItem, Text, Select, Input, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../context/user.context';

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { setUser } = useContext(UserContext);

  const handleChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
  };

  const handleLogout = () => {
    setUser(null); 
    localStorage.removeItem('userResp');
    // Perform additional cleanup if necessary, e.g., clearing local storage, redirecting, etc.
  };


  return (
    // Adjusted for responsiveness: 1 column on small screens, 2 columns on larger screens
    <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={6} p={5}>
      {/* Settings Card */}
      <GridItem w="100%">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
          <Text fontSize="xl" mb={4}>{t('settings')}</Text>
          <Text mb={2}>{t('language')}</Text>
          <Select placeholder={t('select_language')} onChange={handleChangeLanguage}>
            <option value="en">English</option>
            <option value="lt">Lithunian</option>
            <option value="ru">Russian</option>
          </Select>
          <Button mt={4} onClick={handleLogout}>Logout</Button>
        </Box>
      </GridItem>
      
      {/* Edit Account Card */}
      <GridItem w="100%">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
          <Text fontSize="xl" mb={4}>{t('edit_account')}</Text>
          <Text mb={2}>{t('username')}</Text>
          <Input mb={3} />
          <Text mb={2}>{t('password')}</Text>
          <Input mb={3} type="password" />
          <Button colorScheme="blue">{t('change')}</Button>
        </Box>
      </GridItem>
    </Grid>
  );
}

export default SettingsPage;
