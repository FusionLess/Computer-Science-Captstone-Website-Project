import type { Dispatch,  RefObject, SetStateAction} from "react";

export type SyncedCamera = {
    position: [number, number, number]
    target: [number, number, number]
    zoom: number
}

export type SyncState = {
    syncEnabled : boolean,
    setSyncEnabled: Dispatch<SetStateAction<boolean>>,
    syncedCameraRef: RefObject<SyncedCamera | null>,
    sharedResetTrigger : number,
    setSharedResetTrigger: Dispatch<SetStateAction<number>>,
    index : number
}