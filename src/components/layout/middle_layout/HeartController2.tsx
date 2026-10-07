import "./HeartController2.css"

import { HEART_STATE_TITLES } from "../../types/states.ts";
import type { HeartState } from "../../types/states.ts";
import type { CompareState } from "../../types/compare.ts"
import type { SyncedCamera, SyncState } from "../../types/sync.ts";

import { FRAMES } from "../../../data/frames.ts"
import { useState, useRef } from "react";

import HeartViewerPage from "../../hearts/HeartViewer.jsx"
import ConditionButtons from "./ConditionSelector.tsx";

import HeartController from "../../hearts/HeartController.jsx"
import { useHeartMonitor } from "../../context/HeartMonitorContext"
import SliceControls from "../../hearts/SliceController.jsx"
import type { Complexity } from "../../types/complexities.ts";
export default function HeartController2({ compareState, setSelectedPart, complexity}: { compareState: CompareState, setSelectedPart: (part: string | null) => void, complexity: Complexity}) {

    const {
        selection1,
        selection2,
        chooseSelection1,
        chooseSelection2,
        isComparing,
        setIsComparing,
    } = compareState

    const handleCompare = () => {
        if (isComparing) {
            setIsComparing(false)
            return
        }

        if (selection1.category === "healthy") {
            chooseSelection2({
                category: "attack",
                option: "Minor",
            })
        } else {
            chooseSelection2({
                category: "healthy",
                option: "Healthy",
            })
        }
        setIsComparing(true)
    }

    const showControls = complexity !== "basic"

    const [syncEnabled, setSyncEnabled] = useState(false)
    const syncedCameraRef = useRef<SyncedCamera | null>(null)
    const [sharedResetTrigger, setSharedResetTrigger] = useState(0)

    const [sharedShowEpi, setSharedShowEpi] = useState(true)
    const [sharedVentricleOnly, setSharedVentricleOnly] = useState(false)
    const [sharedFullView, setSharedFullView] = useState(false)

    const useSharedControls = isComparing && syncEnabled
    const [sharedSliceEnabled, setSharedSliceEnabled] = useState(true)
    const [sharedShowPlaneGuide, setSharedShowPlaneGuide] = useState(true)

    const [sharedActivePreset, setSharedActivePreset] =
        useState<string | null>("shortAxis")

    const [sharedPitch, setSharedPitch] = useState(-90)
    const [sharedYaw, setSharedYaw] = useState(0)
    const [sharedSliceDistance, setSharedSliceDistance] = useState(-18)

    
    const {
        isPaused,
        setIsPaused
    } = useHeartMonitor()

    const handleSharedReset = () => {
        setSharedShowEpi(true)
        setSharedVentricleOnly(false)
        setSharedFullView(false)

        setSharedResetTrigger(prev => prev + 1)
    }

    const handleSharedVentricleView = () => {
        setSharedVentricleOnly(prev => !prev)
    }

    const handleSharedFullView = () => {
        setSharedFullView(prev => !prev)
    }
    const handleSharedPresetSelect = (
        presetKey: string,
        pitch: number,
        yaw: number
    ) => {
        setSharedActivePreset(presetKey)
        setSharedPitch(pitch)
        setSharedYaw(yaw)

        if (presetKey === "frontal") {
            setSharedSliceDistance(0)
        } else if (presetKey === "sagittal") {
            setSharedSliceDistance(-3)
        } else if (presetKey === "shortAxis") {
            setSharedSliceDistance(-18)
        }
    }

    const handleSharedDepthSliderChange = (depth: number) => {
        setSharedSliceDistance(depth)
    }
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
                onClick={handleCompare}
            >
                {isComparing ? "Stop Comparing" : "Compare"}
            </button>

            {isComparing &&
                <button
                    className="sync"
                    onClick={() => (setSyncEnabled((syncEnabled) => !syncEnabled))}
                    style={{
                        background: syncEnabled ? "var(--selected-condition-background)" : "var(--cards-background)",
                        color: syncEnabled ? "var(--cards-background)" : "var(--body-texts)",
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="lucide lucide-refresh-cw preview-icon">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M8 16H3v5"/>
                    </svg>
                    Sync
                </button>
            }

            <div className="middle-panel-viewers">

                <HeartPanel
                    active={selection1}
                    setActive={chooseSelection1}
                    syncState={syncState}
                    setSelectedPart={setSelectedPart}
                    useSharedControls={useSharedControls}
                    sharedShowEpi={sharedShowEpi}
                    setSharedShowEpi={setSharedShowEpi}
                    sharedVentricleOnly={sharedVentricleOnly}
                    setSharedVentricleOnly={setSharedVentricleOnly}
                    sharedFullView={sharedFullView}
                    setSharedFullView={setSharedFullView}

                    sharedSliceEnabled={sharedSliceEnabled}
                    setSharedSliceEnabled={setSharedSliceEnabled}

                    sharedShowPlaneGuide={sharedShowPlaneGuide}
                    setSharedShowPlaneGuide={setSharedShowPlaneGuide}

                    sharedActivePreset={sharedActivePreset}
                    setSharedActivePreset={setSharedActivePreset}

                    sharedPitch={sharedPitch}
                    setSharedPitch={setSharedPitch}

                    sharedYaw={sharedYaw}
                    setSharedYaw={setSharedYaw}

                    sharedSliceDistance={sharedSliceDistance}
                    setSharedSliceDistance={setSharedSliceDistance}
                    showControls={showControls}
                    complexity={complexity}
                />

                {isComparing && (
                    <HeartPanel
                        active={selection2}
                        setActive={chooseSelection2}
                        syncState={{ ...syncState, index: 1 }}
                        setSelectedPart={setSelectedPart}
                        useSharedControls={useSharedControls}
                        sharedShowEpi={sharedShowEpi}
                        setSharedShowEpi={setSharedShowEpi}
                        sharedVentricleOnly={sharedVentricleOnly}
                        setSharedVentricleOnly={setSharedVentricleOnly}
                        sharedFullView={sharedFullView}
                        setSharedFullView={setSharedFullView}
                        sharedSliceEnabled={sharedSliceEnabled}
                        setSharedSliceEnabled={setSharedSliceEnabled}

                        sharedShowPlaneGuide={sharedShowPlaneGuide}
                        setSharedShowPlaneGuide={setSharedShowPlaneGuide}

                        sharedActivePreset={sharedActivePreset}
                        setSharedActivePreset={setSharedActivePreset}

                        sharedPitch={sharedPitch}
                        setSharedPitch={setSharedPitch}

                        sharedYaw={sharedYaw}
                        setSharedYaw={setSharedYaw}

                        sharedSliceDistance={sharedSliceDistance}
                        setSharedSliceDistance={setSharedSliceDistance}

                        showControls={showControls}
                        complexity={complexity}
                    />
                    
                )}
            </div>
            {isComparing && syncEnabled && showControls && (
                <div className="shared-heart-controller">
                    <HeartController
                        isPaused={isPaused}
                        setIsPaused={setIsPaused}

                        showEpi={sharedShowEpi}
                        setShowEpi={setSharedShowEpi}

                        ventricleOnly={sharedVentricleOnly}
                        setVentricleOnly={setSharedVentricleOnly}

                        fullView={sharedFullView}

                        handleResetView={handleSharedReset}
                        handleFullView={handleSharedFullView}
                        handleVentricleView={handleSharedVentricleView}
                    />
                    <SliceControls
                        shared
                        index={0}

                        sliceEnabled={sharedSliceEnabled}
                        setSliceEnabled={setSharedSliceEnabled}

                        showPlaneGuide={sharedShowPlaneGuide}
                        setShowPlaneGuide={setSharedShowPlaneGuide}

                        activePreset={sharedActivePreset}
                        setActivePreset={setSharedActivePreset}

                        pitch={sharedPitch}
                        setPitch={setSharedPitch}

                        yaw={sharedYaw}
                        setYaw={setSharedYaw}

                        sliceDistance={sharedSliceDistance}

                        handlePresetSelect={handleSharedPresetSelect}
                        handleDepthSliderChange={handleSharedDepthSliderChange}
                        complexity={complexity}

                    />
                </div>
            )}

        </section>
    )
}

function HeartPanel ({
    active,
    setActive,
    syncState,
    setSelectedPart,
    useSharedControls,
    sharedShowEpi,
    setSharedShowEpi,
    sharedVentricleOnly,
    setSharedVentricleOnly,
    sharedFullView,
    setSharedFullView,

    sharedSliceEnabled,
    setSharedSliceEnabled,
    sharedShowPlaneGuide,
    setSharedShowPlaneGuide,
    sharedActivePreset,
    setSharedActivePreset,
    sharedPitch,
    setSharedPitch,
    sharedYaw,
    setSharedYaw,
    sharedSliceDistance,
    setSharedSliceDistance,

    showControls,
    complexity
}: {
    active: HeartState
    setActive: (v: HeartState) => void
    syncState: SyncState
    setSelectedPart: (part: string | null) => void
    useSharedControls: boolean
    sharedShowEpi: boolean
    setSharedShowEpi: (value: boolean) => void
    sharedVentricleOnly: boolean
    setSharedVentricleOnly: (value: boolean) => void
    sharedFullView: boolean
    setSharedFullView: (value: boolean) => void
    sharedSliceEnabled: boolean
    setSharedSliceEnabled: (value: boolean) => void
    sharedShowPlaneGuide: boolean
    setSharedShowPlaneGuide: (value: boolean) => void
    sharedActivePreset: string | null
    setSharedActivePreset: (value: string | null) => void
    sharedPitch: number
    setSharedPitch: (value: number) => void
    sharedYaw: number
    setSharedYaw: (value: number) => void
    sharedSliceDistance: number
    setSharedSliceDistance: (value: number) => void
    showControls: boolean
    complexity: Complexity
}) {
    const {
        syncEnabled,
        syncedCameraRef,
        sharedResetTrigger,
        setSharedResetTrigger,
        index
    } = syncState

    return (
        <div className="heart_panel">
            <ConditionButtons active={active} setActive={setActive}/>
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
                    useSharedControls={useSharedControls}
                    sharedShowEpi={sharedShowEpi}
                    setSharedShowEpi={setSharedShowEpi}
                    sharedVentricleOnly={sharedVentricleOnly}
                    setSharedVentricleOnly={setSharedVentricleOnly}
                    sharedFullView={sharedFullView}
                    setSharedFullView={setSharedFullView}

                    sharedSliceEnabled={sharedSliceEnabled}
                    setSharedSliceEnabled={setSharedSliceEnabled}

                    sharedShowPlaneGuide={sharedShowPlaneGuide}
                    setSharedShowPlaneGuide={setSharedShowPlaneGuide}

                    sharedActivePreset={sharedActivePreset}
                    setSharedActivePreset={setSharedActivePreset}

                    sharedPitch={sharedPitch}
                    setSharedPitch={setSharedPitch}

                    sharedYaw={sharedYaw}
                    setSharedYaw={setSharedYaw}

                    sharedSliceDistance={sharedSliceDistance}
                    setSharedSliceDistance={setSharedSliceDistance}

                    showControls={showControls}
                    complexity={complexity}
                />
            </div>
        </div>
    )
}
