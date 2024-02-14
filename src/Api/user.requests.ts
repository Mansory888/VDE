import { User } from "../models/user";
import { UserResponse } from "../models/userResponse";
import { fetchWithToken } from './fetch-wrapper';

const API_URL =
  "http://192.168.1.4:3000/drivingexam/v1/";


export default class UserRequests {
  static async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    try {
      const user = {
        username: username,
        email: email,
        password: password,
      };
      const response = await fetch(`${API_URL}users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessages = UserRequests.extractErrorMessages(data);
        throw new Error(errorMessages.join(', '));
      }

      return data;
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  static async loginUser(email: string, password: string): Promise<UserResponse> {
    try {
      const user = {
        email: email,
        password: password,
      };
      const response = await fetch(`${API_URL}users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessages = UserRequests.extractErrorMessages(data);
        throw new Error(errorMessages.join(', '));
      }

      return data;
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  static async getUsers(): Promise<UserResponse[]> {
    try {
      return await fetchWithToken('users');
    } catch (error: any) {
      throw Error(error.message);
    }
  }


  static extractErrorMessages(responseObj: any): string[] {
    if (responseObj.hasOwnProperty('errors') && Array.isArray(responseObj['errors'])) {
      return responseObj['errors'].map((error: any) => error.msg.toString());
    } else {
      return ['Unknown error'];
    }
  }


}