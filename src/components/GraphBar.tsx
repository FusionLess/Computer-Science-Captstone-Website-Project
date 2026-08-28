import "./GraphBar.css"

function GraphBar() {
    return (
        <footer className="graphs">
            <ECGContainer />
            <HeartRateContainer />
            <PressureContainer />
        </footer>
    )
}

function ECGContainer() {
    return (
        <div className = "ecg container">
            [ ECG Graph ]
        </div>
    )
}

function HeartRateContainer() {
    return (
        <div className = "heartrate container">
            [ HeartRate ]
        </div>
    )
}

function PressureContainer() {
    return (
        <div className = "pressure container">
            [ Pressure Graph ]
        </div>
    )
}

export default GraphBar