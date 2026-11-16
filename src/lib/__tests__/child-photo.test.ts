import { childPhotoPath } from '@/lib/child-photo';

describe('childPhotoPath', () => {
  it('puts the photo under the nursery and the child, as the profile-photos policy reads it', () => {
    const path = childPhotoPath('nursery-1', 'child-7', 'abc123');

    expect(path).toBe('nursery-1/children/child-7/abc123.jpg');
  });
});
