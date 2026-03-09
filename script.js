const data = {
    parts: {
        tete: "Zone : Tête et Cou.",
        torse: "Zone : Torse et Cavité Abdominale.",
        'bras-gauche': "Zone : Membre supérieur gauche.",
        'bras-droit': "Zone : Membre supérieur droit.",
        'jambe-gauche': "Zone : Membre inférieur gauche.",
        'jambe-droit': "Zone : Membre inférieur droit."
    },
    situations: {
        // Situations universelles
        'balle-sortie': {
            label: "Blessure par balle pénétrante (avec sortie)",
            description: "Plaie transfixiante par projectile. Orifices d'entrée et de sortie identifiés.",
            protocols: ["Nettoyage à l'iode des deux orifices", "Application de poudre de Sulfa", "Pansement compressif modéré"]
        },
        'balle-sans-sortie': {
            label: "Blessure par balle pénétrante (sans sortie)",
            description: "Projectile logé dans les tissus. Risque élevé d'infection et de complications internes.",
            protocols: ["Localisation par palpation", "Ne pas tenter d'extraire sur le terrain", "Nettoyage superficiel et bandage"]
        },
        'balle-fracture': {
            label: "Balle pénétrante + Fracture",
            description: "Impact balistique avec bris osseux. Éclats d'os possiblement présents dans la plaie.",
            protocols: ["Immobilisation immédiate", "Soudrage de Sulfa", "Alignement sommaire du membre", "Attelle de fortune"]
        },
        'fracture-fermee': {
            label: "Fracture fermée",
            description: "Déformation visible du membre. Pas d'effraction cutanée.",
            protocols: ["Immobilisation par attelle", "Application de froid si disponible", "Repos strict du membre"]
        },
        'fracture-ouverte': {
            label: "Fracture ouverte",
            description: "Os saillant à travers la peau. Hémorragie associée probable.",
            protocols: ["Nettoyage périphérique", "Ne pas réduire l'os sur place", "Pansement stérile autour de l'os", "Attelle"]
        },
        'fracture-eclat': {
            label: "Fracture due à éclat",
            description: "Traumatisme osseux causé par shrapnel ou débris d'explosion.",
            protocols: ["Retrait des débris de surface uniquement", "Irrigation abondante", "Pansement large et attelle"]
        },
        'hemorragie-externe': {
            label: "Hémorragie externe",
            description: "Perte de sang active visible. Débit variable selon le vaisseau touché.",
            protocols: ["Compression directe manuelle", "Pansement de fortune", "Garrot si membre et saignement incontrôlable"]
        },
        'hemorragie-interne': {
            label: "Hémorragie interne",
            description: "Signes de choc sans plaie visible (pâleur, pouls rapide, abdomen rigide).",
            protocols: ["Position de Trendelenburg (jambes surélevées)", "Garder le patient au chaud", "Évacuation PRIORITAIRE"]
        },
        // Situations spécifiques au Torse/Abdomen
        'thoracique-simple': {
            label: "Balle pénétrante thoracique simple",
            description: "Impact au thorax sans signe immédiat d'effondrement pulmonaire.",
            protocols: ["Pansement occlusif sur 3 côtés", "Surveillance constante du rythme respiratoire"]
        },
        'pneumothorax': {
            label: "Pneumothorax",
            description: "Air piégé dans la cavité pleurale. Difficultés respiratoires sévères.",
            protocols: ["Pose d'une valve unidirectionnelle", "Position demi-assise", "Aide respiratoire manuelle"]
        },
        'hemothorax': {
            label: "Hémothorax",
            description: "Sang s'accumulant dans la cavité pleurale. Matité à la percussion.",
            protocols: ["Position semi-assise sur le côté affecté", "Surveillance de la cyanose", "Oxygène si disponible"]
        },
        'hemopneumothorax': {
            label: "Combinée : hémopneumothorax",
            description: "Présence simultanée d'air et de sang dans le thorax. Détresse vitale.",
            protocols: ["Pansement occlusif", "Drainage d'urgence requis", "Évacuation immédiate par civière"]
        }
    },
    scenarios: {
        legere: { label: "PRIORITÉ BASSE", details: "L'état général est stable. Pronostic vital non engagé." },
        moderee: { label: "PRIORITÉ MOYENNE", details: "État préoccupant. Nécessite une intervention rapide." },
        critique: { label: "PRIORITÉ ABSOLUE", details: "Pronostic vital engagé. Signes de choc avancés." }
    }
};

const bodyPartSelect = document.getElementById('body-part');
const situationSelect = document.getElementById('situation');

function updateSituations() {
    const part = bodyPartSelect.value;
    situationSelect.innerHTML = '';
    
    // Liste des clés de situations à afficher
    let availableKeys = [
        'balle-sortie', 'balle-sans-sortie', 'balle-fracture', 
        'fracture-fermee', 'fracture-ouverte', 'fracture-eclat',
        'hemorragie-externe', 'hemorragie-interne'
    ];
    
    if (part === 'torse') {
        availableKeys = availableKeys.concat(['thoracique-simple', 'pneumothorax', 'hemothorax', 'hemopneumothorax']);
    }
    
    availableKeys.forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = data.situations[key].label;
        situationSelect.appendChild(option);
    });
}

// Écouteur pour mettre à jour les situations quand la zone change
bodyPartSelect.addEventListener('change', updateSituations);

// Initialisation au chargement
updateSituations();

document.getElementById('generate-btn').addEventListener('click', function() {
    const bodyPart = bodyPartSelect.value;
    const situationKey = situationSelect.value;
    
    // Sélection aléatoire de la gravité
    const severityLevels = ['legere', 'moderee', 'critique'];
    const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
    
    const situation = data.situations[situationKey];
    const scenario = data.scenarios[severity];
    
    // Affichage du rapport
    const reportSection = document.getElementById('report-output');
    reportSection.classList.remove('hidden');
    
    // Mise à jour de la barre de statut
    document.getElementById('severity-status-bar').textContent = scenario.label;
    
    // Génération de l'ID
    document.getElementById('report-id').textContent = Math.floor(Math.random() * 90000) + 10000;
    
    // Construction du texte de diagnostic
    const fullDiagnosis = `${data.parts[bodyPart]} \nSITUATION : ${situation.label}. \n\n${situation.description} \n\nNOTE : ${scenario.details}`;
    document.getElementById('diagnosis-text').innerText = fullDiagnosis;
    
    // Remplissage du protocole
    const protocolList = document.getElementById('protocol-list');
    protocolList.innerHTML = '';

    let finalProtocol = [...situation.protocols];

    // Logique spécifique demandée : GARROT pour membres, BANDAGE COMPRESSIF pour thorax
    const isMembre = ['bras-gauche', 'bras-droit', 'jambe-gauche', 'jambe-droit'].includes(bodyPart);
    const isThoraxAbdomen = (bodyPart === 'torse');

    if (isMembre && (severity === 'critique' || situationKey.includes('balle') || situationKey.includes('hemorragie'))) {
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
