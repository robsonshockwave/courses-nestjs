import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { Repository } from 'typeorm';
import { Course } from './entities/courses.entity';
import { Tag } from './entities/tags.entity';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';

describe('CoursesService', () => {
  let service: CoursesService;
  let courseRepository: jest.Mocked<Repository<Course>>;
  let tagRepository: jest.Mocked<Repository<Tag>>;

  let id: string;
  let date: Date;

  beforeEach(async () => {
    id = '1e38a115-2bdd-4c12-8d0b-fc3f54741ba4';
    date = new Date();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: 'COURSES_REPOSITORY',
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            preload: jest.fn(),
          },
        },
        {
          provide: 'TAGS_REPOSITORY',
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    courseRepository = module.get('COURSES_REPOSITORY');
    tagRepository = module.get('TAGS_REPOSITORY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a course', async () => {
    const expectOutputTags = [{ id, name: 'nestjs', created_at: date }];
    const expectOutputCourse = {
      id,
      name: 'Teste',
      description: 'Test description',
      tags: expectOutputTags,
      created_at: date,
    };

    tagRepository.findOne.mockResolvedValue(null);
    tagRepository.create.mockReturnValue(expectOutputTags[0] as Tag);
    courseRepository.create.mockReturnValue(expectOutputCourse as Course);
    courseRepository.save.mockResolvedValue(expectOutputCourse as Course);

    const createCourseDTO: CreateCourseDTO = {
      name: 'Teste',
      description: 'Test description',
      tags: ['nestjs'],
    };

    const result = await service.create(createCourseDTO);

    expect(courseRepository.create).toHaveBeenCalled();
    expect(courseRepository.save).toHaveBeenCalledWith(expectOutputCourse);
    expect(result).toEqual(expectOutputCourse);
  });

  it('should list courses', async () => {
    const expectOutput = [
      {
        id,
        name: 'Teste',
        description: 'Test description',
        tags: [{ id, name: 'nestjs', created_at: date }],
        created_at: date,
      },
    ];

    courseRepository.find.mockResolvedValue(expectOutput as Course[]);

    const result = await service.findAll();

    expect(courseRepository.find).toHaveBeenCalledWith({ relations: ['tags'] });
    expect(result).toEqual(expectOutput);
  });

  it('should find one course', async () => {
    const expectOutput = {
      id,
      name: 'Teste',
      description: 'Test description',
      tags: [{ id, name: 'nestjs', created_at: date }],
      created_at: date,
    };

    courseRepository.findOne.mockResolvedValue(expectOutput as Course);

    const result = await service.findOne(id);

    expect(courseRepository.findOne).toHaveBeenCalledWith({
      where: { id },
      relations: ['tags'],
    });
    expect(result).toEqual(expectOutput);
  });

  it('should remove a course', async () => {
    const expectOutput = {
      id,
      name: 'Teste',
      description: 'Test description',
      tags: [{ id, name: 'nestjs', created_at: date }],
      created_at: date,
    };

    courseRepository.findOne.mockResolvedValue(expectOutput as Course);

    const result = await service.remove(id);

    expect(courseRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(courseRepository.remove).toHaveBeenCalledWith(expectOutput);
    expect(result).toEqual(undefined);
  });

  it('should update a course', async () => {
    const expectOutputTags = [{ id, name: 'nestjs', created_at: date }];
    const expectOutputCourse = {
      id,
      name: 'Teste',
      description: 'Test description',
      tags: expectOutputTags,
      created_at: date,
    };

    tagRepository.findOne.mockResolvedValue(null);
    tagRepository.create.mockReturnValue(expectOutputTags[0] as Tag);
    courseRepository.preload.mockResolvedValue(expectOutputCourse as Course);
    courseRepository.save.mockResolvedValue(expectOutputCourse as Course);

    const updateCourseDTO: UpdateCourseDTO = {
      name: 'Teste',
      description: 'Test description',
      tags: ['nestjs'],
    };

    const result = await service.update(id, updateCourseDTO);

    expect(courseRepository.preload).toHaveBeenCalledWith({
      ...updateCourseDTO,
      id,
      tags: expectOutputTags,
    });
    expect(courseRepository.save).toHaveBeenCalledWith(expectOutputCourse);
    expect(result).toEqual(expectOutputCourse);
  });
});
