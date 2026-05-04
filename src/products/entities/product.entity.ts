import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne} from 'typeorm';
import { ProductSpecs } from './products-spec.entity';
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string; 

  @Column({ type: 'text', nullable: true })
  info: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number; 

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ProductSpecs, (spec) => spec.product)
  specs: ProductSpecs[];
}