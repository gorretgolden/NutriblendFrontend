import React from "react";
import VerifyEmailClient from "./VerifyEmailClient";

interface VerifyEmailPageProps {
    params: {
        id: string;
        token: string;
    };
}

export function generateStaticParams() {
    // Generate placeholder path for static export build compatibility
    return [{ id: "placeholder", token: "placeholder" }];
}

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
    const { id, token } = params;
    return <VerifyEmailClient id={id} token={token} />;
}
