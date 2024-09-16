import { AuthResponse } from "./AuthModel";

export interface FileRequest {
  file: File;
  type: string;
}

export interface UserSubmissionResponse {
  id: number;
  submitTime: Date;
  correctAnswer: number;
  totalAnswer: number;
  type: string;
  user: AuthResponse;
}
