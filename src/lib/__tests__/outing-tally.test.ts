import {
  isEveryAnswerIn,
  outingTimeLine,
  permissionCardDetail,
  permissionCardTitle,
  permissionRowChip,
  voidedPermissionsLine,
} from '../outing-tally';

const counts = (authorizedCount: number, declinedCount: number, pendingCount: number) => ({
  authorizedCount,
  declinedCount,
  pendingCount,
  childCount: authorizedCount + declinedCount + pendingCount,
});

describe('permissionCardTitle', () => {
  it('says how many of the children were authorized', () => {
    expect(permissionCardTitle(counts(18, 2, 6))).toBe('18 de 26 autorizaron');
  });

  it('uses the singular for one authorization', () => {
    expect(permissionCardTitle(counts(1, 0, 25))).toBe('1 de 26 autorizó');
  });
});

describe('permissionCardDetail', () => {
  it('lists who said no and who did not answer', () => {
    expect(permissionCardDetail(counts(18, 2, 6))).toBe('2 no autorizan · 6 sin responder');
  });

  it('uses the singular for one child who said no', () => {
    expect(permissionCardDetail(counts(25, 1, 0))).toBe('1 no autoriza');
  });

  it('leaves out a part with no children', () => {
    expect(permissionCardDetail(counts(20, 0, 6))).toBe('6 sin responder');
  });

  it('is empty when every child was authorized', () => {
    expect(permissionCardDetail(counts(26, 0, 0))).toBeNull();
  });
});

describe('isEveryAnswerIn', () => {
  it('is true once no child is left without an answer', () => {
    expect(isEveryAnswerIn(counts(24, 2, 0))).toBe(true);
  });

  it('is false while a child has no answer', () => {
    expect(isEveryAnswerIn(counts(18, 2, 6))).toBe(false);
  });
});

describe('permissionRowChip', () => {
  it('shows the authorizations over the children asked', () => {
    expect(permissionRowChip(counts(18, 2, 6))).toBe('Permisos 18 de 26');
  });
});

describe('voidedPermissionsLine', () => {
  it('says the signed permissions stop counting', () => {
    expect(voidedPermissionsLine(18)).toBe('Los 18 permisos firmados quedan sin efecto');
  });

  it('uses the singular for one signed permission', () => {
    expect(voidedPermissionsLine(1)).toBe('El permiso firmado queda sin efecto');
  });

  it('is empty when nobody signed yet', () => {
    expect(voidedPermissionsLine(0)).toBeNull();
  });
});

describe('outingTimeLine', () => {
  it('says when they leave and come back', () => {
    expect(outingTimeLine('10:00', '12:00')).toBe('Salen 10:00 · vuelven 12:00');
  });
});
