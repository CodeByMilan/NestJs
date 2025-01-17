import { Test } from '@nestjs/testing';
import { CommandModule, CommandModuleTest } from 'nestjs-command';
import { CommandAppModule } from './command/command.app.module';

describe('CommandAppModule', () => {
  let commandModule: CommandModuleTest;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [CommandAppModule]
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();
    commandModule = new CommandModuleTest(app.select(CommandModule));
  });

  it('test command module', async () => {
    const command = 'seed:admin';
    const args = { userName:'milan' , email: 'milan@gmail.com' ,password:'admin',role:'admin'};

    const user = await commandModule.execute(command, args);
    expect(user.userName).toBe('milan')
    expect(user.email).toBe('milan@gmail.com')
    expect(user.password).toBe('admin')
    expect(user.role).toBe('admin')
  });
});