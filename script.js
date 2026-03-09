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
    const bodyPart = document.getElementById('body-part').value;
    const causeKey = document.getElementById('cause').value;
    
    // Sélection aléatoire de la gravité
    const severityLevels = ['legere', 'moderee', 'critique'];
    const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
    
    const cause = data.causes[causeKey];
    const scenario = data.scenarios[severity];
    
    // Affichage du rapport
    const reportSection = document.getElementById('report-output');
    reportSection.classList.remove('hidden');
    
    // Mise à jour de la barre de statut
    document.getElementById('severity-status-bar').textContent = scenario.label;
    
    // Génération de l'ID
    document.getElementById('report-id').textContent = Math.floor(Math.random() * 90000) + 10000;
    
    // Construction du texte de diagnostic
    const fullDiagnosis = `${data.parts[bodyPart]} \nCAUSE : ${cause.label}. \n\n${cause.description} \n\nNOTE : ${scenario.details}`;
    document.getElementById('diagnosis-text').innerText = fullDiagnosis;
    
    // Remplissage du protocole
    const protocolList = document.getElementById('protocol-list');
    protocolList.innerHTML = '';

    let finalProtocol = [...cause.protocols];

    // Logique spécifique : GARROT pour membres, BANDAGE COMPRESSIF pour thorax
    const isMembre = ['bras-gauche', 'bras-droit', 'jambe-gauche', 'jambe-droit'].includes(bodyPart);
    const isThoraxAbdomen = (bodyPart === 'torse');

    if (isMembre && (severity === 'critique' || causeKey === 'balle' || causeKey === 'mine')) {
        finalProtocol.unshift("Pose immédiate de GARROT (point de pression haut)");
    }

    if (isThoraxAbdomen) {
        finalProtocol.unshift("Application d'un BANDAGE COMPRESSIF");
    }

    // Ajout des étapes basées sur la gravité (si critique)
    if (severity === 'critique') {
        finalProtocol.push("Injection de morphine (1/2 grain)");
        finalProtocol.push("Évacuation chirurgicale immédiate");
    }
    
    finalProtocol.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        protocolList.appendChild(li);
    });
    
    reportSection.scrollIntoView({ behavior: 'smooth' });
});
