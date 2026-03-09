const data = {
    causes: {
        balle: "Blessure par projectile d'arme à feu (probable calibre Mauser 7.92mm).",
        mine: "Traumatisme par explosion de mine antipersonnel (S-Mine ou Tellermine).",
        eclat: "Multiples plaies par éclats de shrapnel suite à un tir d'artillerie.",
        accident: "Blessure non-balistique résultant d'un accident de terrain ou d'une chute."
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
        legere: {
            label: "PRIORITÉ BASSE",
            details: "Lésion superficielle. Tissus mous légèrement touchés. Pas de signe de choc interne.",
            protocol: ["Nettoyage à l'iode", "Saupoudrage de Sulfa", "Bandage standard", "Retour au poste"]
        },
        moderee: {
            label: "PRIORITÉ MOYENNE",
            details: "Blessure significative avec hémorragie veineuse contrôlable. Risque d'infection modéré.",
            protocol: ["Compression directe", "Nettoyage profond", "Pansement compressif", "Surveillance 12h"]
        },
        critique: {
            label: "PRIORITÉ ABSOLUE",
            details: "Traumatisme majeur. Hémorragie artérielle ou dégâts osseux massifs. Signes de choc hypovolémique.",
            protocol: ["Pose de garrot immédiate", "Injection de morphine (1/2 grain)", "Plasma intraveineux", "Évacuation chirurgicale"]
        }
    }
};

document.getElementById('generate-btn').addEventListener('click', function() {
    const bodyPart = document.getElementById('body-part').value;
    const cause = document.getElementById('cause').value;
    
    // Sélection aléatoire de la gravité
    const severityLevels = ['legere', 'moderee', 'critique'];
    const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
    
    const scenario = data.scenarios[severity];
    
    // Reset et affichage du rapport
    const reportSection = document.getElementById('report-output');
    reportSection.classList.remove('hidden');
    
    // Mise à jour de la barre de statut (sans codes couleur)
    document.getElementById('severity-status-bar').textContent = scenario.label;
    
    // Génération de l'ID
    document.getElementById('report-id').textContent = Math.floor(Math.random() * 90000) + 10000;
    
    // Construction du texte de diagnostic combiné
    const fullDiagnosis = `${data.causes[cause]} ${data.parts[bodyPart]} \n\n${scenario.details}`;
    document.getElementById('diagnosis-text').innerText = fullDiagnosis;
    
    // Remplissage du protocole
    const protocolList = document.getElementById('protocol-list');
    protocolList.innerHTML = '';
    
    // Ajout d'une étape spécifique à la cause si nécessaire
    let finalProtocol = [...scenario.protocol];
    if (cause === 'mine' && severity === 'critique') {
        finalProtocol.unshift("Recherche de membres sectionnés");
    }
    
    finalProtocol.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        protocolList.appendChild(li);
    });
    
    reportSection.scrollIntoView({ behavior: 'smooth' });
});
