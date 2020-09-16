import { validate } from 'class-validator';
import { UserInputError } from 'apollo-server-express';
import { getConnection } from 'typeorm';
import User from '../../entities/User';

interface UserInput { email: string; name: string; password?: string }

export const generalValidation = async (objToValidate: object): Promise<void> => {
  const errors = await validate(objToValidate);
  console.log('errors', errors);
  if (errors.length > 0) {
    const messageErrors = errors.map((error) => {
      const { constraints } = error;
      return `${error.property} is "${error.value}" and must be ${constraints![Object.keys(constraints!)[0]]}`;
    });
    throw new UserInputError(messageErrors.toString());
  }
};

const validatePassword = (password: string): void => {
  const HasANumber = /\d/.test(password);
  const hasAUppercaseCharacter = /[A-Z]/.test(password);
  const hasALowercaseCharacter = /[a-z]/.test(password);
  const hasThreeCharactersInARowRepeated = /(.)\1\1/.test(password);
  if (
    !hasThreeCharactersInARowRepeated
    && HasANumber
    && hasAUppercaseCharacter
    && hasALowercaseCharacter) {
    console.log('The password is strong');
  } else {
    throw new UserInputError(`The password must have at least one number,
     one uppercase letter, one lowercase letter, a minimum length of 8 characters,
      a maximum length of 20 characters and it must not have more than two characters in a row repeated`);
  }
};

const emailIsUnique = async (email: string): Promise<void> => {
  const user = await getConnection().getRepository(User).findOne({ where: { email }, relations: ['recipes'] });
  if (user) throw new UserInputError('This email is already in use');
};

const validateEmail = async (email: string): Promise<void> => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email).toLowerCase())) throw new UserInputError('The email must be a email like example@example.com');
  await emailIsUnique(email);
};

const validateName = (name: string): void => {
  const hasAMinLengthOfFive = /.{5}/.test(name);
  if (!hasAMinLengthOfFive) {
    throw new UserInputError('The name must have a min length of 5');
  }
};

export const userValidation = async (userToValidate: UserInput): Promise<void> => {
  if (userToValidate.password) validatePassword(userToValidate.password!);
  if (userToValidate.email) await validateEmail(userToValidate.email);
  if (userToValidate.name) validateName(userToValidate.name);
};
