// import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list month availability from provider', async () => {
        for (let hour = 8; hour <= 17; hour += 1) {
            // eslint-disable-next-line no-await-in-loop
            await fakeAppointmentsRepository.create({
                provider_id: 'user',
                user_id: 'user2',
                date: new Date(2020, 4, 20, hour, 0, 0),
            });
        }

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user2',
            date: new Date(2020, 4, 21, 8, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 19, 18).getTime();
        });

        const availability = await listProviderMonthAvailability.execute({
            provider_id: 'user',
            month: 5,
            year: 2020,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 19, available: true },
                { day: 20, available: false },
                { day: 21, available: true },
                { day: 22, available: true },
            ]),
        );
    });
});
