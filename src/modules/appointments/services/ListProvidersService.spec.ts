// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        listProviders = new ListProvidersService(fakeUsersRepository);
    });

    it('should be able to list the providers', async () => {
        const provider1 = await fakeUsersRepository.create({
            email: 'marcio@encel.com.br',
            name: 'Marcio Costa',
            password: '1234',
        });

        const provider2 = await fakeUsersRepository.create({
            email: 'raiza@gmail.com.br',
            name: 'Raiza Dutra',
            password: '1234',
        });

        const loggedUser = await fakeUsersRepository.create({
            email: 'junior@encel.com.br',
            name: 'Marcio Junior',
            password: '1234',
        });

        const providers = await listProviders.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([provider1, provider2]);
    });
});
