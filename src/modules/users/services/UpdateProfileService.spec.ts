import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacherProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('should be able to update profile', async () => {
        const user = await fakeUsersRepository.create({
            email: 'marcio@encel.com.br',
            name: 'Marcio Costa',
            password: '1234',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Marcio Costa Jr',
            email: 'junior@encel.com.br',
        });

        expect(updatedUser.name).toBe('Marcio Costa Jr');
        expect(updatedUser.email).toBe('junior@encel.com.br');
    });

    it('should be able to update profile without changing the email', async () => {
        const user = await fakeUsersRepository.create({
            email: 'marcio@encel.com.br',
            name: 'Marcio Costa',
            password: '1234',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Marcio Costa Jr',
            email: 'marcio@encel.com.br',
        });

        expect(updatedUser.name).toBe('Marcio Costa Jr');
        expect(updatedUser.email).toBe('marcio@encel.com.br');
    });

    it('should not be able to update profile to an existing email', async () => {
        await fakeUsersRepository.create({
            email: 'marcio@encel.com.br',
            name: 'Marcio Costa',
            password: '1234',
        });

        const user = await fakeUsersRepository.create({
            email: 'junior@encel.com.br',
            name: 'Marcio Costa Jr',
            password: '1234',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Marcio Costa Jr',
                email: 'marcio@encel.com.br',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update profile from non existing user', async () => {
        await expect(
            updateProfile.execute({
                user_id: 'non_existing_user_id',
                name: 'Marcio Costa Jr',
                email: 'marcio@encel.com.br',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            email: 'marcio@encel.com.br',
            name: 'Marcio Costa',
            password: '1234',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Marcio Costa Jr',
            email: 'junior@encel.com.br',
            old_password: '1234',
            password: '12345',
        });

        expect(updatedUser.password).toBe('12345');
    });

    it('should not be able to update the password without old_password', async () => {
        const user = await fakeUsersRepository.create({
            email: 'marcio@encel.com.br',
            name: 'Marcio Costa',
            password: '1234',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Marcio Costa Jr',
                email: 'junior@encel.com.br',
                password: '12345',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old_password', async () => {
        const user = await fakeUsersRepository.create({
            email: 'marcio@encel.com.br',
            name: 'Marcio Costa',
            password: '1234',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Marcio Costa Jr',
                email: 'junior@encel.com.br',
                old_password: 'wrong_password',
                password: '12345',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
