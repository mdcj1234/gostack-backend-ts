import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacherProvider/fakes/FakeCacheProvider';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new user', async () => {
        const User = await createUserService.execute({
            email: 'marcio@encel.com.br',
            name: 'Marcio Junior',
            password: '1234',
        });

        expect(User).toHaveProperty('id');
        expect(User.name).toBe('Marcio Junior');
        expect(User.email).toBe('marcio@encel.com.br');
    });

    it('should not be able to create two users with same email', async () => {
        await createUserService.execute({
            email: 'marcio@encel.com.br',
            name: 'Marcio Junior',
            password: '1234',
        });

        await expect(
            createUserService.execute({
                email: 'marcio@encel.com.br',
                name: 'Marcio Costa',
                password: '1234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
