import { AuthState } from '../features/auth/store/auth.reducer';
import { UploadState } from '../features/upload/store/upload.reducer';
import { ChatState } from '../features/chat/store/chat.reducer';

export interface AppState {
  auth: AuthState;
  upload: UploadState;
  chat: ChatState;
}
