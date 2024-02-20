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
      "new_user?": "New User?",
      "register_account": "Register Account",
      "fill_your_details": "Fill your details",
      "register": "Register",
      "already_have_account": "Already registered?",
      "log_in": "Log in",
      "home": "Home",
      "exam": "Exam",
      "topics": "Topics",
      "settings": "Settings",
      "user": "User",
      "points": "Points",
      "answered": "Answered",
      "viewed": "Viewed",
      "remaining_time": "Remaining Time",
      "correct": "Correct",
      "wrong": "Wrong",
      "explanation": "Explanation",
      "submit": "Submit",
      "sumbit_answer": "Submit Answer",
      "cancel": "Cancel",
      "send": "Send",
      "report_question": "Report Question",
      "report_explanaition": "If you think this question is wrong, tell us",
      "previous": "Previous",
      "next": "Next",
      "language": "Language",
      "select_language": "Select language",
      "change": "Change",
      "edit_account": "Edit Account",
      // Add more translations here
    }
  },
  lt: {
    translation: {
      "welcome_back": "Sveiki sugrįžę!",
      "fill_in_details": "Užpildykite savo duomenis",
      "username": "Vartotojo vardas",
      "email_address": "El. pašto adresas",
      "password": "Slaptažodis",
      "forgot_pass": "Pamiršote slaptažodį?",
      "new_user?": "Naujas vartotojas?",
      "register_account": "Registruoti paskyrą",
      "fill_your_details": "Užpildykite savo duomenis",
      "register": "Registruotis",
      "already_have_account": "Jau užsiregistravęs?",
      "log_in": "Prisijungti",
      "home": "Pagrindinis",
      "exam": "Egzaminas",
      "topics": "Temos",
      "settings": "Nustatymai",
      "user": "Vartotojas",
      "points": "Taškai",
      "answered": "Atsakyta",
      "viewed": "Peržiūrėta",
      "remaining_time": "Likęs laikas",
      "correct": "Teisingai",
      "wrong": "Neteisingai",
      "explanation": "Paaiškinimas",
      "submit": "Pateikti",
      "submit_answer": "Pateikti atsakymą",
      "cancel": "Atšaukti",
      "send": "Siųsti",
      "report_question": "Pranešti apie klausimą",
      "report_explanation": "Jei manote, kad šis klausimas yra neteisingas, praneškite mums",
      "previous": "Ankstesnis",
      "next": "Kitas",
      "language": "Kalba",
      "select_language": "Pasirinkite kalbą",
      "change": "Keisti",
      "edit_account": "Redaguoti paskyrą"
    }
  },
  ru: {
    translation: {
      "welcome_back": "Добро пожаловать обратно!",
      "fill_in_details": "Заполните ваши данные",
      "username": "Имя пользователя",
      "email_address": "Электронный адрес",
      "password": "Пароль",
      "forgot_pass": "Забыли пароль?",
      "new_user?": "Новый пользователь?",
      "register_account": "Зарегистрировать аккаунт",
      "fill_your_details": "Заполните ваши данные",
      "register": "Регистрация",
      "already_have_account": "Уже зарегистрированы?",
      "log_in": "Войти",
      "home": "Главная",
      "exam": "Экзамен",
      "topics": "Темы",
      "settings": "Настройки",
      "user": "Пользователь",
      "points": "Очки",
      "answered": "Отвечено",
      "viewed": "Просмотрено",
      "remaining_time": "Оставшееся время",
      "correct": "Верно",
      "wrong": "Неверно",
      "explanation": "Объяснение",
      "submit": "Отправить",
      "submit_answer": "Отправить ответ",
      "cancel": "Отмена",
      "send": "Отправить",
      "report_question": "Сообщить о вопросе",
      "report_explanation": "Если вы считаете, что этот вопрос неверен, сообщите нам",
      "previous": "Предыдущий",
      "next": "Следующий",
      "language": "Язык",
      "select_language": "Выберите язык",
      "change": "Изменить",
      "edit_account": "Редактировать аккаунт"
    }
  }
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
