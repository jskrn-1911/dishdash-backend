import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifyServiceSid) {
    throw new Error("twilio credentials are not properly configured in .env");
}

const client = twilio(accountSid, authToken);

export const sendOTP = async (phoneNumber) => {
    // console.log(accountSid, authToken, verifyServiceSid)
    console.log(phoneNumber)
    try {
        const verification = await client.verify.v2.services(verifyServiceSid)
            .verifications
            .create({ to: `${phoneNumber}`, channel: "sms" });
        return verification.status;
    } catch (error) {
        console.error("error sending OTP:", error);
        throw new Error("failed to send OTP");
    }
};

export const verifyOTP = async (phoneNumber, otp) => {
    try {
        const verificationCheck = await client.verify.v2.services(verifyServiceSid)
            .verificationChecks
            .create({ to: `${phoneNumber}`, code: otp });
        return verificationCheck.status;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw new Error("Failed to verify OTP");
    }
};
