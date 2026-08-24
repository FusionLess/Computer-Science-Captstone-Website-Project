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
        </div>
    )
}

function HeartRateContainer() {
    return (
        <div className = "heartrate container">
        </div>
    )
}

function PressureContainer() {
    return (
        <div className = "pressure container">
        </div>
    )
}

export default GraphBar