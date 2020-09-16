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

  @OneToMany((_type) => Recipe, (recipe: Recipe) => recipe.category, { onDelete: 'CASCADE' })
  recipes: Recipe[];
}
