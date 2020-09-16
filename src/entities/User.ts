/* eslint-disable no-unused-vars */
import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';

import Recipe from './Recipe';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  hashPassword: string;

  @OneToMany((_type) => Recipe, (recipe) => recipe.user, { onDelete: 'CASCADE' })
  recipes: Recipe[];
}
