/* eslint-disable no-unused-vars */
import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';

import Recipe from './Recipe';

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // @ts-ignore
  @OneToMany((type) => Recipe, (recipe: Recipe) => recipe.category)
  recipes: Recipe[]
}
