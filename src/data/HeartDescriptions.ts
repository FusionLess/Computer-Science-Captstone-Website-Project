import type { Complexity } from "../components/types/complexities"

type HeartDescription = {
    heading: string
    description: Record<Complexity, string>
    media?: MediaItem[]
}
export type MediaItem = {
    type: "image" | "video"
    title?: string
    src: string
    alt?: string
    transcript?: string
}

export const DESCRIPTIONS: Record<string, HeartDescription> = {
    Healthy : {
        heading: "Healthy Heart",
        description: {
            basic: "This is what a healthy heart should normally look like. It pumps blood around the body in a rhythmic fashion to evenly provide the body with the air you breathe in and the fuel it needs to keep running, taking blood back in once it’s got nothing left to distribute.",
            standard: "The heart pumps blood around the body to provide all the organ systems with oxygen and nutrients.\n\n" + "The ECG trace represents the electrical waves in the heart that simulate contraction and generate pressure to pump blood.\n\n",
            advanced: "A healthy heart should normally look like the model shown here. \n\n" + "As you can see, the heart beats rhythmically at a steady pace to pump oxygen and other nutrients to the rest of the body.\n\n" + "As the heart continues pumping, it takes in depleted blood cells to fill back up with oxygen and nutrients in order for the cycle to keep going."
        },
        media: [
            {
                type: "image",
                src: "/images/conditions/schematic_default.png",
                alt: "Default schematic of the heart",
                transcript: "The default schematic of the heart shows the four chambers and the valves that control blood flow through the heart."
            },
            {
                type: "video",
                src: "/videos/healthyHeart.mp4",
                alt: "Video showing a healthy heart",
                title: "Heart Diagram", 
                transcript: "Here is what the heart looks like from the outside. \n\n"+"The right side of the heart receives blood that is low and oxygen and then pumps this blood through through the pulmonary artery into the lungs where it becomes re-oxygenated. \n\n"+"the left side of the heart received the oxygen rich blood back from the lungs and pumps this back into the body body though the aorta."
                
            }
        ]
    },
    Minor : {
        heading: "Minor Heart Attack",
        description: {
            basic: "This is a small heart attack. Fatty gunk builds up inside the arteries and blocks some of the blood from reaching the heart. \n\n" + "Part of the heart muscle gets damaged, so the heart can't pump as strongly as before.\n\n" + "Medicines like aspirin and statins help open up the arteries. But medicine alone isn't enough. You also need to live healthily so it doesn't happen again.",
            standard: "This model shows a minor heart attack. It occurs when fatty deposits (plaque) build up inside the coronary arteries and restrict blood flow to part of the heart muscle, causing tissue damage. \n\n" + "A damaged heart generates less pressure than a healthy one. Medications such as aspirin (which reduces clotting) and statins (which lower cholesterol) can help widen the arteries and reduce blockages. \n\n"+"However, they are not a standalone cure. They must be combined with a healthy lifestyle to prevent a second heart attack.",
            advanced: "This is what a minor heart attack looks like. \n\n" +"This occurs when fatty deposits build up inside the coronary arteries, obstructing blood flow to the heart muscle and causing tissue damage. \n\n" + "Hearts with damaged tissue generate less pressure compared to healthy hearts, but medications such as aspirin and statins can ease the arteries and clear the blockages. \n\n"+ "These medications are not a use-alone cure though- you must combine them with healthy lifestyle choices to avoid a second heart attack."
        },
        media: [
            {
                type: "image",
                src: "/images/conditions/cbMinor.png",
                alt: "Schematic of a minor heart attack"
            
            },
            {
                type: "video",
                src: "/videos/blockedArteries.mp4",
                alt: "Video showing blocked arteries",
                title: "Blocked Arteries",
                transcript: "People often think that when they have a heart condition, it is these big tubes at the top which become blocked and deprive the heart of blood. \n\n"+"It is, however, the much smaller red arteries which run around the heart and supply the heart muscle with blood which are the ones that become blocked when someone has a heart condition. \n\n"+"So, how exactly does a blood clot form? Here is the inside of one of these arteries. The red balls coming down the artery are red blood cells.\n\n"+" The yellow balls coming down the artery represent LDL, or “bad” cholesterol. You can see that as these come down the tube, some begin to collect under the artery wall.\n\n" +"This weakens the wall and can make it tear. Once the tear happens, little white furry balls called platelets stick to the tear along with red blood cells. \n\n"+"Although they are trying to protect the tear, this process actually blocks up the blood vessel and makes it harder for blood to pass through to the rest of the heart. \n\n"+"This is the process that usually deprives the heart muscle of blood and causes a heart attack"
            },
            {
                type: "video",
                src: "/videos/diet.mp4",
                alt: "Video showing a healthy diet",
                title: "Diet",
                transcript: "Eating Healthy is also important for your heart."+"By eating healthy especially for reducing the amount of fat and sugar you eat you can reduce the amount of cholesterol in your blood and therefore reduce the risk of getting those yellow fatty deposits building up inside your artery walls."
            },
            {
                type: "video",
                src: "/videos/exercise.mp4",
                alt: "Video showing a exercise",
                title: "Exercise",
                transcript: "Exercise is really important in keeping your heart healthy.\n\n "+"Exercising will lower your blood pressure, reduce the amount of bad cholesterol in your blood, and increase the amount of good cholesterol. \n\n"+" Exercise will also help strengthen your heart overall and reduce the likelihood that you will have future problems with your heart."
            },
            {
                type: "video",
                src: "/videos/smoking.mp4",
                alt: "Video showing the effects of smoking",
                title: "Smoking",
                transcript: "Smoking is a major risk factor of the heart disease.\n\n"+"It increases your blood pressure which damages the structure of your arteries by doing this it increases the risk that those fatty deposits will build up inside your arteries which also increases the risk that blood clots will form again inside the arteries."
            },
            {
                type: "video",
                src: "/videos/aspirin.mp4",
                alt: "Video showing the effects of aspirin",
                title: "Taking Aspirin",
                transcript: "When an artery plaque tears, platelets stick to the damaged area and clump together, helping form a blood clot. \n\n"+"Aspirin makes platelets less likely to stick together, so it reduces further clot formation and lowers the chance of the coronary artery becoming blocked. \n\n"+"It doesn't directly dissolve an existing clot."
            },
            {
                type: "video",
                src: "/videos/statins.mp4",
                alt: "Video showing the effects of statins",
                title: "Taking Statins",
                transcript: "Statins reduce the liver's production of cholesterol, particularly LDL ('bad') cholesterol. \n\n"+"This lowers LDL in the blood and helps slow the growth of fatty plaques in coronary arteries. \n\n"+"Statins also help make existing plaques more stable and less likely to rupture, reducing the chance of a clot forming and causing a heart attack."
            }
        ]
    },
    Severe : {
        heading: "Severe Heart Attack",
        description: {
            basic: "If a small heart attack isn't treated, or you stop taking your medicine too soon, the blockage gets worse. \n\n"+"The heart muscle can then be permanently damaged. A damaged heart is too weak to push blood around the body.",
            standard: "If a minor heart attack is left untreated, or if medication is stopped too early, the blockage in the coronary arteries can worsen and cause permanent tissue damage. \n\n"+"The heart then cannot generate enough energy and pressure to circulate blood around the body.",
            advanced: "If a minor heart attack is left untreated, or if you stop medicating too early, the blockage in your coronary arteries will become more severe, which can cause permanent tissue damage.\n\n"+"This prevents the heart from generating enough energy and pressure to pump blood around the body."
        },
        media: [
            {
                type: "image",
                src: "/images/conditions/cbSevere.png",
                alt: "Schematic of a severe heart attack"
            },
            {
                type: "video",
                src: "/videos/blockedArteries.mp4",
                alt: "Video showing blocked arteries",
                title: "Blocked Arteries",
                transcript: "People often think that when they have a heart condition, it is these big tubes at the top which become blocked and deprive the heart of blood. \n\n"+"It is, however, the much smaller red arteries which run around the heart and supply the heart muscle with blood which are the ones that become blocked when someone has a heart condition. \n\n"+"So, how exactly does a blood clot form? Here is the inside of one of these arteries. The red balls coming down the artery are red blood cells. The yellow balls coming down the artery represent LDL, or “bad” cholesterol. \n\n"+"You can see that as these come down the tube, some begin to collect under the artery wall. This weakens the wall and can make it tear. \n\n"+"Once the tear happens, little white furry balls called platelets stick to the tear along with red blood cells. \n\n"+"Although they are trying to protect the tear, this process actually blocks up the blood vessel and makes it harder for blood to pass through to the rest of the heart. \n\n"+"This is the process that usually deprives the heart muscle of blood and causes a heart attack"
            }
        ]
    },
    Fibrillation : {
        heading: "Fibrillation",
        description: {
            basic: "Sometimes the electrical signals go wrong and become messy and random. You can see this in the red line on the ECG at the bottom of the page. \n\n"+"When this happens, the heart can't squeeze properly and can't pump blood well. This is an emergency and needs help straight away. \n\n"+"A machine called an AED can fix it by giving the chest a strong electric shock, which helps the heart's signals get back to normal. Look for the AED sign on a box to find one.",
            standard: "Chaotic electrical waves can be seen in the red trace on the ECG at the bottom of the page. \n\n" +"This reduces the heart's ability to generate pressure and pump normally. It is a medical emergency that needs immediate treatment. \n\n"+"An automated external defibrillator (AED) can often restore a normal rhythm by delivering a large electric shock to the chest. Look for the AED logo on a box to find one nearby.",
            advanced: "Chaotic electrical waves, often sent from an outside source, can be seen in the red outside trace in the ECG meter at the bottom of the page. \n\n"+"This reduces the heart’s ability to create pressure and operate as normal. \n\n"+"This is also a serious matter which needs to be treated immediately, and an AED placed nearby is often able to restore the smooth electrical waves via a large electrical shock to the chest- just look for the AED logo on a box to find out."
        },
        media: [
            {
                type: "image",
                src: "/images/conditions/AED.png",
                alt: "AED Kit",
                title: "AED Kit",
                transcript: "An AED is a device that can give the heart an electrical shock during certain types of cardiac arrest. \n\n"+"The shock stops chaotic electrical activity and gives the heart a chance to return to a normal rhythm. AEDs are commonly found in public places such as schools, workplaces, airports, shopping centres, gyms, and community facilities, where they can be quickly accessed in an emergency."
            }
        ]
    },
    Compensated :  {
        heading: "Compensated Heart",
        description: {
            basic: "Here the heart is coping, but it is under strain. The muscle walls grow thicker because they have been working under pressure for so long. You can see the thicker walls by opening the heart. \n\n"+"Thick, stiff walls don't relax well, so less blood can fit inside. At rest, the heart manages and the person may feel fine. The problems show up when they exercise or feel stressed, because the heart can't pump enough blood for what the body needs. \n\n"+"Scientists are still looking for a good treatment, and this stage may lead to the next one.",
            standard: "In compensated failure, the muscular walls thicken in response to prolonged pressure. You can see the thicker walls by opening the heart. \n\n"+"Because of the thicker walls, increased stiffness, delayed relaxation, or a combination of these, less blood can fill the heart. At rest the heart can cope and patients may have no symptoms. \n\n"+"Problems appear during exercise or stress, when the heart cannot meet the increased demand for blood. Researchers are still searching for an effective treatment, and some suggest this stage may progress to decompensated failure.",
            advanced: "In a compensated failure, the muscular walls get thicker in response to prolonged pressure. \n\n"+"You can see the thicker walls by opening the heart. In this scenario, less blood is able to enter the heart because of thicker walls, increased stiffness, or delayed relaxation. (Or a combination of any of them.)\n\n"+ "At rest, the heart can cope, but even though the patients may be asymptomatic, the real problems start showing when they start to exercise or stress when the heart starts becoming unable to meet the increased demand to pump blood.  \n\n"+"Researchers are still trying to this day to find an effective treatment option for patients, but some suggest it may lead to decompensated heart failure."
        },
        media: [
            {
                type: "image",
                src: "/images/conditions/compHF.png",
                alt: "Schematic of a compensated heart"
                
            },
            {
                type: "image",
                src: "/images/conditions/compHFWALL.png",
                alt: "Schematic of a compensated heart wall",
                title: "Heart Wall",
                transcript: "The compensated Heart wall for the compensated heart failure is typically thickened becuase of high blood pressure. "
            }
        ]
    },
    Decompensated : {
        heading: "Decompensated Heart",
        description: {
            basic: "Here the heart is no longer coping. The walls become thin and the heart stretches out like a balloon. \n\n"+"You can see this by opening the heart. A stretched heart is weak and can't squeeze or pump blood well. People feel unwell even when resting, with dizziness, chest pain, and trouble breathing or getting up to exercise. \n\n"+"Doctors can give medicines (ACE inhibitors, beta blockers and diuretics) that lower blood pressure and take some of the load off the heart.",
            standard: "In decompensated heart failure the muscular walls of the heart become thinner and the heart balloons out. See these changes by opening the heart (double-click).\n\n" +
                "A heart with decompensated failure is weak and has problems with contraction and pumping of blood.\n\n" +
                "Patients with decompensated heart failure will have symptoms, even at rest. These symptoms include dizziness, breathing difficulties, inability to exercise, and chest pains.\n\n" +
                "Treatments for this disease include ACE inhibitors, beta blockers, and diuretics, which work to lower blood pressure and decrease the load on the heart.   ",
            advanced: "In decompensated failure, the walls thin instead and the heart dilates, or balloons outward. Open the heart to see this. \n\n"+"The heart is weak and has difficulty contracting and pumping blood. Patients show symptoms even at rest, including dizziness, chest pain, shortness of breath, and an inability to exercise. \n\n"+"Treatments include ACE inhibitors, beta blockers, and diuretics, which lower blood pressure and reduce the heart's workload."
        },
        media: [
            {
                type: "image",
                src: "/images/conditions/decompHF.png",
                alt: "Schematic of a decompensated heart"
            },
            {
                type: "image",
                src: "/images/conditions/decompHFWALL.png",
                alt: "Schematic of a decompensated heart wall",
                title: "Heart Wall",
                transcript: "The deccompensated Heart wall for the decompensated heart failure is typically thinned stretched because of the increasing pressure inside of the heart chambers."
            }
        ]
    }
}

export const PAGE_DESCRIPTIONS = {
    healthy : {
        heading: "The Heart",
        subheading: "Te Manawa",
        description: {
            basic: "This is what a healthy heart should normally look like. It pumps blood around the body in a rhythmic fashion to evenly provide the body with the air you breathe in and the fuel it needs to keep running, taking blood back in once it’s got nothing left to distribute.",
            standard: "The heart pumps blood around the body to provide all the organ systems with oxygen and nutrients.\n\n" +
                "The ECG trace represents the electrical waves in the heart that simulate contraction and generate pressure to pump blood",
            advanced: "A healthy heart should normally look like the model shown here. As you can see, the heart beats rhythmically at a steady pace to pump oxygen and other nutrients to the rest of the body. \n\n"+"As the heart continues pumping, it takes in depleted blood cells to fill back up with oxygen and nutrients in order for the cycle to keep going."
        }
    },
    attack : {
        heading: "Heart Attack",
        subheading: "Coronary Arteries",
        description: {
            basic: "Your heart is a muscle that needs blood to work. It gets that blood through tubes called coronary arteries (they aren't shown in this model). \n\n"+"If these tubes get blocked, the heart can't get the blood it needs. Healthy habits, like exercising, make a heart attack much less likely.",
            standard: "The heart pumps blood to itself through blood vessels called coronary arteries (not shown in the 3D model). A heart attack occurs when blood flow is obstructed by a narrowing of these arteries.\n\n" +
                "Good lifestyle choices help to keep the coronary arteries healthy and prevent heart attacks. Learn more about how lifestyle factors can affect the heart in the following movie clips.",
            advanced: "The heart receives blood via the coronary arteries, which are not shown in this model. When these arteries narrow, it can lead to the heart failing to receive blood due to them being obstructed. \n\n"+"Good life choices such as going to the gym can significantly reduce the risk of a heart attack. "
        }
    },
    electricity : {
        heading: "Heart Electricity",
        subheading: "Electrocardiograms",
        description: {
            basic: "Your heart uses tiny electrical signals to tell its muscle when to squeeze. You can see these signals moving through the heart in this model. \n\n"+"The signals need to happen in the right order so the heart can pump blood smoothly. Doctors can measure these signals with a test called an ECG, which uses sticky pads (electrodes) on the chest. \n\n"+"The ECG wave below shows what this heart's signals look like.",
            standard: "Electrical waves (coloured yellow) pass through the heart to trigger contraction of the muscular walls. The heart needs coordinated electrical waves and smooth contraction to pump effectively.\n\n" +
                "The electrical waves in the heart can be measured by placing electrodes on the chest. This is called an electrocardiogram (ECG) recording, as shown on the right.",
            advanced: "Electric waves, as shown here, pass through the heart in order to trigger contraction of the muscular walls. \n\n"+"In order to pump effectively and smoothly without a hitch, the waves need to be coordinated with the contractions of the heart. The electrical waves can be measured using an electrocardiogram (ECG) in which electrodes are placed on the chest.\n\n"+"The ECG wave below shows an example of this heart’s ECG recording."
        },
    },
    failure : {
        heading: "Heart Failure",
        subheading: "Chronic Problems",
        description: {
            basic: "Some long-lasting problems, like high blood pressure or a heart attack that wasn't treated, can make the heart start to fail. When this happens, the heart has to work harder than normal just to keep up with what the body needs.\n\n"+"Over time, this can change the heart's shape, make it stiffer, and make it worse at squeezing and relaxing.",
            standard: "Long-term problems such as high blood pressure or untreated heart attacks can eventually cause the heart to fail.\n\n" +
                "In heart failure, the heart needs to work harder than normal to meet the demands of the body. This can lead to changes in the heart's shape and stiffness, and its ability to contract and relax.",
            advanced: "Long-term, or chronic, problems like high blood pressure or heart attacks left untreated can cause the heart to fail. \n\n"+"In a heart failure, the heart has to work more than normal just to get back up to speed with the body, which can lead to the heart changing shape, stiffness, and the ability to contract and relax."
        }
    }
}