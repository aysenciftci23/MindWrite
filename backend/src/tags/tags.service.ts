import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tag } from './tags.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>,
    ) { }

    async create(name: string): Promise<Tag> {
        const tag = this.tagRepository.create({ name });
        return this.tagRepository.save(tag);
    }

    async findAll(): Promise<Tag[]> {
        return this.tagRepository.find();
    }

    async findByIds(ids: number[]): Promise<Tag[]> {
        return this.tagRepository.findBy({ id: In(ids) });

    }

    async findAllWithCount(): Promise<any[]> {
        const tags = await this.tagRepository.find();


        const tagsWithCount = await Promise.all(
            tags.map(async (tag) => {
                const count = await this.tagRepository
                    .createQueryBuilder('tag')
                    .innerJoin('tag.posts', 'post')
                    .where('tag.id = :id', { id: tag.id })
                    .getCount();

                return {
                    id: tag.id,
                    name: tag.name,
                    postCount: count
                };
            })
        );

        return tagsWithCount;
    }
}