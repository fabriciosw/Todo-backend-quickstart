import * as typeorm from 'typeorm';
import { CreateUserService } from '../src/services/users.service';
import AppError from '../src/utils/AppError';

describe('User service', () => {
  const users = [
    {
      id: 1,
      email: 'teste@email.com',
      senha: '$2b$12$jj4i.Vc2Bl1GTYOVnf.u7uJahi6Vzf7rntY023B/spMaRz54gwwiW', // 12345
    },
    {
      id: 2,
      email: 'teste2@email.com',
      senha: '$2b$12$jj4i.Vc2Bl1GTYOVnf.u7uJahi6Vzf7rntY023B/spMaRz54gwwiW', // 12345
    },
  ];

  const findByEmailFake = jest
    .fn()
    .mockImplementation((email: string) =>
      users.find((user) => user.email === email)
    );

  const createFake = jest.fn().mockImplementation((email, senha) => {
    const user = {
      email,
      senha,
      id: Math.floor(Math.random() * (1000 - 3)) + 1,
    };

    return user;
  });

  const saveFake = jest.fn().mockImplementation(() => true);

  const spyRepository = jest.spyOn(typeorm, 'getCustomRepository');

  spyRepository.mockReturnValue({
    create: createFake,
    save: saveFake,
    findByEmail: findByEmailFake,
  });

  it('Should be able to create a new user', async () => {
    const user = await CreateUserService('teste3@email.com', '12345');

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(createFake).toHaveBeenCalledTimes(1);
    expect(saveFake).toHaveBeenCalledTimes(1);
    expect(findByEmailFake).toHaveBeenCalledTimes(1);
  });

  it('Shouldnt be able to create a new user with duplicated email', async () => {
    await expect(
      CreateUserService('teste@email.com', '12345')
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      CreateUserService('teste@email.com', '12345')
    ).rejects.toThrowError('Já existe um usuário com este email');
  });
});
