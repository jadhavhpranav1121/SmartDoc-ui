import { createReducer, on } from '@ngrx/store';
import * as UploadActions from './upload.actions';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface UploadState {
  status: UploadStatus;
  progress: number;
  fileName: string | null;
  totalChunks: number;
  savedChunks: number;
  error: string | null;
}

export const initialUploadState: UploadState = {
  status: 'idle',
  progress: 0,
  fileName: null,
  totalChunks: 0,
  savedChunks: 0,
  error: null
};

export const uploadReducer = createReducer(
  initialUploadState,

  on(UploadActions.uploadPdf, state => ({
    ...state,
    status: 'uploading' as UploadStatus,
    progress: 0,
    error: null,
    fileName: null
  })),

  on(UploadActions.uploadProgress, (state, { percent }) => ({
    ...state,
    progress: percent
  })),

  on(UploadActions.uploadSuccess, (state, { fileName, totalChunks, savedChunks }) => ({
    ...state,
    status: 'success' as UploadStatus,
    progress: 100,
    fileName,
    totalChunks,
    savedChunks,
    error: null
  })),

  on(UploadActions.uploadFailure, (state, { error }) => ({
    ...state,
    status: 'error' as UploadStatus,
    progress: 0,
    error
  })),

  on(UploadActions.resetUpload, () => ({ ...initialUploadState }))
);
