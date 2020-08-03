import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
        );

        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });
    });

    it('should be able to create a new appointment', async () => {
        const appointment = await createAppointmentService.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: 'Raiza',
            provider_id: 'MarcioJr',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('MarcioJr');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const appointmentDate = new Date(2020, 4, 10, 13);

        await createAppointmentService.execute({
            date: appointmentDate,
            user_id: 'Raiza',
            provider_id: 'MarcioJr',
        });

        await expect(
            createAppointmentService.execute({
                date: appointmentDate,
                user_id: 'Raiza',
                provider_id: 'MarcioJr',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 11),
                user_id: 'Raiza',
                provider_id: 'MarcioJr',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with same user as provider', async () => {
        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 13),
                user_id: 'Raiza',
                provider_id: 'Raiza',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8am or after 17pm', async () => {
        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 11, 7),
                user_id: 'Raiza',
                provider_id: 'MarcioJr',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 11, 18),
                user_id: 'Raiza',
                provider_id: 'MarcioJr',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
