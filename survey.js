// Survey functionality
const epsilonSites = {
    ai: { name: 'Epsilon AI', url: 'https://epsiai.vercel.app', logo: 'https://epsiai.vercel.app/icon.png', desc: 'AI assistant for everyone. Chat and learn with AI.' },
    gaming: { name: 'Epsilon Heckle', url: 'https://epsilon-heckle.vercel.app', logo: 'https://epsilon-heckle.vercel.app/epsilon-heckle-logo.png', desc: 'Ultimate gaming destination. Competitive and fast.' },
    business: { name: 'Epsilon Azure', url: 'https://epsilon-azure.vercel.app', logo: 'https://epsilon-azure.vercel.app/icon.png', desc: 'High-performance Business Management System.' },
    creative: { name: 'Epsilon Editz', url: 'https://epsilon-edit.vercel.app', logo: 'https://epsilon-edit.vercel.app/icon.png', desc: 'Professional-grade editing tools for creators.' },
    fitness: { name: 'Epsilon Sport', url: 'https://epsilon-sports.vercel.app', logo: 'https://epsilon-sports.vercel.app/icon.png', desc: 'Workout and fitness tracker for sport lovers.' },
    cars: { name: 'Epsilon Motor', url: 'https://epsilon-motor.vercel.app', logo: 'https://epsilon-motor.vercel.app/icon.png', desc: 'Car discovery website and community.' },
    learning: { name: 'Epsilon Learn', url: 'https://epsilon-learn.vercel.app', logo: 'https://epsilon-learn.vercel.app/icon.png', desc: 'Learn and grow all for free.' },
    coding: { name: 'Epsilon Neote', url: 'https://epsilonneon-sketch.github.io/neote-v2/', logo: 'https://epsilon-neote.vercel.app/icon.png', desc: 'Custom programming language.' }
};

function setupSurvey() {
    const surveyModal = document.getElementById('surveyModal');
    const surveyForm = document.getElementById('surveyForm');
    const surveySkip = document.getElementById('surveySkip');
    const recommendationModal = document.getElementById('recommendationModal');
    const recClose = document.getElementById('recClose');
    const recVisit = document.getElementById('recVisit');
    let recommendedSiteUrl = '';

    surveyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const interest = document.getElementById('surveyInterest').value;
        const activity = document.getElementById('surveyActivity').value;
        const goal = document.getElementById('surveyGoal').value;

        const recommendation = getRecommendation(interest, activity, goal);
        showRecommendation(recommendation);
    });

    surveySkip.addEventListener('click', () => {
        surveyModal.close();
        markSurveyCompleted();
    });

    recClose.addEventListener('click', () => {
        recommendationModal.close();
        markSurveyCompleted();
    });

    recVisit.addEventListener('click', () => {
        window.open(recommendedSiteUrl, '_blank');
        recommendationModal.close();
        markSurveyCompleted();
    });

    function getRecommendation(interest, activity, goal) {
        const activityMap = { chat: 'ai', play: 'gaming', manage: 'business', edit: 'creative', workout: 'fitness', explore: 'cars', study: 'learning', code: 'coding' };
        const key = activityMap[activity] || interest;
        return epsilonSites[key] || epsilonSites.ai;
    }

    function showRecommendation(site) {
        surveyModal.close();
        document.getElementById('recSiteLogo').src = site.logo;
        document.getElementById('recSiteName').textContent = site.name;
        document.getElementById('recSiteDesc').textContent = site.desc;
        recommendedSiteUrl = site.url;
        recommendationModal.showModal();
        lucide.createIcons();
    }

    async function markSurveyCompleted() {
        if (currentUser) {
            await supabaseClient.from('profiles').update({ survey_completed: true }).eq('id', currentUser.id);
            currentUser.survey_completed = true;
        }
    }
}

async function showSurveyModal() {
    if (!currentUser || currentUser.survey_completed) return;
    setTimeout(() => {
        document.getElementById('surveyModal').showModal();
        lucide.createIcons();
    }, 500);
}
