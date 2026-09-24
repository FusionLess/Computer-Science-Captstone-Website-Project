import "./AboutContent.css"
import { AboutInfo } from "../../../data/AboutInfo.ts"

export default function MissionContent() {
    const Info = AboutInfo["mission"]
    return (
        <>
            <h1 className="mission content-heading">
                {Info.heading}
            </h1>
            <p className="mission content-desc-prim">
                {Info.body1}
            </p>
            <p className="mission content-desc-sec  ">
                {Info.body2}
            </p>
        </>
    )
}