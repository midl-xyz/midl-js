import { AddressPurpose } from "@midl-xyz/midl-js-core"
import { BitcoinIcon, CircleHelpIcon } from "lucide-react";

type PurposeIconProps = {
    purpose: AddressPurpose;
}

export const PurposeIcon = ({purpose}: PurposeIconProps) => {
    switch (purpose) {
        case AddressPurpose.Payment: {
            return <BitcoinIcon />
        }
    }

    return <CircleHelpIcon/>
}