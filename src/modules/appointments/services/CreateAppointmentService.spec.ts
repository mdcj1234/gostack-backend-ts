import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();

        const createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointment = await createAppointmentService.execute({
            date: new Date(),
            provider_id: 'MarcioJr',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('MarcioJr');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();

        const createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointmentDate = new Date(2020, 6, 22);

        await createAppointmentService.execute({
            date: appointmentDate,
            provider_id: 'MarcioJr',
        });

        expect(
            createAppointmentService.execute({
                date: appointmentDate,
                provider_id: 'MarcioJr',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
