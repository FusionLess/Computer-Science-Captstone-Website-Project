import "./MiddlePanel.css"

import { HEART_STATE_TITLES } from "../../types/states.ts";
import type { HeartState } from "../../types/states.ts";
import type { CompareState } from "../../types/compare.ts"
import type { SyncedCamera, SyncState } from "../../types/sync.ts";

import { FRAMES } from "../../../data/frames.ts"
import { useState, useRef } from "react";

import HeartViewerPage from "../../hearts/HeartViewer.jsx"
import HeartButtons from "./HeartButtons.tsx";

export default function MiddlePanel({ compareState, setSelectedPart }: { compareState: CompareState, setSelectedPart: (part: string | null) => void }) {

    const {
        selection1,
        selection2,
        chooseSelection1,
        chooseSelection2,
        isComparing,
        setIsComparing,
    } = compareState

    const [syncEnabled, setSyncEnabled] = useState(false)
    const syncedCameraRef = useRef<SyncedCamera | null>(null)
    const [sharedResetTrigger, setSharedResetTrigger] = useState(0)

    const syncState: SyncState = {
        syncEnabled,
        setSyncEnabled,
        syncedCameraRef,
        sharedResetTrigger,
        setSharedResetTrigger,
        index: 0
    }

    return (
        <section className="middle-panel">
            <button
                type="button"
                className={`compare-button ${isComparing ? "" : "not-comparing"}`}
                aria-pressed={isComparing}
                onClick={() => setIsComparing(!isComparing)}
            >
                {isComparing ? "Stop Comparing" : "Compare"}
            </button>

            <div className="middle-panel-viewers">
                <HeartPanel
                    active={selection1}
                    setActive={chooseSelection1}
                    syncState={syncState}
                    setSelectedPart={setSelectedPart}
                />

                {isComparing &&
                    <button
                        className="sync"
                        onClick={() => (setSyncEnabled((syncEnabled) => !syncEnabled))}
                        style={{
                            background: syncEnabled ? "var(--selected-condition-background)" : "var(--cards-background)",
                            color: syncEnabled ? "var(--cards-background)" : "var(--body-texts)",
                        }}
                    >
                        <p style={{fontSize: '20px', fontWeight: 500, margin: '0', paddingBottom: '2px'}}>
                            🗘
                        </p>
                        Sync
                    </button>
                }

                {isComparing && (
                    <HeartPanel
                        active={selection2}
                        setActive={chooseSelection2}
                        syncState={{ ...syncState, index: 1 }}
                        setSelectedPart={setSelectedPart}
                    />
                )}
            </div>
        </section>
    )
}

function HeartPanel ({active, setActive, syncState, setSelectedPart}:
                    {active: HeartState, setActive: (v: HeartState) => void, syncState: SyncState, setSelectedPart: (part: string | null) => void }) {
    const {
        syncEnabled,
        syncedCameraRef,
        sharedResetTrigger,
        setSharedResetTrigger,
        index
    } = syncState

    return (
        <div className="heart_panel">
            <HeartButtons active={active} setActive={setActive}/>
            <div className="heart_viewer">
                <HeartViewerPage
                    frameFolder={FRAMES[active.option]}
                    setSelectedPart={setSelectedPart}
                    title={HEART_STATE_TITLES[active.option]}
                    syncEnabled={syncEnabled}
                    syncedCameraRef={syncedCameraRef}
                    index={index}
                    sharedResetTrigger={sharedResetTrigger}
                    setSharedResetTrigger={setSharedResetTrigger}
                />
            </div>
        </div>
    )
}
