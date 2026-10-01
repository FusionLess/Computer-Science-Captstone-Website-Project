import type { Complexity } from "../components/types/complexities"

type ComplexityText = Record<Complexity, string>

type HeartPart = {
  name: string
  description: ComplexityText
  function: ComplexityText
}

export const HeartParts: Record<string, HeartPart> =  {
  mesh0: {
    name: "Epicardium",
    description: {
      basic: "**basic description**",
      standard: "The epicardium is the outermost layer of the heart wall.",
      advanced: "***advanced description***"
    },
    function: {
      basic: "**basic function**",
      standard: "It protects the heart and helps reduce friction as the heart beats.",
      advanced: "***advanced function***"
    }
  },

  mesh1: {
    name: "Left Ventricle",
    description: {
      basic: "**basic description**",
      standard: "The left ventricle is the lower left chamber of the heart.",
      advanced: "***advanced description***"
    },
    function: {
      basic: "**basic function**",
      standard: "It pumps oxygen-rich blood through the aorta and out to the rest of the body.",
      advanced: "***advanced function***"
    },
  },

  mesh2: {
    name: "Left Atrium",
    description: {
      basic: "**basic description**",
      standard: "The left atrium is one of the four chambers of the heart and is located in the upper part of the heart.",
      advanced: "***advanced description***"
    },
    function: {
      basic: "**basic function**",
      standard: "It receives oxygen-rich blood from the lungs and passes it into the left ventricle.",
      advanced: "***advanced function***"
    }
  },

  mesh3: {
    name: "Pulmonary Artery",
    description: {
      basic: "**basic description**",
      standard: "The pulmonary artery is a major blood vessel that connects the heart to the lungs.",
      advanced: "***advanced description***"
    },
    function: {
      basic: "**basic function**",
      standard: "It carries oxygen-poor blood from the right ventricle to the lungs, where the blood receives oxygen.",
      advanced: "***advanced function***"
    }
  },

  mesh4: {
    name: "Right Ventricle",
    description: {
      basic: "**basic description**",
      standard: "The right ventricle is the lower right chamber of the heart.",
      advanced: "***advanced description***"
    },
    function: {
      basic: "**basic function**",
      standard: "It pumps oxygen-poor blood through the pulmonary artery to the lungs.",
      advanced: "***advanced function***"
    },
  },

  mesh5: {
    name: "Right Atrium",
    description: {
      basic: "**basic description**",
      standard: "The right atrium is one of the four chambers of the heart and is located in the upper part of the heart.",
      advanced: "***advanced description***"
    },
    function: {
      basic: "**basic function**",
      standard: "It receives oxygen-poor blood returning from the body and passes it into the right ventricle.",
      advanced: "***advanced function***"
    },
  },

  mesh6: {
    name: "Aorta",
    description: {
      basic: "**basic description**",
      standard: "The aorta is the largest artery in the body and connects directly to the left ventricle.",
      advanced: "***advanced description***"
    },
    function: {
      basic: "**basic function**",
      standard: "It carries oxygen-rich blood from the left ventricle to the rest of the body.",
      advanced: "***advanced function***"
    }
  },
} as const