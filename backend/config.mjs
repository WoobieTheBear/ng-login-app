
// path definitions
export const environment = 'dev';
export const dataDirectory = 'data';

// cors definitions
export const protocol = 'http';
export const domain = 'localhost';
export const backendPort = 9001;
export const frontendPort = 4200;
export const baseUrl = `${protocol}://${domain}:${backendPort}`;
export const frontendUrl = `${protocol}://${domain}:${frontendPort}`;
export const headerFields = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': `${protocol}://${domain}:${frontendPort}`,
    'Access-Control-Allow-Headers': 'X-Requested-With',
    'Cross-Origin-Resource-Policy': 'same-site',
    'Vary': '*',
}


// security definitions
export const authTokenName = 'ng-login-test';
export const serverSecret = 'xa8XbgC97Myz1Yi0ViywRX28yY1970qTFP4m20xuCJznHMEi+c2nGxGX7N+ZX7UXJHPyvrQl3vDj3D0ui1z8FqbkgrID6PDvDLKBaiAI3IdpOU8hi5u81VGs1rh+8wE4DZ4PZ36vi72GRmktmhwFg4AL4cPVVFudOGnkJ4Bfm/g=';
export const authTokenConfig = {
    'test': {
        domain: false,
    },
    'dev': {
        domain: false,
    },
    'prod': {
        domain: `.${domain}`,
        maxAge: 900000,
        httpOnly: true,
        secure: true,
        sameSite: true,
    }
};

