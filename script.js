const data = {
    causes: {
        balle: {
            label: "Coup de feu (Balle)",
            description: "Blessure par projectile d'arme à feu (probable calibre Mauser 7.92mm).",
            protocols: ["Nettoyage à l'iode", "Application de poudre de Sulfa", "Pansement standard"]
        },
        mine: {
            label: "Explosion de mine",
            description: "Traumatisme par explosion de mine antipersonnel (S-Mine ou Tellermine).",
            protocols: ["Recherche de débris", "Irrigation abondante", "Pansement large"]
        },
        eclat: {
            label: "Éclats d'obus / Shrapnel",
            description: "Multiples plaies par éclats de shrapnel suite à un tir d'artillerie.",
            protocols: ["Extraction des éclats superficiels", "Nettoyage profond", "Bandage compressif modéré"]
        },
        accident: {
            label: "Accident / Chute",
            description: "Blessure non-balistique résultant d'un accident de terrain ou d'une chute.",
            protocols: ["Immobilisation", "Vérification des fractures", "Repos"]
        }
    },
    parts: {
        tete: "Zone : Tête et Cou.",
        torse: "Zone : Torse et Cavité Abdominale.",
        'bras-gauche': "Zone : Membre supérieur gauche.",
        'bras-droit': "Zone : Membre supérieur droit.",
        'jambe-gauche': "Zone : Membre inférieur gauche.",
        'jambe-droit': "Zone : Membre inférieur droit."
    },
    scenarios: {
        legere: { label: "PRIORITÉ BASSE", details: "L'état général est stable. Pronostic vital non engagé." },
        moderee: { label: "PRIORITÉ MOYENNE", details: "État préoccupant. Nécessite une intervention rapide." },
        critique: { label: "PRIORITÉ ABSOLUE", details: "Pronostic vital engagé. Signes de choc avancés." }
    }
};

document.getElementById('generate-btn').addEventListener('click', function() {
    // Récupération des éléments du DOM
    const bodyPart = document.getElementById('body-part').value;
    const causeKey = document.getElementById('cause').value;

    const reportSection = document.getElementById('report-output');
    const diagnosisList = document.getElementById('diagnosis-list');
    const protocolList = document.getElementById('protocol-list');
    const statusStatusBar = document.getElementById('severity-status-bar');
    const reportIdSpan = document.getElementById('report-id');

    // Nettoyage immédiat
    diagnosisList.innerHTML = '';
    protocolList.innerHTML = '';
    
    // Logique de génération aléatoire cohérente selon la cause
    let fractureVal = "non";
    let hemorragieVal = "non";
    let infectionVal = "non";
    let sortieVal = "non";
    const roll = Math.random();

    if (causeKey === 'mine') {
        fractureVal = roll > 0.2 ? "comminutive" : "ouverte";
        hemorragieVal = roll > 0.3 ? "sévère" : "moyenne";
        infectionVal = "oui"; 
        sortieVal = roll > 0.6 ? "oui" : "non";
    } else if (causeKey === 'balle') {
        fractureVal = roll > 0.7 ? "ouverte" : (roll > 0.5 ? "comminutive" : "non");
        hemorragieVal = roll > 0.5 ? "sévère" : (roll > 0.2 ? "moyenne" : "modérée");
        infectionVal = roll > 0.8 ? "oui" : "non";
        sortieVal = roll > 0.3 ? "oui" : "non"; // 70% de chance de sortie
    } else if (causeKey === 'eclat') {
        fractureVal = roll > 0.6 ? "ouverte" : "non";
        hemorragieVal = roll > 0.4 ? "moyenne" : "modérée";
        infectionVal = "oui";
        sortieVal = roll > 0.8 ? "oui" : "non"; // 20% de chance de sortie
    } else if (causeKey === 'accident') {
        fractureVal = roll > 0.5 ? "ouverte" : "non";
        hemorragieVal = roll > 0.8 ? "modérée" : "non";
        infectionVal = roll > 0.9 ? "oui" : "non";
        sortieVal = "n/a";
    }

    // Détermination de la gravité pour le visuel
    let severity = 'legere';
    if (hemorragieVal === 'sévère' || fractureVal === 'comminutive') severity = 'critique';
    else if (hemorragieVal === 'moyenne' || hemorragieVal === 'modérée' || fractureVal === 'ouverte') severity = 'moderee';
    
    const cause = data.causes[causeKey];
    const scenario = data.scenarios[severity];
    
    // Mise à jour de l'interface
    statusStatusBar.textContent = scenario.label;
    reportIdSpan.textContent = Math.floor(Math.random() * 90000) + 10000;
    
    const addDiagItem = (label, value) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${label} :</strong> ${value}`;
        diagnosisList.appendChild(li);
    };

    const fractureText = fractureVal === 'non' ? "AUCUNE" : `OUI (${fractureVal.toUpperCase()})`;
    const hemorragieText = hemorragieVal === 'non' ? "NON / CONTRÔLÉE" : `PRÉSENTE (${hemorragieVal.toUpperCase()})`;
    const infectionText = infectionVal === 'non' ? "NUL" : "ÉLEVÉ (EXPOSITION TERRAIN)";
    const sortieText = sortieVal === 'n/a' ? "NON APPLICABLE" : (sortieVal === 'oui' ? "OUI (TRANSFIXIANTE)" : "NON (PROJECTILE LOGÉ)");

    // On s'assure de l'ordre d'affichage
    addDiagItem("LOCALISATION", data.parts[bodyPart]);
    addDiagItem("CAUSE", cause.label);
    addDiagItem("PLAIE DE SORTIE", sortieText);
    addDiagItem("FRACTURE", fractureText);
    addDiagItem("HÉMORRAGIE", hemorragieText);
    addDiagItem("RISQUE D'INFECTION", infectionText);
    addDiagItem("NOTE MÉDICALE", scenario.details);
    
    // Protocole
    let finalProtocol = [...cause.protocols];

    if (sortieVal === 'non' && causeKey !== 'accident') {
        finalProtocol.push("Recherche du projectile / débridement");
    }
    
    finalProtocol.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        protocolList.appendChild(li);
    });
    
    reportSection.classList.remove('hidden');
    reportSection.scrollIntoView({ behavior: 'smooth' });
});
