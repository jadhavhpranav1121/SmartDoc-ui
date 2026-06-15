import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UploadState } from './upload.reducer';

export const selectUploadState = createFeatureSelector<UploadState>('upload');

export const selectUploadStatus = createSelector(selectUploadState, s => s.status);
export const selectUploadProgress = createSelector(selectUploadState, s => s.progress);
export const selectUploadFileName = createSelector(selectUploadState, s => s.fileName);
export const selectUploadTotalChunks = createSelector(selectUploadState, s => s.totalChunks);
export const selectUploadSavedChunks = createSelector(selectUploadState, s => s.savedChunks);
export const selectUploadError = createSelector(selectUploadState, s => s.error);
export const selectIsUploading = createSelector(selectUploadState, s => s.status === 'uploading');
