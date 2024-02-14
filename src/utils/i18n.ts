// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
    "welcome_back": "Welcome Back!",
      "fill_in_details": "Fill in your details",
      "username": "Username",
      "email_address": "Email address",
      "password": "Password",
      "forgot_pass": "Forgot password?",
      "new_user?":"New User?",
      "register_account": "Register Account",
      "fill_your_details": "Fill your details",
      "register": "Register",
      "already_have_account":"Already registered?",
      "log_in":"Log in",
      // Add more translations here
    }
  },
  es: {
    translation: {
     
      // Add more translations here
    }
  }
  // Add more languages here
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default language
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;
