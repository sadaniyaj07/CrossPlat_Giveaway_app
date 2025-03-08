import { ScaledSize } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { Colors } from "../colors/colors";

export const ButtonIconTypes = {
    icon: 'ICON',
    iconAndText: 'ICON_AND_TEXT'
}

export const connectionStatus = {
    HIGH: 'HIGH',
    LOW: 'LOW',
    MISSING: 'MISSING',
};

export type MediaPickerType = {
    type: 'image',
    source: { uri: string, mimeType: string, name: string | undefined, size: number }
}

export type StyleArgs = {
    theme: typeof Colors,
    dims: ScaledSize,
    insets: EdgeInsets
}

export const pickerOptions = [
    'Camera',
    'Gallery',
    'Delete',
    'Cancel',
]
export const pickerOptions1 = [
    'Camera',
    'Gallery',
    'Cancel',
]

export const imageOptions = {

    height: 400,
    width: 400,
    mediaType: 'photo',
    includeBase64: false,
}

export const appType = {
    App: 'App',
    Browser: 'Browser'
}

export const authType = {
    Local: 'Local',
    Facebook: 'Facebook',
    Google: 'Google',
    Apple: 'Apple'
}

export const identifierType = {
    Email: 'Email',
    UserName: 'UserName',
    PhoneNumber: 'PhoneNumber'
}

export const MessageType = {
    'Success': "success",
    'Error': "danger",
    'Warning': 'warning'
}

export const RateType = {
    'fixed': 'Fixed',
    'flexible': 'Flexible'
}

export const workTime = {
    'fixed': 'Fixed',
    'flexible': 'Flexible'
}
