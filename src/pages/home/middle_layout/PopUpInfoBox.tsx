import "./PopUpInfoBox.css"
import type { MediaItem } from "../../../data/HeartDescriptions"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { HeartParts } from "../../../data/HeartParts"
import type { Complexity } from "../../../components/types/complexities"



type PopUpInfoBoxProps = {
    variant: "anatomy" | "description"
    title?: string
    description?: string
    functionText?: string
    media?: MediaItem[]
    selectedPart?: string | null
    complexity?: Complexity
    onClose: () => void
}

function PopUpInfoBox({
    variant,
    title,
    description,
    functionText,
    media = [],
    selectedPart,
    complexity,
    onClose
}: PopUpInfoBoxProps) {

    const [mediaIndex, setMediaIndex] = useState(0)
    const currentMedia = media[mediaIndex]
    const hasGallery = variant === "description" && media.length > 1

    const previousMedia = () => {setMediaIndex((current) =>current === 0 ? media.length - 1 : current - 1)}
    const nextMedia = () => {setMediaIndex((current) => current === media.length - 1 ? 0 : current + 1)}

    const heartPartKeys = Object.keys(HeartParts)
    const initialPartIndex = selectedPart ? heartPartKeys.indexOf(selectedPart): 0
    const [partIndex, setPartIndex] = useState(initialPartIndex >= 0 ? initialPartIndex : 0)
    const currentPartKey = heartPartKeys[partIndex]
    const currentPart = HeartParts[currentPartKey]

    const previousPart = () => {
        setPartIndex(current =>
            current === 0
                ? heartPartKeys.length - 1
                : current - 1
        )
    }

    const nextPart = () => {
        setPartIndex(current =>
            current === heartPartKeys.length - 1
                ? 0
                : current + 1
        )
    }
    const displayTitle =
        variant === "anatomy"
            ? currentPart.name
            : title

    const displayDescription =
        variant === "anatomy" && complexity
            ? currentPart.description[complexity]
            : description

    const displayFunction =
        variant === "anatomy" && complexity
            ? currentPart.function[complexity]
            : functionText

    const anatomyMedia =
        variant === "anatomy"
            ? currentPart.media?.[0]
            : undefined

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [onClose])

    return createPortal (
        <div className="popup_overlay" onClick={onClose}>
            <div className="popup_box" onClick={(e) => e.stopPropagation()}>
                <div className="popup_header">
                    <div>
                        {variant === "anatomy" ? (
                            <h2>Heart Anatomy</h2>
                        ) : (
                            <h2>Heart Description</h2>
                        )}
                        <p>Explore the {displayTitle}</p>
                    </div>

                    <button
                        className="popup_close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="lucide lucide-x preview-icon">
                            <path d="M18 6 6 18"/>
                            <path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>

                <div className="popup_content">
                    {/* LEFT SIDE */}
                    <div className="popup_text">
                        <h3>{displayTitle}</h3>
                        {displayDescription && (
                            <p className="popup_description">
                                {displayDescription}
                            </p>
                        )}

                        {displayFunction && (
                            <>
                                <h4>Function</h4>
                                <p>{displayFunction}</p>
                            </>
                        )}
                        {/* Current media information */}
                        {currentMedia?.title && (
                            <h3 className="popup_media_title">{currentMedia.title}</h3>
                        )}

                        {currentMedia?.transcript && (
                            <p className="popup_media_caption">{currentMedia.transcript}</p>
                        )}
                    </div>
                            
                    {/* RIGHT SIDE */}
                    {/* ANATOMY GALLERY */}
                    {variant === "anatomy" && anatomyMedia && (
                        <div className="popup_media">

                            <div className="popup_media_viewer">

                                <button
                                    className="gallery_button gallery_previous"
                                    onClick={previousPart}
                                    aria-label="Previous heart part"
                                >
                                    ‹
                                </button>

                                <img
                                    src={anatomyMedia.src}
                                    alt={anatomyMedia.alt ?? currentPart.name}
                                />

                                <button
                                    className="gallery_button gallery_next"
                                    onClick={nextPart}
                                    aria-label="Next heart part"
                                >
                                    ›
                                </button>

                            </div>

                            <div className="gallery_status">
                                <span>
                                    {partIndex + 1} of {heartPartKeys.length}
                                </span>
                            </div>

                            <div className="gallery_dots">
                                {heartPartKeys.map((key, index) => (
                                    <button
                                        key={key}
                                        className={`gallery_dot ${
                                            index === partIndex ? "active" : ""
                                        }`}
                                        onClick={() => setPartIndex(index)}
                                        aria-label={`View ${HeartParts[key].name}`}
                                        aria-current={index === partIndex ? "true" : undefined}
                                    />
                                ))}
                            </div>

                        </div>
                    )}

                    {/* DESCRIPTION MEDIA GALLERY */}
                    {variant === "description" && currentMedia && (
                        <div className="popup_media">

                            <div className="popup_media_viewer">

                                {hasGallery && (
                                    <button
                                        className="gallery_button gallery_previous"
                                        onClick={previousMedia}
                                        aria-label="Previous media"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round"
                                             className="lucide lucide-chevron-left preview-icon">
                                            <path d="m15 18-6-6 6-6"/>
                                        </svg>
                                    </button>
                                )}

                                {currentMedia.type === "image" ? (
                                    <img
                                        src={currentMedia.src}
                                        alt={currentMedia.alt ?? title}
                                    />
                                ) : (
                                    <video
                                        key={currentMedia.src}
                                        src={currentMedia.src}
                                        controls
                                    />
                                )}

                                {hasGallery && (
                                    <button
                                        className="gallery_button gallery_next"
                                        onClick={nextMedia}
                                        aria-label="Next media"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round"
                                             className="lucide lucide-chevron-right preview-icon">
                                            <path d="m9 18 6-6-6-6"/>
                                        </svg>
                                    </button>
                                )}

                            </div>

                            {hasGallery && (
                                <div className="gallery_status">
                                    <span>
                                        {mediaIndex + 1} of {media.length}
                                    </span>
                                </div>
                            )}

                            {hasGallery && (
                                <div className="gallery_dots">
                                    {media.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`gallery_dot ${
                                                index === mediaIndex ? "active" : ""
                                            }`}
                                            onClick={() => setMediaIndex(index)}
                                            aria-label={`Go to media ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}

                        </div>
                    )}
                </div>

                <div className="popup_footer">
                    <button
                        className="popup_close_button"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>,
        document.body
    )
}

export default PopUpInfoBox
