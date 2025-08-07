interface UserInfo {
  facialId: string;
  timestamp: string;
  details: {
    gender: string;
    age: string;
  };
}

interface UserData {
  facialId: string;
  payload?: any;
}

export interface FaceIOInstance {
  enroll(options?: any): Promise<UserInfo>;
  authenticate(options?: any): Promise<UserData>;
  restartSession(options?: any): Promise<any>;
}

declare global {
  interface Window {
    faceIO: new (apiKey: string) => FaceIOInstance;
    fioErrCode: Record<string, number>;
  }
}

export {};
