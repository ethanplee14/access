declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FS_TOKEN: string;
      DATABASE_URL: string;
      GOOGLE_ID: string;
      GOOGLE_SECRET: string;
    }
  }
}
