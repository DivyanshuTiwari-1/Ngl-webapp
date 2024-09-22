import * as React from 'react';
import { Html, Button } from "@react-email/components";

export  default function verificationEmails({username,otp}:any) {
 

  return (
    <Html lang="en">
     <h1>Hi {username}</h1>
     <h2>your verification code is {otp}</h2>
    </Html>
  );
}


