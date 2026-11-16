import type { Dispatch } from 'react';

import { usePhotoSourcePicker } from '@/components/PhotoSourceSheet/use-photo-source-picker';
import { EVENT_FORM_ACTIONS, type EventFormAction } from '@/features/calendar/event-form-reducer';

/** The event's one image uploads only on save. */
export function useEventImagePicker(dispatch: Dispatch<EventFormAction>) {
  const picker = usePhotoSourcePicker({
    closeSheet: () => dispatch({ type: EVENT_FORM_ACTIONS.IMAGE_SOURCE_CLOSED }),
    onPicked: (uri) => dispatch({ type: EVENT_FORM_ACTIONS.IMAGE_PICKED, uri }),
    onCameraDenied: () => dispatch({ type: EVENT_FORM_ACTIONS.CAMERA_DENIED }),
  });

  return {
    open: () => dispatch({ type: EVENT_FORM_ACTIONS.IMAGE_SOURCE_OPENED }),
    close: () => dispatch({ type: EVENT_FORM_ACTIONS.IMAGE_SOURCE_CLOSED }),
    remove: () => dispatch({ type: EVENT_FORM_ACTIONS.IMAGE_REMOVED }),
    ...picker,
  };
}
