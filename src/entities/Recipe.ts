/* eslint-disable no-unused-vars */
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';

import Category from './Category';

@Entity()
export default class Recipes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  // @ts-ignore
  @ManyToOne((type) => Category, (category: Category) => category.recipes)
  category: Category
}
