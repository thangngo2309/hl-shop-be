import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('product_specifications')
export class ProductSpecs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column({ type: 'varchar', length: 255 })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @ManyToOne(() => Product, (product) => product.specs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ length: 30, nullable: true })
  unit: string;

  @Column({ default: 1 })
  position: number;  
}
