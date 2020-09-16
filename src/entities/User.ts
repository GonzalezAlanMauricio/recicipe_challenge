/* eslint-disable no-unused-vars */
import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';

import Recipe from './Recipe';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(3, { message: 'Must be at least 3 character long' })
  name: string;

  @Column()
  @IsEmail({}, { message: 'Must be a email like example@gmail.com' })
  email: string;

  @Column()
  hashPassword: string;

  @OneToMany((_type) => Recipe, (recipe) => recipe.user, { onDelete: 'CASCADE' })
  recipes: Recipe[];
}
