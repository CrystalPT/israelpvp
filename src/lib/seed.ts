import { db } from './firebase';
import { doc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore';

const TIERS = ['HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3', 'HT4', 'LT4', 'HT5', 'LT5'];
const MODES = ['Overall', 'UHC', 'Sword', 'Speed', 'Pot', 'NethOP', 'SMP', 'Diamond SMP', 'Vanilla'];

const SCRAPED_PLAYERS = [
    { "username": "Marlowww", "uuid": "d219c8ee-d32e-4da2-b22e-0aa69d36c88a" },
    { "username": "ItzRealMe", "uuid": "06ec3577-3299-45fa-bbdf-613b1f86c8ab" },
    { "username": "Swight", "uuid": "ebd7af32-759e-41e2-b227-9eeb8576d609" },
    { "username": "coldified", "uuid": "7e8a77ca-daf1-4224-ae1d-2df8bab1eccb" },
    { "username": "janekv", "uuid": "4004ec59-536b-4f8a-b829-ee8c91f3bd86" },
    { "username": "BlvckWlf", "uuid": "653bb064-799a-4bc7-9835-83cce16ddd83" },
    { "username": "Kylaz", "uuid": "f4aa6afa-d90c-4dd2-97b2-ed453b8c99fe" },
    { "username": "ninorc15", "uuid": "b86e6260-895d-443d-8f00-a808eea23294" },
    { "username": "Lurrn", "uuid": "72b76cea-3abb-4ef2-b4b4-bd6786ec921e" },
    { "username": "Arsakha", "uuid": "746db6cd-f626-4a91-902f-43e34867d93a" },
    { "username": "yMiau", "uuid": "ed42d02b-cc94-49b5-ae07-b169b7cefb97" },
    { "username": "Juan_Clean", "uuid": "96eafb3d-e5df-4487-a314-e8ee0aba6c80" },
    { "username": "Deivi_17", "uuid": "bb21bd55-eb29-48c3-87bc-865b5749714b" },
    { "username": "Spawnplayer", "uuid": "4245d301-d6e8-4268-bc4c-dc88270e0fcb" },
    { "username": "Freekee_Fang", "uuid": "bb4f57a3-50bc-461c-a28f-88a36e6d0aaa" },
    { "username": "sashia2m", "uuid": "a59dc025-bb66-4129-bc7c-cd9cce9f2e79" },
    { "username": "Frxnkey", "uuid": "c20d2591-d405-4872-9dbe-989a0ecc6d34" },
    { "username": "Hosthan", "uuid": "ae851e5a-0bab-4c1d-b20c-269fdc57d275" },
    { "username": "Inapplicable", "uuid": "07009f1a-a60f-4485-90fb-eba801a5f3d0" },
    { "username": "michaelcycle00", "uuid": "4bb70487-9146-4fc7-89ec-971808e414b9" },
    { "username": "TgsHalo", "uuid": "92cf161d-5e56-4c95-94f9-c0764681b0fb" },
    { "username": "Legendarryy", "uuid": "ad00f5b8-1c24-4a79-b0f4-f4351154af3c" },
    { "username": "Flowtives", "uuid": "05aee938-19b6-41a9-a3d2-8470d597cdf9" },
    { "username": "Dishwasher1221", "uuid": "ec1635cd-9a24-49d2-a2d0-368b648e5cdb" },
    { "username": "mamAloni", "uuid": "7f232535-593a-4be4-950a-b9b91bec1982" },
    { "username": "TryH4rdd", "uuid": "3421e1a5-e89d-4994-b0cb-15bfbde70170" },
    { "username": "ViviKaiMC", "uuid": "9e6263cc-1027-413f-a568-5588d4cca022" },
    { "username": "Enlock", "uuid": "973843fb-d8d6-403c-9518-026d77d8dfe2" },
    { "username": "Svoen", "uuid": "423e06b9-1073-433a-a7bd-28db129a6ffe" },
    { "username": "Reflex50", "uuid": "ff41b8ac-6e76-4b87-961b-983b0e359e8e" },
    { "username": "360Mall", "uuid": "1f92d0b8-0507-41a6-b6aa-d612ab55a9e8" },
    { "username": "SixtyFive65", "uuid": "f887648c-96a6-4441-876e-6aa7aba4cc6a" },
    { "username": "crescentuser", "uuid": "aa79513a-23c4-4b3b-95f8-2b3944fe01ea" },
    { "username": "Prusso", "uuid": "ff7e19bd-4311-4993-85b8-8f1ca009e7bc" },
    { "username": "TheRandomizer", "uuid": "3b653c04-f2d9-422a-87e7-ccf8b146c350" },
    { "username": "FerreMC", "uuid": "4b0f3d7e-b343-4e4a-8929-a87ddb8f0307" },
    { "username": "C0RZZ", "uuid": "c9468221-f170-4cbe-85f6-48fe00fdeb26" },
    { "username": "Evantii", "uuid": "57816331-5e7a-4f36-9e6d-02f12168f8cd" },
    { "username": "UccDawg", "uuid": "f2694f04-e177-4d58-bfac-f6eec7b2c951" },
    { "username": "Koharu89", "uuid": "9e1dc029-310c-44a5-935e-9046fca98270" },
    { "username": "JackerAcid", "uuid": "96d933c7-360c-4ba5-aa7f-2559bd798a7f" },
    { "username": "Emobubr", "uuid": "b6d5d921-7afd-4552-a33c-36b3a194511e" },
    { "username": "Alexandzr", "uuid": "04bb1574-db3b-4561-a085-c3801f869130" },
    { "username": "SuchSkills_Mx", "uuid": "162ea92e-8010-44e2-9797-8751dc521072" },
    { "username": "Tqmen", "uuid": "226bc8e3-119c-46f8-8fc1-487228c2b4f1" },
    { "username": "Mentaider", "uuid": "7155768f-91b7-4341-932c-579438f584b1" },
    { "username": "Waltersillo", "uuid": "91781d8c-da01-4d19-a62c-9373786b6cf6" },
    { "username": "Twohandsrevy", "uuid": "d4a00333-a836-4a21-b494-e0c27164a150" },
    { "username": "ceeew", "uuid": "7b333d2f-0a08-49d1-bb27-1a01af2e22a2" },
    { "username": "cRonECrAfTEr", "uuid": "a70221c2-ba72-4154-add9-9183a373713e" },
    { "username": "JokingDK", "uuid": "1246a0ec-662b-45de-bb0b-d68cb1cce800" },
    { "username": "badspelhr", "uuid": "8ef74061-685b-49e7-b765-2fd310729dba" },
    { "username": "Ra1gn", "uuid": "026cf46a-4260-4d11-bd4f-914b6c0d41a5" },
    { "username": "ImRedz", "uuid": "4c80b1f8-019a-409e-a84c-4c58db07a1f1" },
    { "username": "Leaferd", "uuid": "c4022901-b19d-4010-ae08-9bf365b6391d" },
    { "username": "fwaggy", "uuid": "4a2253f0-d361-43a4-830d-31d634e28d26" },
    { "username": "ShadowZeuss", "uuid": "5aa6827e-5977-4c3d-9e6b-f7a87080ff02" },
    { "username": "Bqnnyy", "uuid": "a956af6b-8ac2-41e1-9825-58c2eddf2940" },
    { "username": "Mxthi", "uuid": "ca5c672a-148e-482c-9c8e-88af45c9d30c" },
    { "username": "Paulinhq", "uuid": "2e838c05-7d1c-4d3e-962e-ff90e3627db8" },
    { "username": "K1RBE", "uuid": "5e24102f-a2b8-46a3-92e0-932a52dc90f2" },
    { "username": "phanticghost", "uuid": "3979d47b-602b-4c75-9af1-a11d06a2056e" },
    { "username": "sEEBACHS", "uuid": "7091f820-8fbd-45f2-a7a7-4c09910c3795" },
    { "username": "sincerelyray", "uuid": "e04c9947-c559-4bb6-9bd9-6a9ceb7023df" },
    { "username": "lilbizo", "uuid": "9b9cd51d-0efb-45c8-9776-7150ffd1b838" },
    { "username": "supersuperpig", "uuid": "3886f86a-3566-4dd9-aef1-ac2108f1d8a7" },
    { "username": "SmiGuy", "uuid": "5a7e7d65-2dc5-431c-8dc9-1660425f8ab6" },
    { "username": "evesoki", "uuid": "bb2fe58e-d620-44fa-9dc5-362e3a61679b" },
    { "username": "FatalDeath", "uuid": "811b22e6-3d08-4967-bf9d-c99d12a4c751" },
    { "username": "Endy0", "uuid": "8f195a1b-482a-46b5-b006-ee3797167532" },
    { "username": "PUFFIERZ", "uuid": "753a20ab-9c75-4a5a-aaae-5927299ebdf7" },
    { "username": "TooDrew", "uuid": "84272c24-aca9-4ef3-bb7a-4a8f81256b3e" },
    { "username": "GothTripleYoshi", "uuid": "89dcab80-bb97-4145-ae83-28ab9551a1e5" },
    { "username": "Madlogg", "uuid": "d56a6990-9eba-4440-915b-ca7694d12390" },
    { "username": "Gqlm", "uuid": "745f7fba-a531-4c0e-90e6-3f348187c44a" },
    { "username": "1Wenzy", "uuid": "0f2e2924-f4f8-4745-87c5-084e7c71abe2" },
    { "username": "CorruptNoob", "uuid": "a5730eb9-4949-4279-839f-1022d64b937f" },
    { "username": "Viruslmao", "uuid": "bc7088e4-ddf5-4b77-83b1-0fdcfc1d8c49" },
    { "username": "Turbinial", "uuid": "cc1d3161-befd-483e-bfcd-17fb78fbf74e" },
    { "username": "LEONALtheLION", "uuid": "ed63dc95-f7fe-413e-b8f9-5d30d1802f76" },
    { "username": "idns", "uuid": "36a75ae2-4317-418e-acb3-c2e0fd041d91" },
    { "username": "Jxydon", "uuid": "0f6fbcd9-1026-40f7-a7da-73176df110a9" },
    { "username": "Ricardoxx_", "uuid": "123c07ee-c058-4ee5-bced-678c4bfd5de1" },
    { "username": "frzntic", "uuid": "2d3e43be-ba3f-4ca8-ab55-45944cc77347" },
    { "username": "show_y", "uuid": "9fffd119-1765-466b-8ede-3f5292bda2ef" },
    { "username": "Crey6712", "uuid": "2559b007-8f4d-4782-9764-65a2a7f71189" },
    { "username": "Camcal", "uuid": "86e93c86-3a06-4b90-b02a-d2a371b85a26" },
    { "username": "Stooky", "uuid": "e63d9c3d-4957-49b4-9f61-f82b01befba8" },
    { "username": "LatinaRosaParks", "uuid": "011792f1-e015-4f06-89fc-d135136c4e25" },
    { "username": "mzrio", "uuid": "027b526d-1868-4f24-a5e3-962d45160f42" },
    { "username": "Muov", "uuid": "1e32fa99-1529-4e1f-a005-e406a0cc444e" },
    { "username": "Crozzor", "uuid": "3d50b9cd-e587-408e-b401-a6afcab79d2c" },
    { "username": "cxctxs", "uuid": "4604568a-40b5-47a7-8bff-f2edd84d0653" },
    { "username": "Linnc", "uuid": "7a4a4e88-a432-4cdb-8ef6-bc44dbb608b6" },
    { "username": "CreyVictim3", "uuid": "b58d2633-c86e-4579-8265-11116304b3c9" },
    { "username": "Vexaay", "uuid": "36e95757-f830-42c1-b143-db3da8304770" },
    { "username": "sharpur", "uuid": "59f81b3d-1b5f-44e5-bbb5-58fe8028c67b" },
    { "username": "KhalihMortimer", "uuid": "6c0e6473-8947-4531-ab53-e51f3dfa558a" },
    { "username": "AiroKun", "uuid": "71ca9d66-2171-4640-bbaa-d4edbedac1fb" },
    { "username": "Chrolphyte", "uuid": "cc24cded-9400-4349-b4bb-49a21938de73" }
];

const generateExamplePlayers = () => {
    // Determine which player gets HT1 for each mode to ensure uniqueness
    const modeChampions: Record<string, string> = {};
    MODES.forEach(mode => {
        if (mode === 'Overall') return;
        const randomChamp = SCRAPED_PLAYERS[Math.floor(Math.random() * 10)].uuid; // Only top 10 players contend for HT1
        modeChampions[mode] = randomChamp;
    });

    return SCRAPED_PLAYERS.map((p, idx) => {
        const playerTiers: any = {};
        MODES.forEach(mode => {
            if (mode === 'Overall') return;

            const isChampion = modeChampions[mode] === p.uuid;
            // STRICT RULE: Only one HT1 per mode. Others pick from LT1 downwards.
            const tierIdx = isChampion ? 0 : Math.min(TIERS.length - 1, Math.floor(Math.random() * 9) + 1);

            playerTiers[mode] = {
                current: TIERS[tierIdx],
                peak: idx < 5 ? TIERS[0] : null,
                retired: Math.random() > 0.85, // High density of retirements for testing filtering
                lastTestedAt: Date.now() - Math.floor(Math.random() * 10000000000)
            };
        });
        return {
            uuid: p.uuid,
            username: p.username,
            totalPoints: Math.floor(Math.random() * 500), // Random points for test data
            tiers: playerTiers
        };
    });
};

export const seedDatabase = async () => {
    console.log("Seeding database with high density data...");
    const players = generateExamplePlayers();

    for (const player of players) {
        await setDoc(doc(db, 'players', player.uuid), player);
        console.log(`Added player: ${player.username}`);
    }

    console.log("Seeding complete!");
};
