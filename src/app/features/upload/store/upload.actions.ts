import { createAction, props } from '@ngrx/store';

export const uploadPdf = createAction(
  '[Upload] Upload PDF',
  props<{ file: File; chunkSize: number; overlap: number }>()
);

export const uploadProgress = createAction(
  '[Upload] Upload Progress',
  props<{ percent: number }>()
);

export const uploadSuccess = createAction(
  '[Upload] Upload Success',
  props<{ fileName: string; totalChunks: number; savedChunks: number }>()
);

export const uploadFailure = createAction(
  '[Upload] Upload Failure',
  props<{ error: string }>()
);

export const resetUpload = createAction('[Upload] Reset');
