// Gerenciamento de edição de tópicos no painel administrativo
let currentEditingTopic = null;
let resourcesData = [];
let filesToUpload = [];
let existingFiles = []; // Arquivos já salvos no banco

// Carregar níveis para o modal de edição
async function loadLevelsForEditModal() {
    try {
        const response = await fetch('/api/v1/levels');
        if (response.ok) {
            const levels = await response.json();
            const select = document.getElementById('editTopicLevel');
            
            // Limpar opções existentes
            select.innerHTML = '<option value="">Selecione um nível</option>';
            
            // Adicionar níveis como opções, ordenados por ID
            const sortedLevels = levels.sort((a, b) => a.id - b.id);
            sortedLevels.forEach(level => {
                const option = document.createElement('option');
                option.value = level.id;
                option.textContent = level.name;
                select.appendChild(option);
            });
            
            console.log('✅ Níveis carregados para o modal de edição:', levels);
        } else {
            console.error('❌ Erro ao carregar níveis:', response.status);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar níveis:', error);
    }
}

// Abrir modal de edição
async function editTopic(topicId) {
    currentEditingTopic = topicId;
    resourcesData = [];
    filesToUpload = [];
    
    console.log('🔧 Editando tópico:', topicId);
    
    try {
        // Buscar dados do tópico
        const response = await fetch(`/api/v1/topics/${topicId}`);
        const topic = await response.json();
        
        console.log('📋 Dados do tópico:', topic);
        
        // Preencher formulário
        document.getElementById('editTopicId').value = topic.id;
        document.getElementById('editTopicName').value = topic.name;
        document.getElementById('editTopicXp').value = topic.xp;
        document.getElementById('editTopicVideo').value = topic.videoUrl || '';
        document.getElementById('editTopicDescription').value = topic.description || '';
        
        // Carregar níveis e depois selecionar o nível atual
        await loadLevelsForEditModal();
        document.getElementById('editTopicLevel').value = topic.levelId;
        
        // Carregar recursos existentes
        resourcesData = topic.resources || [];
        renderResourcesList();
        
        // Carregar arquivos existentes
        existingFiles = topic.files || [];
        renderExistingFilesList();
        
        // Mostrar modal
        const modal = document.getElementById('editTopicModal');
        modal.classList.add('show');
        modal.style.display = 'flex';
    } catch (error) {
        console.error('❌ Erro ao carregar tópico:', error);
        alert('Erro ao carregar dados do tópico');
    }
}

// Fechar modal de edição
function closeEditTopicModal() {
    const modal = document.getElementById('editTopicModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
    currentEditingTopic = null;
    resourcesData = [];
    filesToUpload = [];
    existingFiles = [];
    document.getElementById('editTopicForm').reset();
    document.getElementById('fileList').innerHTML = '';
    renderResourcesList();
}

// Adicionar recurso externo
function addResource() {
    const url = document.getElementById('newResourceUrl').value.trim();
    const title = document.getElementById('newResourceTitle').value.trim();
    const type = document.getElementById('newResourceType').value;
    
    if (!url || !title) {
        alert('Por favor, preencha a URL e o título do recurso');
        return;
    }
    
    // Validar URL
    try {
        new URL(url);
    } catch (e) {
        alert('Por favor, insira uma URL válida');
        return;
    }
    
    // Adicionar à lista
    const resource = {
        id: Date.now(), // ID temporário
        url: url,
        title: title,
        type: type,
        isNew: true
    };
    
    resourcesData.push(resource);
    
    // Limpar campos
    document.getElementById('newResourceUrl').value = '';
    document.getElementById('newResourceTitle').value = '';
    document.getElementById('newResourceType').value = 'link';
    
    // Re-renderizar lista
    renderResourcesList();
}

// Remover recurso
function removeResource(index) {
    if (confirm('Tem certeza que deseja remover este recurso?')) {
        resourcesData.splice(index, 1);
        renderResourcesList();
    }
}

// Renderizar lista de recursos
function renderResourcesList() {
    const container = document.getElementById('resourcesList');
    
    if (resourcesData.length === 0) {
        container.innerHTML = '<p class="no-resources-admin">Nenhum link externo adicionado.</p>';
        return;
    }
    
    container.innerHTML = resourcesData.map((resource, index) => `
        <div class="resource-item-admin">
            <div class="resource-info">
                <div class="resource-title-admin">${resource.title}</div>
                <div class="resource-url-admin">${resource.url}</div>
                <span class="resource-type-badge">${resource.type}</span>
            </div>
            <button type="button" class="btn btn-sm btn-danger" onclick="removeResource(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Gerenciar seleção de arquivos
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('editTopicFiles');
    const fileList = document.getElementById('fileList');
    
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            filesToUpload = Array.from(e.target.files);
            renderFilesList();
        });
    }
});

// Renderizar lista de arquivos existentes (já salvos)
function renderExistingFilesList() {
    const container = document.getElementById('existingFilesList');
    
    if (!container) {
        console.warn('Container existingFilesList não encontrado');
        return;
    }
    
    if (existingFiles.length === 0) {
        container.innerHTML = '<p class="no-files-admin">Nenhum arquivo existente.</p>';
        return;
    }
    
    container.innerHTML = existingFiles.map((file, index) => `
        <div class="file-item-existing">
            <div class="file-info">
                <i class="fas fa-file-pdf"></i>
                <span class="file-name-admin">${file.name}</span>
                <span class="file-size-admin">${formatFileSize(file.size)}</span>
            </div>
            <div class="file-actions">
                <button type="button" class="btn btn-sm btn-primary" onclick="openFile('${file.path}')" title="Abrir arquivo">
                    <i class="fas fa-external-link-alt"></i>
                </button>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeExistingFile(${index})" title="Excluir arquivo">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Renderizar lista de arquivos selecionados (novos)
function renderFilesList() {
    const container = document.getElementById('fileList');
    
    if (filesToUpload.length === 0) {
        container.innerHTML = '<p class="no-files-admin">Nenhum arquivo selecionado.</p>';
        return;
    }
    
    container.innerHTML = filesToUpload.map((file, index) => `
        <div class="file-item-admin">
            <div class="file-info">
                <i class="fas fa-file-pdf"></i>
                <span class="file-name-admin">${file.name}</span>
                <span class="file-size-admin">${formatFileSize(file.size)}</span>
            </div>
            <button type="button" class="btn btn-sm btn-danger" onclick="removeFile(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Abrir arquivo existente
function openFile(filePath) {
    window.open(filePath, '_blank');
}

// Remover arquivo existente
function removeExistingFile(index) {
    if (confirm('Tem certeza que deseja excluir este arquivo? Esta ação não pode ser desfeita.')) {
        existingFiles.splice(index, 1);
        renderExistingFilesList();
    }
}

// Remover arquivo da lista (novos)
function removeFile(index) {
    filesToUpload.splice(index, 1);
    renderFilesList();
    
    // Atualizar input file
    const fileInput = document.getElementById('editTopicFiles');
    const dt = new DataTransfer();
    filesToUpload.forEach(file => dt.items.add(file));
    fileInput.files = dt.files;
}

// Formatar tamanho do arquivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Salvar edições do tópico
document.addEventListener('DOMContentLoaded', function() {
    const editForm = document.getElementById('editTopicForm');
    
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!currentEditingTopic) {
                alert('Erro: ID do tópico não encontrado');
                return;
            }
            
            const submitBtn = editForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
            submitBtn.disabled = true;
            
            try {
                // Preparar dados básicos do tópico
                const formData = new FormData();
                formData.append('name', document.getElementById('editTopicName').value);
                formData.append('xp', document.getElementById('editTopicXp').value);
                formData.append('levelId', document.getElementById('editTopicLevel').value);
                formData.append('videoUrl', document.getElementById('editTopicVideo').value);
                formData.append('description', document.getElementById('editTopicDescription').value);
                
                // Adicionar recursos
                formData.append('resources', JSON.stringify(resourcesData));
                
                // Adicionar lista de arquivos existentes (para manter)
                formData.append('existingFiles', JSON.stringify(existingFiles));
                
                // Adicionar arquivos novos
                filesToUpload.forEach((file, index) => {
                    formData.append(`files`, file);
                });
                
                // Enviar para o servidor
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Token de autenticação não encontrado. Faça login novamente.');
                    return;
                }
                
                const response = await fetch(`/api/v1/topics/${currentEditingTopic}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                
                if (response.ok) {
                    alert('Tópico atualizado com sucesso!');
                    closeEditTopicModal();
                    
                    // Recarregar lista de tópicos
                    if (typeof loadTopicsForAdmin === 'function') {
                        loadTopicsForAdmin();
                    }
                } else {
                    const error = await response.text();
                    console.error('❌ Erro do servidor:', error);
                    alert('Erro ao salvar tópico: ' + error);
                }
                
            } catch (error) {
                console.error('❌ Erro ao salvar:', error);
                alert('Erro ao salvar tópico: ' + error.message);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
