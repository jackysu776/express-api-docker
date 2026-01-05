const admin = require('firebase-admin');

// Firebase 服務帳號配置
const serviceAccount = {
  type: 'service_account',
  project_id: 'mforceent-e5f06',
  private_key_id: '4f1cda4fcc1a26c3a284e62121474967c470c59b',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDOm1i1pz4wupTS\nSeS3Bddp7jTMv49nAboAK9vpdabzhz1YqjCgtUZ89rZSZEi5hISKFim0NqKoRHiU\nZQx1utprZsZGJnBmoJOBJoyRNxo1QSU5nMNTR9V8x8T/2kJlhJfhbv2efPPMLf8Q\nlwFYN8fkDR/XAuD50Ldq5QDNvTmZwKEMdIxhYFMBLBFmd3YVl2uXhe1w1ycv316X\nWHt2MYoF5iSObdSrR8V1tmTjLeW2Kzbyyp8g1vM95/XzB6XJCcdxuQO23s4LeVY6\neS/khYz732bpRhww+dXNl1Vrh7KVWNeSFloECQOmIShf9522j/kLcerJyXqqRM6q\nGELuAfh3AgMBAAECggEAM7WQscI+X+7KwYjp+96z59jNETOeff7iIRnZC+i81LWT\n5oWN7yL/ldYfkqZzxy7CB1d9r5N/CVM9xJI32J1f/kJ2PGdxeVYWJNxTkSKz5gE8\ngltYTZcsePL8vLZRKNxTMQJY6ppGYGNgs7O/i+dGGa8pOWSIjy2sQk43cca6zF6E\n0obiS2RO04mooj3uHjbxbUaLuCfPwR6lUeSKVgd4dg+W13eHcrBEkNnE/dc8taNy\nxk2qim8tg98CATx3ff7wnkT3aumnRXUWxvjKez0PRDwkeEX0yattf9ywTFA6Swq6\n3ZeRpqls62znUzUYN0Qh8b8Q5WHhTuTg0LY4tc8zqQKBgQD5MLRRZUoewzIkpB9l\nWhMEfY0qCkhhw9G1YvXeSAmx68sXAuecwmldxUYXPkY49iv1vSakIwqTRW6H4A8C\naNzb5TkPDKFcSJY/AowY1N7MUDoddiagXjHXPcql1ZbKQyNMXguZj3lAZRaQc0HV\nGIo5PkGG3qR03B1rq+9CkJnorwKBgQDUQLw23C0ExlCTBq4Ob5oaQ07sg94s1G/j\nDYJpEvB8JI/ULeHNxq1s1HqLUKMeXacNDbXCebutAAMowggl+pKPtjWPa/0nm+Ds\n5+nyKDN997+nAmpb737VCKUAapFXhPzF+8NIJGqfqez7e3zVYuNy3+jwANukQUFe\npQ6cTjTOuQKBgAGvNZjTQXQBx8X9ogSyXiyKmLivBxw6EaHTQGw3OnGMcXv/Vgd2\nPPYYTkf78MeTympH1AoJ/plOP9gFSLSwdsW5v+/9Gt4f03wrjTzhu3vQEwR99vbg\njB+zWDpUvkcxuvxaKmPoV157EHL7hHdnSg/m/tRljuEHV9+RcvWVOqUbAoGBAIVR\nE+cxbGVvWvS+YV1X4+dTF6OfQFHQLWbj+WGeL8cJ//05xHbHr+6Hl2EiCRLtqBue\n3OeGJseHFnTnSs7wEFaMECBBqATU9/ZVxLABaDZbAtoXvk54o6WThHA6f4gFU+/X\nLtWFaiNXTC65ZbNyJYLl+R2mrE8DXdfgvMiYprqhAoGAUnq5goD59KxhtfJ1L7iF\noRcpDyro0tqGDxaHddbSjCm1xz7n6H9J3x/0dYrt6hKT6RTLOV4uOE5p5yvYui+H\nkSKFE1OXNPCvG4Ut350sYo7S6FFznDA33dLIMxZ2+1UzmiNEX5HbBJLe+/YDy7Km\nIuk6T8cR1vAiq5gLGBSSQuU=\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-fbsvc@mforceent-e5f06.iam.gserviceaccount.com',
  client_id: '114321644455792316080',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mforceent-e5f06.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.warn('Firebase initialization warning:', error.message);
  console.warn('Push notification service may not be available');
}

module.exports = admin;
