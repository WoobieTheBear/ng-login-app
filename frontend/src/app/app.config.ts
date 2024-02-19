
export const protocol = 'http';
export const domain = 'localhost';
export const backendPort = 9001;
export const frontendPort = 4200;
export const origin = `${protocol}://${domain}:${frontendPort}`;
export const baseUrl = `${protocol}://${domain}:${backendPort}`;
export const authTokenName = 'ng-login-test';