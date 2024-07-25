import type { EIP6963AnnounceProviderEvent } from "@metamask/providers";

export const discoverSnapsProvider = () => {
  return new Promise((resolve, reject) => {
    if (typeof globalThis.window === "undefined") {
      reject(new Error("No window object found"));
      return;
    }

    const onProviderAnnounced = (event: EIP6963AnnounceProviderEvent) => {
      const { detail } = event;

      if (detail.info.rdns.includes("io.metamask.flask")) {
        resolve(detail.provider);
        globalThis.clearTimeout(timeoutId);
        globalThis.removeEventListener(
          "eip6963:announceProvider",
          onProviderAnnounced
        );
      }
    };

    const timeoutId = setTimeout(() => {
      reject(new Error("Provider not found"));

      globalThis.removeEventListener(
        "eip6963:announceProvider",
        onProviderAnnounced
      );
    }, 5000);

    globalThis.addEventListener(
      "eip6963:announceProvider",
      onProviderAnnounced
    );
    globalThis.dispatchEvent(new Event("eip6963:requestProvider"));
  });
};
