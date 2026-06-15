import { Injectable } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { UploadService } from '../services/upload.service';
import * as UploadActions from './upload.actions';

@Injectable()
export class UploadEffects {
  constructor(
    private actions$: Actions,
    private uploadService: UploadService
  ) {}

  /**
   * switchMap: if user re-uploads before previous finishes, cancels old request.
   * Tracks HttpEventType.UploadProgress for a real progress bar.
   */
  uploadPdf$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UploadActions.uploadPdf),
      switchMap(({ file, chunkSize, overlap }) =>
        this.uploadService.uploadPdf(file, chunkSize, overlap).pipe(
          map(event => {
            if (event.type === HttpEventType.UploadProgress) {
              const percent = event.total
                ? Math.round((100 * event.loaded) / event.total)
                : 0;
              return UploadActions.uploadProgress({ percent });
            }

            if (event.type === HttpEventType.Response) {
              const body = event.body as any;
              return UploadActions.uploadSuccess({
                fileName: body.fileName,
                totalChunks: body.totalChunks,
                savedChunks: body.savedChunks
              });
            }

            return null;
          }),
          filter(action => action !== null),
          map(action => action!),
          catchError(err => {
            const msg = err?.error?.error ?? 'Upload failed. Please try again.';
            return of(UploadActions.uploadFailure({ error: msg }));
          })
        )
      )
    )
  );
}
