import type { Complexity } from "../components/types/complexities"
import type { MediaItem } from "./HeartDescriptions"

type ComplexityText = Record<Complexity, string>

type HeartPart = {
  name: string
  description: ComplexityText
  function: ComplexityText
  media?: MediaItem[]
}

export const HeartParts: Record<string, HeartPart> =  {
  mesh0: {
    name: "Epicardium",
    description: {
      basic: "This is a thin layer on the outside of the heart",
      standard: "The epicardium is the hearts outer layer",
      advanced: "The epicardium is the outermost layer of the heart wall"
    },
    function: {
      basic: " It keeps the heart safe and helps it move smoothly as it beats",
      standard: "It protects the heart and helps reduce friction as the heart beats.",
      advanced: "The epicardium is the outermost layer of the heart wall. It serves a protective function and, by secreting a lubricating fluid, reduces friction between the heart and surrounding tissue with each beat."
    },
    media: [
      {
        type: "image",
        src: "/images/heartParts/epi.png",
        alt: "Schematic of the epicardium"
      }
    ]
  },

  mesh1: {
    name: "Right Ventricle",
    description: {
      basic: "The right ventricle is on the lower right part of the heart",
      standard: "The right ventricle is the lower right chamber of the heart.",
      advanced:  "The right ventricle receives deoxygenated blood from the right atrium through the tricuspid valve, in the lower right quartile of the heart"
    },
    function: {
      basic: "his part sends the blood to your lungs. The blood travels through a tube called the pulmonary artery. In the lungs, the blood picks up fresh oxygen from the air you breathe",
      standard: "It pumps oxygen-poor blood through the pulmonary artery to the lungs.",
      advanced: "The right ventricle ejects this deoxygenated blood through the pulmonary valve and into the pulmonary artery, which conveys it to the lungs. There, gas exchange takes place: oxygen diffuses into the blood across the alveolar membrane, and carbon dioxide diffuses out. "
    },
    media: [
      {
        type: "image",
        src: "/images/heartParts/rv.png",
        alt: "Schematic of the right ventricle"
      }
    ]
    
  },

  mesh2: {
    name: "Right Atrium",
    description: {
      basic: "The right atrium is the upper right part of the heart",
      standard: "The right atrium is one of the four chambers of the heart and is located in the upper part of the heart.",
      advanced:  "Deoxygenated blood returns from the systemic circulation via two major veins. The superior vena cava drains the upper body, while the inferior vena cava drains the lower body."
    },
    function: {
      basic: "This is the first stop for blood that has used up its oxygen. Two big tubes called veins bring the blood here. One comes from the top of your body and one comes from the bottom. The right atrium then pushes the blood down to the right ventricle",
      standard: "It receives oxygen-poor blood returning from the body and passes it into the right ventricle.",
      advanced:  "Both empty into the right atrium, which contracts to propel blood through the tricuspid valve into the right ventricle."
    },
    media: [
      {
        type: "image",
        src: "/images/heartParts/ra.png",
        alt: "Schematic of the right atrium"
      }
    ]
  },

  mesh3: {
    name: "Pulmonary Artery",
    description: {
      basic: "The pulmonary artery is an important blood vessel that acts as a birdge for the heart and lungs",
      standard: "The pulmonary artery is a major blood vessel that connects the heart to the lungs.",
      advanced: "Unlike most arteries, the pulmonary artery carries deoxygenated blood"
    },
    function: {
      basic: "This tube carries blood with little oxygen from the right ventricle to the lungs to get more oxygen",
      standard: "It carries oxygen-poor blood from the right ventricle to the lungs, where the blood receives oxygen.",
      advanced: "Unlike most arteries, the pulmonary artery carries deoxygenated blood. It transports blood from the right ventricle to the lungs for oxygenation, completing the pulmonary circuit."
    },
    media: [
      {
        type: "image",
        src: "/images/heartParts/pa.png",
        alt: "Schematic of the pulmonary artery"
      }
    ]
  },

  mesh4: {
    name: "Left Ventricle",
    description: {
      basic: "The left ventricle is the chamber on the bottom left of the heart",
      standard: "The left ventricle is the lower left chamber of the heart.",
      advanced: "The left ventricle has the thickest muscular wall of the four chambers, in the lower left quartile of the heart"
    },
    function: {
      basic: "This is the strong part that pushes oxygen-rich blood out to the rest of your body",
      standard: "It pumps oxygen-rich blood through the aorta and out to the rest of the body.",
      advanced: "With the thickest muscular wall of the four chambers, the left ventricle generates the high pressure needed to pump oxygenated blood through the aortic valve and into the systemic circulation. Aorta: The aorta is the body's largest artery. It receives blood ejected from the left ventricle and distributes it through its branches to the organs and tissues. "
    },
    media: [
      {
        type: "image",
        src: "/images/heartParts/lv.png",
        alt: "Schematic of the left ventricle"
      }
    ]
  },

  mesh5: {
    name: "Left Atrium",
    description: {
      basic: "The left atrium is a chamber of a heart that is onn the upper left part of the heart",
      standard: "The left atrium is one of the four chambers of the heart and is located in the upper part of the heart.",
      advanced: "The pulmonary veins return newly oxygenated blood to the left atrium, in the upper left quartile of the heart."
    },
    function: {
      basic: "Blood comes back from the lungs full of oxygen. The left atrium gets it and pushes it down to the left ventricle.",
      standard: "It receives oxygen-rich blood from the lungs and passes it into the left ventricle.",
      advanced: "The pulmonary veins return the newly oxygenated blood to the left atrium. The left atrium then contracts, moving blood through the mitral valve into the left ventricle. "
    },
    media: [
      {
        type: "image",
        src: "/images/heartParts/la.png",
        alt: "Schematic of the left atrium"
      }
    ]
    
  },

  mesh6: {
    name: "Aorta",
    description: {
      basic: "The aorta is the biggest artery in the human which connects to the lower left part of the heart (left ventricle)",
      standard: "The aorta is the largest artery in the body and connects directly to the left ventricle.",
      advanced: "The aorta is the greatest artery in the human body and attaches directly to the left ventricle."
    },
    function: {
      basic: "This is the big tube that carries oxygen-rich blood away from the left ventricle to the body",
      standard: "It carries oxygen-rich blood from the left ventricle to the rest of the body.",
      advanced: "The aorta is the body's largest artery. It receives blood ejected from the left ventricle and distributes it through its branches to the organs and tissues."
    },
    media: [
      {
        type: "image",
        src: "/images/heartParts/aorta.png",
        alt: "Schematic of the aorta"
      }
    ]
  },
} as const