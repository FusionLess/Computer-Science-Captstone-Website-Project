import "./AboutContent.css"
import {AboutInfo} from "../../../data/AboutInfo.ts";

export default function ResearchContent() {
    const Info = AboutInfo["research"]
    return (
        <>
            <h1 className="research content-heading">
                {Info.heading}
            </h1>
            <p className="research content-desc-prim">
                {Info.body1}
            </p>
            <iframe
                src={Info.video}
                title="Heart Mechanics Research video"
                style={{
                    display: "block",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    border: 0,
                    borderRadius: "12px",
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            />
        </>
    )
}