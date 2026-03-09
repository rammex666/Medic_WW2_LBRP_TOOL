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

    // Nettoyage immédiat des listes pour éviter l'ancien texte
    diagnosisList.innerHTML = '';
    protocolList.innerHTML = '';
    
    // Sélection aléatoire de la gravité
    const severityLevels = ['legere', 'moderee', 'critique'];
    const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
    
    const cause = data.causes[causeKey];
    const scenario = data.scenarios[severity];
    
    // Mise à jour des informations de base
    statusStatusBar.textContent = scenario.label;
    reportIdSpan.textContent = Math.floor(Math.random() * 90000) + 10000;
    
    // Fonction utilitaire pour ajouter des éléments à la liste de diagnostic
    const addDiagItem = (label, value) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${label} :</strong> ${value}`;
        diagnosisList.appendChild(li);
    };

    // Génération des indicateurs médicaux aléatoires
    const hasFracture = (severity === 'critique' || Math.random() > 0.5);
    const hasHemorragie = (severity === 'critique' || severity === 'moderee' || Math.random() > 0.6);
    const hasChoc = (severity === 'critique' || (severity === 'moderee' && Math.random() > 0.5));

    addDiagItem("LOCALISATION", data.parts[bodyPart]);
    addDiagItem("CAUSE", cause.label);
    addDiagItem("FRACTURE", hasFracture ? "OUI (Ouverte/Éclats)" : "NON");
    addDiagItem("HÉMORRAGIE", hasHemorragie ? "OUI (Active)" : "NON / CONTRÔLÉE");
    addDiagItem("ÉTAT DE CHOC", hasChoc ? "PRÉSENT" : "ABSENT");
    addDiagItem("NOTE MÉDICALE", scenario.details);
    
    // Construction du protocole
    let finalProtocol = [...cause.protocols];
    const isMembre = ['bras-gauche', 'bras-droit', 'jambe-gauche', 'jambe-droit'].includes(bodyPart);
    const isThoraxAbdomen = (bodyPart === 'torse');

    if (isMembre && (severity === 'critique' || hasHemorragie || causeKey === 'balle')) {
        finalProtocol.unshift("Pose immédiate de GARROT (point de pression haut)");
    }
    if (isThoraxAbdomen) {
        finalProtocol.unshift("Application d'un BANDAGE COMPRESSIF");
    }
    if (severity === 'critique' || hasChoc) {
        finalProtocol.push("Injection de morphine (1/2 grain)");
        finalProtocol.push("Évacuation chirurgicale immédiate");
    }
    
    // Remplissage de la liste de protocole
    finalProtocol.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        protocolList.appendChild(li);
    });
    
    // Affichage final du rapport et scroll
    reportSection.classList.remove('hidden');
    reportSection.scrollIntoView({ behavior: 'smooth' });
});
