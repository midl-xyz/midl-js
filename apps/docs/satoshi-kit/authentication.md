---
order: 3
---

# Authentication

In the modern web, besides the ability to connect wallets, it's also crucial to authenticate users. SatoshiKit provides a simple way to authenticate users using their Bitcoin wallets by signing an authentication message.


To authenticate users on wallet connect, you can use the `authenticationAdapter` prop of the `SatoshiKitProvider`. This prop allows you to specify your own authentication adapter that will be used to authenticate users when they connect their wallets. 

When you set the `authenticationAdapter`, SatoshiKit will automatically handle the authentication flow for you. It will prompt the user to sign an authentication message when they connect their wallet, and it will verify the signature using the provided adapter.

The authentication adapter should implement the following methods:

```ts
export type AuthenticationAdapter = {
	verify({
		message,
		signature,
		network,
		account,
	}: {
		message: string;
		signature: string;
		network: BitcoinNetwork;
		account: Account;
	}): Promise<boolean>;
	createMessage(
		account: Account,
		network: BitcoinNetwork,
	): Promise<{
		message: string;
		signMessageProtocol?: SignMessageProtocol;
	}>;
	signOut(): Promise<void>;
};
```

`verify` method is used to verify the signature of the authentication message. It should return `true` if the signature is valid, and `false` otherwise. You can use server side verification or client side verification depending on your use case.

`createMessage` method is used to create the authentication message that will be signed by the user. It should return an object with the `message` field containing the message to be signed, and optionally a `signMessageProtocol` field specifying the protocol to use for signing the message.

`signOut` method is used to sign out the user. It should clear any authentication state and reset the user's session.

## Example

```tsx
import { SatoshiKitProvider, createMidlConfig, createAuthenticationAdapter } from "@midl/satoshi-kit";
import { regtest } from "@midl/core";

const midlConfig = createMidlConfig({
    networks: [regtest],
    persist: true,
});


const authenticationAdapter = createAuthenticationAdapter({
    async verify({ message, signature, account, network }) {
        // Implement your verification logic here
        return true; // or false based on verification
    },
    async createMessage(account, network) {
        const message = `Sign in to SatoshiKit with account ${account.address}`;
        return { message };
    },
    async signOut() {
        // Implement your sign out logic here
    },
});


export const App = () => {
    return (
        <MidlProvider config={midlConfig}>
            <SatoshiKitProvider authenticationAdapter={authenticationAdapter}>
                {/* Your app components */}
            </SatoshiKitProvider>
        </MidlProvider>
    );
};

```
