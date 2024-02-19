import React from 'react';
import { Box, Grid, GridItem, Text, Select, Input, Button } from '@chakra-ui/react';

function SettingsPage() {
  return (
    // Adjusted for responsiveness: 1 column on small screens, 2 columns on larger screens
    <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={6} p={5}>
      {/* Settings Card */}
      <GridItem w="100%">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
          <Text fontSize="xl" mb={4}>Settings</Text>
          <Text mb={2}>Language</Text>
          <Select placeholder="Select language">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            {/* Add more languages as needed */}
          </Select>
        </Box>
      </GridItem>
      
      {/* Edit Account Card */}
      <GridItem w="100%">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
          <Text fontSize="xl" mb={4}>Edit Account</Text>
          <Text mb={2}>Username</Text>
          <Input placeholder="Username" mb={3} />
          <Text mb={2}>Password</Text>
          <Input placeholder="Password" mb={3} type="password" />
          <Button colorScheme="blue">Change</Button>
        </Box>
      </GridItem>
    </Grid>
  );
}

export default SettingsPage;
