import { createPushDeviceId, readEasProjectId } from '@/lib/push-registration';

describe('readEasProjectId', () => {
  it('reads the project id from the app config', () => {
    const projectId = readEasProjectId({ expoConfig: { extra: { eas: { projectId: 'project-1' } } } });

    expect(projectId).toBe('project-1');
  });

  it('falls back to the EAS build config', () => {
    const projectId = readEasProjectId({ expoConfig: { extra: {} }, easConfig: { projectId: 'project-2' } });

    expect(projectId).toBe('project-2');
  });

  it('is null while the app is not linked to an EAS project', () => {
    expect(readEasProjectId({ expoConfig: null })).toBeNull();
  });
});

describe('createPushDeviceId', () => {
  it('builds a device id from the time and a random part', () => {
    const deviceId = createPushDeviceId(() => 0.5, 1_700_000_000_000);

    expect(deviceId).toMatch(/^device-[0-9a-z]+-[0-9a-z]+$/);
  });

  it('gives two installs at the same moment different ids', () => {
    const first = createPushDeviceId(() => 0.1, 1_700_000_000_000);
    const second = createPushDeviceId(() => 0.2, 1_700_000_000_000);

    expect(first).not.toBe(second);
  });
});
