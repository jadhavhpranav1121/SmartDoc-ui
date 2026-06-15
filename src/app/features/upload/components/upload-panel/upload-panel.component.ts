import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../../store/app.state';
import { uploadPdf, resetUpload } from '../../store/upload.actions';
import {
  selectUploadStatus,
  selectUploadProgress,
  selectUploadFileName,
  selectUploadTotalChunks,
  selectUploadSavedChunks,
  selectUploadError,
  selectIsUploading
} from '../../store/upload.selectors';
import { UploadStatus } from '../../store/upload.reducer';

@Component({
  selector: 'app-upload-panel',
  templateUrl: './upload-panel.component.html',
  styleUrls: ['./upload-panel.component.scss']
})
export class UploadPanelComponent implements OnInit {
  status$!: Observable<UploadStatus>;
  progress$!: Observable<number>;
  fileName$!: Observable<string | null>;
  totalChunks$!: Observable<number>;
  savedChunks$!: Observable<number>;
  error$!: Observable<string | null>;
  isUploading$!: Observable<boolean>;

  selectedFile: File | null = null;
  chunkSize = 500;
  overlap = 50;
  isDragOver = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.status$ = this.store.select(selectUploadStatus);
    this.progress$ = this.store.select(selectUploadProgress);
    this.fileName$ = this.store.select(selectUploadFileName);
    this.totalChunks$ = this.store.select(selectUploadTotalChunks);
    this.savedChunks$ = this.store.select(selectUploadSavedChunks);
    this.error$ = this.store.select(selectUploadError);
    this.isUploading$ = this.store.select(selectIsUploading);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.setFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.setFile(file);
  }

  private setFile(file: File): void {
    if (file.type !== 'application/pdf') {
      return;
    }
    this.selectedFile = file;
    this.store.dispatch(resetUpload());
  }

  upload(): void {
    if (!this.selectedFile) return;
    this.store.dispatch(uploadPdf({
      file: this.selectedFile,
      chunkSize: this.chunkSize,
      overlap: this.overlap
    }));
  }

  reset(): void {
    this.selectedFile = null;
    this.store.dispatch(resetUpload());
  }
}
