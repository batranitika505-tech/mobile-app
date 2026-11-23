import { GameModule } from '../../types/game';

export const droughtModule: GameModule = {
  id: 'drought',
  number: 1,
  title: 'Drought Crisis',
  subtitle: 'Groundwater Conservation Under Water Scarcity',
  description:
    'Manage severe aquifer depletion during prolonged meteorological drought. Curb competitive over-extraction, introduce micro-irrigation, and diversify crops.',
  topics: ['Over-Extraction', 'Drip Irrigation', 'Crop Diversification', 'Aquifer Budgeting'],
  iconName: 'Flame',
  variant: 'warning',
  scenarios: [
    {
      id: 'drought_1',
      moduleId: 'drought',
      number: 1,
      title: 'Borewell Over-Extraction Crisis',
      subtitle: 'Falling Static Water Tables in Deep Aquifers',
      description:
        'Aquifer levels have dropped 18 meters below normal. Farmers are competing to drill deeper borewells, risking complete groundwater depletion.',
      situation:
        'In the semi-arid block of Maru Nagar, static groundwater levels have fallen past 120 meters. Over 60 borewells have dried up this season. Wealthier landholders propose deepening existing tube-wells to 250 meters to tap fossil aquifers, which would accelerate regional groundwater depletion.',
      learningObjectives: [
        'Understand cone of depression and competitive aquifer extraction.',
        'Recognize why deepening borewells causes irreversible aquifer collapse.',
        'Implement extraction caps and demand-side management.',
      ],
      bonusXp: 50,
      bonusCoins: 5,
      questions: [
        {
          id: 'd1_q1',
          question: 'How should the local groundwater authority respond to requests for deeper drilling permits?',
          situationContext: 'Drilling contractors are offering deep rig operations to tap lower confined aquifers.',
          choices: [
            {
              id: 'd1_q1_c1',
              text: 'Impose an immediate moratorium on deep drilling and mandate community extraction audits.',
              outcome: 'sustainable',
              explanation:
                'Halting deep drilling prevents irreversible mining of non-renewable fossil aquifers and forces transition to sustainable demand-side budgeting.',
            },
            {
              id: 'd1_q1_c2',
              text: 'Permit drilling only during night hours with metered electrical power.',
              outcome: 'partially_sustainable',
              explanation:
                'Power scheduling reduces peak-load evaporation but does not solve the fundamental deficit of extracting more water than natural recharge.',
            },
            {
              id: 'd1_q1_c3',
              text: 'Subsidize deeper drilling equipment so all smallholders can reach lower aquifers equally.',
              outcome: 'unsustainable',
              explanation:
                'Subsidizing deeper borewells accelerates a race to the bottom, depleting the regional aquifer and permanently compacting pore spaces.',
            },
          ],
        },
        {
          id: 'd1_q2',
          question: 'Farmers currently use flood furrow watering on orchards. What irrigation shift should be prioritized?',
          situationContext: 'Surface temperatures exceed 41°C, causing over 40% of flood-applied water to evaporate before root uptake.',
          choices: [
            {
              id: 'd1_q2_c1',
              text: 'Transition orchards to subsurface drip irrigation with pressure-compensating emitters.',
              outcome: 'sustainable',
              explanation:
                'Subsurface drip applies moisture directly to the root zone with near-zero evaporative loss, slashing irrigation water use by 40–60%.',
            },
            {
              id: 'd1_q2_c2',
              text: 'Line existing open earth furrows with thin plastic sheeting.',
              outcome: 'partially_sustainable',
              explanation:
                'Lining furrows reduces conveyance seepage into soil, but large exposed water surfaces still suffer severe atmospheric evaporation.',
            },
            {
              id: 'd1_q2_c3',
              text: 'Increase daytime pump run-time to saturate dry soil deeper.',
              outcome: 'unsustainable',
              explanation:
                'Excessive flooding in high heat multiplies evaporative loss and causes soil salinization without increasing crop hydration.',
            },
          ],
        },
        {
          id: 'd1_q3',
          question: 'How should community drinking water be secured as irrigation wells dry up?',
          situationContext: 'Five village handpumps have begun yielding murky air-water mixtures as the water table slips below casing screens.',
          choices: [
            {
              id: 'd1_q3_c1',
              text: 'Ring-fence high-yielding public wells strictly for potable domestic use with community quotas.',
              outcome: 'sustainable',
              explanation:
                'Prioritizing domestic drinking water over commercial irrigation aligns with national water policy and preserves human life during acute drought.',
            },
            {
              id: 'd1_q3_c2',
              text: 'Allow private tankers to extract unlimited water from surviving wells for resale.',
              outcome: 'unsustainable',
              explanation:
                'Commercial unregulated tanker extraction accelerates localized cone depression and creates extreme water inequality during crises.',
            },
            {
              id: 'd1_q3_c3',
              text: 'Deepen village handpump cylinders without restricting nearby agricultural pumping.',
              outcome: 'partially_sustainable',
              explanation:
                'Deepening intake cylinders provides temporary relief, but without curbing nearby farm pumping, the table will soon drop past the new depth.',
            },
          ],
        },
      ],
    },
    {
      id: 'drought_2',
      moduleId: 'drought',
      number: 2,
      title: 'Crop Diversification Under Scarcity',
      subtitle: 'Transitioning from Water-Guzzling Cash Crops',
      description:
        'Farmers continue growing water-intensive sugarcane and paddy in drought-prone tracts. Introduce climate-resilient crop planning.',
      situation:
        'In the drought-stressed Krishna basin tract, farmers dedicate 75% of acreage to sugarcane and flood-irrigated summer paddy. These two crops consume over 80% of annual groundwater draft, leaving neighboring food crops desiccated.',
      learningObjectives: [
        'Understand crop water requirement (evapotranspiration demand).',
        'Analyze economic and water footprint trade-offs in crop selection.',
        'Promote millets, pulses, and oilseeds in over-exploited blocks.',
      ],
      bonusXp: 50,
      bonusCoins: 5,
      questions: [
        {
          id: 'd2_q1',
          question: 'What agricultural policy intervention best encourages farmers to move away from water-intensive sugarcane?',
          situationContext: 'Sugarcane has guaranteed mill purchase prices, making farmers hesitant to switch without financial security.',
          choices: [
            {
              id: 'd2_q1_c1',
              text: 'Introduce transitional price guarantees and procurement for nutrient-dense millets and pulses.',
              outcome: 'sustainable',
              explanation:
                'Assuring market procurement for pearl millet and sorghum offsets crop price risks while slashing field water demand by up to 70%.',
            },
            {
              id: 'd2_q1_c2',
              text: 'Ban all sugarcane processing mills without transitional support for farmers.',
              outcome: 'unsustainable',
              explanation:
                'Abrupt bans without alternatives cause farmer distress and illegal extraction rather than systematic hydrological transition.',
            },
            {
              id: 'd2_q1_c3',
              text: 'Offer a minor cash incentive to delay sugarcane sowing by two weeks.',
              outcome: 'partially_sustainable',
              explanation:
                'A two-week delay marginally shifts peak water demand, but the total seasonal water consumption remains unsustainably high.',
            },
          ],
        },
        {
          id: 'd2_q2',
          question: 'Which crop combination provides optimal food security with the lowest groundwater footprint in drought?',
          situationContext: 'Field soil is sandy loam with poor moisture-holding capacity.',
          choices: [
            {
              id: 'd2_q2_c1',
              text: 'Pearl millet (Bajra) intercropped with Pigeon pea (Arhar) and drought-hardy pulses.',
              outcome: 'sustainable',
              explanation:
                'Millets and pulses require only 250–350 mm of water compared to 1500–2500 mm for sugarcane, while enhancing soil nitrogen fixing.',
            },
            {
              id: 'd2_q2_c2',
              text: 'Short-duration hybrid summer paddy with sprinkler misting.',
              outcome: 'partially_sustainable',
              explanation:
                'Short-duration paddy reduces the growing window, but ponding water in high ambient heat still demands excessive extraction.',
            },
            {
              id: 'd2_q2_c3',
              text: 'High-density commercial banana plantation with open ditch watering.',
              outcome: 'unsustainable',
              explanation:
                'Banana is extremely water-intensive and sensitive to moisture stress; planting it during a drought guarantees heavy groundwater overdraft.',
            },
          ],
        },
        {
          id: 'd2_q3',
          question: 'How should soil health be managed to preserve scarce soil moisture between watering cycles?',
          situationContext: 'Topsoil is baking hard and developing deep crust fissures under intense sun.',
          choices: [
            {
              id: 'd2_q3_c1',
              text: 'Apply organic biomass crop residue mulching and zero-tillage practices.',
              outcome: 'sustainable',
              explanation:
                'Mulching reduces soil evaporation by 30–40%, lowers soil temperature, and retains root moisture for significantly longer intervals.',
            },
            {
              id: 'd2_q3_c2',
              text: 'Perform frequent deep tractor plowing to loosen dry soil.',
              outcome: 'unsustainable',
              explanation:
                'Deep tilling in drought exposes subsoil moisture directly to the sun and wind, rapidly desiccating the root zone.',
            },
            {
              id: 'd2_q3_c3',
              text: 'Apply synthetic chemical humectants once per season without residue cover.',
              outcome: 'partially_sustainable',
              explanation:
                'Chemical soil additives can temporarily improve water absorption, but without vegetative mulching, bare soil still loses moisture quickly.',
            },
          ],
        },
      ],
    },
    {
      id: 'drought_3',
      moduleId: 'drought',
      number: 3,
      title: 'Community Aquifer Water Budgeting',
      subtitle: 'Equitable Allocation in Critical Watersheds',
      description:
        'A single shared unconfined aquifer is being pumped by 120 independent farm holdings without shared monitoring or extraction limits.',
      situation:
        'The Gopalpur watershed sits over a shallow weathered basalt aquifer. Downstream community wells have gone dry because upstream commercial farms pump 24/7. Feuds are erupting over water access.',
      learningObjectives: [
        'Understand collective action in common-pool resource management.',
        'Implement water budgeting based on measured seasonal aquifer storage.',
        'Establish social fencing and participatory monitoring.',
      ],
      bonusXp: 50,
      bonusCoins: 5,
      questions: [
        {
          id: 'd3_q1',
          question: 'What institutional mechanism should the village council create to prevent competitive pumping?',
          situationContext: 'Farmers currently extract as much as their electric motors allow whenever grid power is supplied.',
          choices: [
            {
              id: 'd3_q1_c1',
              text: 'Form a Village Water User Association to calculate annual water balance and enforce extraction caps.',
              outcome: 'sustainable',
              explanation:
                'Participatory Groundwater Management (PGWM) aligns communal extraction with seasonal recharge, creating transparent shared accountability.',
            },
            {
              id: 'd3_q1_c2',
              text: 'Auction extraction rights to the highest bidder to raise municipal maintenance funds.',
              outcome: 'unsustainable',
              explanation:
                'Privatizing common aquifer rights deprives low-income farmers of survival water and worsens over-exploitation.',
            },
            {
              id: 'd3_q1_c3',
              text: 'Ask farmers to voluntarily self-report their extraction on paper without verification.',
              outcome: 'partially_sustainable',
              explanation:
                'Voluntary reporting raises awareness, but without communal monitoring tools and shared rules, free-riding inevitably continues.',
            },
          ],
        },
        {
          id: 'd3_q2',
          question: 'How can the community make groundwater levels visible to all residents?',
          situationContext: 'Villagers do not know how deep the water level is until their pumps start sucking air.',
          choices: [
            {
              id: 'd3_q2_c1',
              text: 'Install color-coded water level indicator boards at key observation wells and public spaces.',
              outcome: 'sustainable',
              explanation:
                'Public display of piezometric depth demystifies the invisible resource and fosters collective motivation to conserve.',
            },
            {
              id: 'd3_q2_c2',
              text: 'Keep water table survey data in a secure administrative office ledger.',
              outcome: 'unsustainable',
              explanation:
                'Restricting hydrogeological data to closed files prevents community understanding and delays critical conservation action.',
            },
            {
              id: 'd3_q2_c3',
              text: 'Send automated SMS alerts only to landowners owning three or more tube-wells.',
              outcome: 'partially_sustainable',
              explanation:
                'Alerting large pumpers is useful, but excluding smallholders and domestic users undermines universal community consensus.',
            },
          ],
        },
        {
          id: 'd3_q3',
          question: 'During peak summer, how should emergency water allocation be prioritized?',
          situationContext: 'The remaining aquifer storage is projected to last only 45 days at current pumping rates.',
          choices: [
            {
              id: 'd3_q3_c1',
              text: 'Halt all non-essential horticultural flooding and guarantee 55 liters per person per day for drinking and livestock.',
              outcome: 'sustainable',
              explanation:
                'Human and livestock survival drinking quotas take paramount priority over non-essential seasonal agriculture in hydrological emergencies.',
            },
            {
              id: 'd3_q3_c2',
              text: 'Divide remaining hours of electricity equally between commercial fields and village handpumps.',
              outcome: 'partially_sustainable',
              explanation:
                'Equal power division sounds fair on paper, but high-power farm pumps still drain disproportionate groundwater volume compared to domestic handpumps.',
            },
            {
              id: 'd3_q3_c3',
              text: 'Allow anyone who can afford diesel gensets to pump without limitation.',
              outcome: 'unsustainable',
              explanation:
                'Relying on private fuel pumping depletes the final reserve water table within weeks and leaves vulnerable families with zero drinking supply.',
            },
          ],
        },
      ],
    },
    {
      id: 'drought_4',
      moduleId: 'drought',
      number: 4,
      title: 'Water Conveyance & Distribution Efficiency',
      subtitle: 'Eliminating Seepage and Evaporation Losses',
      description:
        'Over 35% of pumped groundwater is lost in transit through unlined earthen field channels before reaching crops.',
      situation:
        'In the arid taluka of Shekhawati, farmers pump scarce groundwater into earthen channels stretching 300 to 800 meters across porous sandy soil. By the time water reaches distant fields, deep percolation and evaporation swallow over a third of the pumped volume.',
      learningObjectives: [
        'Analyze distribution and conveyance efficiency.',
        'Evaluate underground closed pipelines versus open field canals.',
        'Schedule night-time irrigation to minimize micrometeorological loss.',
      ],
      bonusXp: 50,
      bonusCoins: 5,
      questions: [
        {
          id: 'd4_q1',
          question: 'What is the most effective engineering solution to eliminate field conveyance losses in sandy soil?',
          situationContext: 'Earthen channels lose huge water volumes through lateral seepage and sandy infiltration.',
          choices: [
            {
              id: 'd4_q1_c1',
              text: 'Install buried High-Density Polyethylene (HDPE) closed pipelines from borewells directly to plot heads.',
              outcome: 'sustainable',
              explanation:
                'Enclosed pressurized pipelines achieve near 100% conveyance efficiency, completely eliminating transit seepage, evaporation, and weed uptake.',
            },
            {
              id: 'd4_q1_c2',
              text: 'Dig deeper open channels and pack the canal bottom with clay.',
              outcome: 'partially_sustainable',
              explanation:
                'Clay lining reduces seepage temporarily, but open water channels still lose substantial moisture to solar evaporation and bank cracks.',
            },
            {
              id: 'd4_q1_c3',
              text: 'Pump at maximum motor horsepower so water travels faster through the dirt ditches.',
              outcome: 'unsustainable',
              explanation:
                'High-velocity pumping through unlined ditches causes canal wall scouring, erosion, and even greater water wastage.',
            },
          ],
        },
        {
          id: 'd4_q2',
          question: 'What timing adjustment dramatically reduces evaporative loss during summer irrigation?',
          situationContext: 'Midday solar radiation creates a high vapor-pressure deficit, drying foliage in minutes.',
          choices: [
            {
              id: 'd4_q2_c1',
              text: 'Schedule irrigation exclusively during night or early dawn hours.',
              outcome: 'sustainable',
              explanation:
                'Night irrigation takes advantage of low ambient temperatures, higher relative humidity, and minimal wind, ensuring maximum water infiltrates into root zones.',
            },
            {
              id: 'd4_q2_c2',
              text: 'Irrigate at noon so crops can immediately photosynthesize with the water.',
              outcome: 'unsustainable',
              explanation:
                'Noontime watering causes peak evaporation (up to 40% loss), plant heat shock, and surface soil scalding.',
            },
            {
              id: 'd4_q2_c3',
              text: 'Irrigate in late afternoon without adjusting water application volumes.',
              outcome: 'partially_sustainable',
              explanation:
                'Late afternoon is better than noon, but soil temperatures are still elevated; nocturnal scheduling remains significantly superior.',
            },
          ],
        },
        {
          id: 'd4_q3',
          question: 'How should on-farm storage ponds (diggis) be protected against extreme solar evaporation?',
          situationContext: 'Open farm storage tanks hold emergency water reserves but lose 10 mm of depth daily to sun exposure.',
          choices: [
            {
              id: 'd4_q3_c1',
              text: 'Cover pond surfaces with shade nets, floating modular covers, or integrate rooftop solar arrays.',
              outcome: 'sustainable',
              explanation:
                'Surface shading blocks direct ultraviolet solar radiation, cutting pond evaporation losses by 80–90% while preventing algae blooms.',
            },
            {
              id: 'd4_q3_c2',
              text: 'Add non-biodegradable mineral oils to form a thin surface slick.',
              outcome: 'unsustainable',
              explanation:
                'Chemical oil slicks contaminate water supplies, asphyxiate aquatic ecosystems, and degrade soil biology when applied to fields.',
            },
            {
              id: 'd4_q3_c3',
              text: 'Plant tall eucalyptus trees closely along all pond banks.',
              outcome: 'partially_sustainable',
              explanation:
                'Eucalyptus provides windbreak shelter, but its voracious root system consumes massive quantities of water directly from pond margins.',
            },
          ],
        },
      ],
    },
  ],
};
