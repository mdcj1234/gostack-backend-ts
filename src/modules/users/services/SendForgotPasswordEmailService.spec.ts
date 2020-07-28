import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPassowordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeMailProvider,
        );
    });

    it('should be able to recover the password using email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
        await fakeUsersRepository.create({
            email: 'marcio@encel.com.br',
            name: 'Marcio Junior',
            password: '1234',
        });

        await sendForgotPasswordEmailService.execute({
            email: 'marcio@encel.com.br',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover password of a non existing user', async () => {
        await expect(
            sendForgotPasswordEmailService.execute({
                email: 'marcio@encel.com.br',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');
        const user = await fakeUsersRepository.create({
            email: 'marcio@encel.com.br',
            name: 'Marcio Junior',
            password: '1234',
        });

        await sendForgotPasswordEmailService.execute({
            email: 'marcio@encel.com.br',
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
