const CHILD_PHOTO_EXTENSION = 'jpg';
const CHILDREN_FOLDER = 'children';

/** The `profile_photos_upload` policy reads the nursery from the first folder of the path. */
export function childPhotoPath(nurseryId: string, childId: string, photoId: string): string {
  return `${nurseryId}/${CHILDREN_FOLDER}/${childId}/${photoId}.${CHILD_PHOTO_EXTENSION}`;
}
