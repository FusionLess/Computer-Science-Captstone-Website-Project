# From Lab to Life: Interactive Heart Visualisations for Education and Outreach

An interactive web application developed for COMPSCI 399 at the University of Auckland, designed to turn complex anatomy into an interactive 3D website, giving people the clarity they need to better understand and care for their health.

The website allows users to explore animated healthy and diseased heart models, compare different conditions, and learn about different conditions along with physiological graphs and medical imaging.

## Features

- **Interactive 3D Heart Models:** Rotate, zoom, pause and adjust the heart rate.
- **Heart Condition Selection:** Explore six different heart conditions.
- **Comparison Mode:** Compare two heart models side by side with optional synchronised controls.
- **Anatomical Exploration:** Highlight and select structures to view educational descriptions.
- **Cross-Sectional Viewing:** Examine internal structures using clipping planes.
- **Physiological Graphs:** View ECG and pressure/volume visualisations.
- **Medical Imaging:** Explore MRI and echocardiography images.
- **Adjustable Complexity:** Switch between basic, standard and advanced educational detail.
- **Responsive Design:** Supports desktop and mobile devices.

## Project Management
We used Trello to assign tasks to team members and track their progress throughout the project.

**Trello:** [Insert link]

We also used GitHub to organise tasks, track bugs.


## Technologies Used

| Technology               | Purpose                                  |
|--------------------------|------------------------------------------|
| JavaScript / TypeScript  | Frontend development                     |
| React                    | User interface                           |
| Vite                     | Development and build tooling            |
| React Router             | Page navigation                          |
| Three.js                 | 3D rendering                             |
| React Three Fiber        | React integration with Three.js          |
| React Three Drei         | 3D rendering utilities                   |
| CSS                      | Styling and responsive layouts           |
| Node.js                  | Development tooling and regression tests |
| Playwright               | Browser-based end-to-end tests           |
| GitHub Actions           | Continuous integration                   |
| Figma                    | Website prototypes design tool           |


## Architecture Overview

The application uses React for its user interface and Three.js with React Three Fiber for interactive 3D visualisation. 
Preprocessed GLB heart models and medical images are loaded as static assets.

The 3D heart rendering system supports frame-based animation, anatomical interaction, clipping and visibility controls.

For more details about heart model setup, see the [Technical Documentation](docs/HEART_README.md).

## Installation and Setup

### Prerequisites

- Node.js 22.18+ or Node.js 24
- npm
- A modern browser with WebGL support

### Installation


Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal, typically `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

The production build is generated in the `dist` directory.

## Usage Examples

**Exploring a heart model:** Select a heart condition, rotate or zoom the model, adjust the heart rate and use the anatomical controls to explore internal structures.

**Comparing conditions:** Enable comparison mode, select two heart conditions and examine the models side by side.

**Viewing medical imaging:** Open the medical imaging section to explore MRI and echocardiography images.

## Testing and Quality Assurance

We use both automated and manual testing to verify the application.

- **Node.js regression tests:** Check rendering logic and routing.
- **Playwright end-to-end tests:** Verify browser interactions such as condition selection, comparison mode, navigation and heart rate controls.
- **GitHub Actions:** Automatically runs tests on pull requests and pushes to `main` or `Development`.
- **Manual testing:** Checks for UI layout and UX. 

Run the automated tests using:

```bash
npm test
npm run test:e2e
```

## Deployment

**Live Website:** https://main.daug44awk3a81.amplifyapp.com/

## Future Plans

Potential future improvements include:

- Search-enabled highlighting and labeling of heart structures
- Hoverable regions and pop-up info in the medical imaging section
- Affected region highlighting
- Integration with PPG sensors
- Demographic-based heart changes
- Educational quizzes or mini-games
- Heart valves
- Multilingual support

## Acknowledgements

We thank our client for providing the heart models and scientific guidance, our academic supervisors for their support, and user-testing participants for their feedback.

MRI and echocardiography images were obtained from open-source resources suggested by the client. Specific sources and licences should be credited where applicable.

We also acknowledge the open-source libraries and tools used throughout development.

## Team

Developed by **Five Random Men (Team 23)** for COMPSCI 399 at the University of Auckland.

**Final Report:** [Insert link]