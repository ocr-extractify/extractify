/**
 * Represents the user object to be sent to the /auth/login endpoint.
*/
export type UserLogin = {
    username: string;
    password: string;
};

export type AccessToken = {
    access_token: string;
    token_type: string;
};