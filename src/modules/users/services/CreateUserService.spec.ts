import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();

        const createUserService = new CreateUserService(fakeUsersRepository);

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
        const fakeUsersRepository = new FakeUsersRepository();

        const createUserService = new CreateUserService(fakeUsersRepository);

        await createUserService.execute({
            email: 'marcio@encel.com.br',
            name: 'Marcio Junior',
            password: '1234',
        });

        expect(
            createUserService.execute({
                email: 'marcio@encel.com.br',
                name: 'Marcio Costa',
                password: '1234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
