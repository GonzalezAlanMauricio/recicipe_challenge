import {
  Entity, PrimaryGeneratedColumn, Column,
} from 'typeorm';

@Entity()
export default class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  unitOfMeasurement: string;
}
