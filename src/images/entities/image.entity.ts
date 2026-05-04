import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { ImageType } from '../../enum/imagetype.enum';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text'})
  storage_path: string;

  @Column({ type: 'text'})
  file_name: string;

  @Column({ type: 'enum', enum: ImageType })
  type: ImageType;

  @Column({ type: 'bigint' })
  entity_id: number;

  @Column({ type: 'int', default: 0 })
  position: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}