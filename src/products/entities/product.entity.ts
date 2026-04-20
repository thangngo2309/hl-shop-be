import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string; 

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number; 

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'text', nullable: true, default: 'https://example.com/images/product.png' })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}