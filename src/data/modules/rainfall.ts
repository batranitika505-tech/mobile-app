import { GameModule } from '../../types/game';

export const rainfallModule: GameModule = {
  id: 'rainfall',
  number: 2,
  title: 'Rainfall Opportunity',
  subtitle: 'Sustainable Surplus Water Management & Harvesting',
  description:
    'Harness monsoon cloudbursts and seasonal runoff. Deploy artificial recharge structures, filter recharge pits, check dams, and injection shafts to replenish subterranean aquifers.',
  topics: ['Artificial Recharge', 'Recharge Pits', 'Rainwater Harvesting', 'Runoff Management'],
  iconName: 'Droplets',
  variant: 'turquoise',
  scenarios: [
    {
      id: 'rainfall_1',
      moduleId: 'rainfall',
      number: 1,
      title: 'Urban Rooftop Rainwater Harvesting',
      subtitle: 'Capturing Flash Storm Runoff in Built Environments',
      description:
        'Torrential monsoon rain is overwhelming municipal storm drains while surrounding borewells suffer from dropping levels. Direct roof runoff to aquifers.',
      situation:
        'During three weeks of intense monsoon showers in an expanding district capital, millions of liters of pristine rainwater cascade across paved rooftops into concrete storm drains, causing localized street flooding. Simultaneously, institutional borewells are failing due to lack of recharge.',
      learningObjectives: [
        'Calculate rooftop rainwater harvesting potential using the runoff coefficient formula.',
        'Understand first-flush bypass mechanisms and gravel-sand filtration.',
        'Prevent urban stormwater contamination from entering drinking aquifers.',
      ],
      bonusXp: 50,
      bonusCoins: 5,
      questions: [
        {
          id: 'r1_q1',
          question: 'What initial component must be installed before rooftop runoff enters an underground recharge pit?',
          situationContext: 'The first 15 minutes of rainfall washes atmospheric soot, bird droppings, and accumulated roof dust.',
          choices: [
            {
              id: 'r1_q1_c1',
              text: 'A first-flush diverter valve to discard initial contaminated runoff before routing water to filters.',
              outcome: 'sustainable',
              explanation:
                'First-flush diverters isolate initial dirt and biological pollutants from reaching filtration media and entering pristine aquifers.',
            },
            {
              id: 'r1_q1_c2',
              text: 'Direct pipe connection straight into the casing of a functional drinking borewell.',
              outcome: 'unsustainable',
              explanation:
                'Direct uncleaned injection injects bird pathogens, rooftop dirt, and street toxins directly into the groundwater table.',
            },
            {
              id: 'r1_q1_c3',
              text: 'A wire mesh screen over the rooftop drain without a diverter or sand filter.',
              outcome: 'partially_sustainable',
              explanation:
                'Mesh blocks large leaves, but fine suspended particles and dissolved pollutants still pass directly through into the groundwater.',
            },
          ],
        },
        {
          id: 'r1_q2',
          question: 'What is the ideal layered filter composition for a rooftop recharge pit?',
          situationContext: 'Water needs to filter rapidly without clogging during intense cloudburst events.',
          choices: [
            {
              id: 'r1_q2_c1',
              text: 'Graded filter layers of boulders at the bottom, coarse gravel in the middle, and clean coarse sand on top.',
              outcome: 'sustainable',
              explanation:
                'Graded sand-gravel-boulder filtration captures fine particulates while maintaining high hydraulic conductivity for fast percolation.',
            },
            {
              id: 'r1_q2_c2',
              text: 'Pure clay soil packed tightly inside a brick chamber.',
              outcome: 'unsustainable',
              explanation:
                'Dense clay has virtually zero infiltration permeability; the chamber will overflow within minutes and reject all recharge water.',
            },
            {
              id: 'r1_q2_c3',
              text: 'Coarse crushed gravel only without a sand or geotextile sediment layer.',
              outcome: 'partially_sustainable',
              explanation:
                'Gravel allows quick drainage, but without sand filtration, fine silts pass into the aquifer and can clog pore throats over time.',
            },
          ],
        },
        {
          id: 'r1_q3',
          question: 'How should the municipality mandate rainwater harvesting across institutional campuses?',
          situationContext: 'Large schools, hospitals, and administrative headquarters have expansive concrete roofs.',
          choices: [
            {
              id: 'r1_q3_c1',
              text: 'Enact building bylaws requiring certified recharge shafts with annual pre-monsoon filter maintenance audits.',
              outcome: 'sustainable',
              explanation:
                'Mandating certified designs coupled with mandatory pre-monsoon cleaning ensures recharge pits remain functional season after season.',
            },
            {
              id: 'r1_q3_c2',
              text: 'Require buildings to store water only in above-ground plastic drums.',
              outcome: 'partially_sustainable',
              explanation:
                'Small drums provide temporary surface storage, but their limited capacity quickly overflows, missing massive aquifer recharge potential.',
            },
            {
              id: 'r1_q3_c3',
              text: 'Rely on voluntary adoption without regulatory verification or technical assistance.',
              outcome: 'unsustainable',
              explanation:
                'Without building code integration and enforcement, adoption rates remain negligible and flash flooding continues unchecked.',
            },
          ],
        },
      ],
    },
    {
      id: 'rainfall_2',
      moduleId: 'rainfall',
      number: 2,
      title: 'Watershed Check Dams & Percolation Tanks',
      subtitle: 'Slow, Spread, and Sink Runoff Across Rural Landscapes',
      description:
        'Ephemeral streams flow violently for days during monsoon downpours and then dry up completely. Implement ridge-to-valley recharge structures.',
      situation:
        'In the undulating terrain of the Vindhyan foothills, rainwater rapidly rushes down bare hillsides into major rivers within 48 hours of rainfall. The erosion strips fertile topsoil while leaving valley aquifers starved of percolation time.',
      learningObjectives: [
        'Understand the ridge-to-valley watershed treatment approach.',
        'Distinguish between gully plugs, continuous contour trenches, and masonry check dams.',
        'Measure groundwater recharge enhancement around percolation tanks.',
      ],
      bonusXp: 50,
      bonusCoins: 5,
      questions: [
        {
          id: 'r2_q1',
          question: 'In watershed planning, where should water conservation treatments begin?',
          situationContext: 'Heavy rainwater flows from hill ridges down into agricultural valley plains.',
          choices: [
            {
              id: 'r2_q1_c1',
              text: 'At the upper ridge with contour trenches and vegetative cover before building downstream check dams.',
              outcome: 'sustainable',
              explanation:
                'Ridge-to-valley treatment dissipates runoff velocity at the summit, traps silt, and prevents downstream masonry check dams from washing away.',
            },
            {
              id: 'r2_q1_c2',
              text: 'Build a giant concrete dam at the very bottom of the valley without touching upper hills.',
              outcome: 'partially_sustainable',
              explanation:
                'A single valley dam captures runoff, but unchecked torrential hill velocity rapidly deposits silt, filling the reservoir within a few years.',
            },
            {
              id: 'r2_q1_c3',
              text: 'Straighten and dredge natural stream channels to accelerate runoff flow out of the district.',
              outcome: 'unsustainable',
              explanation:
                'Channelizing and accelerating streamflow increases destructive flash floods downstream and destroys all natural bank infiltration.',
            },
          ],
        },
        {
          id: 'r2_q2',
          question: 'What type of structure best enhances groundwater recharge across seasonal seasonal streams?',
          situationContext: 'Stream bed consists of permeable weathered rock and fractured sandstone.',
          choices: [
            {
              id: 'r2_q2_c1',
              text: 'Cascading series of permeable check dams and percolation tanks with emergency spillways.',
              outcome: 'sustainable',
              explanation:
                'Low-height check dams hold water long enough to allow hydrostatic pressure to push moisture deep into underlying fractured rock strata.',
            },
            {
              id: 'r2_q2_c2',
              text: 'Completely concrete-line the stream bed and banks to prevent any water from sinking.',
              outcome: 'unsustainable',
              explanation:
                'Concreting the bed isolates the stream from the aquifer, completely halting natural groundwater recharge.',
            },
            {
              id: 'r2_q2_c3',
              text: 'Place temporary loose sandbag barriers without spillways on high-gradient turns.',
              outcome: 'partially_sustainable',
              explanation:
                'Sandbags offer quick emergency detention, but lack durability and rupture under heavy monsoon storm rushes.',
            },
          ],
        },
        {
          id: 'r2_q3',
          question: 'How should percolation tanks be maintained to sustain their recharge efficiency over years?',
          situationContext: 'Fine clay and silt particles carried by runoff settle at the bottom of the percolation tank, forming an impermeable crust.',
          choices: [
            {
              id: 'r2_q3_c1',
              text: 'Perform annual community desiltation before the monsoon and use nutrient-rich silt on farm soils.',
              outcome: 'sustainable',
              explanation:
                'Desilting removes the impermeable clay blanket, restoring percolation rates into the aquifer while enriching agricultural topsoil.',
            },
            {
              id: 'r2_q3_c2',
              text: 'Spray chemical dispersants into the water to dissolve the bottom mud layer.',
              outcome: 'unsustainable',
              explanation:
                'Chemical dispersants pollute groundwater aquifers and poison surrounding borewells used for drinking and irrigation.',
            },
            {
              id: 'r2_q3_c3',
              text: 'Leave silt in place to serve as a natural waterproof floor.',
              outcome: 'partially_sustainable',
              explanation:
                'A waterproof floor creates an evaporation-prone surface pond, but completely defeats the primary purpose of a percolation recharge tank.',
            },
          ],
        },
      ],
    },
    {
      id: 'rainfall_3',
      moduleId: 'rainfall',
      number: 3,
      title: 'Rejuvenation of Traditional Water Bodies',
      subtitle: 'Restoring Heritage Ponds, Baolis & Johads',
      description:
        'Historical community tanks, stepwells (baolis), and earthen ponds (johads) have fallen into disrepair, encroached by garbage and construction.',
      situation:
        'In an ancient settlement near the Aravalli range, four centuries-old johads and stepwells that once kept regional water tables high have been severed from their intake catchment canals by roads and waste dumping. Borewells within a 3 km radius have fallen drastically.',
      learningObjectives: [
        'Recognize the hydrogeological importance of traditional decentralized water systems.',
        'Restore natural feeder channels (agors) and catchment inflows.',
        'Combine heritage conservation with community water security.',
      ],
      bonusXp: 50,
      bonusCoins: 5,
      questions: [
        {
          id: 'r3_q1',
          question: 'What is the first step to restore inflows into an abandoned traditional pond?',
          situationContext: 'Feeder drainage channels (agors) are blocked by road construction, debris, and silt.',
          choices: [
            {
              id: 'r3_q1_c1',
              text: 'Clear, demarcate, and legally protect the natural feeder channels and catchment slopes from encroachment.',
              outcome: 'sustainable',
              explanation:
                'A water body cannot function without its catchment; clearing feeder channels ensures monsoon runoff reaches the reservoir naturally.',
            },
            {
              id: 'r3_q1_c2',
              text: 'Fill the dry pond with municipal tap water to make it look full.',
              outcome: 'unsustainable',
              explanation:
                'Pumping treated potable tap water into an earthen pond wastes energy and potable reserves without addressing catchment hydrology.',
            },
            {
              id: 'r3_q1_c3',
              text: 'Deepen the pond center with excavators without restoring the catchment canals.',
              outcome: 'partially_sustainable',
              explanation:
                'Deepening provides storage capacity, but if feeder channels remain blocked, the deepened pond will remain dry during rainfall.',
            },
          ],
        },
        {
          id: 'r3_q2',
          question: 'Why are traditional johads and stepwells so effective at localized groundwater recharge?',
          situationContext: 'Traditional structures are built at strategic geological fractures and natural valley depressions.',
          choices: [
            {
              id: 'r3_q2_c1',
              text: 'They exploit natural hydrological depressions and porous fractures to slowly feed regional water tables.',
              outcome: 'sustainable',
              explanation:
                'Indigenous water wisdom historically placed johads at the intersection of permeable strata, ensuring long-term subterranean feeding.',
            },
            {
              id: 'r3_q2_c2',
              text: 'They prevent all water from entering the ground, keeping it strictly on the surface.',
              outcome: 'unsustainable',
              explanation:
                'Traditional johads are intentionally unlined earthen structures specifically engineered to facilitate ground infiltration.',
            },
            {
              id: 'r3_q2_c3',
              text: 'They rely exclusively on groundwater pumping to stay filled.',
              outcome: 'partially_sustainable',
              explanation:
                'Johads receive monsoon surface runoff, not pumped groundwater; pumping into them would invert the conservation objective.',
            },
          ],
        },
        {
          id: 'r3_q3',
          question: 'How should solid waste and sewage dumping near traditional water bodies be eliminated?',
          situationContext: 'Local drains are discharging untreated greywater directly into the heritage stepwell.',
          choices: [
            {
              id: 'r3_q3_c1',
              text: 'Divert sewage into constructed wetland bio-filters and declare the stepwell perimeter an eco-heritage zone.',
              outcome: 'sustainable',
              explanation:
                'Constructed wetlands biologically purify wastewater before secondary reuse, protecting the sensitive unconfined aquifer from pathogens.',
            },
            {
              id: 'r3_q3_c2',
              text: 'Pour chlorine powder directly into the stepwell once a month while leaving sewage pipes connected.',
              outcome: 'unsustainable',
              explanation:
                'Chlorination without stopping raw sewage inflow creates toxic chloramines, kills natural biota, and fails to stop chemical aquifer pollution.',
            },
            {
              id: 'r3_q3_c3',
              text: 'Erect a tall boundary wall around the stepwell to hide the dirty water from view.',
              outcome: 'partially_sustainable',
              explanation:
                'A wall prevents physical trash throwing, but underground sewage seepage through stone joints continues to contaminate groundwater.',
            },
          ],
        },
      ],
    },
    {
      id: 'rainfall_4',
      moduleId: 'rainfall',
      number: 4,
      title: 'Injection Well Recharge in Deep Aquifers',
      subtitle: 'Replenishing Overexploited Confined Formations',
      description:
        'In hard-rock and deep alluvial basins, thick surface clay layers block surface infiltration. Deploy engineered recharge shafts.',
      situation:
        'In an overexploited agrarian belt of Malwa, a 20-meter impermeable black cotton clay layer prevents monsoon surface water from reaching the deeper fractured basalt aquifer located at 70 meters depth. Deep tube-wells are failing.',
      learningObjectives: [
        'Understand hydrogeological barriers to unconfined vs confined recharge.',
        'Design recharge shafts and inverted injection wells.',
        'Maintain water quality standards to prevent subterranean aquifer fouling.',
      ],
      bonusXp: 50,
      bonusCoins: 5,
      questions: [
        {
          id: 'r4_q1',
          question: 'When an impermeable thick clay layer prevents surface infiltration, what engineering solution is appropriate?',
          situationContext: 'Monsoon puddles stand on the clay surface for weeks without percolating into the deep aquifer.',
          choices: [
            {
              id: 'r4_q1_c1',
              text: 'Construct a recharge shaft that pierces the impermeable clay layer into permeable fractured rock with a sand filter chamber.',
              outcome: 'sustainable',
              explanation:
                'Piercing the aquitard with a filtered recharge shaft creates a direct hydraulic conduit into deep storage zones without bypassing filtration.',
            },
            {
              id: 'r4_q1_c2',
              text: 'Dig thousands of shallow 1-meter scrapes on the surface clay.',
              outcome: 'unsustainable',
              explanation:
                'Shallow scrapes remain trapped in the impermeable clay; all water is lost to surface evaporation without recharging the aquifer.',
            },
            {
              id: 'r4_q1_c3',
              text: 'Pump pressurized river floodwaters directly into active borewells without sediment settlement.',
              outcome: 'partially_sustainable',
              explanation:
                'Unfiltered river floodwater carries heavy suspended silts and biological pathogens that permanently clog aquifer fractures.',
            },
          ],
        },
        {
          id: 'r4_q2',
          question: 'What happens if murky silt-laden water is allowed to enter an injection well directly?',
          situationContext: 'Farmers want to direct muddy canal overflow straight down tube-well casings during floods.',
          choices: [
            {
              id: 'r4_q2_c1',
              text: 'Fine silt particles deposit in the well slotted pipe and surrounding rock pores, permanently choking the well.',
              outcome: 'sustainable',
              explanation:
                'Clogging of aquifer pore space by physical silt deposition is extremely difficult and expensive to reverse; rigorous pre-settling is mandatory.',
            },
            {
              id: 'r4_q2_c2',
              text: 'The silt dissolves instantly into pure water under deep aquifer pressure.',
              outcome: 'unsustainable',
              explanation:
                'Mineral silt particles do not dissolve in water; they settle and mechanically seal the pore spaces of the water-bearing formation.',
            },
            {
              id: 'r4_q2_c3',
              text: 'The silt will simply float on top of the groundwater without causing any harm.',
              outcome: 'partially_sustainable',
              explanation:
                'Silt is denser than water and precipitates immediately around the well screen, creating a severe hydraulic flow barrier.',
            },
          ],
        },
        {
          id: 'r4_q3',
          question: 'What quality safeguard must be included in deep aquifer injection systems?',
          situationContext: 'Deep aquifers are regional multi-village drinking sources.',
          choices: [
            {
              id: 'r4_q3_c1',
              text: 'Sedimentation desilting chamber, dual-media sand-gravel filter bed, and periodic backwashing capability.',
              outcome: 'sustainable',
              explanation:
                'Pre-treatment chambers and backwashing facilities guarantee that only clean, sediment-free water enters the valuable deep aquifer.',
            },
            {
              id: 'r4_q3_c2',
              text: 'Install an automated sensor that only checks the temperature of incoming water.',
              outcome: 'unsustainable',
              explanation:
                'Temperature checking does not detect sediment turbidity, chemical residues, pesticides, or biological contaminants.',
            },
            {
              id: 'r4_q3_c3',
              text: 'Rely on a single nylon mesh bag tied over the inflow pipe.',
              outcome: 'partially_sustainable',
              explanation:
                'A mesh bag stops twigs, but allows fine colloidal mud and bacteria to enter the deep regional drinking table unimpeded.',
            },
          ],
        },
      ],
    },
  ],
};
