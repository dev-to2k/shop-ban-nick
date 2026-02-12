import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@shop-ban-nick/nest-prisma';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  create(createBlogDto: CreateBlogDto) {
    const slug =
      createBlogDto.slug ??
      createBlogDto.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    return this.prisma.blog.create({
      data: { ...createBlogDto, slug },
    });
  }

  findAll(query: any) {
    const { take, skip, search } = query;
    return this.prisma.blog.findMany({
      where: search
        ? {
            OR: [{ title: { contains: search, mode: 'insensitive' } }],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  async findOne(slug: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { slug },
    });
    if (!blog) {
      // Try finding by ID if slug fails (optional)
      const blogById = await this.prisma.blog.findUnique({
        where: { id: slug },
      });
      if (!blogById)
        throw new NotFoundException(`Blog with slug/id ${slug} not found`);
      return blogById;
    }
    return blog;
  }

  update(id: string, updateBlogDto: UpdateBlogDto) {
    return this.prisma.blog.update({
      where: { id },
      data: updateBlogDto,
    });
  }

  remove(id: string) {
    return this.prisma.blog.delete({
      where: { id },
    });
  }
}
