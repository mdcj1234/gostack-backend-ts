import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        showProfile = new ShowProfileService(fakeUsersRepository);
    });

    it('should be able to show profile', async () => {
        const user = await fakeUsersRepository.create({
            email: 'marcio@encel.com.br',
            name: 'Marcio Costa',
            password: '1234',
        });

        const profile = await showProfile.execute({
            user_id: user.id,
        });

        expect(profile.name).toBe('Marcio Costa');
        expect(profile.email).toBe('marcio@encel.com.br');
    });

    it('should not be able to show profile from non existing user', async () => {
        expect(
            showProfile.execute({
                user_id: 'non_existing_user_id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
