import { ContactInfo } from './../../../models/Achievement/contactInfo.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

@Injectable()
export class ContactInfoService extends TypeOrmQueryService<ContactInfo> {
  constructor(
    @InjectRepository(ContactInfo)
    private contactInfoRepository: Repository<ContactInfo>,
  ) {
    super(contactInfoRepository, { useSoftDelete: true });
  }
}
