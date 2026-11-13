import type { PickedMedia } from '@/lib/gallery-upload';

import { TEACHER_UPLOAD_COPY } from '../teacher-upload-copy';
import { checkedGroupKeysOf, INITIAL_TEACHER_UPLOAD_STATE, TEACHER_UPLOAD_ACTIONS, teacherUploadReducer, type TeacherUploadState } from '../teacher-upload-reducer';

function pick(id: string): PickedMedia {
  return { id, kind: 'photo', uri: `file:///${id}`, width: 100, height: 100, durationSeconds: null, thumbnailUri: null };
}

describe('teacherUploadReducer', () => {
  it('adds new picks after the ones already chosen', () => {
    const state = teacherUploadReducer({ ...INITIAL_TEACHER_UPLOAD_STATE, picks: [pick('a')] }, { type: TEACHER_UPLOAD_ACTIONS.MEDIA_PICKED, picks: [pick('b')] });
    expect(state.picks.map((media) => media.id)).toEqual(['a', 'b']);
  });

  it('clears the camera line once something is picked', () => {
    const state = teacherUploadReducer({ ...INITIAL_TEACHER_UPLOAD_STATE, cameraDenied: true }, { type: TEACHER_UPLOAD_ACTIONS.MEDIA_PICKED, picks: [pick('a')] });
    expect(state.cameraDenied).toBe(false);
  });

  it('removes one pick with its x', () => {
    const state = teacherUploadReducer({ ...INITIAL_TEACHER_UPLOAD_STATE, picks: [pick('a'), pick('b')] }, { type: TEACHER_UPLOAD_ACTIONS.PICK_REMOVED, id: 'a' });
    expect(state.picks.map((media) => media.id)).toEqual(['b']);
  });

  it('uses the default groups until the teacher touches a checkbox', () => {
    expect(checkedGroupKeysOf(INITIAL_TEACHER_UPLOAD_STATE, ['am'])).toEqual(['am']);
  });

  it('adds a group to the default ones when it is checked', () => {
    const state = teacherUploadReducer(INITIAL_TEACHER_UPLOAD_STATE, { type: TEACHER_UPLOAD_ACTIONS.GROUP_TOGGLED, groupKey: 'pm', defaultGroupKeys: ['am'] });
    expect(checkedGroupKeysOf(state, ['am'])).toEqual(['am', 'pm']);
  });

  it('unchecks a checked group, down to none', () => {
    const state = teacherUploadReducer(INITIAL_TEACHER_UPLOAD_STATE, { type: TEACHER_UPLOAD_ACTIONS.GROUP_TOGGLED, groupKey: 'am', defaultGroupKeys: ['am'] });
    expect(checkedGroupKeysOf(state, ['am'])).toEqual([]);
  });

  it('empties the picks when the upload starts and keeps the checked groups', () => {
    const before: TeacherUploadState = { picks: [pick('a')], checkedGroupKeys: ['am', 'pm'], cameraDenied: false };
    const state = teacherUploadReducer(before, { type: TEACHER_UPLOAD_ACTIONS.UPLOAD_STARTED });
    expect(state).toEqual({ picks: [], checkedGroupKeys: ['am', 'pm'], cameraDenied: false });
  });

  it('shows the camera line when the permission is refused', () => {
    expect(teacherUploadReducer(INITIAL_TEACHER_UPLOAD_STATE, { type: TEACHER_UPLOAD_ACTIONS.CAMERA_DENIED }).cameraDenied).toBe(true);
  });
});

describe('TEACHER_UPLOAD_COPY', () => {
  it('names the files and the rooms on the upload button', () => {
    expect(TEACHER_UPLOAD_COPY.uploadButton(4, 2)).toBe('Subir 4 a 2 salas');
  });

  it('names only the files for one room', () => {
    expect(TEACHER_UPLOAD_COPY.uploadButton(4, 1)).toBe('Subir 4');
  });

  it('asks for a room when none is checked', () => {
    expect(TEACHER_UPLOAD_COPY.uploadButton(4, 0)).toBe('Elegí al menos una sala');
  });

  it('says one video is too long in the singular', () => {
    expect(TEACHER_UPLOAD_COPY.tooLong(1)).toBe('1 video es muy largo (máx. 1:30). No se va a subir.');
  });

  it('says several videos are too long in the plural', () => {
    expect(TEACHER_UPLOAD_COPY.tooLong(2)).toBe('2 videos son muy largos (máx. 1:30). No se van a subir.');
  });

  it('names a video with its length and a photo as Foto', () => {
    expect(TEACHER_UPLOAD_COPY.itemName('video', '0:42')).toBe('Video · 0:42');
    expect(TEACHER_UPLOAD_COPY.itemName('photo', null)).toBe('Foto');
  });
});
