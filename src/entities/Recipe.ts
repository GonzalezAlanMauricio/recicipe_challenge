/* eslint-disable no-unused-vars */
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';

import Category from './Category';
import User from './User';

@Entity()
export default class Recipes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne((_type) => Category, (category: Category) => category.recipes)
  category: Category;

  @ManyToOne((_type) => User, (user) => user.recipes)
  user: User;
}
