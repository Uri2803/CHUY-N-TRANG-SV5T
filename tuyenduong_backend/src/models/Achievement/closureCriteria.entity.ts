import { Criteria } from './criteria.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClosureCriteria {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Criteria, (criteria) => criteria.closureAncestors, {
    onDelete: 'SET NULL',
  })
  ancestors: Criteria;

  @ManyToOne(() => Criteria, (criteria) => criteria.closureDescendants, {
    onDelete: 'SET NULL',
  })
  descendants: Criteria;
}
