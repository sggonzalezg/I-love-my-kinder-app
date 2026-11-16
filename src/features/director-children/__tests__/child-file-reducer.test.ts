import { CHILD_FILE_PARTS } from '@/lib/director-child-file';

import { CHILD_FILE_ACTIONS, INITIAL_CHILD_FILE_STATE, childFileReducer } from '../child-file-reducer';

describe('childFileReducer', () => {
  it('starts on Datos, editing, with no edits', () => {
    const state = INITIAL_CHILD_FILE_STATE;

    expect([state.part, state.status, state.edits, state.showErrors, state.saveFailed]).toEqual([CHILD_FILE_PARTS.data, 'editing', {}, false, false]);
  });

  it('switches the part and keeps the edits', () => {
    const edited = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.FIELD_CHANGED, field: 'firstName', value: 'Mateo' });
    const state = childFileReducer(edited, { type: CHILD_FILE_ACTIONS.PART_CHOSEN, part: CHILD_FILE_PARTS.health });

    expect([state.part, state.edits.firstName]).toEqual([CHILD_FILE_PARTS.health, 'Mateo']);
  });

  it('hides the field errors on the new part', () => {
    const refused = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.SUBMIT_REFUSED });
    const state = childFileReducer(refused, { type: CHILD_FILE_ACTIONS.PART_CHOSEN, part: CHILD_FILE_PARTS.health });

    expect(state.showErrors).toBe(false);
  });

  it('stores an edited field', () => {
    const state = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.FIELD_CHANGED, field: 'allergies', value: 'Maní' });

    expect(state.edits).toEqual({ allergies: 'Maní' });
  });

  it('shows the field errors after a refused save', () => {
    const state = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.SUBMIT_REFUSED });

    expect(state.showErrors).toBe(true);
  });

  it('marks saving', () => {
    const state = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.SAVE_STARTED });

    expect(state.status).toBe('saving');
  });

  it('keeps the edits after a failed save', () => {
    const edited = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.FIELD_CHANGED, field: 'lastName', value: 'Sosa' });
    const saving = childFileReducer(edited, { type: CHILD_FILE_ACTIONS.SAVE_STARTED });
    const failed = childFileReducer(saving, { type: CHILD_FILE_ACTIONS.SAVE_FAILED });

    expect([failed.status, failed.edits.lastName, failed.saveFailed]).toEqual(['editing', 'Sosa', true]);
  });

  it('clears the save failure once a field changes', () => {
    const failed = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.SAVE_FAILED });
    const edited = childFileReducer(failed, { type: CHILD_FILE_ACTIONS.FIELD_CHANGED, field: 'firstName', value: 'M' });

    expect(edited.saveFailed).toBe(false);
  });

  it('ignores edits and part changes while saving', () => {
    const saving = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.SAVE_STARTED });
    const edited = childFileReducer(saving, { type: CHILD_FILE_ACTIONS.FIELD_CHANGED, field: 'firstName', value: 'M' });
    const switched = childFileReducer(edited, { type: CHILD_FILE_ACTIONS.PART_CHOSEN, part: CHILD_FILE_PARTS.health });

    expect(switched).toBe(saving);
  });

  describe('photo', () => {
    it('starts with the source sheet closed and no new photo', () => {
      const photo = INITIAL_CHILD_FILE_STATE.photo;

      expect(photo).toEqual({ sourceOpen: false, status: 'idle', cameraDenied: false, savedPath: null });
    });

    it('opens the source sheet and clears an earlier camera refusal and failure', () => {
      const denied = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.PHOTO_CAMERA_DENIED });
      const failed = childFileReducer(denied, { type: CHILD_FILE_ACTIONS.PHOTO_UPLOAD_FAILED });
      const state = childFileReducer(failed, { type: CHILD_FILE_ACTIONS.PHOTO_SOURCE_OPENED });

      expect(state.photo).toEqual({ sourceOpen: true, status: 'idle', cameraDenied: false, savedPath: null });
    });

    it('closes the source sheet', () => {
      const opened = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.PHOTO_SOURCE_OPENED });
      const state = childFileReducer(opened, { type: CHILD_FILE_ACTIONS.PHOTO_SOURCE_CLOSED });

      expect(state.photo.sourceOpen).toBe(false);
    });

    it('does not open the source sheet while the file is saving', () => {
      const saving = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.SAVE_STARTED });
      const state = childFileReducer(saving, { type: CHILD_FILE_ACTIONS.PHOTO_SOURCE_OPENED });

      expect(state).toBe(saving);
    });

    it('does not open the source sheet while a photo uploads', () => {
      const uploading = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.PHOTO_UPLOAD_STARTED });
      const state = childFileReducer(uploading, { type: CHILD_FILE_ACTIONS.PHOTO_SOURCE_OPENED });

      expect(state).toBe(uploading);
    });

    it('marks the camera as refused', () => {
      const state = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.PHOTO_CAMERA_DENIED });

      expect(state.photo.cameraDenied).toBe(true);
    });

    it('marks the upload and clears an earlier failure', () => {
      const failed = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.PHOTO_UPLOAD_FAILED });
      const state = childFileReducer(failed, { type: CHILD_FILE_ACTIONS.PHOTO_UPLOAD_STARTED });

      expect(state.photo.status).toBe('uploading');
    });

    it('keeps the photo it had after a failed upload', () => {
      const saved = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.PHOTO_SAVED, path: 'n/children/c/first.jpg' });
      const uploading = childFileReducer(saved, { type: CHILD_FILE_ACTIONS.PHOTO_UPLOAD_STARTED });
      const state = childFileReducer(uploading, { type: CHILD_FILE_ACTIONS.PHOTO_UPLOAD_FAILED });

      expect([state.photo.status, state.photo.savedPath]).toEqual(['failed', 'n/children/c/first.jpg']);
    });

    it('holds the new photo path once saved', () => {
      const uploading = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.PHOTO_UPLOAD_STARTED });
      const state = childFileReducer(uploading, { type: CHILD_FILE_ACTIONS.PHOTO_SAVED, path: 'n/children/c/new.jpg' });

      expect([state.photo.status, state.photo.savedPath]).toEqual(['idle', 'n/children/c/new.jpg']);
    });

    it('keeps the field edits while the photo changes', () => {
      const edited = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.FIELD_CHANGED, field: 'firstName', value: 'Mateo' });
      const state = childFileReducer(edited, { type: CHILD_FILE_ACTIONS.PHOTO_SAVED, path: 'n/children/c/new.jpg' });

      expect(state.edits.firstName).toBe('Mateo');
    });
  });

  describe('cédulas of the people who pick up', () => {
    it('shows a cédula on the first tap', () => {
      const state = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.NATIONAL_ID_TOGGLED, personId: 'p1' });

      expect(state.revealedIds).toEqual(['p1']);
    });

    it('hides it again on the second tap', () => {
      const shown = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.NATIONAL_ID_TOGGLED, personId: 'p1' });
      const state = childFileReducer(shown, { type: CHILD_FILE_ACTIONS.NATIONAL_ID_TOGGLED, personId: 'p1' });

      expect(state.revealedIds).toEqual([]);
    });

    it('hides every cédula when the part changes', () => {
      const shown = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.NATIONAL_ID_TOGGLED, personId: 'p1' });
      const state = childFileReducer(shown, { type: CHILD_FILE_ACTIONS.PART_CHOSEN, part: CHILD_FILE_PARTS.contacts });

      expect(state.revealedIds).toEqual([]);
    });

    it('hides every cédula when the screen loses focus', () => {
      const shown = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.NATIONAL_ID_TOGGLED, personId: 'p1' });
      const state = childFileReducer(shown, { type: CHILD_FILE_ACTIONS.NATIONAL_IDS_HIDDEN });

      expect(state.revealedIds).toEqual([]);
    });

    it('keeps the same state when nothing is shown', () => {
      const state = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.NATIONAL_IDS_HIDDEN });

      expect(state).toBe(INITIAL_CHILD_FILE_STATE);
    });
  });
});
