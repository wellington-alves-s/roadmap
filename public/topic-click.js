// Função para adicionar eventos de clique aos tópicos
function addTopicClickEvents() {
    console.log('🔧 Adicionando eventos de clique aos tópicos...');
    const topicNames = document.querySelectorAll('.topic-name');
    console.log(`📝 Encontrados ${topicNames.length} tópicos`);
    
    topicNames.forEach((topicName, index) => {
        if (!topicName.hasClickEvent) {
            topicName.hasClickEvent = true;
            topicName.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`🖱️ Clique no tópico ${index + 1}`);
                
                // Encontra o elemento pai topic-item
                const topicItem = topicName.closest('.topic-item');
                if (topicItem) {
                    // Extrai o ID do tópico do elemento pai
                    const topicId = topicItem.getAttribute('data-topic-id');
                    console.log(`📋 ID do tópico: ${topicId}`);
                    if (topicId) {
                        openTopicModal(topicId);
                    } else {
                        console.error('❌ data-topic-id não encontrado');
                    }
                } else {
                    console.error('❌ topic-item não encontrado');
                }
            });
            console.log(`✅ Evento adicionado ao tópico ${index + 1}`);
        }
    });
}

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM carregado, inicializando eventos dos tópicos...');
    addTopicClickEvents();
});

// Também adicionar após carregamento de dados
document.addEventListener('dataLoaded', function() {
    console.log('📊 Dados carregados, re-adicionando eventos dos tópicos...');
    setTimeout(addTopicClickEvents, 100);
});