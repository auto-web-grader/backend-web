import { AuthResponse } from "./AuthModel";

export interface FileRequest {
  file: File;
  type: string;
}

export interface GradeStatisticRequest {
  file: File;
  answer1: Float32Array;
  answer2: Float32Array;
  answer3: Float32Array;
  answer4: string;
  answer5: Float32Array;
  answer7: Float32Array;
  answer8: string;
}

export interface UserSubmissionResponse {
  id: number;
  submitTime: Date;
  correctAnswer: number;
  totalAnswer: number;
  type: string;
  user: AuthResponse;
}
