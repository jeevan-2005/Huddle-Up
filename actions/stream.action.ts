"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

// using this we dont have to install express or node since this code will run on server side.

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;


const tokenProvider = async () => {
    const user = await currentUser();

    if(!user) throw new Error("User is not logged in");

    if(!apiKey) throw new Error("Stream API key not found");
    if(!apiSecret) throw new Error("Stream API secret not found");

    // creating client using StreamCLient from node sdk
    const client = new StreamClient(apiKey, apiSecret);
    // expiry is optional (by default token is valid for 1 hour)
    const expiry = Math.round(new Date().getTime() /1000 ) + 60 * 60;
    // to get the time when the token was issued.
    const issued = Math.floor(Date.now() / 1000) - 60

    const token = client.generateUserToken({user_id:user.id, expiry, issued});

    return token;
}

export default tokenProvider;