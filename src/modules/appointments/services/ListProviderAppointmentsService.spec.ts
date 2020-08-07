// import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacherProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviderAppointmentsService = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to list provider appointments on a day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user2',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user2',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });

        const appointments = await listProviderAppointmentsService.execute({
            provider_id: 'user',
            day: 20,
            month: 5,
            year: 2020,
        });

        expect(appointments).toEqual(
            expect.arrayContaining([appointment1, appointment2]),
        );
    });

    it('should be able to list provider appointments on a day from cache', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user2',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user2',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });

        const findAllInDayFromProvider = jest.spyOn(
            fakeAppointmentsRepository,
            'findAllInDayFromProvider',
        );

        await listProviderAppointmentsService.execute({
            provider_id: 'user',
            day: 20,
            month: 5,
            year: 2020,
        });

        await listProviderAppointmentsService.execute({
            provider_id: 'user',
            day: 20,
            month: 5,
            year: 2020,
        });

        expect(findAllInDayFromProvider).toHaveBeenCalledTimes(1);
    });
});
