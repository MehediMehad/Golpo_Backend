import path from 'path';

import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });

import authConfig from './auth.config';
import emailConfig from './email.config';
import { getEnvVar } from '../utils/getEnvVar';

const config = {
  app: {
    env: getEnvVar('NODE_ENV'),
    port: getEnvVar('PORT'),
  },
  auth: authConfig,
  email: emailConfig,
  S3: {
    accessKeyId: getEnvVar('S3_ACCESS_KEY'),
    secretAccessKey: getEnvVar('S3_SECRET_KEY'),
    region: getEnvVar('S3_REGION', 'nyc3'),
    bucketName: getEnvVar('S3_BUCKET_NAME'),
    endpoint: getEnvVar('S3_ENDPOINT'),
  },
  Google: {
    google_service_account_email: getEnvVar('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
    google_private_key: getEnvVar('GOOGLE_PRIVATE_KEY'),
    google_calendar_id: getEnvVar('GOOGLE_CALENDAR_ID'),
    meeting_link: getEnvVar('MEETING_LINK'),
  },
  Zoom: {
    account_id: getEnvVar('ZOOM_ACCOUNT_ID'),
    client_id: getEnvVar('ZOOM_CLIENT_ID'),
    client_secret: getEnvVar('ZOOM_CLIENT_SECRET'),
  },
};

export default config;
