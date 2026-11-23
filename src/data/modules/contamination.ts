import { GameModule } from '../../types/game';

export const contaminationModule: GameModule = {
  id: 'contamination',
  number: 3,
  title: 'Contamination Crisis',
  subtitle: 'Groundwater Quality & Pollution Abatement',
  description:
    'Identify and mitigate severe groundwater pollution. Detect agricultural nitrates, industrial chemical effluent seepage, geogenic fluoride, and coastal saline intrusion.',
  topics: ['Contamination Sources', 'Water Quality Testing', 'Pollution Prevention', 'Aquifer Protection'],
  iconName: 'ShieldAlert',
  variant: 'danger',
  scenarios: [
    {
      id: 'contamination_1',
      moduleId: 'contamination',
      number: 1,
      title: 'Agricultural Nitrate Leaching',
      subtitle: 'Excessive Fertilizer Infiltration into Drinking Wells',
      description:
        'Routine drinking water testing in village borewells reveals nitrate levels at 85 mg/L, nearly double the safe drinking limit of 45 mg/L.',
      situation:
        'In an intensive horticultural belt, farmers have applied excessive urea and synthetic nitrogen fertilizers to boost vegetable yields. Heavy irrigation has leached dissolved nitrates below the root zone into the unconfined shallow drinking aquifer. Cases of infant methemoglobinemia (blue baby syndrome) have been reported.',
      learningObjectives: [
        'Understand the nitrogen cycle and pathways of groundwater leaching.',
        'Apply Bureau of Indian Standards (BIS 10500) potable water thresholds.',
        'Implement integrated nutrient management (INM) and organic buffer zones.',
      ],
      bonusXp: 50,
      bonusCoins: 5,
      questions: [
        {
          id: 'c1_q1',
          question: 'What immediate emergency action must be taken for village drinking supplies?',
          situationContext: 'Borewell tests confirm nitrate concentrations exceed 85 mg/L across 8 domestic handpumps.',
          choices: [
            {
              id: 'c1_q1_c1',
              text: 'Mark contaminated wells with warning signs, provide safe alternative water supplies, and distribute home testing kits.',
              outcome: 'sustainable',
              explanation:
                'Immediate isolation of toxic drinking sources combined with temporary safe supply prevents acute poisoning, especially in infants.',
            },
            {
              id: 'c1_q1_c2',
              text: 'Boil the well water vigorously before drinking.',
              outcome: 'unsustainable',
              explanation:
                'Boiling water evaporates pure water and actually CONCENTRATES chemical nitrates, increasing the toxic hazard significantly.',
            },
            {
              id: 'c1_q1_c3',
              text: 'Add standard chlorine bleaching powder to the wells to neutralize nitrates.',
              outcome: 'partially_sustainable',
              explanation:
                'Chlorine kills bacteria, but does not remove chemical nitrates; relying on chlorination gives false safety while leaving nitrate toxicity untouched.',
            },
          ],
        },
        {
          id: 'c1_q2',
          question: 'What farming practice addresses the root cause of nitrate groundwater leaching?',
          situationContext: 'Farmers apply broadcast urea granules directly before heavy flood irrigation cycles.',
          choices: [
            {
              id: 'c1_q2_c1',
              text: 'Adopt soil-test-based Fertigation through drip systems using neem-coated urea and bio-fertilizers.',
              outcome: 'sustainable',
              explanation:
                'Precision drip fertigation delivers nutrients in micro-doses directly to active root hairs, stopping deep downward chemical leaching.',
            },
            {
              id: 'c1_q2_c2',
              text: 'Double the urea dosage so plants absorb nutrients faster before it rains.',
              outcome: 'unsustainable',
              explanation:
                'Excess nitrogen cannot be absorbed by saturated plant roots and leaches directly down into groundwater tables.',
            },
            {
              id: 'c1_q2_c3',
              text: 'Apply granular fertilizer only on cloudy days without changing flood watering habits.',
              outcome: 'partially_sustainable',
              explanation:
                'Cloudy weather slightly reduces surface volatilization, but flood irrigation still washes excess nitrogen straight down to the water table.',
            },
          ],
        },
        {
          id: 'c1_q3',
          question: 'How can natural landscape ecology help trap agricultural runoff before it enters recharge zones?',
          situationContext: 'Fields border the community percolation pond catchment.',
          choices: [
            {
              id: 'c1_q3_c1',
              text: 'Establish multi-species riparian vegetative buffer strips with deep-rooted vetiver and indigenous shrubs.',
              outcome: 'sustainable',
              explanation:
                'Vegetative riparian buffers naturally filter surface runoff, absorb dissolved nitrogen through root biomass, and prevent groundwater fouling.',
            },
            {
              id: 'c1_q3_c2',
              text: 'Pave the entire boundary between farm fields and the pond with smooth concrete.',
              outcome: 'unsustainable',
              explanation:
                'Paving speeds up contaminated runoff velocity and sweeps chemicals directly into downstream surface depressions.',
            },
            {
              id: 'c1_q3_c3',
              text: 'Dig a shallow bare ditch between fields and the pond without planting vegetation.',
              outcome: 'partially_sustainable',
              explanation:
                'A ditch temporarily catches surface runoff, but without plants to absorb nitrates, the standing dirty water still leaches downward.',
            },
          ],
        },
      ],
    },
    {
      id: 'contamination_2',
      moduleId: 'contamination',
      number: 2,
      title: 'Industrial Chemical Effluent Seepage',
      subtitle: 'Isolating Toxic Heavy Metals and Solvent Leaks',
      description:
        'A chemical dye and electroplating industrial cluster is storing untreated acidic wastewater in unlined holding lagoons, threatening an underlying regional aquifer.',
      situation:
        'Near the industrial outskirts of Ranipet, factories store untreated chromium, heavy metals, and organic solvent waste in unlined earth lagoons. Private borewells 500 meters down-gradient have turned yellowish with an acidic pH of 4.2 and hexavalent chromium levels 10 times the permissible limit.',
      learningObjectives: [
        'Understand toxic chemical plume migration and hydraulic gradients.',
        'Differentiate between point-source and non-point source pollution.',
        'Implement Zero Liquid Discharge (ZLD) and containment monitoring.',
      ],
      bonusXp: 50,
      bonusCoins: 5,
      questions: [
        {
          id: 'c2_q1',
          question: 'What immediate containment measure is legally and hydrologically required for the industrial lagoons?',
          situationContext: 'Effluent is actively seeping through porous soil into the unconfined groundwater aquifer.',
          choices: [
            {
              id: 'c2_q1_c1',
              text: 'Issue shutdown orders, evacuate wastewater to a Common Effluent Treatment Plant (CETP), and line lagoons with impermeable geomembranes.',
              outcome: 'sustainable',
              explanation:
                'Stopping the active pollutant source and enforcing impermeable containment prevents the toxic plume from expanding further into regional aquifers.',
            },
            {
              id: 'c2_q1_c2',
              text: 'Dilute the effluent pond with fresh groundwater pumped from deep tube-wells.',
              outcome: 'unsustainable',
              explanation:
                'Dilution is not pollution control; pumping fresh groundwater to dilute surface waste depletes clean reserves and increases total contaminated volume.',
            },
            {
              id: 'c2_q1_c3',
              text: 'Construct an earthen berm around the lagoon without lining the bottom floor.',
              outcome: 'partially_sustainable',
              explanation:
                'A surface berm stops surface overtopping during rain, but does absolutely nothing to stop downward subterranean seepage.',
            },
          ],
        },
        {
          id: 'c2_q2',
          question: 'How should the extent of the underground toxic plume be tracked and monitored?',
          situationContext: 'The direction of groundwater flow is toward the municipal drinking well-field.',
          choices: [
            {
              id: 'c2_q2_c1',
              text: 'Drill a network of dedicated piezometer monitoring wells up-gradient and down-gradient to map contaminant transport.',
              outcome: 'sustainable',
              explanation:
                'Strategic piezometer arrays allow hydrogeologists to measure groundwater velocity, trace contaminant concentrations, and safeguard municipal wells.',
            },
            {
              id: 'c2_q2_c2',
              text: 'Wait for nearby residential wells to report foul smells before acting.',
              outcome: 'unsustainable',
              explanation:
                'Waiting for sensory detection exposes thousands of people to severe carcinogenic poisoning, as heavy metals like chromium are odorless.',
            },
            {
              id: 'c2_q2_c3',
              text: 'Test only water samples taken from the surface lagoon itself once a year.',
              outcome: 'partially_sustainable',
              explanation:
                'Testing lagoon water is routine, but fails to track the underground plume migration speed and direction.',
            },
          ],
        },
        {
          id: 'c2_q3',
          question: 'What long-term standard must manufacturing facilities adopt to prevent recurring contamination?',
          situationContext: 'Factories produce high-TDS chemical wash water on a daily basis.',
          choices: [
            {
              id: 'c2_q3_c1',
              text: 'Mandate Zero Liquid Discharge (ZLD) systems with multi-effect evaporators and complete water recycling.',
              outcome: 'sustainable',
              explanation:
                'ZLD completely closes the industrial water cycle, recycling 95%+ of processed water and eliminating any effluent discharge to the environment.',
            },
            {
              id: 'c2_q3_c2',
              text: 'Inject treated wastewater deep into abandoned borewells under high pressure.',
              outcome: 'unsustainable',
              explanation:
                'Deep-well industrial injection risks fracturing rock aquitards and irreversibly poisoning pristine confined regional aquifers.',
            },
            {
              id: 'c2_q3_c3',
              text: 'Discharge wastewater into public storm drains only during heavy monsoon nights.',
              outcome: 'unsustainable',
              explanation:
                'Midnight dumping pollutes natural watercourses, deposits toxic sludges, and recharges toxic chemicals directly into surrounding aquifers.',
            },
          ],
        },
      ],
    },
    {
      id: 'contamination_3',
      moduleId: 'contamination',
      number: 3,
      title: 'Geogenic Fluoride & Arsenic Mitigation',
      subtitle: 'Managing Naturally Occurring Deep Mineral Toxins',
      description:
        'Over-drilling into granitic bedrock has tapped deep groundwater with 3.8 mg/L fluoride, causing dental and skeletal fluorosis across local communities.',
      situation:
        'In the Nalgonda district granitic hard-rock terrain, deep drilling beyond 80 meters has tapped ancient groundwater that has dissolved minerals from fluoride-bearing rock (fluorite and apatite). Children show mottled teeth and elderly residents suffer crippling skeletal joint pain.',
      learningObjectives: [
        'Distinguish between anthropogenic (man-made) and geogenic (natural rock) contamination.',
        'Understand why deep drilling in specific granitic formations increases fluoride risk.',
        'Implement Nalgonda technique, activated alumina adsorption, and rainwater dilution.',
      ],
      bonusXp: 50,
      bonusCoins: 5,
      questions: [
        {
          id: 'c3_q1',
          question: 'Why does fluoride concentration often increase when borewells are drilled deeper into granitic bedrock?',
          situationContext: 'Shallow open wells in the village had safe fluoride (<1.0 mg/L), but new deep 100-meter tube-wells have 3.8 mg/L.',
          choices: [
            {
              id: 'c3_q1_c1',
              text: 'Deep groundwater has prolonged residence time in high-fluorite granitic minerals under alkaline conditions.',
              outcome: 'sustainable',
              explanation:
                'Deep groundwater moves slowly over centuries through fractured granitic rock, dissolving fluoride minerals under alkaline, low-calcium conditions.',
            },
            {
              id: 'c3_q1_c2',
              text: 'Farmers are pouring fluoride fertilizer into the deep borewells.',
              outcome: 'unsustainable',
              explanation:
                'Fluoride contamination in granitic terrains is geogenic (natural geological origin), not caused by synthetic fertilizer dumping.',
            },
            {
              id: 'c3_q1_c3',
              text: 'Deep borewells rust faster, releasing fluoride from the steel pipes.',
              outcome: 'unsustainable',
              explanation:
                'Steel rust produces iron oxides, not fluoride; fluoride is derived exclusively from natural mineral dissolution in bedrock.',
            },
          ],
        },
        {
          id: 'c3_q2',
          question: 'What practical community-level water treatment method removes excess fluoride effectively?',
          situationContext: 'The community needs a reliable, affordable defluoridation system for domestic drinking water.',
          choices: [
            {
              id: 'c3_q2_c1',
              text: 'Community adsorption units using activated alumina or the Nalgonda chemical coagulation-sedimentation technique.',
              outcome: 'sustainable',
              explanation:
                'Activated alumina adsorption and the Nalgonda technique (alum and lime coagulation) reliably reduce fluoride below the 1.0 mg/L safety standard.',
            },
            {
              id: 'c3_q2_c2',
              text: 'Passing water through a simple cloth mesh strainer.',
              outcome: 'unsustainable',
              explanation:
                'Fluoride is a dissolved chemical ion; mechanical cloth filters have zero effect on dissolved mineral contaminants.',
            },
            {
              id: 'c3_q2_c3',
              text: 'Exposing water to direct midday sunlight in open trays.',
              outcome: 'unsustainable',
              explanation:
                'Solar exposure evaporates water, which actually increases the dissolved fluoride concentration rather than removing it.',
            },
          ],
        },
        {
          id: 'c3_q3',
          question: 'What sustainable hydrological strategy provides permanent relief from geogenic contamination?',
          situationContext: 'Relying solely on treatment filters requires continuous maintenance and chemical media replacement.',
          choices: [
            {
              id: 'c3_q3_c1',
              text: 'Recharge shallow aquifers with rainwater to dilute fluoride and transition drinking supply to safe shallow/surface sources.',
              outcome: 'sustainable',
              explanation:
                'Rainwater artificial recharge dilutes high mineral concentrations while providing sustainable, low-fluoride water for village needs.',
            },
            {
              id: 'c3_q3_c2',
              text: 'Drill twice as deep (to 300 meters) to find completely mineral-free water.',
              outcome: 'unsustainable',
              explanation:
                'Drilling even deeper into granitic basement rocks typically encounters even higher fluoride, salinity, and dissolved solids.',
            },
            {
              id: 'c3_q3_c3',
              text: 'Mix raw borewell water with muddy ditch water to mask the taste.',
              outcome: 'unsustainable',
              explanation:
                'Adding dirty surface ditch water introduces deadly bacterial pathogens and water-borne diseases without neutralizing fluoride.',
            },
          ],
        },
      ],
    },
    {
      id: 'contamination_4',
      moduleId: 'contamination',
      number: 4,
      title: 'Coastal Saline Water Intrusion',
      subtitle: 'Halting Seawater Ingress in Coastal Aquifers',
      description:
        'Excessive fresh groundwater pumping near the coastline has reversed the natural hydraulic gradient, causing ocean saltwater to intrude inland into freshwater wells.',
      situation:
        'In a coastal agricultural belt, high-capacity pumps operate around the clock to support commercial prawn hatcheries and fruit orchards. Over the past three years, freshwater borewells up to 4 km inland have turned brackish, with electrical conductivity spiking from 600 µS/cm to over 8,500 µS/cm.',
      learningObjectives: [
        'Understand the Ghyben-Herzberg hydrostatic equilibrium principle.',
        'Analyze how lowering freshwater hydraulic head causes saline interface upconing.',
        'Deploy fresh groundwater recharge barriers and pumping regulations.',
      ],
      bonusXp: 50,
      bonusCoins: 5,
      questions: [
        {
          id: 'c4_q1',
          question: 'What hydrogeological principle explains why coastal over-pumping causes rapid saltwater invasion?',
          situationContext: 'For every 1 meter of freshwater table decline above sea level, deep saltwater rises by approximately 40 meters (Ghyben-Herzberg relation).',
          choices: [
            {
              id: 'c4_q1_c1',
              text: 'Lowering the freshwater head reduces hydraulic pressure, allowing denser seawater to advance inland and upcone into wells.',
              outcome: 'sustainable',
              explanation:
                'Freshwater is less dense than seawater; drawing down the freshwater table disrupts equilibrium and allows the wedge of seawater to migrate inland.',
            },
            {
              id: 'c4_q1_c2',
              text: 'Saltwater travels inland purely through surface waves splashing over beaches.',
              outcome: 'unsustainable',
              explanation:
                'Saline intrusion occurs subterraneanly through porous aquifer formations due to pressure differentials, not surface wave splashing.',
            },
            {
              id: 'c4_q1_c3',
              text: 'Underground rock minerals spontaneously convert into table salt when exposed to air.',
              outcome: 'unsustainable',
              explanation:
                'Rock does not turn into salt; the high salinity is caused by literal intrusion of ocean seawater into coastal geological formations.',
            },
          ],
        },
        {
          id: 'c4_q2',
          question: 'What immediate regulatory control is required along the vulnerable coastal margin?',
          situationContext: 'High-power commercial tube-wells are operating within 500 meters of the high-tide line.',
          choices: [
            {
              id: 'c4_q2_c1',
              text: 'Establish a Coastal Protection Zone with strict caps on groundwater extraction and ban new high-capacity commercial wells.',
              outcome: 'sustainable',
              explanation:
                'Regulating extraction stops the expansion of the regional cone of depression and stabilizes the natural freshwater-saltwater boundary.',
            },
            {
              id: 'c4_q2_c2',
              text: 'Subsidize larger 20 HP submersible pumps so farmers can pump faster before water turns salty.',
              outcome: 'unsustainable',
              explanation:
                'Higher pumping rates induce extreme localized upconing, turning freshwater borewells completely saline within weeks.',
            },
            {
              id: 'c4_q2_c3',
              text: 'Pump coastal seawater onto inland fields to fill dry irrigation ditches.',
              outcome: 'unsustainable',
              explanation:
                'Pumping seawater onto fields causes immediate irreversible soil salinization and poisons all remaining shallow freshwater tables.',
            },
          ],
        },
        {
          id: 'c4_q3',
          question: 'What active engineering measure creates a subterranean barrier against incoming seawater?',
          situationContext: 'The community needs to push the saline interface back toward the ocean.',
          choices: [
            {
              id: 'c4_q3_c1',
              text: 'Create a freshwater hydraulic barrier by injecting clean harvested surface runoff into wells along the coastal front.',
              outcome: 'sustainable',
              explanation:
                'Injecting fresh water raises the coastal hydraulic head, exerting outward hydrostatic pressure that pushes the advancing saltwater wedge back toward the sea.',
            },
            {
              id: 'c4_q3_c2',
              text: 'Dig a 2-meter deep trench along the beach and fill it with dry gravel.',
              outcome: 'partially_sustainable',
              explanation:
                'A shallow beach trench does not affect deep subterranean pressure gradients located 50–100 meters underground.',
            },
            {
              id: 'c4_q3_c3',
              text: 'Pour table sugar into the wells to counteract the salty taste.',
              outcome: 'unsustainable',
              explanation:
                'Adding organic sugar feeds bacterial proliferation, rots inside the well casing, and does not alter groundwater salinity or mineral balance.',
            },
          ],
        },
      ],
    },
  ],
};
